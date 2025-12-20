-- Add explicit deny SELECT policy for anon on provider_submissions to satisfy scanner
-- Base table already has FORCE RLS and no anon/public privileges.

ALTER TABLE public.provider_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_submissions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Block public access" ON public.provider_submissions;
CREATE POLICY "Block public access"
ON public.provider_submissions
FOR SELECT
TO anon
USING (false);

REVOKE ALL ON TABLE public.provider_submissions FROM anon;
REVOKE ALL ON TABLE public.provider_submissions FROM public;
