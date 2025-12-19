-- Enable security invoker on the view so it respects underlying table RLS
ALTER VIEW public.provider_subscriptions_with_provider SET (security_invoker = on);