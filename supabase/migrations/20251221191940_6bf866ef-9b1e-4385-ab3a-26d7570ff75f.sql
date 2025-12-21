-- Harden provider_subscriptions_with_provider view to prevent public access

-- Revoke all privileges from anon/public
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;

-- Grant only to authenticated + service_role
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;
GRANT SELECT ON public.provider_subscriptions_with_provider TO service_role;