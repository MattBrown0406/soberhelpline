-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Explicitly deny any anonymous/public reads (defense-in-depth and silences scanners)
DROP POLICY IF EXISTS "Deny anonymous profile reads" ON public.profiles;
CREATE POLICY "Deny anonymous profile reads"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Also deny any anonymous updates/inserts (extra safety; no-op unless attempted)
DROP POLICY IF EXISTS "Deny anonymous profile writes" ON public.profiles;
CREATE POLICY "Deny anonymous profile writes"
ON public.profiles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);