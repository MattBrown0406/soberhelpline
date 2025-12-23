-- Revoke public/anon access to provider_click_analytics view
REVOKE ALL ON public.provider_click_analytics FROM anon, public;

-- Grant access only to authenticated users (RLS will further restrict)
GRANT SELECT ON public.provider_click_analytics TO authenticated;