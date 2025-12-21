-- Harden subscription financial view access.
-- Goal: ensure only the subscription owner (via RPC) and admins (via RPC) can view enriched subscription rows.

-- 1) Force RLS on the base table for defense-in-depth
ALTER TABLE public.provider_subscriptions FORCE ROW LEVEL SECURITY;

-- 2) Remove direct SELECT access to the view for all roles
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM authenticated;
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM public;

-- 3) Owner-only RPC
CREATE OR REPLACE FUNCTION public.get_my_provider_subscriptions_with_provider()
RETURNS SETOF public.provider_subscriptions_with_provider
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.*
  FROM public.provider_subscriptions_with_provider v
  WHERE auth.uid() IS NOT NULL
    AND v.user_id = auth.uid()
  ORDER BY v.created_at DESC;
$$;

-- 4) Admin-only RPC
CREATE OR REPLACE FUNCTION public.get_provider_subscriptions_with_provider_admin()
RETURNS SETOF public.provider_subscriptions_with_provider
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.*
  FROM public.provider_subscriptions_with_provider v
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY v.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_provider_subscriptions_with_provider() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_provider_subscriptions_with_provider_admin() TO authenticated;