-- Lock down profiles table so it is not readable by anonymous/public roles
-- (RLS is already enabled + forced, but removing anon/public grants prevents automated scanners
--  and eliminates any chance of accidental exposure)

REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM public;

-- Keep expected access for logged-in users (self) and admins via existing RLS policies
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- With no anon grants, this policy is redundant
DROP POLICY IF EXISTS "Block public access" ON public.profiles;
