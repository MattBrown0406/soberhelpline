-- Table for @mentions in posts
CREATE TABLE public.forum_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  mentioned_user_id UUID NOT NULL,
  mentioning_user_id UUID NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forum_mentions ENABLE ROW LEVEL SECURITY;

-- Users can see mentions about them
CREATE POLICY "Users can view their own mentions"
  ON public.forum_mentions FOR SELECT
  USING (auth.uid() = mentioned_user_id);

-- Active family members can create mentions
CREATE POLICY "Active members can create mentions"
  ON public.forum_mentions FOR INSERT
  WITH CHECK (
    auth.uid() = mentioning_user_id
    AND public.is_active_family_member(auth.uid())
  );

-- Users can mark their mentions as read
CREATE POLICY "Users can update their own mentions"
  ON public.forum_mentions FOR UPDATE
  USING (auth.uid() = mentioned_user_id);

-- Table for post drafts (auto-save)
CREATE TABLE public.forum_post_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id TEXT NOT NULL,
  parent_post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id, parent_post_id)
);

-- Enable RLS
ALTER TABLE public.forum_post_drafts ENABLE ROW LEVEL SECURITY;

-- Users can manage their own drafts
CREATE POLICY "Users can view their own drafts"
  ON public.forum_post_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own drafts"
  ON public.forum_post_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON public.forum_post_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON public.forum_post_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Table for journal entries
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  related_resource_path TEXT,
  related_resource_name TEXT,
  mood TEXT,
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own journal entries
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Table for education progress tracking
CREATE TABLE public.education_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_type TEXT NOT NULL, -- 'guide', 'worksheet', 'assessment', 'meditation'
  resource_path TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'started', -- 'started', 'in_progress', 'completed'
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_path)
);

-- Enable RLS
ALTER TABLE public.education_progress ENABLE ROW LEVEL SECURITY;

-- Users can manage their own progress
CREATE POLICY "Users can view their own progress"
  ON public.education_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON public.education_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.education_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Table for resource bookmarks (education)
CREATE TABLE public.education_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_path TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_path)
);

-- Enable RLS
ALTER TABLE public.education_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can manage their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.education_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON public.education_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.education_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Table for digest/notification preferences
CREATE TABLE public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  weekly_forum_digest BOOLEAN NOT NULL DEFAULT true,
  weekly_education_nudge BOOLEAN NOT NULL DEFAULT true,
  mention_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can manage their own preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
  ON public.user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_forum_mentions_mentioned_user ON public.forum_mentions(mentioned_user_id);
CREATE INDEX idx_forum_mentions_post ON public.forum_mentions(post_id);
CREATE INDEX idx_forum_post_drafts_user ON public.forum_post_drafts(user_id);
CREATE INDEX idx_journal_entries_user ON public.journal_entries(user_id);
CREATE INDEX idx_education_progress_user ON public.education_progress(user_id);
CREATE INDEX idx_education_bookmarks_user ON public.education_bookmarks(user_id);

-- Update triggers for updated_at
CREATE TRIGGER update_forum_post_drafts_updated_at
  BEFORE UPDATE ON public.forum_post_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_progress_updated_at
  BEFORE UPDATE ON public.education_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON public.user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();