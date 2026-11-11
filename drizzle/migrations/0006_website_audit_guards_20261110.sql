DROP POLICY IF EXISTS "Providers can insert own profile" ON public.consultation_providers;

CREATE OR REPLACE FUNCTION public.guard_consultation_provider_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '') = 'service_role'
     OR auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only administrators may create coaching providers'
      USING ERRCODE = '42501';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only administrators may change a coaching provider''s status or owner'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS guard_consultation_provider_changes ON public.consultation_providers;
CREATE TRIGGER guard_consultation_provider_changes
  BEFORE INSERT OR UPDATE ON public.consultation_providers
  FOR EACH ROW EXECUTE FUNCTION public.guard_consultation_provider_changes();

CREATE OR REPLACE FUNCTION public.guard_consultation_booking_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '') = 'service_role'
     OR auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.client_user_id IS DISTINCT FROM OLD.client_user_id
     OR NEW.provider_id IS DISTINCT FROM OLD.provider_id
     OR NEW.client_email IS DISTINCT FROM OLD.client_email
     OR NEW.amount_paid IS DISTINCT FROM OLD.amount_paid
     OR NEW.paypal_order_id IS DISTINCT FROM OLD.paypal_order_id
     OR NEW.coaching_plan_id IS DISTINCT FROM OLD.coaching_plan_id THEN
    RAISE EXCEPTION 'Only administrators may change the client, provider or payment on a booking'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS guard_consultation_booking_changes ON public.consultation_bookings;
CREATE TRIGGER guard_consultation_booking_changes
  BEFORE UPDATE ON public.consultation_bookings
  FOR EACH ROW EXECUTE FUNCTION public.guard_consultation_booking_changes();

CREATE OR REPLACE FUNCTION public.enforce_provider_submission_insert_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '') = 'service_role'
     OR auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS NOT NULL AND NEW.status NOT IN ('draft', 'pending') THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_enforce_provider_submission_insert_status ON public.provider_submissions;
CREATE TRIGGER trg_enforce_provider_submission_insert_status
  BEFORE INSERT ON public.provider_submissions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_provider_submission_insert_status();

ALTER TABLE public.coaching_plans ALTER COLUMN client_user_id DROP NOT NULL;
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.coaching_plans'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%plan_type%'
  LOOP
    EXECUTE format('ALTER TABLE public.coaching_plans DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;
ALTER TABLE public.coaching_plans
  ADD CONSTRAINT coaching_plans_plan_type_check
  CHECK (plan_type IN ('emergency', 'stabilization', 'parallel-recovery')) NOT VALID;