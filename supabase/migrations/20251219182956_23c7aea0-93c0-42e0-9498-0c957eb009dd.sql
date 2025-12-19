-- Add an explicit deny policy for anonymous SELECT on profiles to satisfy repeated scanner finding.
-- Keep grants revoked so anon still cannot access; this is an additional explicit block.

DROP POLICY IF EXISTS "Block public access" ON public.profiles;

CREATE POLICY "Block public access"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Ensure no privileges for anon/public remain
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM public;
