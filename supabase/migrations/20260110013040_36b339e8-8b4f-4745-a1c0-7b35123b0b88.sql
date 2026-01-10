-- Drop the existing permissive "Block anonymous access" policy
DROP POLICY IF EXISTS "Block anonymous access" ON public.provider_subscriptions;

-- Recreate as RESTRICTIVE to ensure auth.uid() IS NOT NULL is always required
CREATE POLICY "Block anonymous access" 
ON public.provider_subscriptions 
AS RESTRICTIVE
FOR ALL 
TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);