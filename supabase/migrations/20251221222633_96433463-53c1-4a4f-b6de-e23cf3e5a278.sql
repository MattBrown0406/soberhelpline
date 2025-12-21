-- Clean up conflicting/redundant RLS policies on profiles table
-- Drop the problematic permissive "deny" policy that doesn't actually deny
DROP POLICY IF EXISTS "Deny anon profile reads" ON public.profiles;

-- The existing restrictive policies are correct:
-- "Block anonymous access" (restrictive, anon, false) - GOOD
-- "Block public role access" (restrictive, public, false) - GOOD

-- Verify no anon or public grants exist
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM public;

-- Ensure only authenticated users can access through proper policies
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;