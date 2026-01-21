-- Revoke direct SELECT access to guide_analytics view from all roles
-- Data should only be accessed via get_guide_analytics() RPC function which checks admin role
REVOKE SELECT ON public.guide_analytics FROM anon;
REVOKE SELECT ON public.guide_analytics FROM authenticated;