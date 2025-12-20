-- Fix: provider_subscriptions_with_provider view exposure
-- Postgres does not support RLS on views, so we:
-- 1) make the view SECURITY INVOKER
-- 2) bake auth filtering into the view definition
-- 3) revoke all public/anon grants

-- Ensure view is invoker-security
ALTER VIEW public.provider_subscriptions_with_provider SET (security_invoker = true);

-- Recreate view with row filtering (owner or admin only)
CREATE OR REPLACE VIEW public.provider_subscriptions_with_provider
WITH (security_invoker = true) AS
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
  ON p.id = ps.provider_submission_id
WHERE
  auth.uid() IS NOT NULL
  AND (
    ps.user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- Remove any accidental public access to the view
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM PUBLIC;
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM anon;

-- Allow authenticated users to query the view (rows are still filtered by the view itself)
GRANT SELECT ON TABLE public.provider_subscriptions_with_provider TO authenticated;
