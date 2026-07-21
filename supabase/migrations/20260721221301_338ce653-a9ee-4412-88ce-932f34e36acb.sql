
-- 1) SECURITY DEFINER VIEW fix: switch consultation_providers_public back to invoker,
--    and grant only non-sensitive columns on the base table to public roles.
ALTER VIEW public.consultation_providers_public SET (security_invoker = on);

REVOKE SELECT ON public.consultation_providers FROM anon, authenticated;
GRANT SELECT (
  id, user_id, full_name, title, bio, photo_url, specialties,
  session_rate, session_duration_minutes, status, timezone,
  created_at, updated_at
) ON public.consultation_providers TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view active providers" ON public.consultation_providers;
CREATE POLICY "Public can view active providers"
  ON public.consultation_providers
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- 2) coaching_plans: prevent providers from changing financial columns.
CREATE OR REPLACE FUNCTION public.prevent_coaching_plan_financial_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount
     OR NEW.provider_payout_per_session IS DISTINCT FROM OLD.provider_payout_per_session
     OR NEW.total_sessions IS DISTINCT FROM OLD.total_sessions
     OR NEW.plan_type IS DISTINCT FROM OLD.plan_type
     OR NEW.client_user_id IS DISTINCT FROM OLD.client_user_id
     OR NEW.provider_id IS DISTINCT FROM OLD.provider_id THEN
    RAISE EXCEPTION 'Only administrators may modify financial or ownership fields on coaching plans'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_coaching_plan_financial_tampering ON public.coaching_plans;
CREATE TRIGGER prevent_coaching_plan_financial_tampering
  BEFORE UPDATE ON public.coaching_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_coaching_plan_financial_tampering();

-- 3) provider_subscriptions: prevent self-activation without payment.
CREATE OR REPLACE FUNCTION public.prevent_provider_subscription_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.amount IS DISTINCT FROM OLD.amount
     OR NEW.plan_type IS DISTINCT FROM OLD.plan_type
     OR NEW.paypal_subscription_id IS DISTINCT FROM OLD.paypal_subscription_id
     OR NEW.provider_submission_id IS DISTINCT FROM OLD.provider_submission_id
     OR NEW.next_billing_date IS DISTINCT FROM OLD.next_billing_date
     OR NEW.start_date IS DISTINCT FROM OLD.start_date
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only administrators or the payment service may modify subscription status or billing fields'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_provider_subscription_tampering ON public.provider_subscriptions;
CREATE TRIGGER prevent_provider_subscription_tampering
  BEFORE UPDATE ON public.provider_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_provider_subscription_tampering();

-- 4) testimonials: prevent users from self-approving.
CREATE OR REPLACE FUNCTION public.prevent_testimonial_self_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.rating IS DISTINCT FROM OLD.rating
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only administrators may modify approval status, rating, or ownership of testimonials'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_testimonial_self_approval ON public.testimonials;
CREATE TRIGGER prevent_testimonial_self_approval
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_testimonial_self_approval();
