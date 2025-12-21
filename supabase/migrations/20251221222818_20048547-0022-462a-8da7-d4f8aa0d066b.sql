-- Revoke all access from anon and public on the view
REVOKE ALL ON public.provider_submissions_public FROM anon;
REVOKE ALL ON public.provider_submissions_public FROM public;

-- Grant SELECT only to authenticated users
GRANT SELECT ON public.provider_submissions_public TO authenticated;

-- Also lock down provider_click_analytics view
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM public;
GRANT SELECT ON public.provider_click_analytics TO authenticated;

-- Lock down provider_subscriptions_with_provider view  
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;
-- No direct grants - access only through SECURITY DEFINER functions