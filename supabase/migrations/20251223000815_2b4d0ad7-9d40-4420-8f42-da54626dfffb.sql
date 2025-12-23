-- Revoke all public/anon access to provider_submissions table
REVOKE ALL ON public.provider_submissions FROM anon, public;

-- Grant access only to authenticated users (RLS policies handle actual access control)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_submissions TO authenticated;