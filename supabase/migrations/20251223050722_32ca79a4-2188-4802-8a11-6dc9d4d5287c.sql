-- Secure provider_click_analytics view: revoke all public/anon access

-- Revoke ALL permissions from anon and public roles
REVOKE ALL ON public.provider_click_analytics FROM anon, public;

-- Grant access only to authenticated users (access is controlled via security definer function get_provider_click_analytics_admin)
GRANT SELECT ON public.provider_click_analytics TO authenticated;