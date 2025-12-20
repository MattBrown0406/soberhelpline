-- Lock down provider_subscriptions_with_provider view so only authenticated users can read it
-- and ensure it runs with INVOKER privileges (so base-table RLS applies).

-- Recreate view with security_invoker so it cannot bypass RLS via view owner.
DROP VIEW IF EXISTS public.provider_subscriptions_with_provider;

CREATE VIEW public.provider_subscriptions_with_provider
WITH (security_invoker = true, security_barrier = true) AS
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

-- Remove any accidental public access to the view.
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM public;

-- Allow only authenticated users to select it (still governed by base-table RLS).
GRANT SELECT ON TABLE public.provider_subscriptions_with_provider TO authenticated;
