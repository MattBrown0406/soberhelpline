-- Revoke all public/anon access to profile_private table
REVOKE ALL ON public.profile_private FROM anon, public;

-- Grant access only to authenticated users (RLS restricts to owner/admin)
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;