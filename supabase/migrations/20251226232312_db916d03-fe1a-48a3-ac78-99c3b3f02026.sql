-- Block anonymous access to profile_private table
CREATE POLICY "Block anonymous access" 
ON public.profile_private 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);