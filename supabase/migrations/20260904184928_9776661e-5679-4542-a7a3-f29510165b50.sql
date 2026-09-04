CREATE OR REPLACE FUNCTION public.get_my_provider_submissions()
RETURNS SETOF public.provider_submissions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.provider_submissions
  WHERE auth.uid() IS NOT NULL
    AND submitted_by = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.get_my_provider_submissions() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_provider_submissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_provider_submissions() TO service_role;