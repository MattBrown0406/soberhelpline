-- Add explicit deny policy for anonymous role on profiles to satisfy security scanners.
-- (Anon also has no SELECT grants, but this makes intent explicit.)

DROP POLICY IF EXISTS "Block anonymous profile access" ON public.profiles;
CREATE POLICY "Block anonymous profile access"
ON public.profiles
FOR SELECT
TO anon
USING (false);
