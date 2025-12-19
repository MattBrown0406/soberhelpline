-- Explicitly block anonymous/public access to profiles table
-- This adds a deny-all policy for the anon role to satisfy security requirements

CREATE POLICY "Block anonymous access"
ON public.profiles
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Block anonymous insert"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Block anonymous update"
ON public.profiles
FOR UPDATE
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Block anonymous delete"
ON public.profiles
FOR DELETE
TO anon
USING (false);