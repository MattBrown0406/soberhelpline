-- Security fix: ensure provider_submissions table is not publicly readable and RLS is enforced

-- 1) Enforce RLS (and force it for all non-superuser roles)
ALTER TABLE public.provider_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_submissions FORCE ROW LEVEL SECURITY;

-- 2) Ensure there are no broad grants that could allow anon/public access
REVOKE ALL ON TABLE public.provider_submissions FROM PUBLIC;
REVOKE ALL ON TABLE public.provider_submissions FROM anon;

-- 3) Grant only what the app needs to authenticated users (RLS still applies)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.provider_submissions TO authenticated;

-- Note: fine-grained access is controlled by existing RLS policies (owners/admins only, plus explicit block-public SELECT).
