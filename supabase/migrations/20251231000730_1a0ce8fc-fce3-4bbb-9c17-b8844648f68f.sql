-- Drop the existing flawed "Block anonymous access" policy
DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;

-- Create a proper restrictive policy that blocks anonymous users
CREATE POLICY "Block anonymous access" ON public.profiles
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);