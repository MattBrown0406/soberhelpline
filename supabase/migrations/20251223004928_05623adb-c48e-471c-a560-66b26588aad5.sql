-- Revoke all public/anon access to the view
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon, public;

-- Grant access only to authenticated users (they access via security definer functions)
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;