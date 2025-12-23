-- Add UPDATE policy for family_control_worksheets
CREATE POLICY "Users can update their own worksheets"
ON public.family_control_worksheets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for family_boundary_worksheets
CREATE POLICY "Users can update their own boundary worksheets"
ON public.family_boundary_worksheets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);