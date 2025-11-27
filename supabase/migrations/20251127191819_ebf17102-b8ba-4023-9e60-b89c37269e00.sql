-- Update RLS policy to only allow users to update their own submissions
DROP POLICY IF EXISTS "Allow updates to provider submissions" ON provider_submissions;

CREATE POLICY "Users can update their own submissions"
ON provider_submissions
FOR UPDATE
TO authenticated
USING (auth.uid() = submitted_by)
WITH CHECK (auth.uid() = submitted_by);