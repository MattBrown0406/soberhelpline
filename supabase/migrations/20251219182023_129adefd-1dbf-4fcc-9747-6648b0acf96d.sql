-- Secure the provider_subscriptions_with_provider view
-- Views don't support RLS directly, but we can use security_invoker to respect underlying table RLS

-- Drop and recreate view with security_invoker = true
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
  prov.provider_name,
  ps.paypal_subscription_id,
  ps.plan_type,
  ps.status
FROM public.provider_subscriptions ps
LEFT JOIN public.provider_submissions prov ON ps.provider_submission_id = prov.id;

-- Revoke all access from anonymous and public
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;

-- Grant access only to authenticated users (underlying RLS still applies)
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;