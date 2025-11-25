-- Add SELECT policy for anonymous users to view approved provider submissions
CREATE POLICY "Anyone can view approved provider submissions"
  ON public.provider_submissions
  FOR SELECT
  USING (status = 'approved');