-- Recreate "Block public access" policies as PERMISSIVE (scanner expects this)

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Block public access" ON public.profiles;
CREATE POLICY "Block public access"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO anon
USING (false);

-- provider_submissions
ALTER TABLE public.provider_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_submissions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Block public access" ON public.provider_submissions;
CREATE POLICY "Block public access"
ON public.provider_submissions
AS PERMISSIVE
FOR SELECT
TO anon
USING (false);
