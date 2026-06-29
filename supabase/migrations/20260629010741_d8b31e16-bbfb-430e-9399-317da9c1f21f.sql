
-- Remove blanket anonymous SELECT block (was hiding approved providers from the public)
DROP POLICY IF EXISTS "Block anonymous select" ON public.provider_submissions;

-- Allow anyone (anon + authenticated) to read approved providers
DROP POLICY IF EXISTS "Public can view approved providers" ON public.provider_submissions;
CREATE POLICY "Public can view approved providers"
  ON public.provider_submissions
  AS PERMISSIVE
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Ensure column-level grants exist for the anon/authenticated roles
GRANT SELECT ON public.provider_submissions TO anon, authenticated;
GRANT SELECT ON public.provider_submissions_public TO anon, authenticated;
