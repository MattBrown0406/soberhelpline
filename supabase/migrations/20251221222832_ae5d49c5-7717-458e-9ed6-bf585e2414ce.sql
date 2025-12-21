-- Restore anon SELECT on provider_submissions_public - this is intentionally public
-- The view already masks email/phone as NULL for security
GRANT SELECT ON public.provider_submissions_public TO anon;
GRANT SELECT ON public.provider_submissions_public TO authenticated;