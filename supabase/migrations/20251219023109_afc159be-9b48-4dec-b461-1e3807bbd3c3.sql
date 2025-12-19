-- Remove redundant/ambiguous anon-deny SELECT policies (we'll rely on role grants + authenticated-only policies)
DROP POLICY IF EXISTS "Deny anonymous profile reads" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous profile writes" ON public.profiles;

-- Ensure privileges are locked down (defense-in-depth)
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;