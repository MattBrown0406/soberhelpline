
-- 1. Safe JSONB integer extraction — returns NULL for missing, wrong-type, or malformed values.
CREATE OR REPLACE FUNCTION public.safe_jsonb_int(j jsonb, k text)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v jsonb;
  n numeric;
BEGIN
  IF j IS NULL THEN RETURN NULL; END IF;
  v := j -> k;
  IF v IS NULL OR jsonb_typeof(v) <> 'number' THEN RETURN NULL; END IF;
  BEGIN
    n := (j->>k)::numeric;
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;
  IF n <> trunc(n) THEN RETURN NULL; END IF;
  IF n > 2147483647 OR n < -2147483648 THEN RETURN NULL; END IF;
  RETURN n::integer;
END;
$$;

REVOKE ALL ON FUNCTION public.safe_jsonb_int(jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.safe_jsonb_int(jsonb, text) TO service_role;

-- 2. Reuse-if-exists outbox comparison helper: matches on stable canonical fields only.
CREATE OR REPLACE FUNCTION public.outbox_payload_matches(a jsonb, b jsonb, keys text[])
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM unnest(keys) k
    WHERE (a->k) IS DISTINCT FROM (b->k)
  );
$$;
REVOKE ALL ON FUNCTION public.outbox_payload_matches(jsonb, jsonb, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.outbox_payload_matches(jsonb, jsonb, text[]) TO service_role;

-- 3. Harden finalize_coaching_capture: safe amount cast, canonical-key idempotency.
CREATE OR REPLACE FUNCTION public.finalize_coaching_capture(
  p_session_id uuid,
  p_paypal_order_id text,
  p_capture_id text,
  p_service_type text,
  p_amount_cents integer,
  p_currency text,
  p_captured_at timestamptz,
  p_event_id text,
  p_payload jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row          public.coaching_checkout_orders%ROWTYPE;
  v_conflict_id  uuid;
  v_existing     public.app_payment_bridge_outbox%ROWTYPE;
  v_has_outbox   boolean := false;
  v_amount_cents integer;
BEGIN
  -- 1. Static validation (no side effects).
  IF p_session_id IS NULL OR p_paypal_order_id IS NULL OR p_capture_id IS NULL
     OR p_event_id IS NULL OR p_payload IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'missing_params');
  END IF;

  IF p_amount_cents <> 15000
     OR p_currency <> 'USD'
     OR p_service_type <> 'plan_review_coaching' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'amount_or_currency_mismatch');
  END IF;

  v_amount_cents := public.safe_jsonb_int(p_payload, 'amount_cents');
  IF v_amount_cents IS NULL OR v_amount_cents <> 15000
     OR (p_payload->>'event_id')      IS DISTINCT FROM p_event_id
     OR (p_payload->>'order_id')      IS DISTINCT FROM p_paypal_order_id
     OR (p_payload->>'capture_id')    IS DISTINCT FROM p_capture_id
     OR (p_payload->>'status')        IS DISTINCT FROM 'captured'
     OR (p_payload->>'currency')      IS DISTINCT FROM 'USD' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_mismatch');
  END IF;

  -- 2. Lock coaching order.
  SELECT * INTO v_row FROM public.coaching_checkout_orders
   WHERE id = p_session_id FOR UPDATE;
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
  IF (p_payload->>'booking_id') IS DISTINCT FROM v_row.app_booking_ref THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_booking_mismatch');
  END IF;

  -- 3. Capture-id uniqueness across coaching orders.
  SELECT id INTO v_conflict_id
    FROM public.coaching_checkout_orders
   WHERE paypal_capture_id = p_capture_id AND id <> v_row.id;
  IF FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'capture_conflict');
  END IF;

  -- 4. Pre-lock outbox row and validate canonical fields only (timestamp fields are volatile).
  SELECT * INTO v_existing FROM public.app_payment_bridge_outbox
   WHERE event_id = p_event_id FOR UPDATE;
  v_has_outbox := FOUND;

  IF v_has_outbox THEN
    IF v_existing.coaching_order_id <> v_row.id THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_conflict');
    END IF;
    IF NOT public.outbox_payload_matches(
      v_existing.payload, p_payload,
      ARRAY['event','event_id','booking_id','order_id','capture_id','status','currency','amount_cents']
    ) THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_payload_mismatch');
    END IF;
  END IF;

  -- 5. State transition.
  IF v_row.status = 'captured' THEN
    IF v_row.paypal_capture_id IS DISTINCT FROM p_capture_id THEN
      RETURN jsonb_build_object('ok', false, 'code', 'capture_conflict');
    END IF;
    -- Idempotent replay.
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

  -- 6. Outbox insert or idempotent no-op (reuse existing payload as canonical).
  IF NOT v_has_outbox THEN
    BEGIN
      INSERT INTO public.app_payment_bridge_outbox (event_id, coaching_order_id, payload)
      VALUES (p_event_id, v_row.id, p_payload);
    EXCEPTION WHEN unique_violation THEN
      RAISE EXCEPTION 'concurrent_outbox_insert' USING ERRCODE = '40001';
    END;
    RETURN jsonb_build_object('ok', true, 'already', false, 'capture_id', p_capture_id);
  END IF;

  RETURN jsonb_build_object('ok', true, 'already', true, 'capture_id', p_capture_id);
