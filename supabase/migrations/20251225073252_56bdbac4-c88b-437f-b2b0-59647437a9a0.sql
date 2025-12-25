-- Create table to track guide views
CREATE TABLE public.guide_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_path text NOT NULL,
  guide_name text NOT NULL,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text
);

-- Enable RLS
ALTER TABLE public.guide_views ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own views
CREATE POLICY "Authenticated users can insert guide views"
ON public.guide_views
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow anonymous inserts with null user_id (for non-logged-in tracking)
CREATE POLICY "Anyone can insert anonymous guide views"
ON public.guide_views
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Only admins can view analytics
CREATE POLICY "Admins can view all guide analytics"
ON public.guide_views
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Create a view for monthly analytics
CREATE OR REPLACE VIEW public.guide_analytics AS
SELECT 
  guide_path,
  guide_name,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('month', viewed_at) as month
FROM public.guide_views
GROUP BY guide_path, guide_name, DATE_TRUNC('month', viewed_at)
ORDER BY month DESC, total_views DESC;

-- Revoke direct access to the analytics view
REVOKE ALL ON public.guide_analytics FROM anon;
REVOKE ALL ON public.guide_analytics FROM authenticated;
GRANT SELECT ON public.guide_analytics TO postgres;

-- Create a security definer function for admin access to analytics
CREATE OR REPLACE FUNCTION public.get_guide_analytics()
RETURNS TABLE (
  guide_path text,
  guide_name text,
  total_views bigint,
  unique_sessions bigint,
  unique_users bigint,
  month timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT guide_path, guide_name, total_views, unique_sessions, unique_users, month
  FROM public.guide_analytics
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY month DESC, total_views DESC;
$$;