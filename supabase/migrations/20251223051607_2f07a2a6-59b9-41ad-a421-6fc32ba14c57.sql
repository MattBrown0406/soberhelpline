-- Secure all three exposed views by revoking anon/public access

-- 1. Secure provider_submissions_public view
-- Revoke all access from anon and public roles
REVOKE ALL ON public.provider_submissions_public FROM anon, public;

-- Grant SELECT only to authenticated users
GRANT SELECT ON public.provider_submissions_public TO authenticated;

-- 2. Secure provider_click_analytics view
-- Revoke all access from anon and public roles  
REVOKE ALL ON public.provider_click_analytics FROM anon, public;

-- Grant SELECT only to authenticated users (accessed via security definer function)
GRANT SELECT ON public.provider_click_analytics TO authenticated;

-- 3. Secure provider_subscriptions_with_provider view
-- Revoke all access from anon and public roles
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon, public;

-- Grant SELECT only to authenticated users (accessed via security definer function)
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;