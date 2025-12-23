-- Ensure all public/anon access is revoked from profiles table
REVOKE ALL ON public.profiles FROM anon, public;

-- Grant access only to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;