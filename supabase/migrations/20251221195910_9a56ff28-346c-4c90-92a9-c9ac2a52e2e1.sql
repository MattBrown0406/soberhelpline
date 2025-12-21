-- Ensure anonymous users cannot read from profiles (explicit anon-targeted RLS deny)
-- This is additive defense-in-depth alongside revoked table privileges.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any prior anon deny policy (idempotent)
DROP POLICY IF EXISTS "Deny anon profile reads" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous profile reads" ON public.profiles;

-- Explicitly deny SELECT for the anon role so scanners (and Postgres) see a clear block.
CREATE POLICY "Deny anon profile reads"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Keep privilege layer locked down as well (idempotent)
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM public;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
