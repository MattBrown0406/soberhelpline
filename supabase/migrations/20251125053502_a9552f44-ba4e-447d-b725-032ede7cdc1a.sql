-- Drop existing restrictive update policy
DROP POLICY IF EXISTS "Admins can update submissions" ON public.provider_submissions;

-- Create new policy that allows service role and admin users to update
CREATE POLICY "Admins and service role can update submissions" 
ON public.provider_submissions 
FOR UPDATE 
USING (
  -- Allow if user has admin role OR if using service role
  has_role(auth.uid(), 'admin'::app_role) OR auth.jwt()->>'role' = 'service_role'
);