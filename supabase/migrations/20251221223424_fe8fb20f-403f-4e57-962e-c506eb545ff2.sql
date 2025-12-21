-- Restore authenticated user grants on profiles table
-- This was accidentally revoked during security hardening
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Also ensure profile_private has proper grants
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;