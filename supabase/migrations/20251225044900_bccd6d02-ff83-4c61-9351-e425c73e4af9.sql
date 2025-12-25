-- Revoke public access to provider_subscriptions_with_provider view
-- Access should only be through the get_my_provider_subscriptions_with_provider() security definer function

REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;

-- Also revoke from authenticated and only allow access via the security definer functions
REVOKE SELECT ON public.provider_subscriptions_with_provider FROM authenticated;

-- Grant access only to service_role for backend operations
GRANT SELECT ON public.provider_subscriptions_with_provider TO service_role;