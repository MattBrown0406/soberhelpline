-- =====================================================
-- FORUM ENGAGEMENT FEATURES DATABASE SCHEMA
-- =====================================================

-- 1. Add new columns to forum_posts for pinning, anonymous posting, and support requests
ALTER TABLE public.forum_posts 
ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS needs_support boolean NOT NULL DEFAULT false;

-- 2. Create reactions table for emoji reactions on posts
CREATE TABLE public.forum_post_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('pray', 'strong', 'heart', 'hug')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, reaction_type)
);

-- 3. Create bookmarks table
CREATE TABLE public.forum_bookmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- 4. Create topic follows table for notifications
CREATE TABLE public.forum_topic_follows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (topic_id, user_id)
);

-- 5. Create polls table
CREATE TABLE public.forum_polls (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE UNIQUE,
  question text NOT NULL,
  allows_multiple boolean NOT NULL DEFAULT false,
  ends_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 6. Create poll options table
CREATE TABLE public.forum_poll_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES public.forum_polls(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 7. Create poll votes table
CREATE TABLE public.forum_poll_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES public.forum_polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES public.forum_poll_options(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (poll_id, option_id, user_id)
);

-- 8. Create daily prompts table
CREATE TABLE public.forum_daily_prompts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_text text NOT NULL,
  topic_id text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 9. Create badge definitions table
CREATE TABLE public.forum_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL DEFAULT 'bg-blue-500',
  criteria_type text NOT NULL CHECK (criteria_type IN ('membership_duration', 'post_count', 'helpful_contributor', 'manual')),
  criteria_value integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 10. Create user badges table
CREATE TABLE public.user_forum_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.forum_badges(id) ON DELETE CASCADE,
  awarded_at timestamp with time zone NOT NULL DEFAULT now(),
  awarded_by uuid,
  UNIQUE (user_id, badge_id)
);

-- 11. Create member spotlights table
CREATE TABLE public.forum_member_spotlights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  month date NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (month)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.forum_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topic_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_daily_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_forum_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_member_spotlights ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Reactions
-- =====================================================

CREATE POLICY "Members can view reactions"
ON public.forum_post_reactions FOR SELECT
USING (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Members can add reactions"
ON public.forum_post_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_active_family_member(auth.uid()));

CREATE POLICY "Members can remove own reactions"
ON public.forum_post_reactions FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Bookmarks
-- =====================================================

CREATE POLICY "Users can view own bookmarks"
ON public.forum_bookmarks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Members can add bookmarks"
ON public.forum_bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_active_family_member(auth.uid()));

CREATE POLICY "Users can remove own bookmarks"
ON public.forum_bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Topic Follows
-- =====================================================

CREATE POLICY "Users can view own follows"
ON public.forum_topic_follows FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Members can follow topics"
ON public.forum_topic_follows FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_active_family_member(auth.uid()));

CREATE POLICY "Users can unfollow topics"
ON public.forum_topic_follows FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Polls
-- =====================================================

CREATE POLICY "Members can view polls"
ON public.forum_polls FOR SELECT
USING (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Members can create polls"
ON public.forum_polls FOR INSERT
WITH CHECK (public.is_active_family_member(auth.uid()));

-- =====================================================
-- RLS POLICIES - Poll Options
-- =====================================================

CREATE POLICY "Members can view poll options"
ON public.forum_poll_options FOR SELECT
USING (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Members can create poll options"
ON public.forum_poll_options FOR INSERT
WITH CHECK (public.is_active_family_member(auth.uid()));

-- =====================================================
-- RLS POLICIES - Poll Votes
-- =====================================================

CREATE POLICY "Members can view votes"
ON public.forum_poll_votes FOR SELECT
USING (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Members can vote"
ON public.forum_poll_votes FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_active_family_member(auth.uid()));

CREATE POLICY "Members can change vote"
ON public.forum_poll_votes FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Daily Prompts
-- =====================================================

CREATE POLICY "Members can view active prompts"
ON public.forum_daily_prompts FOR SELECT
USING (is_active = true AND (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Admins can manage prompts"
ON public.forum_daily_prompts FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS POLICIES - Badges
-- =====================================================

CREATE POLICY "Anyone can view badges"
ON public.forum_badges FOR SELECT
USING (true);

CREATE POLICY "Admins can manage badges"
ON public.forum_badges FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS POLICIES - User Badges
-- =====================================================

CREATE POLICY "Members can view user badges"
ON public.user_forum_badges FOR SELECT
USING (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins and moderators can award badges"
ON public.user_forum_badges FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can revoke badges"
ON public.user_forum_badges FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS POLICIES - Member Spotlights
-- =====================================================

CREATE POLICY "Members can view spotlights"
ON public.forum_member_spotlights FOR SELECT
USING (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage spotlights"
ON public.forum_member_spotlights FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- SEED DEFAULT BADGES
-- =====================================================

INSERT INTO public.forum_badges (name, description, icon, color, criteria_type, criteria_value) VALUES
('New Member', 'Welcome to the community!', '👋', 'bg-blue-500', 'membership_duration', 0),
('1 Month Member', 'Active member for 1 month', '⭐', 'bg-green-500', 'membership_duration', 30),
('3 Month Member', 'Active member for 3 months', '🌟', 'bg-purple-500', 'membership_duration', 90),
('6 Month Member', 'Active member for 6 months', '💫', 'bg-yellow-500', 'membership_duration', 180),
('1 Year Member', 'Celebrating 1 year in our community', '🎉', 'bg-pink-500', 'membership_duration', 365),
('Helpful Contributor', 'Recognized for providing helpful support', '💝', 'bg-rose-500', 'helpful_contributor', null),
('Active Participant', 'Posted 10+ times', '💬', 'bg-cyan-500', 'post_count', 10),
('Community Pillar', 'Posted 50+ times', '🏆', 'bg-orange-500', 'post_count', 50);

-- =====================================================
-- SEED DAILY PROMPTS
-- =====================================================

INSERT INTO public.forum_daily_prompts (prompt_text, topic_id) VALUES
('What is one thing that helped you cope this week?', 'self-care'),
('Share a boundary you successfully maintained recently.', 'boundaries'),
('What resource (book, podcast, article) has been helpful in your journey?', 'resources'),
('How are you taking care of yourself today?', 'self-care'),
('What is something positive that happened in your family recently?', 'recovery-wins'),
('What is one thing you wish you knew earlier in this journey?', 'ask-community'),
('Share a moment when you felt supported by this community.', 'introductions'),
('What healthy coping mechanism has worked best for you?', 'self-care'),
('How do you maintain hope during difficult times?', 'share-story'),
('What advice would you give to someone new to this journey?', 'ask-community');

-- =====================================================
-- ENABLE REALTIME for new tables
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_post_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_poll_votes;