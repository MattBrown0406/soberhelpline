-- Extra tables the member-area parts depend on (shapes from types.ts + original migrations).
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), topic_id text NOT NULL, user_id uuid NOT NULL, title text, content text NOT NULL,
  parent_post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE, is_anonymous boolean NOT NULL DEFAULT false,
  is_pinned boolean NOT NULL DEFAULT false, needs_support boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active members can view posts" ON public.forum_posts FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.provider_subscriptions WHERE user_id = auth.uid() AND status = 'active' AND provider_submission_id IS NULL));
CREATE POLICY "Active members can create posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.provider_subscriptions WHERE user_id = auth.uid() AND status = 'active' AND provider_submission_id IS NULL));
CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Admins can view all posts" ON public.forum_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_posts TO authenticated;
GRANT ALL ON public.forum_posts TO service_role;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;

CREATE TABLE public.user_notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id uuid NOT NULL UNIQUE,
  weekly_forum_digest boolean NOT NULL DEFAULT true, weekly_education_nudge boolean NOT NULL DEFAULT true,
  mention_notifications boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own preferences" ON public.user_notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own preferences" ON public.user_notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_notification_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.education_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id uuid NOT NULL, resource_type text NOT NULL, resource_path text NOT NULL,
  resource_name text NOT NULL, status text NOT NULL DEFAULT 'started', progress_percentage integer DEFAULT 0, completed_at timestamptz,
  time_spent_seconds integer DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, resource_path)
);
ALTER TABLE public.education_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress" ON public.education_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE ON public.education_progress TO authenticated;

CREATE TABLE public.worksheet_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, worksheet_key text NOT NULL, responses jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (user_id, worksheet_key)
);
ALTER TABLE public.worksheet_responses ENABLE ROW LEVEL SECURITY;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
