-- Revoke direct access to the provider_click_analytics view
-- Users should only access this data through the get_provider_click_analytics_admin() function
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM authenticated;

-- Grant access only to the postgres role (used by security definer functions)
GRANT SELECT ON public.provider_click_analytics TO postgres;