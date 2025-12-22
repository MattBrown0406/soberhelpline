-- Drop the problematic RESTRICTIVE policies that block anonymous and public access
DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;
DROP POLICY IF EXISTS "Block public role access" ON public.profiles;