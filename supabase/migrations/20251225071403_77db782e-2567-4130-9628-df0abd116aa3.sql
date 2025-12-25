-- Revoke all direct access to provider_click_analytics view
-- Access should only happen through the get_provider_click_analytics_admin() function
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM authenticated;

-- Grant SELECT only to postgres (service role) so the security definer function works
GRANT SELECT ON public.provider_click_analytics TO postgres;