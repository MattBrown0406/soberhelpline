-- Drop the existing view and recreate with security_invoker=on
-- This ensures the view uses the calling user's permissions, not the view creator's
DROP VIEW IF EXISTS public.forum_posts_secure;

CREATE VIEW public.forum_posts_secure
WITH (security_invoker=on) AS
SELECT 
  id,
  topic_id,
  parent_post_id,
  title,
  content,
  is_anonymous,
  is_pinned,
  needs_support,
  created_at,
  updated_at,
  -- Mask user_id for anonymous posts unless viewer is owner, admin, or moderator
  CASE 
    WHEN is_anonymous = false THEN user_id
    WHEN is_anonymous = true AND auth.uid() = user_id THEN user_id
    WHEN is_anonymous = true AND public.has_role(auth.uid(), 'admin'::public.app_role) THEN user_id
    WHEN is_anonymous = true AND public.has_role(auth.uid(), 'moderator'::public.app_role) THEN user_id
    ELSE NULL
  END AS user_id
FROM public.forum_posts;

-- Revoke public access and grant only to authenticated users
REVOKE ALL ON public.forum_posts_secure FROM anon;
REVOKE ALL ON public.forum_posts_secure FROM public;
GRANT SELECT ON public.forum_posts_secure TO authenticated;

COMMENT ON VIEW public.forum_posts_secure IS 'Secure view for forum posts with security_invoker=on. Inherits RLS from forum_posts table and masks user_id for anonymous posts.';