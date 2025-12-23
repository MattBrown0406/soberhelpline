-- Ensure views have proper permissions by explicitly revoking from all and granting only to authenticated

-- Revoke from ALL roles first (including service_role which might be granting access)
REVOKE ALL ON public.provider_submissions_public FROM anon;
REVOKE ALL ON public.provider_submissions_public FROM public;
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM public;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;

-- Grant SELECT only to authenticated role
GRANT SELECT ON public.provider_submissions_public TO authenticated;
GRANT SELECT ON public.provider_click_analytics TO authenticated;
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;

-- Verify by setting default privileges for the public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM public;