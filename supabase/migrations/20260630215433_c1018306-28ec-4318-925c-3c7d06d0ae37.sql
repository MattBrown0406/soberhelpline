
-- 1. Fix SECURITY DEFINER view: switch to security_invoker
ALTER VIEW public.provider_submissions_public SET (security_invoker = true);

-- Permissive RLS policy enabling public read of approved providers (used by the view)
DROP POLICY IF EXISTS "Public can read approved providers" ON public.provider_submissions;
CREATE POLICY "Public can read approved providers"
ON public.provider_submissions
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Column-level grants: expose only non-sensitive columns to anon/authenticated,
-- explicitly excluding email and phone_number.
REVOKE SELECT ON public.provider_submissions FROM anon, authenticated;

DO $$
DECLARE
  cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'provider_submissions'
    AND column_name NOT IN ('email', 'phone_number');

  EXECUTE format('GRANT SELECT (%s) ON public.provider_submissions TO anon, authenticated', cols);
END $$;

GRANT SELECT ON public.provider_submissions_public TO anon, authenticated;

-- 2. roadmap_assessments: explicit restrictive policy blocking anon SELECT
DROP POLICY IF EXISTS "Block anonymous reads of roadmap assessments" ON public.roadmap_assessments;
CREATE POLICY "Block anonymous reads of roadmap assessments"
ON public.roadmap_assessments
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (auth.uid() IS NOT NULL);
