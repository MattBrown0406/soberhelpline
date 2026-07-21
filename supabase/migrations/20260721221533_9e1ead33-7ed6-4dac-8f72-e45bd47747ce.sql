CREATE OR REPLACE FUNCTION public.get_provider_submissions_admin()
RETURNS SETOF public.provider_submissions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT ps.*
  FROM public.provider_submissions AS ps
  WHERE auth.uid() IS NOT NULL
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'moderator'::public.app_role)
    )
  ORDER BY ps.created_at DESC NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.get_provider_submissions_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_provider_submissions_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_provider_submissions_admin() TO authenticated;

COMMENT ON FUNCTION public.get_provider_submissions_admin() IS
  'Returns complete provider applications only to authenticated admins or moderators.';