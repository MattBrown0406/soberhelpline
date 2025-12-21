-- Fix: Ensure profiles table is not publicly readable at the privilege layer
-- RLS policies already restrict access; this removes any chance of anon/public SELECT via grants.

REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM public;

-- Allow logged-in users (RLS still restricts to own profile unless admin)
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- Belt-and-suspenders: explicitly block anon select (policy may already exist)
DROP POLICY IF EXISTS "Block anonymous profile access" ON public.profiles;
CREATE POLICY "Block anonymous profile access"
ON public.profiles
FOR SELECT
TO anon
USING (false);