-- Drop dependent functions first, then recreate views with security_invoker, then recreate functions

-- 1. Drop dependent functions
DROP FUNCTION IF EXISTS public.get_provider_click_analytics_admin();
DROP FUNCTION IF EXISTS public.get_my_provider_subscriptions_with_provider();
DROP FUNCTION IF EXISTS public.get_provider_subscriptions_with_provider_admin();

-- 2. Drop and recreate provider_click_analytics view with security_invoker
DROP VIEW IF EXISTS public.provider_click_analytics;

CREATE VIEW public.provider_click_analytics 
WITH (security_invoker = true)
AS SELECT 
  pc.provider_id,
  ps.provider_name,
  ps.category,
  ps.city,
  ps.state,
  COUNT(*) AS total_clicks,
  COUNT(DISTINCT pc.session_id) AS unique_visitors,
  COUNT(*) FILTER (WHERE pc.click_type = 'card_view') AS card_views,
  COUNT(*) FILTER (WHERE pc.click_type = 'website') AS website_clicks,
  COUNT(*) FILTER (WHERE pc.click_type = 'phone') AS phone_clicks,
  COUNT(*) FILTER (WHERE pc.click_type = 'email') AS email_clicks,
  COUNT(*) FILTER (WHERE pc.clicked_at > NOW() - INTERVAL '7 days') AS clicks_last_7_days,
  COUNT(*) FILTER (WHERE pc.clicked_at > NOW() - INTERVAL '30 days') AS clicks_last_30_days,
  MIN(pc.clicked_at) AS first_click,
  MAX(pc.clicked_at) AS last_click
FROM public.provider_clicks pc
JOIN public.provider_submissions ps ON pc.provider_id = ps.id
GROUP BY pc.provider_id, ps.provider_name, ps.category, ps.city, ps.state;

-- Revoke access from anon/public
REVOKE ALL ON public.provider_click_analytics FROM anon, public;
GRANT SELECT ON public.provider_click_analytics TO authenticated;

-- 3. Drop and recreate provider_subscriptions_with_provider view with security_invoker
DROP VIEW IF EXISTS public.provider_subscriptions_with_provider;

CREATE VIEW public.provider_subscriptions_with_provider
WITH (security_invoker = true)
AS SELECT 
  s.id,
  s.user_id,
  s.provider_submission_id,
  s.paypal_subscription_id,
  s.plan_type,
  s.status,
  s.amount,
  s.start_date,
  s.next_billing_date,
  s.created_at,
  s.updated_at,
  p.provider_name
FROM public.provider_subscriptions s
LEFT JOIN public.provider_submissions p ON s.provider_submission_id = p.id;

-- Revoke access from anon/public  
REVOKE ALL ON public.provider_subscriptions_with_provider FROM anon, public;
GRANT SELECT ON public.provider_subscriptions_with_provider TO authenticated;

-- 4. Recreate security definer functions for controlled access

-- Admin function to get all click analytics
CREATE OR REPLACE FUNCTION public.get_provider_click_analytics_admin()
RETURNS SETOF public.provider_click_analytics
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.provider_click_analytics
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY total_clicks DESC NULLS LAST;
$$;

-- User function to get their own subscriptions with provider info
CREATE OR REPLACE FUNCTION public.get_my_provider_subscriptions_with_provider()
RETURNS SETOF public.provider_subscriptions_with_provider
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.*
  FROM public.provider_subscriptions_with_provider v
  WHERE auth.uid() IS NOT NULL
    AND v.user_id = auth.uid()
  ORDER BY v.created_at DESC;
$$;

-- Admin function to get all subscriptions with provider info
CREATE OR REPLACE FUNCTION public.get_provider_subscriptions_with_provider_admin()
RETURNS SETOF public.provider_subscriptions_with_provider
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.*
  FROM public.provider_subscriptions_with_provider v
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY v.created_at DESC;
$$;