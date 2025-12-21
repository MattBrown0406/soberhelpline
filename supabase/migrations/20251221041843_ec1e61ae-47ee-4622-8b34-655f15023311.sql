-- Lock down provider_click_analytics view so only authenticated provider owners and admins can access
-- Views don't support RLS directly, so we revoke public/anon access and only grant to authenticated role

REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM public;

-- Only authenticated users can query this view
-- The underlying provider_clicks table already has RLS that restricts to admins and provider owners
GRANT SELECT ON public.provider_click_analytics TO authenticated;

-- Also lock down provider_subscriptions_with_provider view (same issue)
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON public.provider_subscriptions_with_provider FROM public;
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;