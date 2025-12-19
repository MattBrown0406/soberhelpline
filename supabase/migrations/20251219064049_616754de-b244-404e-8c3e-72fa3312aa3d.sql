-- Add explicit policy to block anonymous SELECT access on profiles
CREATE POLICY "Block anonymous select access" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);