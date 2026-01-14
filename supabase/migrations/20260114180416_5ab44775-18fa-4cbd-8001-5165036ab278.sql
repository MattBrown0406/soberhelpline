-- Recreate the guide_analytics view with security_invoker to respect RLS
DROP VIEW IF EXISTS public.guide_analytics;

CREATE VIEW public.guide_analytics
WITH (security_invoker=on) AS
SELECT 
  guide_path,
  guide_name,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  date_trunc('month', viewed_at) as month
FROM public.guide_views
GROUP BY guide_path, guide_name, date_trunc('month', viewed_at);

-- Add a SELECT policy on guide_views that only allows admins to read
-- This protects both direct table access AND the view (via security_invoker)
CREATE POLICY "Only admins can read guide views"
  ON public.guide_views
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));