
-- =========================================================
-- Corrective RPC: finalize_coaching_capture
-- Validates outbox + payload BEFORE mutating coaching_checkout_orders.
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
  v_row              public.coaching_checkout_orders%ROWTYPE;
  v_conflict_id      UUID;
  v_existing_row     public.app_payment_bridge_outbox%ROWTYPE;
  v_has_outbox       BOOLEAN := FALSE;
BEGIN
  ---------------------------------------------------------------
  -- 1. Static parameter validation (no side effects yet)
  ---------------------------------------------------------------
  IF p_session_id IS NULL OR p_paypal_order_id IS NULL OR p_capture_id IS NULL
     OR p_event_id IS NULL OR p_payload IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'missing_params');
  END IF;

  IF p_amount_cents <> 15000
     OR p_currency <> 'USD'
     OR p_service_type <> 'plan_review_coaching' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'amount_or_currency_mismatch');
  END IF;

  -- Payload internal cross-checks vs RPC parameters
  IF (p_payload->>'event_id')       IS DISTINCT FROM p_event_id
     OR (p_payload->>'order_id')    IS DISTINCT FROM p_paypal_order_id
     OR (p_payload->>'capture_id')  IS DISTINCT FROM p_capture_id
     OR (p_payload->>'status')      IS DISTINCT FROM 'captured'
     OR (p_payload->>'currency')    IS DISTINCT FROM 'USD'
     OR ((p_payload->>'amount_cents')::INTEGER) IS DISTINCT FROM 15000 THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_mismatch');
  END IF;

  ---------------------------------------------------------------
  -- 2. Lock the coaching order row
  ---------------------------------------------------------------
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

  -- Payload booking_id must match the locked row's app_booking_ref
  IF (p_payload->>'booking_id') IS DISTINCT FROM v_row.app_booking_ref THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_booking_mismatch');
  END IF;

  ---------------------------------------------------------------
  -- 3. Capture-id uniqueness across coaching orders
  ---------------------------------------------------------------
  SELECT id INTO v_conflict_id
  FROM public.coaching_checkout_orders
  WHERE paypal_capture_id = p_capture_id
    AND id <> v_row.id;
  IF FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'capture_conflict');
  END IF;

  ---------------------------------------------------------------
  -- 4. Pre-lock outbox row (BEFORE any mutation) and validate fully
  ---------------------------------------------------------------
  SELECT * INTO v_existing_row
  FROM public.app_payment_bridge_outbox
  WHERE event_id = p_event_id
  FOR UPDATE;
  v_has_outbox := FOUND;

  IF v_has_outbox THEN
    IF v_existing_row.coaching_order_id <> v_row.id THEN
      -- Belongs to another order: nothing has been mutated yet, safe to return.
      RETURN jsonb_build_object('ok', false, 'code', 'event_conflict');
    END IF;
    IF v_existing_row.payload IS DISTINCT FROM p_payload THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_payload_mismatch');
    END IF;
  END IF;

  ---------------------------------------------------------------
  -- 5. State transition (all validations passed)
  ---------------------------------------------------------------
  IF v_row.status = 'captured' THEN
    IF v_row.paypal_capture_id IS DISTINCT FROM p_capture_id THEN
      RETURN jsonb_build_object('ok', false, 'code', 'capture_conflict');
    END IF;
    -- Idempotent replay. If outbox row is missing, repair it below.
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

  ---------------------------------------------------------------
  -- 6. Outbox insert or idempotent no-op
  ---------------------------------------------------------------
  IF NOT v_has_outbox THEN
    BEGIN
      INSERT INTO public.app_payment_bridge_outbox (event_id, coaching_order_id, payload)
      VALUES (p_event_id, v_row.id, p_payload);
    EXCEPTION WHEN unique_violation THEN
      -- Concurrent insert of same event_id: force full rollback so caller retries.
      RAISE EXCEPTION 'concurrent_outbox_insert' USING ERRCODE = '40001';
    END;
    RETURN jsonb_build_object('ok', true, 'already', false, 'capture_id', p_capture_id);
  END IF;

  RETURN jsonb_build_object('ok', true, 'already', true, 'capture_id', p_capture_id);
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_coaching_capture(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TIMESTAMPTZ, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_coaching_capture(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TIMESTAMPTZ, TEXT, JSONB) TO service_role;


-- =========================================================
-- Corrective RPC: finalize_coaching_refund_or_reversal
-- Validates outbox + payload BEFORE mutating coaching_checkout_orders.
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
  v_row              public.coaching_checkout_orders%ROWTYPE;
  v_existing_row     public.app_payment_bridge_outbox%ROWTYPE;
  v_has_outbox       BOOLEAN := FALSE;
  v_expected_event   TEXT;
BEGIN
  ---------------------------------------------------------------
  -- 1. Static parameter validation
  ---------------------------------------------------------------
  IF p_original_capture_id IS NULL OR p_event_id IS NULL OR p_payload IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'missing_params');
  END IF;
  IF p_new_status NOT IN ('refunded','reversed','failed') THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid_status');
  END IF;

  v_expected_event := CASE p_new_status
    WHEN 'refunded' THEN 'payment.refunded'
    WHEN 'reversed' THEN 'payment.reversed'
    WHEN 'failed'   THEN 'payment.denied'
  END;

  -- Payload internal cross-checks vs RPC parameters
  IF (p_payload->>'event_id')      IS DISTINCT FROM p_event_id
     OR (p_payload->>'capture_id') IS DISTINCT FROM p_original_capture_id
     OR (p_payload->>'status')     IS DISTINCT FROM p_new_status
     OR (p_payload->>'event')      IS DISTINCT FROM v_expected_event
     OR (p_payload->>'currency')   IS DISTINCT FROM 'USD'
     OR ((p_payload->>'amount_cents')::INTEGER) IS DISTINCT FROM 15000 THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_mismatch');
  END IF;

  ---------------------------------------------------------------
  -- 2. Lock the coaching order row by original capture id
  ---------------------------------------------------------------
  SELECT * INTO v_row
  FROM public.coaching_checkout_orders
  WHERE paypal_capture_id = p_original_capture_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'capture_not_found');
  END IF;

  IF v_row.captured_at IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'no_prior_capture');
  END IF;

  -- Payload booking + order must match the locked row
  IF (p_payload->>'booking_id') IS DISTINCT FROM v_row.app_booking_ref
     OR (p_payload->>'order_id') IS DISTINCT FROM v_row.paypal_order_id THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_booking_mismatch');
  END IF;

  ---------------------------------------------------------------
  -- 3. Pre-lock outbox row (BEFORE any mutation) and validate fully
  ---------------------------------------------------------------
  SELECT * INTO v_existing_row
  FROM public.app_payment_bridge_outbox
  WHERE event_id = p_event_id
  FOR UPDATE;
  v_has_outbox := FOUND;

  IF v_has_outbox THEN
    IF v_existing_row.coaching_order_id <> v_row.id THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_conflict');
    END IF;
    IF v_existing_row.payload IS DISTINCT FROM p_payload THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_payload_mismatch');
    END IF;
  END IF;

  ---------------------------------------------------------------
  -- 4. State transition
  ---------------------------------------------------------------
  IF v_row.status = p_new_status THEN
    -- Idempotent; repair outbox below if missing.
    NULL;
  ELSIF v_row.status = 'captured' THEN
    UPDATE public.coaching_checkout_orders
    SET status = p_new_status,
        refunded_at = CASE WHEN p_new_status = 'refunded' THEN p_occurred_at ELSE refunded_at END,
        failed_at   = CASE WHEN p_new_status = 'failed'   THEN p_occurred_at ELSE failed_at END,
        updated_at  = now()
    WHERE id = v_row.id;
  ELSE
    RETURN jsonb_build_object('ok', false, 'code', 'invalid_state_transition',
                              'from', v_row.status, 'to', p_new_status);
  END IF;

  ---------------------------------------------------------------
  -- 5. Outbox insert or idempotent no-op
  ---------------------------------------------------------------
  IF NOT v_has_outbox THEN
    BEGIN
      INSERT INTO public.app_payment_bridge_outbox (event_id, coaching_order_id, payload)
      VALUES (p_event_id, v_row.id, p_payload);
    EXCEPTION WHEN unique_violation THEN
      RAISE EXCEPTION 'concurrent_outbox_insert' USING ERRCODE = '40001';
    END;
    RETURN jsonb_build_object('ok', true, 'already', false);
  END IF;

  RETURN jsonb_build_object('ok', true, 'already', true);
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_coaching_refund_or_reversal(TEXT, TEXT, TEXT, JSONB, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_coaching_refund_or_reversal(TEXT, TEXT, TEXT, JSONB, TIMESTAMPTZ) TO service_role;
