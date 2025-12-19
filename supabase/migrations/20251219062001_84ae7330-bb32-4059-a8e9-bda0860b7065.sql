-- Drop the existing view and recreate it with security_invoker enabled
-- This makes the view respect RLS policies of underlying tables
DROP VIEW IF EXISTS public.provider_subscriptions_with_provider;

CREATE VIEW public.provider_subscriptions_with_provider
WITH (security_invoker = true)
AS
SELECT 
    ps.provider_name,
    s.id,
    s.user_id,
    s.provider_submission_id,
    s.paypal_subscription_id,
    s.plan_type,
    s.amount,
    s.status,
    s.start_date,
    s.next_billing_date,
    s.created_at,
    s.updated_at
FROM provider_subscriptions s
LEFT JOIN provider_submissions ps ON s.provider_submission_id = ps.id
ORDER BY s.created_at DESC;