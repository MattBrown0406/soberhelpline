-- =====================================================================
-- Sober Helpline website — membership + app sign-in + coaching member price
-- 2026-10-02. Idempotent. Run as ONE migration.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Run the app -> website membership sync every night.
--    App memberships on the website (plan_type 'app') carry a short
--    app_grace_until that only sync-app-memberships extends, and section 3
--    makes that grace binding — so this job must exist. Same pattern and
--    auth (cron_secret) as sync-website-to-app-entitlements-nightly, 30 minutes
--    earlier. Any existing job that calls the function is replaced.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  j record;
BEGIN
  FOR j IN
    SELECT jobid FROM cron.job
    WHERE jobname = 'sync-app-memberships-nightly'
       OR command ILIKE '%/functions/v1/sync-app-memberships%'
  LOOP
    PERFORM cron.unschedule(j.jobid);
  END LOOP;
END $$;

SELECT cron.schedule(
  'sync-app-memberships-nightly',
  '0 10 * * *',
  $cmd$
  select net.http_post(
    url:='https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/sync-app-memberships',
    headers:='{"Content-Type": "application/json"}'::jsonb,
    body:=jsonb_build_object('cron_secret', (select value from public.site_settings where key = 'cron_secret'))
  ) as request_id;
  $cmd$
);

-- ---------------------------------------------------------------------
-- 1. Members can no longer create or extend their own membership rows
--    from the browser.
--    Until now RLS let any signed-in user INSERT a provider_subscriptions row
--    for themselves (e.g. status 'active', amount 0) and UPDATE the access end
--    dates of their own rows. All real writes come from edge functions
--    (service role) or admins.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Admins can insert subscriptions" ON public.provider_subscriptions;
CREATE POLICY "Admins can insert subscriptions"
  ON public.provider_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Same guard as before, now also covering the access-window columns.
CREATE OR REPLACE FUNCTION public.prevent_provider_subscription_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Service role (PayPal edge functions, webhooks, syncs) and admins bypass.
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role'
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.amount IS DISTINCT FROM OLD.amount
     OR NEW.plan_type IS DISTINCT FROM OLD.plan_type
     OR NEW.paypal_subscription_id IS DISTINCT FROM OLD.paypal_subscription_id
     OR NEW.provider_submission_id IS DISTINCT FROM OLD.provider_submission_id
     OR NEW.next_billing_date IS DISTINCT FROM OLD.next_billing_date
     OR NEW.start_date IS DISTINCT FROM OLD.start_date
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.access_ends_at IS DISTINCT FROM OLD.access_ends_at
     OR NEW.app_grace_until IS DISTINCT FROM OLD.app_grace_until
     OR NEW.cancelled_at IS DISTINCT FROM OLD.cancelled_at
     OR NEW.cancellation_reason IS DISTINCT FROM OLD.cancellation_reason
     OR NEW.cancellation_source IS DISTINCT FROM OLD.cancellation_source
     OR NEW.paypal_cancel_confirmed_at IS DISTINCT FROM OLD.paypal_cancel_confirmed_at THEN
    RAISE EXCEPTION 'Only administrators or the payment service may modify subscription status or billing fields'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------
