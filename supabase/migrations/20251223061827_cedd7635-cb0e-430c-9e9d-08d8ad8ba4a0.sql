-- Add restrictive policy for authenticated users to only see their own profile
-- (The get_public_profiles security definer function handles forum member visibility)
CREATE POLICY "Authenticated users can only view own profile"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_role(auth.uid(), 'moderator'::app_role)
);