-- Drop the overly permissive "Block anonymous access" policy that allows all authenticated users
DROP POLICY IF EXISTS "Block anonymous access" ON public.provider_submissions;

-- Create separate policies for each operation that properly restrict access

-- SELECT: Only admins, moderators, submission owners with active subscriptions, OR users viewing approved providers via the public view
-- The existing SELECT policies already handle admins/moderators and owners with subscriptions
-- We need to ensure no catch-all policy allows unauthorized SELECT

-- INSERT: Authenticated users can insert their own submissions (already exists)
-- Recreate to be explicit
DROP POLICY IF EXISTS "Authenticated users can insert submissions" ON public.provider_submissions;
CREATE POLICY "Authenticated users can insert submissions"
  ON public.provider_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

-- Ensure anonymous users are completely blocked with explicit denial
-- This is implicit when using TO authenticated, but let's be explicit for all commands
CREATE POLICY "Block anonymous insert"
  ON public.provider_submissions
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "Block anonymous update"
  ON public.provider_submissions
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "Block anonymous delete"
  ON public.provider_submissions
  FOR DELETE
  TO anon
  USING (false);

CREATE POLICY "Block anonymous select"
  ON public.provider_submissions
  FOR SELECT
  TO anon
  USING (false);