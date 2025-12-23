-- Ensure RLS is enabled on provider_submissions
ALTER TABLE public.provider_submissions ENABLE ROW LEVEL SECURITY;

-- Revoke all public/anon access at privilege level
REVOKE ALL ON public.provider_submissions FROM anon, public;

-- Add explicit block policy for anon SELECT
DROP POLICY IF EXISTS "Block anonymous access" ON public.provider_submissions;
CREATE POLICY "Block anonymous access" ON public.provider_submissions
FOR SELECT TO anon
USING (false);

-- Grant access only to authenticated users (RLS policies restrict to owner/admin)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_submissions TO authenticated;