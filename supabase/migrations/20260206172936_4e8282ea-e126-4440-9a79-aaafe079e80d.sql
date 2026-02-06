
-- Block anonymous access to family_boundary_worksheets
CREATE POLICY "Block anonymous select"
  ON public.family_boundary_worksheets
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous insert"
  ON public.family_boundary_worksheets
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous update"
  ON public.family_boundary_worksheets
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous delete"
  ON public.family_boundary_worksheets
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Also add delete policy so owners can delete their own worksheets
CREATE POLICY "Users can delete their own boundary worksheets"
  ON public.family_boundary_worksheets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable FORCE RLS to prevent even service role bypasses from app code
ALTER TABLE public.family_boundary_worksheets FORCE ROW LEVEL SECURITY;
