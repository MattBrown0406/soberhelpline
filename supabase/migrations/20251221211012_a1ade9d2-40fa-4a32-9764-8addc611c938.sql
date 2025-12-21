-- Ensure RLS is enabled and enforced on provider_submissions
ALTER TABLE public.provider_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_submissions FORCE ROW LEVEL SECURITY;

-- Add an explicit anonymous-blocking policy
DROP POLICY IF EXISTS "Block anonymous access" ON public.provider_submissions;
CREATE POLICY "Block anonymous access"
ON public.provider_submissions
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Also block public role explicitly
DROP POLICY IF EXISTS "Block public role access" ON public.provider_submissions;
CREATE POLICY "Block public role access"
ON public.provider_submissions
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);