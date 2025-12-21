-- Harden profiles table to prevent any possibility of public/anon reads and reduce scanner false-positives

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove any policy attached to PUBLIC role (scanner may interpret as public readability even if qual=false)
DROP POLICY IF EXISTS "Deny unauthenticated profile reads" ON public.profiles;

-- Revoke all privileges from anon/public explicitly
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM public;

-- Grant only to authenticated + service_role
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO service_role;

-- Defensive: ensure no old policy variants exist under alternate names
DROP POLICY IF EXISTS "Block anonymous read access" ON public.profiles;
DROP POLICY IF EXISTS "Block public access" ON public.profiles;