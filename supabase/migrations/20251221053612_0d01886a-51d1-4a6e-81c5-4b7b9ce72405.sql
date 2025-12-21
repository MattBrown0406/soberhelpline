-- Ensure provider_subscriptions_with_provider view is not publicly readable
-- and is accessible only to authenticated users (with underlying table RLS applying).

-- Re-grant explicitly (scanner/metadata sometimes misses prior grants)
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;

GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;
GRANT SELECT ON public.provider_subscriptions_with_provider TO service_role;