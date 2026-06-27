
-- Drop overly broad "Block anon" PERMISSIVE policies that granted access to ALL authenticated users.
-- The user-scoped + admin + provider policies remain and properly restrict access by row.

-- boundary_clarity_worksheets
DROP POLICY IF EXISTS "Block anon select" ON public.boundary_clarity_worksheets;
DROP POLICY IF EXISTS "Block anon insert" ON public.boundary_clarity_worksheets;
DROP POLICY IF EXISTS "Block anon update" ON public.boundary_clarity_worksheets;
DROP POLICY IF EXISTS "Block anon delete" ON public.boundary_clarity_worksheets;

-- coaching_intake_assessments
DROP POLICY IF EXISTS "Block anon select intake" ON public.coaching_intake_assessments;
DROP POLICY IF EXISTS "Block anon insert intake" ON public.coaching_intake_assessments;
DROP POLICY IF EXISTS "Block anon update intake" ON public.coaching_intake_assessments;
DROP POLICY IF EXISTS "Block anon delete intake" ON public.coaching_intake_assessments;

-- enabling_behavior_audits
DROP POLICY IF EXISTS "Block anon select" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anon insert" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anon update" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anon delete" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anonymous select" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anonymous insert" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anonymous update" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anonymous delete" ON public.enabling_behavior_audits;

-- family_boundary_worksheets
DROP POLICY IF EXISTS "Block anonymous select" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Block anonymous insert" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Block anonymous update" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Block anonymous delete" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Block anon select" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Block anon insert" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Block anon update" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Block anon delete" ON public.family_boundary_worksheets;

-- family_readiness_assessments
DROP POLICY IF EXISTS "Block anon select" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anon insert" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anon update" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anon delete" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anonymous select" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anonymous insert" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anonymous update" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anonymous delete" ON public.family_readiness_assessments;

-- zoom_attendance: add explicit RESTRICTIVE policies denying non-admin access (defense in depth).
CREATE POLICY "Restrict zoom_attendance to admins (select)"
  ON public.zoom_attendance AS RESTRICTIVE
  FOR SELECT TO authenticated, anon
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Restrict zoom_attendance to admins (modify)"
  ON public.zoom_attendance AS RESTRICTIVE
  FOR ALL TO authenticated, anon
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
