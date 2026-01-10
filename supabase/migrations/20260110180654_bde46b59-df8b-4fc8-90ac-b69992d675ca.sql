-- Drop the existing permissive "Block anonymous access" policy
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;

-- Recreate as RESTRICTIVE to ensure auth.uid() IS NOT NULL is always required
-- AND other SELECT policies (user-own or admin) must also pass
CREATE POLICY "Block anonymous access"
ON public.profile_private
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);