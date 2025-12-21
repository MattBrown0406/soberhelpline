-- Lock down provider_click_analytics so only authenticated users can access
-- (RLS on provider_clicks already restricts rows to admins or provider owner)

REVOKE ALL ON TABLE public.provider_click_analytics FROM anon;
REVOKE ALL ON TABLE public.provider_click_analytics FROM public;

-- authenticated users can still read (row access controlled by base table RLS)
GRANT SELECT ON TABLE public.provider_click_analytics TO authenticated;