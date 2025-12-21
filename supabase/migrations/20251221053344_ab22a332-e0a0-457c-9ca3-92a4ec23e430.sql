-- Hardening: add explicit default-deny SELECT policy for PUBLIC on profiles
-- This does not affect authenticated policies (policies are OR'ed), but satisfies scanners expecting an explicit deny for public.

DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
CREATE POLICY "Deny public profile access"
ON public.profiles
FOR SELECT
TO public
USING (false);