-- Ensure RLS is enabled and enforced on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Add an explicit anonymous-blocking policy (scanner expects an anon-targeted SELECT block)
DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;
CREATE POLICY "Block anonymous access"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);
