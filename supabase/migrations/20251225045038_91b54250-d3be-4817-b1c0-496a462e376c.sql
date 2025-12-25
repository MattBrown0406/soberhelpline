-- Ensure provider_subscriptions_with_provider view is fully locked down
-- First revoke any remaining permissions
REVOKE ALL PRIVILEGES ON public.provider_subscriptions_with_provider FROM anon, public, authenticated;

-- Only service_role should have direct access (for the security definer functions)
GRANT SELECT ON public.provider_subscriptions_with_provider TO service_role;