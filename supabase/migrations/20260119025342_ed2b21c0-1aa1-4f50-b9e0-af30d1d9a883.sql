-- Revoke direct access to provider_click_analytics view
-- Access should only be through the get_provider_click_analytics_admin() function
REVOKE SELECT ON public.provider_click_analytics FROM anon;
REVOKE SELECT ON public.provider_click_analytics FROM authenticated;

-- Grant access only through the admin function (already exists as SECURITY DEFINER)