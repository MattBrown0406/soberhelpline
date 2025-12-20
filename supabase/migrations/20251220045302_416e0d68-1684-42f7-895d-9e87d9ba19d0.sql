-- Add an explicit catch-all deny SELECT policy for anon on profiles (scanner requirement)
-- while keeping FORCE RLS + revoked anon/public privileges as the real protection.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Explicit deny policy for anonymous reads
DROP POLICY IF EXISTS "Block public access" ON public.profiles;
CREATE POLICY "Block public access"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Ensure anon/public still have no table privileges
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM public;
