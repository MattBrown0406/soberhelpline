-- Drop the overly permissive policy that allows anyone to update
DROP POLICY IF EXISTS "Allow updates to provider submissions" ON public.provider_submissions;

-- Ensure admins can update all submissions (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Admins can update submissions" ON public.provider_submissions;
CREATE POLICY "Admins can update submissions"
ON public.provider_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));