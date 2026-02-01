-- Block anonymous access to provider_subscriptions table
CREATE POLICY "Block anonymous select" 
ON public.provider_subscriptions 
FOR SELECT 
TO anon
USING (false);

CREATE POLICY "Block anonymous insert" 
ON public.provider_subscriptions 
FOR INSERT 
TO anon
WITH CHECK (false);

CREATE POLICY "Block anonymous update" 
ON public.provider_subscriptions 
FOR UPDATE 
TO anon
USING (false);

CREATE POLICY "Block anonymous delete" 
ON public.provider_subscriptions 
FOR DELETE 
TO anon
USING (false);