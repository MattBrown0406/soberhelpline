-- Secure profile_private table: revoke all public/anon access and restrict to authenticated users only

-- Revoke ALL permissions from anon and public roles
REVOKE ALL ON public.profile_private FROM anon, public;

-- Grant permissions only to authenticated users (RLS policies will further restrict access)
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;

-- Add explicit blocking policies for all operations from anon role
-- Block anonymous INSERT
CREATE POLICY "Block anonymous insert" 
ON public.profile_private 
FOR INSERT 
TO anon 
WITH CHECK (false);

-- Block anonymous UPDATE
CREATE POLICY "Block anonymous update" 
ON public.profile_private 
FOR UPDATE 
TO anon 
USING (false);

-- Block anonymous DELETE
CREATE POLICY "Block anonymous delete" 
ON public.profile_private 
FOR DELETE 
TO anon 
USING (false);