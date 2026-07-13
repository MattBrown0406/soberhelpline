
-- =========================================================
-- Atomic capture finalization RPC
-- =========================================================
CREATE OR REPLACE FUNCTION public.finalize_coaching_capture(
  p_session_id UUID,
  p_paypal_order_id TEXT,
  p_capture_id TEXT,
  p_service_type TEXT,
  p_amount_cents INTEGER,
  p_currency TEXT,
  p_captured_at TIMESTAMPTZ,
  p_event_id TEXT,
  p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.coaching_checkout_orders%ROWTYPE;
  v_conflict_id UUID;
  v_existing_outbox_id UUID;
  v_existing_payload JSONB;
BEGIN
  IF p_session_id IS NULL OR p_paypal_order_id IS NULL OR p_capture_id IS NULL
     OR p_event_id IS NULL OR p_payload IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'missing_params');
  END IF;
  IF p_amount_cents <> 15000 OR p_currency <> 'USD' OR p_service_type <> 'plan_review_coaching' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'amount_or_currency_mismatch');
  END IF;

  -- Lock the row
  SELECT * INTO v_row
  FROM public.coaching_checkout_orders
  WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'session_not_found');
  END IF;

  IF v_row.paypal_order_id IS DISTINCT FROM p_paypal_order_id THEN
    RETURN jsonb_build_object('ok', false, 'code', 'order_session_mismatch');
  END IF;
  IF v_row.service_type IS DISTINCT FROM p_service_type
     OR v_row.amount_cents <> 15000
     OR v_row.currency <> 'USD' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'service_or_amount_mismatch');
  END IF;

  -- Reject capture-id owned by a different coaching order
  SELECT id INTO v_conflict_id
  FROM public.coaching_checkout_orders
  WHERE paypal_capture_id = p_capture_id
    AND id <> v_row.id;
  IF FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'capture_conflict');
  END IF;

  IF v_row.status = 'captured' THEN
    -- Idempotent: identical capture is success. Conflicting capture rejected.
    IF v_row.paypal_capture_id IS DISTINCT FROM p_capture_id THEN
      RETURN jsonb_build_object('ok', false, 'code', 'capture_conflict');
    END IF;
  ELSIF v_row.status IN ('refunded','reversed','failed','expired') THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid_state_transition', 'from', v_row.status);
  ELSE
    UPDATE public.coaching_checkout_orders
    SET status = 'captured',
        paypal_capture_id = p_capture_id,
        approved_at = COALESCE(approved_at, p_captured_at),
        captured_at = p_captured_at,
        updated_at = now()
    WHERE id = v_row.id;
  END IF;

  -- Insert or repair outbox event (idempotent by event_id).
  SELECT id, payload INTO v_existing_outbox_id, v_existing_payload
  FROM public.app_payment_bridge_outbox
  WHERE event_id = p_event_id;

  IF NOT FOUND THEN
    INSERT INTO public.app_payment_bridge_outbox (event_id, coaching_order_id, payload)
    VALUES (p_event_id, v_row.id, p_payload);
    RETURN jsonb_build_object('ok', true, 'already', false, 'capture_id', p_capture_id);
  ELSE
    -- Duplicate must reference the same order
    IF EXISTS (
      SELECT 1 FROM public.app_payment_bridge_outbox
      WHERE event_id = p_event_id AND coaching_order_id <> v_row.id
    ) THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_conflict');
    END IF;
    RETURN jsonb_build_object('ok', true, 'already', true, 'capture_id', p_capture_id);
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_coaching_capture(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TIMESTAMPTZ, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_coaching_capture(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TIMESTAMPTZ, TEXT, JSONB) TO service_role;

-- =========================================================
-- Atomic refund / reversal / denial finalization RPC
-- =========================================================
CREATE OR REPLACE FUNCTION public.finalize_coaching_refund_or_reversal(
  p_original_capture_id TEXT,
  p_new_status TEXT,
  p_event_id TEXT,
  p_payload JSONB,
  p_occurred_at TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.coaching_checkout_orders%ROWTYPE;
BEGIN
  IF p_original_capture_id IS NULL OR p_event_id IS NULL OR p_payload IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'missing_params');
  END IF;
  IF p_new_status NOT IN ('refunded','reversed','failed') THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid_status');
  END IF;

  SELECT * INTO v_row
  FROM public.coaching_checkout_orders
  WHERE paypal_capture_id = p_original_capture_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'capture_not_found');
  END IF;

  -- Must have been captured previously
  IF v_row.captured_at IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'no_prior_capture');
  END IF;

  IF v_row.status = p_new_status THEN
    -- idempotent; still ensure outbox row exists below
    NULL;
  ELSIF v_row.status = 'captured' OR
        (p_new_status = 'failed' AND v_row.status IN ('captured'))
  THEN
    UPDATE public.coaching_checkout_orders
    SET status = p_new_status,
        refunded_at = CASE WHEN p_new_status = 'refunded' THEN p_occurred_at ELSE refunded_at END,
        failed_at   = CASE WHEN p_new_status = 'failed'   THEN p_occurred_at ELSE failed_at END,
        updated_at  = now()
    WHERE id = v_row.id;
  ELSE
    RETURN jsonb_build_object('ok', false, 'code', 'invalid_state_transition', 'from', v_row.status, 'to', p_new_status);
  END IF;

  -- Idempotent outbox insert
  IF NOT EXISTS (SELECT 1 FROM public.app_payment_bridge_outbox WHERE event_id = p_event_id) THEN
    INSERT INTO public.app_payment_bridge_outbox (event_id, coaching_order_id, payload)
    VALUES (p_event_id, v_row.id, p_payload);
    RETURN jsonb_build_object('ok', true, 'already', false);
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.app_payment_bridge_outbox
      WHERE event_id = p_event_id AND coaching_order_id <> v_row.id
    ) THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_conflict');
    END IF;
    RETURN jsonb_build_object('ok', true, 'already', true);
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_coaching_refund_or_reversal(TEXT, TEXT, TEXT, JSONB, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_coaching_refund_or_reversal(TEXT, TEXT, TEXT, JSONB, TIMESTAMPTZ) TO service_role;
