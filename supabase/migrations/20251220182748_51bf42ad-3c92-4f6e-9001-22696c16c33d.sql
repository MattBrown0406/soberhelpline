-- Security fix: ensure profiles table is not publicly readable and RLS is enforced

-- 1) Enforce RLS (and force it for all non-superuser roles)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- 2) Ensure there are no broad grants that could allow anon/public access
REVOKE ALL ON TABLE public.profiles FROM PUBLIC;
REVOKE ALL ON TABLE public.profiles FROM anon;

-- 3) Grant only what the app needs to authenticated users (RLS still applies)
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- Note: DELETE is intentionally not granted (table currently has no DELETE policies).
