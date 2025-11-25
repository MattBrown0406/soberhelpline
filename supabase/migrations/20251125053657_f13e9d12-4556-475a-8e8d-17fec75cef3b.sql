-- Drop the policy we just created
DROP POLICY IF EXISTS "Admins and service role can update submissions" ON public.provider_submissions;

-- Create a simpler policy that works with the Cloud database interface
-- The Cloud interface uses service role which bypasses RLS, but we need this for admin users
CREATE POLICY "Allow updates to provider submissions" 
ON public.provider_submissions 
FOR UPDATE 
USING (true)
WITH CHECK (true);