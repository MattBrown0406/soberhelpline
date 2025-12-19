-- Drop and recreate the view with proper security settings
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
FROM provider_subscriptions ps
LEFT JOIN provider_submissions prov ON ps.provider_submission_id = prov.id;

-- Revoke all privileges from anonymous and public roles
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM PUBLIC;