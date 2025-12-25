-- Revoke direct access to the view from anon and authenticated users
-- Access should only be through the security definer functions
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM authenticated;