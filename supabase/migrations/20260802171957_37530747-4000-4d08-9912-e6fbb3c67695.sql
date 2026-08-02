-- 1. consultation_providers: guarantee sensitive columns are never readable by anon/authenticated
REVOKE SELECT ON TABLE public.consultation_providers FROM anon, authenticated;
REVOKE SELECT (paypal_email, notification_email) ON public.consultation_providers FROM anon, authenticated;
GRANT SELECT (
  id, user_id, full_name, title, bio, photo_url, specialties,
  session_rate, session_duration_minutes, status, timezone, created_at, updated_at
) ON public.consultation_providers TO anon, authenticated;

-- 2. email_poll_votes: no direct client reads at all; token flow uses SECURITY DEFINER RPCs
REVOKE ALL ON TABLE public.email_poll_votes FROM anon;
REVOKE ALL ON TABLE public.email_poll_votes FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_poll_votes TO authenticated; -- admin policy still gates rows
GRANT ALL ON public.email_poll_votes TO service_role;

DROP POLICY IF EXISTS "Deny anonymous reads of poll votes" ON public.email_poll_votes;
CREATE POLICY "Deny anonymous reads of poll votes"
ON public.email_poll_votes
FOR SELECT
TO anon
USING (false);

-- 3. forum reactions / poll votes: scope policies to authenticated role only
DROP POLICY IF EXISTS "Members can view reactions" ON public.forum_post_reactions;
CREATE POLICY "Members can view reactions"
ON public.forum_post_reactions
FOR SELECT
TO authenticated
USING (
  public.is_active_family_member(auth.uid())
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);

DROP POLICY IF EXISTS "Members can add reactions" ON public.forum_post_reactions;
CREATE POLICY "Members can add reactions"
ON public.forum_post_reactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.is_active_family_member(auth.uid()));

DROP POLICY IF EXISTS "Members can remove own reactions" ON public.forum_post_reactions;
CREATE POLICY "Members can remove own reactions"
ON public.forum_post_reactions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can view votes" ON public.forum_poll_votes;
CREATE POLICY "Members can view votes"
ON public.forum_poll_votes
FOR SELECT
TO authenticated
USING (
  public.is_active_family_member(auth.uid())
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);

DROP POLICY IF EXISTS "Members can vote" ON public.forum_poll_votes;
CREATE POLICY "Members can vote"
ON public.forum_poll_votes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.is_active_family_member(auth.uid()));

DROP POLICY IF EXISTS "Members can change vote" ON public.forum_poll_votes;
CREATE POLICY "Members can change vote"
ON public.forum_poll_votes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

REVOKE ALL ON TABLE public.forum_post_reactions FROM anon;
REVOKE ALL ON TABLE public.forum_poll_votes FROM anon;
GRANT SELECT, INSERT, DELETE ON public.forum_post_reactions TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.forum_poll_votes TO authenticated;
GRANT ALL ON public.forum_post_reactions TO service_role;
GRANT ALL ON public.forum_poll_votes TO service_role;