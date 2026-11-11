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
