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
