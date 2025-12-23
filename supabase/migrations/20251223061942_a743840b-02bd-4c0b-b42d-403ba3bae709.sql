-- Ensure anonymous access is fully blocked on provider_subscriptions_with_provider view
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;