-- Forum tables (shapes from types.ts; original policies from the repo migrations).
CREATE TABLE public.private_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sender_id uuid NOT NULL, recipient_id uuid NOT NULL, subject text NOT NULL DEFAULT '',
  content text NOT NULL, is_read boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their messages" ON public.private_messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Active members can send messages" ON public.private_messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.provider_subscriptions WHERE user_id = auth.uid() AND status = 'active' AND provider_submission_id IS NULL));
GRANT SELECT, INSERT, UPDATE ON public.private_messages TO authenticated;

CREATE TABLE public.forum_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  mentioned_user_id uuid NOT NULL, mentioning_user_id uuid NOT NULL, is_read boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their mentions" ON public.forum_mentions FOR SELECT TO authenticated USING (auth.uid() = mentioned_user_id);
CREATE POLICY "Active members can create mentions" ON public.forum_mentions FOR INSERT TO authenticated WITH CHECK (auth.uid() = mentioning_user_id);
GRANT SELECT, INSERT, UPDATE ON public.forum_mentions TO authenticated;

CREATE TABLE public.forum_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  question text NOT NULL, allows_multiple boolean NOT NULL DEFAULT false, ends_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view polls" ON public.forum_polls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can create polls" ON public.forum_polls FOR INSERT TO authenticated WITH CHECK (true);
GRANT SELECT, INSERT ON public.forum_polls TO authenticated;
CREATE TABLE public.forum_poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), poll_id uuid NOT NULL REFERENCES public.forum_polls(id) ON DELETE CASCADE,
  option_text text NOT NULL, display_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_poll_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view poll options" ON public.forum_poll_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can create poll options" ON public.forum_poll_options FOR INSERT TO authenticated WITH CHECK (true);
GRANT SELECT, INSERT ON public.forum_poll_options TO authenticated;

CREATE FUNCTION public.get_public_profiles(_user_ids uuid[]) RETURNS TABLE(id uuid, username text, first_name text, last_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.username, p.first_name, p.last_name FROM public.profiles p
  WHERE auth.uid() IS NOT NULL AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') OR public.is_active_family_member(auth.uid()))
    AND p.id = ANY(_user_ids);
$$;
-- old secure view (security_invoker) as live today
CREATE VIEW public.forum_posts_secure WITH (security_invoker=on) AS
SELECT id, topic_id, parent_post_id, title, content, is_anonymous, is_pinned, needs_support, created_at, updated_at,
  CASE WHEN is_anonymous = false THEN user_id WHEN auth.uid() = user_id THEN user_id ELSE NULL END AS user_id
FROM public.forum_posts;
GRANT SELECT ON public.forum_posts_secure TO authenticated;
INSERT INTO public.profiles (id, first_name, last_name, username) VALUES
 ('00000000-0000-0000-0000-00000000000a','Admin','Person','host'),
 ('00000000-0000-0000-0000-00000000000b','Mary','Realname','quietmom'),
 ('00000000-0000-0000-0000-00000000000c','Stranger','X',NULL),
 ('00000000-0000-0000-0000-00000000000e','Ellen','Other','ellen_k');
