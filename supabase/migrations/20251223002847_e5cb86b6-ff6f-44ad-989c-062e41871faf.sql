-- Ensure RLS is enabled on profile_private
ALTER TABLE public.profile_private ENABLE ROW LEVEL SECURITY;

-- Revoke all public/anon access at privilege level
REVOKE ALL ON public.profile_private FROM anon, public;

-- Recreate explicit block policy for anon SELECT
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;
CREATE POLICY "Block anonymous access" ON public.profile_private
FOR SELECT TO anon
USING (false);

-- Ensure authenticated role can access (RLS still restricts to owner/admin)
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;