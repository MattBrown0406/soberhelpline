-- Remove the overly restrictive "Block anonymous access" policy
-- This policy was blocking ALL access (including authenticated users) because 
-- RESTRICTIVE policies with `false` require all policies to pass
-- The existing user-specific policies already block anonymous access via auth.uid() = user_id
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;

-- Revoke any direct access from anon role as an extra safeguard
REVOKE ALL ON public.profile_private FROM anon;