-- 1b. Exact login-email lookup for edge functions (service role only), so
--     membership checks never rely on the user-editable profile_private.email.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auth_user_id_by_email(p_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.id
  FROM auth.users u
  WHERE lower(u.email) = lower(trim(p_email))
  ORDER BY u.created_at
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.auth_user_id_by_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.auth_user_id_by_email(text) TO service_role;

-- ---------------------------------------------------------------------
-- 2. Data fixes. They change membership rows on purpose, which the tampering
--    trigger only allows for service_role/admins, so the trigger is paused
--    INSIDE this single DO block: if anything in the block fails, the whole
--    block (including the pause) is rolled back, so the trigger can never be
--    left disabled.
-- ---------------------------------------------------------------------
DO $$
BEGIN
  ALTER TABLE public.provider_subscriptions DISABLE TRIGGER prevent_provider_subscription_tampering;

  -- 2a. Old-style invites queued by the app sync (not by an admin) that nobody
  --     has claimed yet become 'app_pending', so signing up grants the app-type
  --     membership instead of an open-ended free one.
  --     How they are identified: sync-app-memberships inserts the invite and,
  --     later in the SAME run (seconds to a few minutes), logs an
  --     app_membership_sync_issues row with reason 'no_matching_website_account'
  --     for the same email. invited_by is NULL for both sync and admin invites,
  --     so the issue row is what tells them apart: admin invites never create
  --     one, and the time window (from 1 minute before to 30 minutes after the
  --     invite) only matches an issue logged by the run that created the invite.
  UPDATE public.pending_free_memberships p
  SET status = 'app_pending'
  WHERE p.status = 'pending'
    AND p.invited_by IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.app_membership_sync_issues i
      WHERE i.reason = 'no_matching_website_account'
        AND lower(i.email) = lower(p.email)
        AND i.created_at BETWEEN p.created_at - interval '1 minute'
                             AND p.created_at + interval '30 minutes'
    );

  -- 2b. Lifetime-free loop: app subscribers whose app-queued invite was already
  --     claimed got an open-ended plan_type 'free' row. Turn exactly those rows
  --     into the app-type membership the nightly sync keeps (while the app
  --     subscription is active) or revokes (when it has ended).
  --     How they are identified, all conditions together:
  --       - the invite is app-queued (same rule as 2a) and status 'claimed';
  --       - the membership row belongs to the auth user with that email;
  --       - it is the row the signup trigger created: plan_type 'free', amount 0,
  --         no PayPal id, family membership, and start_date EXACTLY equal to the
  --         invite's claimed_at (the trigger writes both with the same now()).
  WITH app_claims AS (
    SELECT p.id AS pending_id, lower(p.email) AS email, p.claimed_at
    FROM public.pending_free_memberships p
    WHERE p.status = 'claimed'
      AND p.invited_by IS NULL
      AND p.claimed_at IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.app_membership_sync_issues i
        WHERE i.reason = 'no_matching_website_account'
          AND lower(i.email) = lower(p.email)
          AND i.created_at BETWEEN p.created_at - interval '1 minute'
                               AND p.created_at + interval '30 minutes'
      )
  ),
  converted AS (
    UPDATE public.provider_subscriptions ps
    SET plan_type = 'app',
        -- 3 days for the nightly sync to pick it up (same grace the sync uses).
        app_grace_until = now() + interval '3 days',
        next_billing_date = NULL,
        updated_at = now()
    FROM app_claims c
    JOIN auth.users u ON lower(u.email) = c.email
    WHERE ps.user_id = u.id
      AND ps.provider_submission_id IS NULL
      AND ps.plan_type = 'free'
      AND ps.status = 'active'
      AND ps.amount = 0
      AND ps.paypal_subscription_id IS NULL
      AND ps.start_date = c.claimed_at
    RETURNING c.pending_id
  )
  UPDATE public.pending_free_memberships p
  SET status = 'app_claimed'
  WHERE p.id IN (SELECT pending_id FROM converted);

  -- 2c. FAMILY6 promo memberships get their 6-month end date. The promise was
  --     "6 months free", recorded in next_billing_date. Members whose 6 months
  --     have already passed keep access for 14 more days from today so nobody
  --     is cut off without notice (change '14 days' if you prefer).
  UPDATE public.provider_subscriptions
  SET access_ends_at = GREATEST(next_billing_date, now() + interval '14 days'),
      updated_at = now()
  WHERE provider_submission_id IS NULL
    AND paypal_subscription_id LIKE 'FAMILY6-%'
    AND status = 'active'
    AND access_ends_at IS NULL
    AND next_billing_date IS NOT NULL;

  -- 2d. Live PayPal subscriptions (ids start with 'I-') that are active but
  --     still carry an access_ends_at from an earlier cancellation: clear the
  --     stale end date so the new membership rule (section 3) doesn't cut off
  --     a paying member. Rows whose PayPal cancellation was confirmed keep
  --     their end date. Rows an administrator revoked are never touched.
  UPDATE public.provider_subscriptions
  SET access_ends_at = NULL,
      updated_at = now()
  WHERE provider_submission_id IS NULL
    AND status = 'active'
    AND access_ends_at IS NOT NULL
    AND paypal_cancel_confirmed_at IS NULL
    AND (cancellation_source IS NULL OR cancellation_source NOT LIKE 'admin%')
    AND paypal_subscription_id LIKE 'I-%';

  ALTER TABLE public.provider_subscriptions ENABLE TRIGGER prevent_provider_subscription_tampering;
END $$;

-- ---------------------------------------------------------------------
-- 3. One membership rule for the forum, recordings, Q&A and member pages
--    (every RLS policy that calls is_active_family_member):
--    - active rows count until their access end date (FAMILY6 has one);
--    - app rows count until app_grace_until (kept fresh by the nightly sync
--      and by app sign-in), so access ends even if the sync stops running;
--    - cancelled members keep access until the end of the period they paid for.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_family_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.provider_subscriptions ps
    WHERE ps.user_id = _user_id
      AND ps.provider_submission_id IS NULL
      AND (
        (
          ps.status = 'active'
          AND (ps.access_ends_at IS NULL OR ps.access_ends_at > now())
          AND (ps.plan_type IS DISTINCT FROM 'app'
               OR ps.app_grace_until IS NULL
               OR ps.app_grace_until > now())
        )
        OR (
          ps.status = 'cancelled'
          AND ps.access_ends_at IS NOT NULL
          AND ps.access_ends_at > now()
        )
      )
  );
