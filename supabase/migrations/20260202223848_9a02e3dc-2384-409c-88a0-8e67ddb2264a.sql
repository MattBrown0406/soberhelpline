-- Revoke direct SELECT access to guide_analytics view from all roles
-- Access is provided via the get_guide_analytics() RPC function which requires admin role
REVOKE SELECT ON public.guide_analytics FROM anon;
REVOKE SELECT ON public.guide_analytics FROM authenticated;
REVOKE SELECT ON public.guide_analytics FROM public;