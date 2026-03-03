CREATE POLICY "Anyone can view approved submissions via public view"
ON public.provider_submissions
FOR SELECT
USING (status = 'approved');