-- Revoke all access to the provider_click_analytics view from public/anon
REVOKE ALL ON public.provider_click_analytics FROM anon, public;

-- Grant SELECT only to authenticated users (actual access control is through the security definer function)
GRANT SELECT ON public.provider_click_analytics TO authenticated;

-- Add a comment explaining the security model
COMMENT ON VIEW public.provider_click_analytics IS 'Access restricted: use get_provider_click_analytics_admin() for admin access. Direct view access requires authentication.';