-- Revoke all public/anon access to profiles table
REVOKE ALL ON public.profiles FROM anon, public;

-- Add explicit RLS policy to block anonymous access
DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;
CREATE POLICY "Block anonymous access" ON public.profiles FOR SELECT TO anon USING (false);

-- Grant access only to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;