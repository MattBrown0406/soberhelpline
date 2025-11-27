-- Create a view that shows provider subscriptions with provider names
CREATE OR REPLACE VIEW provider_subscriptions_with_provider AS
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

-- Grant access to the view
GRANT SELECT ON provider_subscriptions_with_provider TO anon, authenticated;

-- Add RLS policies for the view
ALTER VIEW provider_subscriptions_with_provider SET (security_invoker = true);