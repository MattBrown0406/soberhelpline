-- Fix: secure provider_subscriptions_with_provider view
-- Views don't have RLS policies; security is enforced via:
-- 1) security_invoker=true so underlying table RLS applies to querying user
-- 2) explicit GRANT/REVOKE so anonymous users cannot read the view

-- Recreate the view to ensure it does NOT bypass RLS
DROP VIEW IF EXISTS public.provider_subscriptions_with_provider;

CREATE VIEW public.provider_subscriptions_with_provider
WITH (security_invoker = true)
AS
SELECT
  ps.id,
  ps.user_id,
  ps.provider_submission_id,
  ps.amount,
  ps.start_date,
  ps.next_billing_date,
  ps.created_at,
  ps.updated_at,
  ps.paypal_subscription_id,
  ps.plan_type,
  ps.status,
  p.provider_name
FROM public.provider_subscriptions ps
LEFT JOIN public.provider_submissions p
  ON p.id = ps.provider_submission_id;

-- Lock down access: no anonymous/public reads
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;

-- Allow logged-in users to read (RLS on provider_subscriptions limits to own rows; admins already allowed)
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;

-- Optional: explicitly allow service role (usually implicit as owner/superuser)
GRANT SELECT ON public.provider_subscriptions_with_provider TO service_role;