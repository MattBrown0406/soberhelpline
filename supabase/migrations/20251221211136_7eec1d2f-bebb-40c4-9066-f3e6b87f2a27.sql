-- Revoke all privileges from anon and public roles on profiles table
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM public;

-- Add explicit block for public role SELECT (belt and suspenders)
DROP POLICY IF EXISTS "Block public role access" ON public.profiles;
CREATE POLICY "Block public role access"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);