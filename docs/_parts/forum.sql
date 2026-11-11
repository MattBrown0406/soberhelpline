-- =====================================================================
-- Forum (workstream A) — 2026-11-10
-- Three spaces, real anonymity, one membership rule, safer writes.
-- Idempotent: safe to run twice. Run as ONE migration, in this order.
--
-- Membership rule everywhere: public.is_active_family_member(uid)
-- (members who cancelled but are paid through keep access).
-- Staff = admin or moderator via public.has_role().
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Helpers (SECURITY DEFINER so policies can ask about a post's author
--    without members needing to read forum_posts.user_id themselves).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_forum_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND (
    public.has_role(_user_id, 'admin'::public.app_role)
    OR public.has_role(_user_id, 'moderator'::public.app_role)
  );
$$;
REVOKE ALL ON FUNCTION public.is_forum_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_forum_staff(uuid) TO authenticated, service_role;

-- True when the signed-in user wrote the post.
CREATE OR REPLACE FUNCTION public.is_forum_post_author(_post_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.forum_posts p
    WHERE p.id = _post_id AND p.user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION public.is_forum_post_author(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_forum_post_author(uuid) TO authenticated, service_role;

-- True when the signed-in user wrote the post AND it is not anonymous
-- (an @mention row would tell the mentioned member who wrote it).
CREATE OR REPLACE FUNCTION public.can_mention_from_post(_post_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.forum_posts p
    WHERE p.id = _post_id AND p.user_id = auth.uid() AND p.is_anonymous = false
  );
$$;
REVOKE ALL ON FUNCTION public.can_mention_from_post(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_mention_from_post(uuid) TO authenticated, service_role;


-- ---------------------------------------------------------------------
-- 2. forum_posts policies: is_active_family_member instead of raw
--    provider_subscriptions.status = 'active'; staff can read, post
--    (Host replies) and update (pin) as well.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Active members can view posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Members and staff can view posts" ON public.forum_posts;
CREATE POLICY "Members and staff can view posts"
ON public.forum_posts
FOR SELECT
TO authenticated
USING (
  public.is_active_family_member(auth.uid())
  OR public.is_forum_staff(auth.uid())
);

DROP POLICY IF EXISTS "Active members can create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Members and staff can create posts" ON public.forum_posts;
CREATE POLICY "Members and staff can create posts"
ON public.forum_posts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    public.is_active_family_member(auth.uid())
    OR public.is_forum_staff(auth.uid())
  )
);

DROP POLICY IF EXISTS "Staff can update posts" ON public.forum_posts;
CREATE POLICY "Staff can update posts"
ON public.forum_posts
FOR UPDATE
TO authenticated
USING (public.is_forum_staff(auth.uid()))
WITH CHECK (public.is_forum_staff(auth.uid()));
-- Kept as they are: "Users can update their own posts", "Users can delete own
-- posts" (owner/admin/moderator), "Admins can view all posts".


-- ---------------------------------------------------------------------
-- 3. Write guard on forum_posts (style of prevent_provider_subscription_tampering).
--    Non-staff:
--      * cannot pin, or change user_id / topic_id / parent_post_id on update;
--      * cannot start a new conversation in an archived space;
--      * a reply always takes its parent's topic.
--    Service role, direct database sessions and admins/moderators bypass.
--    KEEP the active list in sync with ACTIVE_TOPIC_IDS in src/lib/forumTopics.ts.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_forum_post_write()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _parent_topic text;
BEGIN
  IF current_user NOT IN ('authenticated', 'anon')
     OR coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '') = 'service_role'
     OR public.is_forum_staff(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.is_pinned := false;
    IF NEW.parent_post_id IS NULL THEN
      IF NEW.topic_id NOT IN ('this-weeks-meeting', 'ask-community', 'introductions') THEN
        RAISE EXCEPTION 'New conversations can only be started in an active forum space'
          USING ERRCODE = '42501';
      END IF;
    ELSE
      SELECT p.topic_id INTO _parent_topic
      FROM public.forum_posts p
      WHERE p.id = NEW.parent_post_id;
      IF _parent_topic IS NULL THEN
        RAISE EXCEPTION 'The conversation you are replying to no longer exists'
          USING ERRCODE = '23503';
      END IF;
      NEW.topic_id := _parent_topic;
    END IF;
    RETURN NEW;
  END IF;

  -- UPDATE
  IF NEW.is_pinned IS DISTINCT FROM OLD.is_pinned
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.topic_id IS DISTINCT FROM OLD.topic_id
     OR NEW.parent_post_id IS DISTINCT FROM OLD.parent_post_id THEN
    RAISE EXCEPTION 'Only moderators can pin or move forum posts'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_forum_post_write_trg ON public.forum_posts;
CREATE TRIGGER guard_forum_post_write_trg
BEFORE INSERT OR UPDATE ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.guard_forum_post_write();


-- ---------------------------------------------------------------------
-- 4. forum_posts_secure: the ONLY way members read posts.
--    Runs with the view owner's rights (security_invoker = false), so it
--    enforces access itself: members (is_active_family_member) and staff.
--    Masks user_id on anonymous posts unless the viewer is the author or
--    staff. Adds is_mine and author_is_staff (false for anonymous posts).
--    Same leading columns, in the same order, as the old view.
-- ---------------------------------------------------------------------
DROP VIEW IF EXISTS public.forum_posts_secure;

CREATE VIEW public.forum_posts_secure
WITH (security_invoker = false) AS
SELECT
  fp.id,
  fp.topic_id,
  fp.parent_post_id,
  fp.title,
  fp.content,
  fp.is_anonymous,
  fp.is_pinned,
  fp.needs_support,
  fp.created_at,
  fp.updated_at,
  CASE
    WHEN fp.is_anonymous = false THEN fp.user_id
    WHEN fp.user_id = auth.uid() THEN fp.user_id
    WHEN (SELECT public.is_forum_staff(auth.uid())) THEN fp.user_id
    ELSE NULL
  END AS user_id,
  (auth.uid() IS NOT NULL AND fp.user_id = auth.uid()) AS is_mine,
  (
    fp.is_anonymous = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = fp.user_id
        AND ur.role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  ) AS author_is_staff
FROM public.forum_posts fp
WHERE auth.uid() IS NOT NULL
  AND (
    (SELECT public.is_active_family_member(auth.uid()))
    OR (SELECT public.is_forum_staff(auth.uid()))
  );

REVOKE ALL ON public.forum_posts_secure FROM PUBLIC;
REVOKE ALL ON public.forum_posts_secure FROM anon;
REVOKE ALL ON public.forum_posts_secure FROM authenticated;
GRANT SELECT ON public.forum_posts_secure TO authenticated;
GRANT SELECT ON public.forum_posts_secure TO service_role;

COMMENT ON VIEW public.forum_posts_secure IS
  'Members read forum posts ONLY through this view. Owner-rights view (security_invoker=false) that limits rows to active family members and staff, masks user_id on anonymous posts (except for the author and staff), and adds is_mine / author_is_staff. authenticated has no SELECT on forum_posts.user_id.';


-- ---------------------------------------------------------------------
-- 5. Members can no longer read forum_posts.user_id from the base table.
--    INSERT / UPDATE / DELETE grants are untouched. RLS policies may still
--    use user_id (column privileges only apply to columns a query names).
-- ---------------------------------------------------------------------
REVOKE SELECT ON public.forum_posts FROM PUBLIC;
REVOKE SELECT ON public.forum_posts FROM authenticated;
REVOKE SELECT (user_id) ON public.forum_posts FROM authenticated;
GRANT SELECT (
  id, topic_id, parent_post_id, title, content,
  is_anonymous, is_pinned, needs_support, created_at, updated_at
) ON public.forum_posts TO authenticated;
GRANT ALL ON public.forum_posts TO service_role;


-- ---------------------------------------------------------------------
-- 6. Realtime payloads include every column (user_id too): take
--    forum_posts out of the publication. The site now polls.
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'forum_posts'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.forum_posts';
  END IF;
END $$;


-- ---------------------------------------------------------------------
-- 7. private_messages: membership rule; only to members or staff; not to
--    yourself. (Reading your own messages is unchanged.)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Active members can send messages" ON public.private_messages;
CREATE POLICY "Active members can send messages"
ON public.private_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND recipient_id <> sender_id
  AND (
    public.is_active_family_member(auth.uid())
    OR public.is_forum_staff(auth.uid())
  )
  AND (
    public.is_active_family_member(recipient_id)
    OR public.is_forum_staff(recipient_id)
  )
);


