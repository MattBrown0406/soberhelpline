-- Defense-in-depth: restrict table privileges so anon/public cannot query profiles at all
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM PUBLIC;

-- Allow authenticated users to use the table (RLS still enforces row-level rules)
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;