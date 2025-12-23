-- Add explicit restrictive policy to block anonymous access to profiles table
CREATE POLICY "Block anonymous access"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);