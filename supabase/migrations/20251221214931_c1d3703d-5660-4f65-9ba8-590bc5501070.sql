-- Force RLS on family_assessments so table owner also respects policies
ALTER TABLE public.family_assessments FORCE ROW LEVEL SECURITY;

-- Explicitly block anonymous access to health assessment data
CREATE POLICY "Block anonymous access"
ON public.family_assessments
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Block public role access"
ON public.family_assessments
FOR SELECT
TO public
USING (false);