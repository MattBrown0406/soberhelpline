-- Revoke all access from anon and public roles on the view
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;

-- Grant access only to authenticated users (they'll still be restricted by the SECURITY DEFINER functions)
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;