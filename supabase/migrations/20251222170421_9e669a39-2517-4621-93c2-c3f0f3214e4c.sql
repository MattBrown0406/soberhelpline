-- Revoke all access to the provider_subscriptions_with_provider view from public/anon
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon, public;

-- Grant SELECT only to authenticated users (they still need to use the security definer functions for actual access)
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;

-- Add a comment explaining the security model
COMMENT ON VIEW public.provider_subscriptions_with_provider IS 'Access restricted: use get_my_provider_subscriptions_with_provider() for user access or get_provider_subscriptions_with_provider_admin() for admin access';