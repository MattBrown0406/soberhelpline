-- Drop and recreate the view with security_invoker to respect underlying RLS
DROP VIEW IF EXISTS public.provider_click_analytics;

CREATE VIEW public.provider_click_analytics 
WITH (security_invoker = true)
AS
SELECT 
    ps.id AS provider_id,
    ps.provider_name,
    ps.category,
    ps.city,
    ps.state,
    count(pc.id) AS total_clicks,
    count(DISTINCT pc.session_id) AS unique_visitors,
    count(CASE WHEN pc.click_type = 'card_view' THEN 1 ELSE NULL END) AS card_views,
    count(CASE WHEN pc.click_type = 'website_click' THEN 1 ELSE NULL END) AS website_clicks,
    count(CASE WHEN pc.click_type = 'phone_click' THEN 1 ELSE NULL END) AS phone_clicks,
    count(CASE WHEN pc.click_type = 'email_click' THEN 1 ELSE NULL END) AS email_clicks,
    count(CASE WHEN pc.clicked_at > (now() - interval '7 days') THEN 1 ELSE NULL END) AS clicks_last_7_days,
    count(CASE WHEN pc.clicked_at > (now() - interval '30 days') THEN 1 ELSE NULL END) AS clicks_last_30_days,
    min(pc.clicked_at) AS first_click,
    max(pc.clicked_at) AS last_click
FROM provider_submissions ps
LEFT JOIN provider_clicks pc ON ps.id = pc.provider_id
WHERE ps.status = 'approved'
GROUP BY ps.id, ps.provider_name, ps.category, ps.city, ps.state;

-- Grant access to authenticated users (admins will access through underlying RLS)
GRANT SELECT ON public.provider_click_analytics TO authenticated;