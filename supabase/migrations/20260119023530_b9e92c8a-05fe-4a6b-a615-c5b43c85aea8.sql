-- Drop the overly permissive "Block anonymous access" policy
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;

-- Add explicit denial policies for anonymous users
CREATE POLICY "Block anonymous select"
  ON public.profile_private
  FOR SELECT
  TO anon
  USING (false);

CREATE POLICY "Block anonymous insert"
  ON public.profile_private
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "Block anonymous update"
  ON public.profile_private
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "Block anonymous delete"
  ON public.profile_private
  FOR DELETE
  TO anon
  USING (false);