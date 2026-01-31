-- Add explicit block for anonymous access to family_assessments
-- This ensures unauthenticated users cannot access any health assessment data

CREATE POLICY "Block anonymous access to assessments"
ON public.family_assessments
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);