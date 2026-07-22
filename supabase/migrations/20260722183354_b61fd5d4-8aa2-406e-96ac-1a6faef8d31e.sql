-- Fix 1: Allow the payment service (service_role) to update subscription billing fields.
-- service_role connects with the 'service_role' Postgres role, but auth.uid() is NULL,
-- so has_role(NULL, 'admin') is false and the trigger was rejecting legitimate webhook updates.
CREATE OR REPLACE FUNCTION public.prevent_provider_subscription_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role (PayPal webhook, cancel-subscription edge function) bypasses.
  IF current_setting('request.jwt.claim.role', true) = 'service_role'
     OR current_user = 'service_role'
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
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only administrators or the payment service may modify subscription status or billing fields'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

-- Apply the same service_role bypass to the sibling safeguards for consistency,
-- so backend automation (edge functions) can update these tables when needed.
CREATE OR REPLACE FUNCTION public.prevent_coaching_plan_financial_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('request.jwt.claim.role', true) = 'service_role'
     OR current_user = 'service_role'
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
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

CREATE OR REPLACE FUNCTION public.prevent_testimonial_self_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('request.jwt.claim.role', true) = 'service_role'
     OR current_user = 'service_role'
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
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

-- Fix 2: Restore full column SELECT on consultation_providers to authenticated users.
-- Column-level GRANTs are enforced BEFORE row-level policies, so SELECT * broke for
-- the provider viewing their own record and for admins on the Consultation Management page.
-- Row visibility remains gated by the existing RLS policies:
--   - "Providers can view own profile" (auth.uid() = user_id)
--   - "Admins can manage providers" (has_role(auth.uid(), 'admin'))
-- Anonymous public directory reads continue to go through consultation_providers_public,
-- which excludes paypal_email and notification_email; anon keeps only the column-limited
-- grant necessary for that view.
GRANT SELECT ON public.consultation_providers TO authenticated;
