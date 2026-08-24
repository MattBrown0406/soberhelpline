CREATE OR REPLACE FUNCTION public.roadmap_assessment_exists(_assessment_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.roadmap_assessments ra WHERE ra.id = _assessment_id)
$$;

GRANT EXECUTE ON FUNCTION public.roadmap_assessment_exists(uuid) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public roadmap registration with validation" ON public.roadmap_users;

CREATE POLICY "Public roadmap registration with validation"
ON public.roadmap_users
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (current_stage IS NULL OR length(current_stage) <= 64)
  AND (checklist_progress IS NULL OR pg_column_size(checklist_progress) <= 8192)
  AND (
    assessment_id IS NULL
    OR public.roadmap_assessment_exists(assessment_id)
  )
);