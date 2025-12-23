-- Revoke all public/anon access to profile_private table
REVOKE ALL ON public.profile_private FROM anon, public;

-- Add explicit RLS policy to block anonymous access
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;
CREATE POLICY "Block anonymous access" ON public.profile_private FOR SELECT TO anon USING (false);

-- Grant access only to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;