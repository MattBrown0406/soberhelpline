-- Harden provider_click_analytics view to prevent public access

-- Revoke all privileges from anon/public
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM public;

-- Grant only to authenticated + service_role
GRANT SELECT ON public.provider_click_analytics TO authenticated;
GRANT SELECT ON public.provider_click_analytics TO service_role;