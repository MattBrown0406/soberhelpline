-- Recreate provider_click_analytics view with security_invoker = true
-- This ensures the view respects RLS policies on underlying tables
DROP VIEW IF EXISTS public.provider_click_analytics;

CREATE VIEW public.provider_click_analytics
WITH (security_invoker = true)
AS
SELECT 
  ps.id as provider_id,
  ps.provider_name,
  ps.category,
  ps.city,
  ps.state,
  COUNT(pc.id) as total_clicks,
  COUNT(DISTINCT pc.session_id) as unique_visitors,
  COUNT(CASE WHEN pc.click_type = 'card_view' THEN 1 END) as card_views,
  COUNT(CASE WHEN pc.click_type = 'website_click' THEN 1 END) as website_clicks,
  COUNT(CASE WHEN pc.click_type = 'phone_click' THEN 1 END) as phone_clicks,
  COUNT(CASE WHEN pc.click_type = 'email_click' THEN 1 END) as email_clicks,
  COUNT(CASE WHEN pc.clicked_at > NOW() - INTERVAL '7 days' THEN 1 END) as clicks_last_7_days,
  COUNT(CASE WHEN pc.clicked_at > NOW() - INTERVAL '30 days' THEN 1 END) as clicks_last_30_days,
  MIN(pc.clicked_at) as first_click,
  MAX(pc.clicked_at) as last_click
FROM public.provider_submissions ps
LEFT JOIN public.provider_clicks pc ON ps.id = pc.provider_id
WHERE ps.status = 'approved'
GROUP BY ps.id, ps.provider_name, ps.category, ps.city, ps.state;