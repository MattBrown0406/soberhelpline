-- Owner/admin access to full provider record (including sensitive emails)
CREATE OR REPLACE FUNCTION public.get_my_consultation_provider(_user_id uuid DEFAULT NULL)
RETURNS SETOF public.consultation_providers
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT cp.*
  FROM public.consultation_providers cp
  WHERE auth.uid() IS NOT NULL
    AND (
      cp.user_id = auth.uid()
      OR (
        public.has_role(auth.uid(), 'admin'::public.app_role)
        AND _user_id IS NOT NULL
        AND cp.user_id = _user_id
      )
    );
$$;

REVOKE ALL ON FUNCTION public.get_my_consultation_provider(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_consultation_provider(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_consultation_providers_admin()
RETURNS SETOF public.consultation_providers
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT cp.*
  FROM public.consultation_providers cp
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY cp.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_consultation_providers_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_consultation_providers_admin() TO authenticated;

-- Column-level protection: hide paypal_email / notification_email from direct table reads
REVOKE SELECT ON public.consultation_providers FROM anon, authenticated;

GRANT SELECT (
  id, user_id, full_name, title, bio, photo_url, specialties,
  session_rate, session_duration_minutes, status, timezone,
  created_at, updated_at
) ON public.consultation_providers TO anon, authenticated;

GRANT SELECT ON public.consultation_providers_public TO anon, authenticated;
GRANT ALL ON public.consultation_providers TO service_role;