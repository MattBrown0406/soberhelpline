-- Drop and recreate view with security_invoker to respect RLS on guide_views
DROP VIEW IF EXISTS public.guide_analytics;

CREATE VIEW public.guide_analytics
WITH (security_invoker = true)
AS
SELECT 
    guide_path,
    guide_name,
    count(*) AS total_views,
    count(DISTINCT session_id) AS unique_sessions,
    count(DISTINCT user_id) AS unique_users,
    date_trunc('month'::text, viewed_at) AS month
FROM guide_views
GROUP BY guide_path, guide_name, (date_trunc('month'::text, viewed_at));