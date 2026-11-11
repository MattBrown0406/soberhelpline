-- Fires when a website family membership is inserted active OR becomes
-- active later (PayPal rows are inserted 'pending' and activated by UPDATE).
-- Skips memberships that came from the mobile app (plan_type 'app'). At most
-- once per user ever: claims member_email_log ('welcome', 'once') and only
-- posts if that claim is new. Never blocks the membership write: any error
-- is turned into a WARNING (and the claim is rolled back with it).
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _email text;
  _first_name text;
  _cron_secret text;
  _claimed uuid;
BEGIN
  IF NEW.status IS DISTINCT FROM 'active'
     OR NEW.provider_submission_id IS NOT NULL
     OR NEW.plan_type IS NOT DISTINCT FROM 'app'
     OR NEW.plan_type IS NOT DISTINCT FROM 'free' THEN
    -- 'app': joined in the mobile app. 'free': granted by an admin, whose
    -- screen already sends its own welcome (send-free-membership-email).
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status IS NOT DISTINCT FROM 'active' THEN
    RETURN NEW;  -- already active before this update
  END IF;

  BEGIN
    SELECT au.email INTO _email FROM auth.users au WHERE au.id = NEW.user_id;
    SELECT value INTO _cron_secret FROM public.site_settings WHERE key = 'cron_secret';
    IF _email IS NULL OR _email = '' OR _cron_secret IS NULL OR _cron_secret = '' THEN
      RETURN NEW;  -- nothing claimed, so a later activation can still welcome them
    END IF;

    INSERT INTO public.member_email_log (kind, period_key, user_id)
    VALUES ('welcome', 'once', NEW.user_id)
    ON CONFLICT (kind, period_key, user_id) DO NOTHING
    RETURNING id INTO _claimed;
    IF _claimed IS NULL THEN
      RETURN NEW;  -- already welcomed
    END IF;

    SELECT p.first_name INTO _first_name FROM public.profiles p WHERE p.id = NEW.user_id;

    PERFORM net.http_post(
      url     := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-welcome-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := jsonb_build_object(
        'cron_secret', _cron_secret,
        'email',       _email,
        'firstName',   COALESCE(_first_name, '')
      )
    );
  EXCEPTION WHEN others THEN
    RAISE WARNING 'trigger_welcome_email skipped for %: %', NEW.user_id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.trigger_welcome_email() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS on_new_family_membership ON public.provider_subscriptions;
CREATE TRIGGER on_new_family_membership
  AFTER INSERT OR UPDATE ON public.provider_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();

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
-- (an @mention row would tell the mentioned member which post mentioned her).
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

-- Editing or deleting your own post also needs a current membership (a lapsed
-- member could otherwise still delete a thread, and other members' replies
-- with it). Staff can delete any post, as before.
DROP POLICY IF EXISTS "Users can update their own posts" ON public.forum_posts;
CREATE POLICY "Users can update their own posts"
ON public.forum_posts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND (public.is_active_family_member(auth.uid()) OR public.is_forum_staff(auth.uid()))
)
WITH CHECK (
  auth.uid() = user_id
  AND (public.is_active_family_member(auth.uid()) OR public.is_forum_staff(auth.uid()))
);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.forum_posts;
CREATE POLICY "Users can delete own posts"
ON public.forum_posts
FOR DELETE
TO authenticated
USING (
  public.is_forum_staff(auth.uid())
  OR (auth.uid() = user_id AND public.is_active_family_member(auth.uid()))
);
-- Kept as it is: "Admins can view all posts".


-- ---------------------------------------------------------------------
-- 3. Write guard on forum_posts (style of prevent_provider_subscription_tampering).
--    Everyone writing through the API (members and staff):
--      * created_at is the server's time and never changes;
--      * a post has a length limit;
--      * a reply always takes its parent's topic, and a reply to a reply
--        joins the same conversation (threads are one level deep).
--    Non-staff:
--      * cannot pin, or change topic_id / parent_post_id on update;
--      * cannot start a new conversation in an archived space.
--    Only an admin can change who a post belongs to, or switch someone
--    else's post between anonymous and named.
--    Service role and direct database sessions bypass.
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
  _parent_parent uuid;
  _is_staff boolean;
  _is_admin boolean;
