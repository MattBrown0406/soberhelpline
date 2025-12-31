-- Revoke direct access to provider_click_analytics view from public roles
-- Users should access this data through the get_provider_click_analytics_admin() function instead
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM authenticated;

-- Grant access only to service_role (for backend operations)
GRANT SELECT ON public.provider_click_analytics TO service_role;