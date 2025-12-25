-- Block anonymous access to provider_subscriptions
CREATE POLICY "Block anonymous access"
ON public.provider_subscriptions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);