BEGIN
  IF current_user NOT IN ('authenticated', 'anon')
     OR coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '') = 'service_role' THEN
    RETURN NEW;
  END IF;

  _is_staff := coalesce(public.is_forum_staff(auth.uid()), false);
  _is_admin := coalesce(public.has_role(auth.uid(), 'admin'::public.app_role), false);

  IF (TG_OP = 'INSERT' OR NEW.content IS DISTINCT FROM OLD.content OR NEW.title IS DISTINCT FROM OLD.title)
     AND (char_length(coalesce(NEW.content, '')) > 20000 OR char_length(coalesce(NEW.title, '')) > 300) THEN
    RAISE EXCEPTION 'That post is too long. Please shorten it and try again.'
      USING ERRCODE = '22001';
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.created_at := now();
    IF NOT _is_staff THEN
      NEW.is_pinned := false;
    END IF;
    IF NEW.parent_post_id IS NULL THEN
      IF NOT _is_staff
         AND NEW.topic_id NOT IN ('this-weeks-meeting', 'ask-community', 'introductions') THEN
        RAISE EXCEPTION 'New conversations can only be started in an active forum space'
          USING ERRCODE = '42501';
      END IF;
    ELSE
      SELECT p.topic_id, p.parent_post_id INTO _parent_topic, _parent_parent
      FROM public.forum_posts p
      WHERE p.id = NEW.parent_post_id;
      IF _parent_topic IS NULL THEN
        RAISE EXCEPTION 'The conversation you are replying to no longer exists'
          USING ERRCODE = '23503';
      END IF;
      IF _parent_parent IS NOT NULL THEN
        NEW.parent_post_id := _parent_parent;
      END IF;
      NEW.topic_id := _parent_topic;
    END IF;
    RETURN NEW;
  END IF;

  -- UPDATE
  NEW.created_at := OLD.created_at;
  IF NOT _is_admin
     AND (NEW.user_id IS DISTINCT FROM OLD.user_id
          OR (OLD.user_id IS DISTINCT FROM auth.uid()
              AND NEW.is_anonymous IS DISTINCT FROM OLD.is_anonymous)) THEN
    RAISE EXCEPTION 'Only an admin can change who a post belongs to or whether it is anonymous'
      USING ERRCODE = '42501';
  END IF;
  IF NOT _is_staff
     AND (NEW.is_pinned IS DISTINCT FROM OLD.is_pinned
          OR NEW.topic_id IS DISTINCT FROM OLD.topic_id
          OR NEW.parent_post_id IS DISTINCT FROM OLD.parent_post_id) THEN
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

-- When a post is switched to anonymous, its @mentions go: a mention row
-- tells the mentioned member which post mentioned her, and so who wrote it.
CREATE OR REPLACE FUNCTION public.forum_post_went_anonymous()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_anonymous AND NOT coalesce(OLD.is_anonymous, false) THEN
    DELETE FROM public.forum_mentions WHERE post_id = NEW.id;
  END IF;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.forum_post_went_anonymous() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS forum_post_went_anonymous_trg ON public.forum_posts;
CREATE TRIGGER forum_post_went_anonymous_trg
AFTER UPDATE OF is_anonymous ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.forum_post_went_anonymous();


-- ---------------------------------------------------------------------
-- 4. forum_posts_secure: the ONLY way members read posts.
--    Runs with the view owner's rights (security_invoker = false), so it
--    enforces access itself: members (is_active_family_member) and staff.
--    Masks user_id on anonymous posts unless the viewer is the author or
--    an admin (moderators moderate without seeing who wrote an anonymous
--    post). Adds is_mine and author_is_staff (false for anonymous posts).
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
    WHEN (SELECT public.has_role(auth.uid(), 'admin'::public.app_role)) THEN fp.user_id
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
  'Members read forum posts ONLY through this view. Owner-rights view (security_invoker=false) that limits rows to active family members and staff, masks user_id on anonymous posts (except for the author and admins), and adds is_mine / author_is_staff. authenticated has no SELECT on forum_posts.user_id.';


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
-- Members never read another member's profile row (it holds first and last
-- name): the forum gets usernames through the functions below. Own-profile,
-- admin and moderator policies stay.
DROP POLICY IF EXISTS "Active members can view profiles" ON public.profiles;

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