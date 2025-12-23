-- Revoke all access from anonymous users to profile_private table
REVOKE ALL ON public.profile_private FROM anon;

-- Also add an explicit restrictive policy to block anonymous SELECT access
CREATE POLICY "Block anonymous access"
ON public.profile_private
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);