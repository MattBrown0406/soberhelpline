-- Revoke all access from anon and public roles on the view
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM public;

-- Grant access only to authenticated users (restricted by SECURITY DEFINER function)
GRANT SELECT ON public.provider_click_analytics TO authenticated;