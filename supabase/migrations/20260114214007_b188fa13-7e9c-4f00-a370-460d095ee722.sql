-- Create a function to check if user has an active provider subscription for a specific provider
CREATE OR REPLACE FUNCTION public.has_active_provider_subscription(_user_id uuid, _provider_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.provider_subscriptions ps
    WHERE ps.user_id = _user_id
      AND ps.provider_submission_id = _provider_id
      AND ps.status = 'active'
  );
$$;

-- Drop the old policy
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.provider_submissions;

-- Create new policy that requires active subscription OR admin
CREATE POLICY "Users can view their own active submissions"
ON public.provider_submissions
FOR SELECT
USING (
  auth.uid() = submitted_by 
  AND public.has_active_provider_subscription(auth.uid(), id)
);

-- Drop and recreate update policy with same restriction
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.provider_submissions;

CREATE POLICY "Users can update their own active submissions"
ON public.provider_submissions
FOR UPDATE
USING (
  auth.uid() = submitted_by 
  AND public.has_active_provider_subscription(auth.uid(), id)
)
WITH CHECK (
  auth.uid() = submitted_by 
  AND public.has_active_provider_subscription(auth.uid(), id)
);