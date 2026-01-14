-- Drop existing SELECT policies on provider_submissions
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.provider_submissions;
DROP POLICY IF EXISTS "Users can view their own active submissions" ON public.provider_submissions;

-- Create proper SELECT policies with clear access control

-- 1. Admins and moderators can view all submissions (for management)
CREATE POLICY "Admins and moderators can view all submissions"
ON public.provider_submissions
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR public.has_role(auth.uid(), 'moderator'::app_role)
);

-- 2. Users can view their own submissions ONLY if they have an active subscription
CREATE POLICY "Users can view their own active submissions"
ON public.provider_submissions
FOR SELECT
TO authenticated
USING (
  auth.uid() = submitted_by 
  AND public.has_active_provider_subscription(auth.uid(), id)
);