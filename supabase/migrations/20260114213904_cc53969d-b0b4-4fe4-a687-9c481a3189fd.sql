-- Drop the dependent function first
DROP FUNCTION IF EXISTS public.get_provider_click_analytics_admin();

-- Drop and recreate the view with security_invoker to respect RLS
DROP VIEW IF EXISTS public.provider_click_analytics;

CREATE VIEW public.provider_click_analytics
WITH (security_invoker = on) AS
SELECT 
    pc.provider_id,
    ps.provider_name,
    ps.category,
    ps.city,
    ps.state,
    count(*) AS total_clicks,
    count(DISTINCT pc.session_id) AS unique_visitors,
    count(*) FILTER (WHERE pc.click_type = 'card_view'::text) AS card_views,
    count(*) FILTER (WHERE pc.click_type = 'website'::text) AS website_clicks,
    count(*) FILTER (WHERE pc.click_type = 'phone'::text) AS phone_clicks,
    count(*) FILTER (WHERE pc.click_type = 'email'::text) AS email_clicks,
    count(*) FILTER (WHERE pc.clicked_at > (now() - '7 days'::interval)) AS clicks_last_7_days,
    count(*) FILTER (WHERE pc.clicked_at > (now() - '30 days'::interval)) AS clicks_last_30_days,
    min(pc.clicked_at) AS first_click,
    max(pc.clicked_at) AS last_click
FROM provider_clicks pc
JOIN provider_submissions ps ON pc.provider_id = ps.id
GROUP BY pc.provider_id, ps.provider_name, ps.category, ps.city, ps.state;

-- Recreate the admin function
CREATE OR REPLACE FUNCTION public.get_provider_click_analytics_admin()
RETURNS SETOF provider_click_analytics
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT *
  FROM public.provider_click_analytics
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY total_clicks DESC NULLS LAST;
$$;