
-- Allow users to view their own pending/rejected submissions (not just drafts)
CREATE POLICY "Users can view their own non-draft submissions"
ON public.provider_submissions
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND auth.uid() = submitted_by
  AND status IN ('pending', 'rejected')
);