-- ---------------------------------------------------------------------
-- 8. forum_mentions: only from your own, non-anonymous post.
--    (The bell polls; no realtime needed for forum_mentions.)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Active members can create mentions" ON public.forum_mentions;
CREATE POLICY "Active members can create mentions"
ON public.forum_mentions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = mentioning_user_id
  AND mentioned_user_id <> auth.uid()
  AND (
    public.is_active_family_member(auth.uid())
    OR public.is_forum_staff(auth.uid())
  )
  AND public.can_mention_from_post(post_id)
);


-- ---------------------------------------------------------------------
-- 9. Polls: only on your own post (previously any member could attach a
--    poll to anyone's post).
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Members can create polls" ON public.forum_polls;
CREATE POLICY "Members can create polls"
ON public.forum_polls
FOR INSERT
TO authenticated
WITH CHECK (
  (public.is_active_family_member(auth.uid()) OR public.is_forum_staff(auth.uid()))
  AND public.is_forum_post_author(post_id)
);

DROP POLICY IF EXISTS "Members can create poll options" ON public.forum_poll_options;
CREATE POLICY "Members can create poll options"
ON public.forum_poll_options
FOR INSERT
TO authenticated
WITH CHECK (
  (public.is_active_family_member(auth.uid()) OR public.is_forum_staff(auth.uid()))
  AND EXISTS (
    SELECT 1 FROM public.forum_polls fpl
    WHERE fpl.id = poll_id
      AND public.is_forum_post_author(fpl.post_id)
  )
);


-- ---------------------------------------------------------------------
-- 10. Profiles for the forum: usernames only.
--     get_public_profiles keeps its signature, but first_name / last_name
--     are returned to ADMINS only (null for members and moderators). No
--     admin screen uses this RPC (admins read profiles directly).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_public_profiles(_user_ids uuid[])
RETURNS TABLE(
  id uuid,
  username text,
  first_name text,
  last_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.username,
    CASE WHEN public.has_role(auth.uid(), 'admin'::public.app_role) THEN p.first_name END,
    CASE WHEN public.has_role(auth.uid(), 'admin'::public.app_role) THEN p.last_name END
  FROM public.profiles p
  WHERE auth.uid() IS NOT NULL
    AND (
      public.is_active_family_member(auth.uid())
      OR public.is_forum_staff(auth.uid())
    )
    AND p.id = ANY(_user_ids);
$$;
REVOKE ALL ON FUNCTION public.get_public_profiles(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) TO authenticated;

-- @mention autocomplete and the message / moderator "To" picker:
-- members (and staff) with a username containing the query. Never searches
-- or returns real names. Excludes the caller.
CREATE OR REPLACE FUNCTION public.search_forum_members(_query text)
RETURNS TABLE(id uuid, username text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH q AS (SELECT lower(left(btrim(coalesce(_query, '')), 50)) AS term)
  SELECT p.id, p.username
  FROM public.profiles p, q
  WHERE auth.uid() IS NOT NULL
    AND (
      public.is_active_family_member(auth.uid())
      OR public.is_forum_staff(auth.uid())
    )
    AND length(q.term) >= 1
    AND p.username IS NOT NULL
    AND btrim(p.username) <> ''
    AND p.id <> auth.uid()
    AND position(q.term IN lower(p.username)) > 0
    AND (
      public.is_active_family_member(p.id)
      OR public.is_forum_staff(p.id)
    )
  ORDER BY (left(lower(p.username), length(q.term)) = q.term) DESC, lower(p.username)
  LIMIT 8;
$$;
REVOKE ALL ON FUNCTION public.search_forum_members(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.search_forum_members(text) TO authenticated;

-- Resolve @usernames (exact, case-insensitive) to member ids for mention rows.
CREATE OR REPLACE FUNCTION public.find_forum_members_by_username(_usernames text[])
RETURNS TABLE(id uuid, username text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.username
  FROM public.profiles p
  WHERE auth.uid() IS NOT NULL
    AND (
      public.is_active_family_member(auth.uid())
      OR public.is_forum_staff(auth.uid())
    )
    AND coalesce(array_length(_usernames, 1), 0) BETWEEN 1 AND 20
    AND p.username IS NOT NULL
    AND lower(p.username) IN (SELECT lower(btrim(u)) FROM unnest(_usernames) AS u)
    AND (
      public.is_active_family_member(p.id)
      OR public.is_forum_staff(p.id)
    );
$$;
REVOKE ALL ON FUNCTION public.find_forum_members_by_username(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_forum_members_by_username(text[]) TO authenticated;
