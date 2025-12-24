-- Restore public provider search functionality
-- Safe because view masks email/phone as NULL (see migration 20251221053105)
GRANT SELECT ON public.provider_submissions_public TO anon;
GRANT SELECT ON public.provider_submissions_public TO authenticated;