-- Drop the problematic RESTRICTIVE policies that can conflict with proper access
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;
DROP POLICY IF EXISTS "Block public role access" ON public.profile_private;

-- Revoke all access from anon and public roles (proper security at grant level)
REVOKE ALL ON public.profile_private FROM anon, public;

-- Ensure authenticated users have proper access (through RLS policies)
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;