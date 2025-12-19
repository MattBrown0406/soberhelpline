-- Allow providers to view clicks for their own provider submissions
CREATE POLICY "Providers can view their own clicks"
ON public.provider_clicks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.provider_submissions ps
    WHERE ps.id = provider_id
    AND ps.submitted_by = auth.uid()
  )
);