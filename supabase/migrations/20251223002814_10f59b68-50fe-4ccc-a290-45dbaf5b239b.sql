-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Revoke all public/anon access at privilege level
REVOKE ALL ON public.profiles FROM anon, public;

-- Drop and recreate the explicit block policy to ensure it's properly applied
DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;
CREATE POLICY "Block anonymous access" ON public.profiles FOR SELECT TO anon USING (false);

-- Grant access only to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;