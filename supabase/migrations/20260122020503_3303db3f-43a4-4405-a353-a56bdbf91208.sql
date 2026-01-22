-- Create a secure view for forum posts that masks user_id for anonymous posts
-- Only the post owner, admins, and moderators can see the real user_id for anonymous posts

CREATE OR REPLACE VIEW public.forum_posts_secure AS
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
    WHEN is_anonymous = true AND auth.uid() = user_id THEN user_id  -- Owner can see their own
    WHEN is_anonymous = true AND public.has_role(auth.uid(), 'admin'::public.app_role) THEN user_id
    WHEN is_anonymous = true AND public.has_role(auth.uid(), 'moderator'::public.app_role) THEN user_id
    ELSE NULL  -- Mask user_id for anonymous posts viewed by others
  END AS user_id
FROM public.forum_posts;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.forum_posts_secure TO authenticated;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.forum_posts_secure IS 'Secure view for forum posts that masks user_id when is_anonymous is true, except for the post owner, admins, and moderators. Use this view for reading posts to prevent de-anonymization.';