-- Add policy to explicitly block anonymous access to provider_submissions
CREATE POLICY "Block anonymous access"
ON public.provider_submissions
AS RESTRICTIVE
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);