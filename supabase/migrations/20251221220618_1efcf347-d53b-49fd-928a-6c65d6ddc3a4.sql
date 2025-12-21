-- Harden provider analytics access:
-- 1) Force RLS on base click table to prevent any owner bypass
ALTER TABLE public.provider_clicks FORCE ROW LEVEL SECURITY;

-- 2) Ensure the aggregated analytics view is not queryable directly by regular authenticated users
REVOKE ALL ON TABLE public.provider_click_analytics FROM authenticated;
REVOKE ALL ON TABLE public.provider_click_analytics FROM anon;
REVOKE ALL ON TABLE public.provider_click_analytics FROM public;

-- 3) Provide an admin-only RPC for the admin UI
CREATE OR REPLACE FUNCTION public.get_provider_click_analytics_admin()
RETURNS SETOF public.provider_click_analytics
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.provider_click_analytics
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY total_clicks DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION public.get_provider_click_analytics_admin() TO authenticated;