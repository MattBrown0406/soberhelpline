-- Revoke all table-level permissions from anon and public roles for sensitive tables

-- 1. Secure profile_private table
REVOKE ALL ON public.profile_private FROM anon, public;
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;

-- 2. Secure provider_submissions table (contains email and phone)
REVOKE ALL ON public.provider_submissions FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_submissions TO authenticated;

-- 3. Secure provider_subscriptions table (contains payment info)
REVOKE ALL ON public.provider_subscriptions FROM anon, public;
GRANT SELECT, INSERT, UPDATE ON public.provider_subscriptions TO authenticated;