-- member-core: the member's one learning path.
-- Idempotent: safe to run more than once.

CREATE TABLE IF NOT EXISTS public.member_learning_paths (
  -- No foreign key to auth.users (not allowed here); her rows are removed with
  -- her profile by cleanup_member_area_rows() in account-cleanup.sql.
  user_id uuid PRIMARY KEY,
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

REVOKE ALL ON public.member_learning_paths FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_learning_paths TO authenticated;
GRANT ALL ON public.member_learning_paths TO service_role;

ALTER TABLE public.member_learning_paths ENABLE ROW LEVEL SECURITY;

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
  -- No foreign key to auth.users (not allowed here); see account-cleanup.sql.
  user_id uuid NOT NULL,
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

REVOKE ALL ON public.workbook_entries FROM anon;
GRANT SELECT, INSERT, DELETE ON public.workbook_entries TO authenticated;
GRANT ALL ON public.workbook_entries TO service_role;

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

-- ---------------------------------------------------------------------
-- Member engagement: one row per member per day they open a member page,
-- and two admin-only reports computed in the database (no row caps).
-- Weeks are Monday–Sunday in Pacific time.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.member_visits (
  -- No foreign key to auth.users (not allowed here); see account-cleanup.sql.
  user_id uuid NOT NULL,
  visit_date date NOT NULL DEFAULT ((now() AT TIME ZONE 'America/Los_Angeles')::date),
  first_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, visit_date)
);

REVOKE ALL ON public.member_visits FROM anon;
GRANT SELECT, INSERT ON public.member_visits TO authenticated;
GRANT ALL ON public.member_visits TO service_role;

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
GRANT ALL ON public.user_notification_preferences TO service_role;

-- ---------------------------------------------------------------------
-- 2. Ledgers (service role only: RLS on, no client policies).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('reply', 'mention', 'followed', 'host_alert')),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  -- No foreign key to auth.users (not allowed here); see account-cleanup.sql.
  recipient_user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT forum_notification_log_unique UNIQUE (kind, post_id, recipient_user_id)
);
CREATE INDEX IF NOT EXISTS forum_notification_log_post_idx ON public.forum_notification_log (post_id);
REVOKE ALL ON public.forum_notification_log FROM anon, authenticated;
GRANT ALL ON public.forum_notification_log TO service_role;
ALTER TABLE public.forum_notification_log ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.member_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  period_key text NOT NULL,
  -- No foreign key to auth.users (not allowed here); see account-cleanup.sql.
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT member_email_log_unique UNIQUE (kind, period_key, user_id)
);
CREATE INDEX IF NOT EXISTS member_email_log_kind_period_idx ON public.member_email_log (kind, period_key);
REVOKE ALL ON public.member_email_log FROM anon, authenticated;
GRANT ALL ON public.member_email_log TO service_role;
ALTER TABLE public.member_email_log ENABLE ROW LEVEL SECURITY;

-- account-cleanup: when an account is deleted, her member-area rows go too.
--
-- The new member-area tables do not reference auth.users (foreign keys to the
-- auth schema are not allowed here). public.profiles already does (ON DELETE
-- CASCADE), so deleting an account deletes its profile row, and this trigger
-- then removes what she wrote and what was recorded about her in the new
-- tables. Idempotent. It can never block a deletion: any error becomes a
-- WARNING.

CREATE OR REPLACE FUNCTION public.cleanup_member_area_rows()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    DELETE FROM public.workbook_entries WHERE user_id = OLD.id;
    DELETE FROM public.member_learning_paths WHERE user_id = OLD.id;
    DELETE FROM public.member_visits WHERE user_id = OLD.id;
    DELETE FROM public.member_email_log WHERE user_id = OLD.id;
    DELETE FROM public.forum_notification_log WHERE recipient_user_id = OLD.id;
  EXCEPTION WHEN others THEN
    RAISE WARNING 'cleanup_member_area_rows skipped for %: %', OLD.id, SQLERRM;
  END;
  RETURN OLD;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_member_area_rows() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS cleanup_member_area_rows_trg ON public.profiles;
CREATE TRIGGER cleanup_member_area_rows_trg
AFTER DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.cleanup_member_area_rows();