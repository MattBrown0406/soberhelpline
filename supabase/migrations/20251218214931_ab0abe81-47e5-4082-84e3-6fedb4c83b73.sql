-- Create forum_posts table for discussions
CREATE TABLE public.forum_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id text NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text,
    content text NOT NULL,
    parent_post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Create index for faster topic queries
CREATE INDEX idx_forum_posts_topic ON public.forum_posts(topic_id);
CREATE INDEX idx_forum_posts_parent ON public.forum_posts(parent_post_id);

-- RLS Policies

-- Active members can view all posts
CREATE POLICY "Active members can view posts"
ON public.forum_posts
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.provider_subscriptions
        WHERE user_id = auth.uid()
        AND status = 'active'
        AND provider_submission_id IS NULL
    )
);

-- Active members can create posts
CREATE POLICY "Active members can create posts"
ON public.forum_posts
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
        SELECT 1 FROM public.provider_subscriptions
        WHERE user_id = auth.uid()
        AND status = 'active'
        AND provider_submission_id IS NULL
    )
);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON public.forum_posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts, admins and moderators can delete any
CREATE POLICY "Users can delete own posts"
ON public.forum_posts
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id 
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'moderator')
);

-- Admins can view all posts
CREATE POLICY "Admins can view all posts"
ON public.forum_posts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_forum_posts_updated_at
    BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for forum posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;