END;
$$;

-- 4. Harden finalize_coaching_refund_or_reversal: validate refund amount, allow refunded_amount_cents.
CREATE OR REPLACE FUNCTION public.finalize_coaching_refund_or_reversal(
  p_original_capture_id text,
  p_new_status text,
  p_event_id text,
  p_payload jsonb,
  p_occurred_at timestamptz
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row              public.coaching_checkout_orders%ROWTYPE;
  v_existing         public.app_payment_bridge_outbox%ROWTYPE;
  v_has_outbox       boolean := false;
  v_expected_event   text;
  v_amount_cents     integer;
  v_refunded_cents   integer;
BEGIN
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

  v_amount_cents := public.safe_jsonb_int(p_payload, 'amount_cents');
  IF v_amount_cents IS NULL OR v_amount_cents <> 15000
     OR (p_payload->>'event_id')     IS DISTINCT FROM p_event_id
     OR (p_payload->>'capture_id')   IS DISTINCT FROM p_original_capture_id
     OR (p_payload->>'status')       IS DISTINCT FROM p_new_status
     OR (p_payload->>'event')        IS DISTINCT FROM v_expected_event
     OR (p_payload->>'currency')     IS DISTINCT FROM 'USD' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_mismatch');
  END IF;

  -- Refund policy: refunded events MUST include refunded_amount_cents (> 0, <= 15000).
  IF p_new_status = 'refunded' THEN
    v_refunded_cents := public.safe_jsonb_int(p_payload, 'refunded_amount_cents');
    IF v_refunded_cents IS NULL OR v_refunded_cents <= 0 OR v_refunded_cents > 15000 THEN
      RETURN jsonb_build_object('ok', false, 'code', 'refunded_amount_invalid');
    END IF;
  END IF;

  -- 2. Lock coaching order by original capture id.
  SELECT * INTO v_row FROM public.coaching_checkout_orders
   WHERE paypal_capture_id = p_original_capture_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'capture_not_found');
  END IF;
  IF v_row.captured_at IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'no_prior_capture');
  END IF;
  IF (p_payload->>'booking_id') IS DISTINCT FROM v_row.app_booking_ref
     OR (p_payload->>'order_id') IS DISTINCT FROM v_row.paypal_order_id THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_booking_mismatch');
  END IF;

  -- 3. Pre-lock outbox row.
  SELECT * INTO v_existing FROM public.app_payment_bridge_outbox
   WHERE event_id = p_event_id FOR UPDATE;
  v_has_outbox := FOUND;

  IF v_has_outbox THEN
    IF v_existing.coaching_order_id <> v_row.id THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_conflict');
    END IF;
    IF NOT public.outbox_payload_matches(
      v_existing.payload, p_payload,
      ARRAY['event','event_id','booking_id','order_id','capture_id','status','currency','amount_cents','refunded_amount_cents']
    ) THEN
      RETURN jsonb_build_object('ok', false, 'code', 'event_payload_mismatch');
    END IF;
  END IF;

  -- 4. State transition (any verified nonzero refund blocks scheduling).
  IF v_row.status = p_new_status THEN
    NULL; -- idempotent
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

  -- 5. Outbox insert or idempotent no-op.
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
