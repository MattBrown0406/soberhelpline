-- Block anonymous access to provider_subscriptions table
CREATE POLICY "Block anonymous access" 
ON public.provider_subscriptions 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);