$$;
REVOKE ALL ON FUNCTION public.is_active_family_member(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_active_family_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_family_member(uuid) TO service_role;

-- ---------------------------------------------------------------------
-- 4. Signup trigger: app-queued invites ('app_pending') become the app-type
--    membership the nightly sync manages; admin invites ('pending') still
--    grant the open-ended free membership as before. Matching uses only the
--    account's real email (no fallback to sign-up metadata, which the person
--    signing up controls), case-insensitively.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_pending_free_membership()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  pending_email TEXT;
  pending_record RECORD;
BEGIN
  pending_email := LOWER(TRIM(NEW.email));
  IF pending_email IS NULL OR pending_email = '' THEN
    RETURN NEW;
  END IF;

  SELECT * INTO pending_record
  FROM public.pending_free_memberships
  WHERE LOWER(email) = pending_email
    AND status IN ('pending', 'app_pending')
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE;

  IF FOUND THEN
    IF pending_record.status = 'app_pending' THEN
      -- Paying Sober Helpline app subscriber: same row type sync-app-memberships
      -- keeps while the app subscription is active and revokes when it ends.
      INSERT INTO public.provider_subscriptions (
        user_id, provider_submission_id, plan_type, status, amount, start_date, app_grace_until
      ) VALUES (
        NEW.id, NULL, 'app', 'active', 0, now(), now() + interval '3 days'
      );
      UPDATE public.pending_free_memberships
      SET status = 'app_claimed', claimed_at = now()
      WHERE id = pending_record.id;
    ELSE
      -- Admin invitation: open-ended free membership (unchanged).
      INSERT INTO public.provider_subscriptions (
        user_id, provider_submission_id, plan_type, status, amount, start_date, paypal_subscription_id
      ) VALUES (
        NEW.id, NULL, 'free', 'active', 0, now(), NULL
      );
      UPDATE public.pending_free_memberships
      SET status = 'claimed', claimed_at = now()
      WHERE id = pending_record.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------
-- 5. Coaching member price: allow $125 (12500) as well as $150 (15000).
--    The amount of each order comes from the app-signed checkout token;
--    capture/refund events must carry exactly the order's own amount.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.coaching_checkout_orders'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%amount_cents%'
  LOOP
    EXECUTE format('ALTER TABLE public.coaching_checkout_orders DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.coaching_checkout_orders
  ADD CONSTRAINT coaching_checkout_orders_amount_cents_check
  CHECK (amount_cents IN (15000, 12500));

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

  IF p_amount_cents IS NULL OR p_amount_cents NOT IN (15000, 12500)
     OR p_currency <> 'USD'
     OR p_service_type <> 'plan_review_coaching' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'amount_or_currency_mismatch');
  END IF;

  v_amount_cents := public.safe_jsonb_int(p_payload, 'amount_cents');
  IF v_amount_cents IS NULL OR v_amount_cents <> p_amount_cents
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
  -- The captured amount must be exactly the amount this order was created for.
  IF v_row.service_type IS DISTINCT FROM p_service_type
     OR v_row.amount_cents IS DISTINCT FROM p_amount_cents
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

REVOKE ALL ON FUNCTION public.finalize_coaching_capture(uuid, text, text, text, integer, text, timestamptz, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_coaching_capture(uuid, text, text, text, integer, text, timestamptz, text, jsonb) TO service_role;

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
  IF v_amount_cents IS NULL OR v_amount_cents NOT IN (15000, 12500)
     OR (p_payload->>'event_id')     IS DISTINCT FROM p_event_id
     OR (p_payload->>'capture_id')   IS DISTINCT FROM p_original_capture_id
     OR (p_payload->>'status')       IS DISTINCT FROM p_new_status
     OR (p_payload->>'event')        IS DISTINCT FROM v_expected_event
     OR (p_payload->>'currency')     IS DISTINCT FROM 'USD' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_mismatch');
  END IF;

  -- Refund policy: refunded events MUST include refunded_amount_cents (> 0, <= the
  -- order amount; checked against the order once it is locked below).
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
  -- The event must describe this order's own amount.
  IF v_amount_cents IS DISTINCT FROM v_row.amount_cents THEN
    RETURN jsonb_build_object('ok', false, 'code', 'payload_mismatch');
  END IF;
  IF p_new_status = 'refunded' AND v_refunded_cents > v_row.amount_cents THEN
    RETURN jsonb_build_object('ok', false, 'code', 'refunded_amount_invalid');
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

REVOKE ALL ON FUNCTION public.finalize_coaching_refund_or_reversal(text, text, text, jsonb, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_coaching_refund_or_reversal(text, text, text, jsonb, timestamptz) TO service_role;