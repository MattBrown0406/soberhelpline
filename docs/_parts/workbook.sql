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
