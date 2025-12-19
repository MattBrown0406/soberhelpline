-- Lock down view privileges so only authenticated users can access (admins via underlying RLS)
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM PUBLIC;
GRANT SELECT ON public.provider_click_analytics TO authenticated;