-- Secure provider_click_analytics view: enforce underlying RLS via security_invoker and restrict grants

DROP VIEW IF EXISTS public.provider_click_analytics;

CREATE VIEW public.provider_click_analytics
WITH (security_invoker = true)
AS
SELECT
  pc.provider_id,
  COUNT(*)::bigint AS total_clicks,
  COUNT(DISTINCT pc.session_id)::bigint AS unique_visitors,
  COUNT(*) FILTER (WHERE pc.click_type = 'card_view')::bigint AS card_views,
  COUNT(*) FILTER (WHERE pc.click_type = 'website')::bigint AS website_clicks,
  COUNT(*) FILTER (WHERE pc.click_type = 'phone')::bigint AS phone_clicks,
  COUNT(*) FILTER (WHERE pc.click_type = 'email')::bigint AS email_clicks,
  COUNT(*) FILTER (WHERE pc.clicked_at >= now() - interval '7 days')::bigint AS clicks_last_7_days,
  COUNT(*) FILTER (WHERE pc.clicked_at >= now() - interval '30 days')::bigint AS clicks_last_30_days,
  MIN(pc.clicked_at) AS first_click,
  MAX(pc.clicked_at) AS last_click,
  ps.provider_name,
  ps.category,
  ps.city,
  ps.state
FROM public.provider_clicks pc
LEFT JOIN public.provider_submissions ps ON ps.id = pc.provider_id
GROUP BY pc.provider_id, ps.provider_name, ps.category, ps.city, ps.state;

-- Prevent anonymous/public access; allow only authenticated (RLS still applies through security_invoker)
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM public;
GRANT SELECT ON public.provider_click_analytics TO authenticated;