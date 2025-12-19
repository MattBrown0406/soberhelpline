-- Remove redundant "Block anonymous" policies on profiles and ensure access is authenticated-only.
-- The table is already protected by revoked grants + authenticated-scoped RLS policies.

DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous insert" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous update" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous delete" ON public.profiles;

-- Ensure RLS is enforced
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Ensure there are no accidental public/anon grants
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM public;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;