-- Fix family_assessments table
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.family_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.family_assessments;

ALTER TABLE public.family_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments"
ON public.family_assessments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
ON public.family_assessments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
ON public.family_assessments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Fix family_control_worksheets table
DROP POLICY IF EXISTS "Users can view their own worksheets" ON public.family_control_worksheets;
DROP POLICY IF EXISTS "Users can insert their own worksheets" ON public.family_control_worksheets;
DROP POLICY IF EXISTS "Users can update their own worksheets" ON public.family_control_worksheets;

ALTER TABLE public.family_control_worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own worksheets"
ON public.family_control_worksheets
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own worksheets"
ON public.family_control_worksheets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own worksheets"
ON public.family_control_worksheets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Fix family_boundary_worksheets table
DROP POLICY IF EXISTS "Users can view their own boundary worksheets" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Users can insert their own boundary worksheets" ON public.family_boundary_worksheets;
DROP POLICY IF EXISTS "Users can update their own boundary worksheets" ON public.family_boundary_worksheets;

ALTER TABLE public.family_boundary_worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own boundary worksheets"
ON public.family_boundary_worksheets
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boundary worksheets"
ON public.family_boundary_worksheets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boundary worksheets"
ON public.family_boundary_worksheets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);