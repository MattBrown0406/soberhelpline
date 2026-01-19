-- Revoke direct access to guide_analytics view from all roles
-- Access should only be through the get_guide_analytics() function which checks for admin role
REVOKE ALL ON public.guide_analytics FROM anon;
REVOKE ALL ON public.guide_analytics FROM authenticated;

-- Grant access only to service_role (for admin functions)
GRANT SELECT ON public.guide_analytics TO service_role;