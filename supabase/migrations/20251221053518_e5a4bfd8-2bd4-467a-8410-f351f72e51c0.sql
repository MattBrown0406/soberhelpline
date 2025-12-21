-- Consolidate profiles SELECT policies to remove ambiguity for scanners
-- Keep ONLY:
-- 1) Users can view their own profile (authenticated)
-- 2) Admins can view all profiles (authenticated)
-- 3) Single explicit deny for public/anon (public role covers anon)

-- Drop redundant/overlapping deny policies
DROP POLICY IF EXISTS "Block anonymous profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Deny public profile access" ON public.profiles;

-- Create one clear deny policy for anyone not authenticated
DROP POLICY IF EXISTS "Deny unauthenticated profile reads" ON public.profiles;
CREATE POLICY "Deny unauthenticated profile reads"
ON public.profiles
FOR SELECT
TO public
USING (false);

-- (Allow policies already exist: Users can view their own profile, Admins can view all profiles)
-- Ensure privilege layer is also locked down
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM public;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;