# Lovable apply prompt: member area, My Workbook, forum, member emails, library rebuild

How to use: after this change is merged to `main` and Lovable has synced it,
paste everything in the "Prompt for Lovable" section below into Lovable as one
message. Then press **Publish** when Lovable says step 6 is done.

Timing: any time except a Tuesday between 3 and 7 PM Pacific (the weekly
member note goes out then, and it should not go out before you have
published).

Why the steps are split: Lovable's migration tool only accepts schema changes,
so the one data step (marking today's members as already welcomed) and the
scheduled jobs are separate steps, in this order on purpose.

What this change does:

1. **Member home.** Members land on a front door (`/member-home`) with their
   next step, the next meeting, and what they have saved.
2. **Learning paths.** The start quiz recommends one of eight paths; the choice
   is saved (`member_learning_paths`).
3. **My Workbook.** Eight five-minute guided exercises with saved results
   (`workbook_entries`), plus every plan, check-in and checklist she has filled in.
4. **Library rebuild.** The guides and tools kept in the library can be filled
   in, save automatically, and print cleanly. Answers use the existing
   `worksheet_responses` table: no database change for this part.
5. **Forum.** Three active spaces, anonymous posting that hides the author from
   other members in the database itself (`forum_posts_secure`), and membership
   checked with `is_active_family_member`.
6. **Member emails.** Reply, mention and followed-space emails (every 15
   minutes), a Tuesday member note, and a welcome email that fires when a
   membership actually becomes active. Members can switch each one off.
7. **Admin.** A Member Engagement tab (`member_visits`, two reporting
   functions) and a Forum Moderation tab.

Nothing here changes Monday night registration. Two Monday-adjacent functions
change in small ways: `send-member-zoom-reminder` (one link now opens the
question box in This Week's Meeting) and `zoom-webhook` (the after-meeting
thread is posted in This Week's Meeting, and only for The Family Squares).

---

## Prompt for Lovable

Please do these steps in order and tell me the result of each. Steps 1 and 4
are schema migrations. Step 2 is one data statement and step 5 is the
scheduled jobs: please run those two as separate SQL, not inside a migration.
If any step fails, stop and tell me the error; do not skip ahead.

### 0. Checks first (read-only)

```sql
-- 0a. Things this change relies on already exist (expect 5 rows, all true).
select 'is_active_family_member' as item, to_regprocedure('public.is_active_family_member(uuid)') is not null as ok
union all select 'has_role', exists (select 1 from pg_proc where proname = 'has_role' and pronamespace = 'public'::regnamespace)
union all select 'worksheet_responses', to_regclass('public.worksheet_responses') is not null
union all select 'user_notification_preferences', to_regclass('public.user_notification_preferences') is not null
union all select 'cron_secret set', exists (select 1 from public.site_settings where key = 'cron_secret' and coalesce(value, '') <> '');

-- 0b. worksheet_responses can hold one row per member per tool (expect a unique key on user_id, worksheet_key).
select conname, pg_get_constraintdef(oid) from pg_constraint
where conrelid = 'public.worksheet_responses'::regclass and contype in ('u', 'p');

-- 0c. Forum size today (counts only).
select count(*) as posts, count(*) filter (where is_anonymous) as anonymous_posts from public.forum_posts;
```

### 1. Schema migration A: new tables and settings

One migration. It only creates things; nothing existing changes behaviour.

```sql
-- member-core: the member's one learning path.
-- Idempotent: safe to run more than once.

CREATE TABLE IF NOT EXISTS public.member_learning_paths (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  track_id text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Track ids live in supabase/functions/_shared/memberTracks.json; keep this
-- loose (non-empty, short) so adding a track never needs a migration.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'member_learning_paths_track_id_check'
      AND conrelid = 'public.member_learning_paths'::regclass
  ) THEN
    ALTER TABLE public.member_learning_paths
      ADD CONSTRAINT member_learning_paths_track_id_check
      CHECK (char_length(track_id) BETWEEN 1 AND 100);
  END IF;
END $$;

ALTER TABLE public.member_learning_paths ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_learning_paths TO authenticated;

DROP POLICY IF EXISTS "Members read their own learning path" ON public.member_learning_paths;
CREATE POLICY "Members read their own learning path"
  ON public.member_learning_paths FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members create their own learning path" ON public.member_learning_paths;
CREATE POLICY "Members create their own learning path"
  ON public.member_learning_paths FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members update their own learning path" ON public.member_learning_paths;
CREATE POLICY "Members update their own learning path"
  ON public.member_learning_paths FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members delete their own learning path" ON public.member_learning_paths;
CREATE POLICY "Members delete their own learning path"
  ON public.member_learning_paths FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins read all learning paths" ON public.member_learning_paths;
CREATE POLICY "Admins read all learning paths"
  ON public.member_learning_paths FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS member_learning_paths_track_id_idx
  ON public.member_learning_paths (track_id);

-- =====================================================================
-- Workstream D: My Workbook (guided exercises). 2026-11-10.
-- Idempotent (safe to run twice). No dependencies on other parts except
-- public.has_role(uuid, public.app_role), which already exists.
-- =====================================================================

-- One row per finished guided exercise. Members can retake an exercise, so
-- there can be many rows per (user, exercise); the app compares the latest
-- with the one before it.
CREATE TABLE IF NOT EXISTS public.workbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  exercise_id text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

-- Light guards against junk rows (exercise ids are short slugs like
-- "boundary-script"; scores are 0..32 today; answers/output are small JSON).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workbook_entries_exercise_id_format') THEN
    ALTER TABLE public.workbook_entries
      ADD CONSTRAINT workbook_entries_exercise_id_format CHECK (exercise_id ~ '^[a-z0-9-]{1,64}$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workbook_entries_score_range') THEN
    ALTER TABLE public.workbook_entries
      ADD CONSTRAINT workbook_entries_score_range CHECK (score IS NULL OR (score >= 0 AND score <= 1000));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workbook_entries_size') THEN
    ALTER TABLE public.workbook_entries
      ADD CONSTRAINT workbook_entries_size CHECK (pg_column_size(answers) + pg_column_size(output) < 65536);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS workbook_entries_user_exercise_completed_idx
  ON public.workbook_entries (user_id, exercise_id, completed_at DESC);

ALTER TABLE public.workbook_entries ENABLE ROW LEVEL SECURITY;

-- Members: their own rows only (read, add, delete). No updates: a result is
-- kept as it was written; retaking creates a new row.
DROP POLICY IF EXISTS "Members read own workbook entries" ON public.workbook_entries;
CREATE POLICY "Members read own workbook entries"
  ON public.workbook_entries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members add own workbook entries" ON public.workbook_entries;
CREATE POLICY "Members add own workbook entries"
  ON public.workbook_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members delete own workbook entries" ON public.workbook_entries;
CREATE POLICY "Members delete own workbook entries"
  ON public.workbook_entries FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admins: read everything (engagement reporting).
-- No admin read policy: what a member writes in an exercise is private to
-- her. (The engagement report counts entries through its own functions.)
DROP POLICY IF EXISTS "Admins read all workbook entries" ON public.workbook_entries;

REVOKE ALL ON public.workbook_entries FROM anon;
GRANT SELECT, INSERT, DELETE ON public.workbook_entries TO authenticated;

-- ---------------------------------------------------------------------
-- Member engagement: one row per member per day they open a member page,
-- and two admin-only reports computed in the database (no row caps).
-- Weeks are Monday–Sunday in Pacific time.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.member_visits (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_date date NOT NULL DEFAULT ((now() AT TIME ZONE 'America/Los_Angeles')::date),
  first_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, visit_date)
);

ALTER TABLE public.member_visits ENABLE ROW LEVEL SECURITY;

-- Members can only record a visit for themselves, for today. Nobody but
-- admins (through the report functions) reads them.
DROP POLICY IF EXISTS "Members record own visit" ON public.member_visits;
CREATE POLICY "Members record own visit"
  ON public.member_visits
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND visit_date = (now() AT TIME ZONE 'America/Los_Angeles')::date
  );

DROP POLICY IF EXISTS "Admins read visits" ON public.member_visits;
CREATE POLICY "Admins read visits"
  ON public.member_visits
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

GRANT INSERT ON public.member_visits TO authenticated;
GRANT SELECT ON public.member_visits TO authenticated;

-- Weekly series. plpgsql so it is created even before the other new tables
-- in this migration exist; it only touches them when it runs.
CREATE OR REPLACE FUNCTION public.get_member_engagement(p_weeks integer DEFAULT 12)
RETURNS TABLE (
  week_start date,
  members_visited bigint,
  active_members bigint,
  new_members bigint,
  guides_started bigint,
  guides_completed bigint,
  exercises_started bigint,
  exercises_completed bigint,
  worksheets_edited bigint,
  forum_threads bigint,
  forum_replies bigint,
  paths_chosen bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n integer := greatest(1, least(coalesce(p_weeks, 12), 104));
  this_week date := date_trunc('week', now() AT TIME ZONE 'America/Los_Angeles')::date;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH weeks AS (
    SELECT (this_week - (7 * g))::date AS ws
    FROM generate_series(0, n - 1) AS g
  ),
  visits AS (
    SELECT date_trunc('week', v.visit_date)::date AS ws, v.user_id
    FROM public.member_visits v
    WHERE v.visit_date >= this_week - 7 * n
  ),
  progress AS (
    SELECT p.user_id, p.resource_type, p.resource_path,
           date_trunc('week', p.created_at AT TIME ZONE 'America/Los_Angeles')::date AS started_ws,
           CASE WHEN p.completed_at IS NOT NULL
                THEN date_trunc('week', p.completed_at AT TIME ZONE 'America/Los_Angeles')::date END AS completed_ws
    FROM public.education_progress p
    WHERE p.created_at >= (this_week - 7 * n)::timestamp AT TIME ZONE 'America/Los_Angeles'
       OR p.completed_at >= (this_week - 7 * n)::timestamp AT TIME ZONE 'America/Los_Angeles'
  ),
  workbook AS (
    SELECT w.user_id, date_trunc('week', w.completed_at AT TIME ZONE 'America/Los_Angeles')::date AS ws
    FROM public.workbook_entries w
    WHERE w.completed_at >= (this_week - 7 * n)::timestamp AT TIME ZONE 'America/Los_Angeles'
  ),
  worksheets AS (
    SELECT r.user_id, date_trunc('week', r.updated_at AT TIME ZONE 'America/Los_Angeles')::date AS ws
    FROM public.worksheet_responses r
    WHERE r.updated_at >= (this_week - 7 * n)::timestamp AT TIME ZONE 'America/Los_Angeles'
  ),
  posts AS (
    SELECT f.user_id, (f.parent_post_id IS NULL) AS is_thread,
           date_trunc('week', f.created_at AT TIME ZONE 'America/Los_Angeles')::date AS ws
    FROM public.forum_posts f
    WHERE f.created_at >= (this_week - 7 * n)::timestamp AT TIME ZONE 'America/Los_Angeles'
  ),
  paths AS (
    SELECT l.user_id, date_trunc('week', l.updated_at AT TIME ZONE 'America/Los_Angeles')::date AS ws
    FROM public.member_learning_paths l
    WHERE l.updated_at >= (this_week - 7 * n)::timestamp AT TIME ZONE 'America/Los_Angeles'
  ),
  first_membership AS (
    SELECT s.user_id,
           date_trunc('week', min(coalesce(s.start_date, s.created_at)) AT TIME ZONE 'America/Los_Angeles')::date AS ws
    FROM public.provider_subscriptions s
    WHERE s.provider_submission_id IS NULL
      AND s.status <> 'pending'
    GROUP BY s.user_id
  ),
  activity AS (
    SELECT ws, user_id FROM visits
    UNION SELECT started_ws, user_id FROM progress
    UNION SELECT completed_ws, user_id FROM progress WHERE completed_ws IS NOT NULL
    UNION SELECT ws, user_id FROM workbook
    UNION SELECT ws, user_id FROM worksheets
    UNION SELECT ws, user_id FROM posts
  )
  SELECT
    w.ws,
    (SELECT count(DISTINCT v.user_id) FROM visits v WHERE v.ws = w.ws),
    (SELECT count(DISTINCT a.user_id) FROM activity a WHERE a.ws = w.ws),
    (SELECT count(*) FROM first_membership m WHERE m.ws = w.ws),
    (SELECT count(*) FROM progress p WHERE p.started_ws = w.ws AND p.resource_type = 'guide'),
    (SELECT count(*) FROM progress p WHERE p.completed_ws = w.ws AND p.resource_type = 'guide'),
    (SELECT count(*) FROM progress p WHERE p.started_ws = w.ws AND p.resource_path LIKE '/workbook/%'),
    (SELECT count(*) FROM workbook b WHERE b.ws = w.ws),
    (SELECT count(*) FROM worksheets r WHERE r.ws = w.ws),
    (SELECT count(*) FROM posts f WHERE f.ws = w.ws AND f.is_thread),
    (SELECT count(*) FROM posts f WHERE f.ws = w.ws AND NOT f.is_thread),
    (SELECT count(*) FROM paths l WHERE l.ws = w.ws)
  FROM weeks w
  ORDER BY w.ws DESC;
END;
$$;

-- What is used: each guided exercise and the most-completed library pages
-- over the last p_days, plus a current snapshot.
CREATE OR REPLACE FUNCTION public.get_member_engagement_breakdown(p_days integer DEFAULT 30)
RETURNS TABLE (
  section text,
  label text,
  started bigint,
  completed bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  since timestamptz := now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 730)));
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;

  -- Snapshot: members now, and how many of them did each thing in the window.
  RETURN QUERY
  WITH members AS (
    SELECT DISTINCT s.user_id
    FROM public.provider_subscriptions s
    WHERE s.provider_submission_id IS NULL
      AND public.is_active_family_member(s.user_id)
  )
  SELECT 'snapshot'::text, x.label, x.n, NULL::bigint
  FROM (
    SELECT 'Active members' AS label, (SELECT count(*) FROM members) AS n
    UNION ALL SELECT 'Visited a member page',
      (SELECT count(DISTINCT v.user_id) FROM public.member_visits v JOIN members m USING (user_id)
        WHERE v.visit_date >= (since AT TIME ZONE 'America/Los_Angeles')::date)
    UNION ALL SELECT 'Have chosen a path',
      (SELECT count(*) FROM public.member_learning_paths l JOIN members m USING (user_id))
    UNION ALL SELECT 'Completed a guided exercise',
      (SELECT count(DISTINCT w.user_id) FROM public.workbook_entries w JOIN members m USING (user_id) WHERE w.completed_at >= since)
    UNION ALL SELECT 'Completed a guide',
      (SELECT count(DISTINCT p.user_id) FROM public.education_progress p JOIN members m USING (user_id)
        WHERE p.resource_type = 'guide' AND p.completed_at >= since)
    UNION ALL SELECT 'Posted in the forum',
      (SELECT count(DISTINCT f.user_id) FROM public.forum_posts f JOIN members m USING (user_id) WHERE f.created_at >= since)
  ) x;

  RETURN QUERY
  SELECT 'exercise'::text,
         substring(p.resource_path FROM '^/workbook/(.*)$'),
         count(*) FILTER (WHERE p.created_at >= since),
         (SELECT count(*) FROM public.workbook_entries w
           WHERE w.exercise_id = substring(p.resource_path FROM '^/workbook/(.*)$') AND w.completed_at >= since)
  FROM public.education_progress p
  WHERE p.resource_path LIKE '/workbook/%'
  GROUP BY p.resource_path;

  RETURN QUERY
  SELECT 'library'::text,
         max(p.resource_name),
         count(*) FILTER (WHERE p.created_at >= since),
         count(*) FILTER (WHERE p.completed_at >= since)
  FROM public.education_progress p
  WHERE p.resource_path NOT LIKE '/workbook/%'
    AND (p.created_at >= since OR p.completed_at >= since)
  GROUP BY p.resource_path
  ORDER BY 4 DESC, 3 DESC
  LIMIT 25;
END;
$$;

REVOKE ALL ON FUNCTION public.get_member_engagement(integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_member_engagement_breakdown(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_member_engagement(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_member_engagement_breakdown(integer) TO authenticated;

-- =====================================================================
-- Workstream B: member notifications & email. 2026-11-10.
-- Idempotent (safe to run twice). Run as ONE migration, BEFORE deploying
-- send-forum-notifications / send-member-weekly-note / send-welcome-email.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Email preferences: three new switches (a missing row = all on).
-- ---------------------------------------------------------------------
ALTER TABLE public.user_notification_preferences
  ADD COLUMN IF NOT EXISTS reply_notifications boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS followed_topic_notifications boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS weekly_member_note boolean NOT NULL DEFAULT true;

-- Members read, create and update only their own row (same policies as the
-- 2026-01-20 migration, re-asserted so the settings card works even if they
-- were changed since; WITH CHECK added so a row can't be moved to another user).
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_notification_preferences;
CREATE POLICY "Users can view their own preferences"
  ON public.user_notification_preferences FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own preferences" ON public.user_notification_preferences;
CREATE POLICY "Users can create their own preferences"
  ON public.user_notification_preferences FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_notification_preferences;
CREATE POLICY "Users can update their own preferences"
  ON public.user_notification_preferences FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.user_notification_preferences TO authenticated;

-- ---------------------------------------------------------------------
-- 2. Ledgers (service role only: RLS on, no client policies).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('reply', 'mention', 'followed', 'host_alert')),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  recipient_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT forum_notification_log_unique UNIQUE (kind, post_id, recipient_user_id)
);
CREATE INDEX IF NOT EXISTS forum_notification_log_post_idx ON public.forum_notification_log (post_id);
ALTER TABLE public.forum_notification_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.forum_notification_log FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.member_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  period_key text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT member_email_log_unique UNIQUE (kind, period_key, user_id)
);
CREATE INDEX IF NOT EXISTS member_email_log_kind_period_idx ON public.member_email_log (kind, period_key);
ALTER TABLE public.member_email_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.member_email_log FROM anon, authenticated;
```

### 2. Data step (run as SQL, not a migration): mark today's members as already welcomed

This must run before step 4, so the corrected welcome email only goes to
people who join from now on. It inserts ledger rows and sends nothing.

```sql
-- ---------------------------------------------------------------------
-- 3. Welcome email: existing members are marked as already welcomed, so
--    the new UPDATE trigger only welcomes people who join from now on.
--    "Existing" = anyone with a website family membership row that is not
--    just 'pending' (a pending PayPal checkout that activates later still
--    gets its welcome). Only inserts ledger rows; sends nothing.
-- ---------------------------------------------------------------------
INSERT INTO public.member_email_log (kind, period_key, user_id)
SELECT DISTINCT 'welcome', 'once', ps.user_id
FROM public.provider_subscriptions ps
JOIN auth.users au ON au.id = ps.user_id
WHERE ps.provider_submission_id IS NULL
  AND ps.status IS DISTINCT FROM 'pending'
ON CONFLICT (kind, period_key, user_id) DO NOTHING;
```

Please tell me how many rows it inserted.

### 3. Deploy these edge functions from the synced code

Before step 4, because step 4's welcome trigger calls `send-welcome-email`
and needs the new version to be there.

- `send-welcome-email` (changed; `verify_jwt = false` in `supabase/config.toml`)
- `send-forum-notifications` (new)
- `send-member-weekly-note` (new)
- `send-member-zoom-reminder` (one link changed)
- `zoom-webhook` (after-meeting thread only)

Please do not change or redeploy any other function, and do not touch the
Monday registration functions.

### 4. Schema migration B: welcome trigger and forum

One migration.

```sql
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
```

### 5. Scheduled jobs (run as SQL, not a migration)

The first statement records when forum emails start, so nothing posted before
now is ever emailed. The cron secret is read from `site_settings` each time a
job runs; it is not pasted into the job.

```sql
-- ---------------------------------------------------------------------
-- 4. Scheduled jobs. cron.schedule with an existing name replaces that job,
--    so re-running does not duplicate. The cron secret is read from
--    site_settings when each job runs (never pasted into the job).
-- ---------------------------------------------------------------------

-- Forum emails start from now: nothing posted before this moment is ever
-- emailed (the function does nothing until this is set). Kept if already set.
INSERT INTO public.site_settings (key, value)
VALUES ('forum_notifications_start_at', to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
ON CONFLICT (key) DO NOTHING;

-- Forum notifications: every 15 minutes.
SELECT cron.schedule(
  'send-forum-notifications-15min',
  '*/15 * * * *',
  $cmd$
  select net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-forum-notifications',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
      'source', 'cron'),
    timeout_milliseconds := 150000
  ) as request_id;
  $cmd$
);

-- Weekly member note: Tuesday from 4 PM Pacific. The function only sends on
-- Tuesday between 4 and 7 PM Pacific; these UTC hours cover that window in
-- both seasons (PDT: 23:xx Tue to 01:xx Wed; PST: 00:xx to 02:xx Wed), and
-- the runs outside it are no-ops. Every 10 minutes so a long member list, or
-- a bad half hour at the email provider, is caught up the same evening (the
-- ledger stops repeats).
SELECT cron.schedule(
  'send-member-weekly-note-a',
  '*/10 23 * * 2',
  $cmd$
  select net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-member-weekly-note',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
      'source', 'cron'),
    timeout_milliseconds := 150000
  ) as request_id;
  $cmd$
);

SELECT cron.schedule(
  'send-member-weekly-note-b',
  '*/10 0-2 * * 3',
  $cmd$
  select net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-member-weekly-note',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
      'source', 'cron'),
    timeout_milliseconds := 150000
  ) as request_id;
  $cmd$
);
```

### 6. Regenerate `src/integrations/supabase/types.ts`

So the new tables, view and functions appear in it. Then tell me, and I will
press Publish. The forum needs the new site and step 4 together, so please
don't leave a gap between them.

### 7. Checks after (read-only): please paste the results

```sql
-- 7a. New tables exist with row level security on (expect 6 rows, rls = true).
select c.relname, c.relrowsecurity as rls
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('member_learning_paths', 'workbook_entries', 'member_visits',
  'forum_notification_log', 'member_email_log', 'user_notification_preferences')
order by 1;

-- 7b. The forum view exists; forum_posts is out of realtime (expect 1 row, then 0 rows).
select c.relname, c.reloptions, pg_get_userbyid(c.relowner) as owner from pg_class c where c.relname = 'forum_posts_secure';
select * from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'forum_posts';

-- 7c. Members can read every forum_posts column except user_id (user_id must not be in this list).
select column_name from information_schema.column_privileges
where table_schema = 'public' and table_name = 'forum_posts' and grantee = 'authenticated' and privilege_type = 'SELECT'
order by 1;

-- 7c2. Members can no longer read other members' profile rows (expect 0 rows).
select policyname from pg_policies
where schemaname = 'public' and tablename = 'profiles' and policyname = 'Active members can view profiles';

-- 7c3. Workbook answers are private: no admin read policy (expect 0 rows).
select policyname from pg_policies
where schemaname = 'public' and tablename = 'workbook_entries' and policyname ilike 'Admins%';

-- 7d. Welcome trigger fires on insert or update; today's members are marked welcomed.
select tgname, pg_get_triggerdef(oid) from pg_trigger where tgname = 'on_new_family_membership';
select count(*) as already_welcomed from public.member_email_log where kind = 'welcome';

-- 7e. Forum emails have a start time; the three new jobs are active and send the cron secret (expect 1 row, then 3 rows, both true).
select key, value from public.site_settings where key = 'forum_notifications_start_at';
select jobname, schedule, active, command ~* 'cron_secret' as sends_cron_secret
from cron.job
where jobname in ('send-forum-notifications-15min', 'send-member-weekly-note-a', 'send-member-weekly-note-b')
order by 1;

-- 7f. About 15 minutes after step 5: the forum job answers 200, not 401 or 404.
select r.status_code, left(r.content, 200) as content, r.created
from net._http_response r order by r.id desc limit 5;
```

---

## After Publish: a five-minute check as a member

1. `/member-home` opens with a next step and the next meeting.
2. `/workbook`: do one exercise to the end; it appears under saved results.
3. Open the Family Recovery Action Plan, type in two boxes, wait for "Saved",
   reload: the answers are still there. Print preview shows the answers.
4. Open any guide (for example Crisis vs. Chaos), answer a reflection question
   at the bottom, reload: still there.
5. `/family-forum`: post in Ask the Community, reply, post once anonymously and
   check from a second member account that it shows "Anonymous member".
   (Only admins can see who wrote an anonymous post; moderators cannot.)
6. Account settings: the email switches save.

## Undo

- Emails: `select cron.unschedule('send-forum-notifications-15min');` and the
  same for `send-member-weekly-note-a` and `-b`.
- The rest is additive. The forum change (step 4) and the new site depend on
  each other, so roll those back together (revert the merge, then Publish).
