-- Revoke all public/anon access to provider_subscriptions_with_provider view
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon, public;

-- Grant access only to authenticated users (security definer functions handle access control)
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;