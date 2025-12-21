-- Ensure subscription financial data is not publicly accessible (idempotent hardening)

REVOKE ALL ON TABLE public.provider_subscriptions FROM anon;
REVOKE ALL ON TABLE public.provider_subscriptions FROM public;
GRANT SELECT, INSERT, UPDATE ON TABLE public.provider_subscriptions TO authenticated;

REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM public;
GRANT SELECT ON TABLE public.provider_subscriptions_with_provider TO authenticated;
