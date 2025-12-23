-- Remove ineffective blocking policies that create confusion
-- The table-level REVOKE statements already block anon/public access

-- Drop ineffective policies on profiles table
DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous insert" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous update" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous delete" ON public.profiles;

-- Drop ineffective policies on profile_private table  
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;
DROP POLICY IF EXISTS "Block anonymous insert" ON public.profile_private;
DROP POLICY IF EXISTS "Block anonymous update" ON public.profile_private;
DROP POLICY IF EXISTS "Block anonymous delete" ON public.profile_private;

-- Drop ineffective policies on provider_submissions table
DROP POLICY IF EXISTS "Block public role access" ON public.provider_submissions;
DROP POLICY IF EXISTS "Block anonymous access" ON public.provider_submissions;
DROP POLICY IF EXISTS "Block public access" ON public.provider_submissions;

-- Drop ineffective policies on family_assessments table
DROP POLICY IF EXISTS "Block anonymous access" ON public.family_assessments;
DROP POLICY IF EXISTS "Block public role access" ON public.family_assessments;

-- Ensure table-level permissions are properly set (defense in depth)
REVOKE ALL ON public.profiles FROM anon, public;
REVOKE ALL ON public.profile_private FROM anon, public;
REVOKE ALL ON public.provider_submissions FROM anon, public;
REVOKE ALL ON public.family_assessments FROM anon, public;

-- Grant only to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_submissions TO authenticated;
GRANT SELECT, INSERT ON public.family_assessments TO authenticated;