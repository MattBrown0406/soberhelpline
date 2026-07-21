-- Restore admin access to complete provider applications without reopening
-- provider contact details to every authenticated user.
--
-- The public-directory hardening migration intentionally replaced table-level
-- SELECT with column grants that exclude email and phone_number. That also made
-- Admin.tsx's `.select('*')` fail before RLS could apply. Keep the restricted
-- base-table grants and expose a narrowly authorized admin RPC instead.

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
