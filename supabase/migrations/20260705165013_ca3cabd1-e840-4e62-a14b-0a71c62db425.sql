
-- enabling_behavior_audits: drop broad permissive anon-block policies (owner + admin + provider policies remain)
DROP POLICY IF EXISTS "Block anon select audits" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anon insert audits" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anon update audits" ON public.enabling_behavior_audits;
DROP POLICY IF EXISTS "Block anon delete audits" ON public.enabling_behavior_audits;
CREATE POLICY "Deny anon access to audits" ON public.enabling_behavior_audits
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- family_assessments
DROP POLICY IF EXISTS "Block anonymous access to assessments" ON public.family_assessments;
CREATE POLICY "Deny anon access to family assessments" ON public.family_assessments
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- family_readiness_assessments
DROP POLICY IF EXISTS "Block anon select readiness" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anon insert readiness" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anon update readiness" ON public.family_readiness_assessments;
DROP POLICY IF EXISTS "Block anon delete readiness" ON public.family_readiness_assessments;
CREATE POLICY "Deny anon access to readiness" ON public.family_readiness_assessments
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- journal_entries
DROP POLICY IF EXISTS "Block anonymous access to journal entries" ON public.journal_entries;
CREATE POLICY "Deny anon access to journal entries" ON public.journal_entries
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- profiles: the broad ALL permissive granted any authed user write access
DROP POLICY IF EXISTS "Block anonymous access" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous select on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous insert on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous update on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous delete on profiles" ON public.profiles;
CREATE POLICY "Deny anon access to profiles" ON public.profiles
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
-- Restrict write ops to owner or admin (no more broad authenticated write)
CREATE POLICY "Only owner or admin can insert profiles" ON public.profiles
  AS RESTRICTIVE FOR INSERT TO public
  WITH CHECK (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only owner or admin can update profiles" ON public.profiles
  AS RESTRICTIVE FOR UPDATE TO public
  USING (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admin can delete profiles" ON public.profiles
  AS RESTRICTIVE FOR DELETE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));
