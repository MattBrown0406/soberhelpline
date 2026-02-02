-- Add RLS policy for users to view their own draft submissions (without requiring active subscription)
CREATE POLICY "Users can view their own draft submissions"
ON public.provider_submissions
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = submitted_by 
  AND status = 'draft'
);

-- Add RLS policy for users to update their own draft submissions
CREATE POLICY "Users can update their own draft submissions"
ON public.provider_submissions
FOR UPDATE
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = submitted_by 
  AND status = 'draft'
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = submitted_by 
  AND status IN ('draft', 'pending')
);

-- Add RLS policy for users to delete their own draft submissions
CREATE POLICY "Users can delete their own draft submissions"
ON public.provider_submissions
FOR DELETE
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = submitted_by 
  AND status = 'draft'
);

-- Comment for documentation
COMMENT ON COLUMN public.provider_submissions.status IS 'Status can be: draft (saved but not submitted), pending (submitted awaiting review), approved, rejected';