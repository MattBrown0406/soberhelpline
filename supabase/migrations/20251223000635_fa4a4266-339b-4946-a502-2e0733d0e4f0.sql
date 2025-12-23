-- Revoke all public/anon access to profiles table
REVOKE ALL ON public.profiles FROM anon, public;

-- Grant access only to authenticated users (RLS policies handle the rest)
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;