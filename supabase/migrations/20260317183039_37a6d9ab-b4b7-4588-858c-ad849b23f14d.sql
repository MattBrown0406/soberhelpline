-- Drop the broken policies
DROP POLICY IF EXISTS "Authenticated users can view approved providers" ON public.consultation_providers;
DROP POLICY IF EXISTS "Block anonymous select" ON public.consultation_providers;

-- Allow anyone (guest or authenticated) to view active consultation providers
-- This is public directory info (name, bio, specialties) - not sensitive PII
CREATE POLICY "Anyone can view active providers"
ON public.consultation_providers
FOR SELECT
USING (status = 'active');
