-- A. family_squares_weekly_checkins
CREATE TABLE IF NOT EXISTS public.family_squares_weekly_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.zoom_meeting_registrations(id) ON DELETE CASCADE,
  changed_this_week text NULL,
  decision_facing text NULL,
  biggest_disagreement text NULL,
  immediate_safety_concern boolean NOT NULL DEFAULT false,
  desired_help text NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_by_user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'family_squares_pre_meeting',
  CONSTRAINT family_squares_weekly_checkins_registration_key UNIQUE (registration_id),
  CONSTRAINT fs_checkins_changed_this_week_valid CHECK (changed_this_week IS NULL OR (length(changed_this_week) <= 2000 AND btrim(changed_this_week) <> '')),
  CONSTRAINT fs_checkins_decision_facing_valid CHECK (decision_facing IS NULL OR (length(decision_facing) <= 2000 AND btrim(decision_facing) <> '')),
  CONSTRAINT fs_checkins_biggest_disagreement_valid CHECK (biggest_disagreement IS NULL OR (length(biggest_disagreement) <= 2000 AND btrim(biggest_disagreement) <> '')),
  CONSTRAINT fs_checkins_desired_help_valid CHECK (desired_help IS NULL OR (length(desired_help) <= 2000 AND btrim(desired_help) <> '')),
  CONSTRAINT fs_checkins_source_valid CHECK (length(source) <= 100 AND btrim(source) <> '')
);

-- B. family_squares_next_step_reviews
CREATE TABLE IF NOT EXISTS public.family_squares_next_step_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.zoom_meeting_registrations(id) ON DELETE CASCADE,
  recommendation_version text NOT NULL,
  readiness_score integer NOT NULL CHECK (readiness_score BETWEEN 0 AND 100),
  readiness_tier text NOT NULL CHECK (readiness_tier IN ('matt_now','review_today','nurture_review','watch')),
  recommended_path text NOT NULL CHECK (recommended_path IN ('intervention_readiness','private_strategy_session','continued_support','personal_check_in')),
  recommended_action text NOT NULL,
  reason_summary text[] NOT NULL DEFAULT '{}',
  generated_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz NULL,
  reviewed_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','dismissed','completed')),
  outreach_authorized boolean NOT NULL DEFAULT false,
  outreach_authorized_at timestamptz NULL,
  outreach_authorized_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT fs_reviews_registration_version_key UNIQUE (registration_id, recommendation_version),
  CONSTRAINT fs_reviews_version_valid CHECK (length(recommendation_version) <= 100 AND btrim(recommendation_version) <> ''),
  CONSTRAINT fs_reviews_action_valid CHECK (length(recommended_action) <= 2000 AND btrim(recommended_action) <> ''),
  CONSTRAINT fs_reviews_outreach_authorization_complete CHECK (
    outreach_authorized = false
    OR (outreach_authorized_at IS NOT NULL AND outreach_authorized_by IS NOT NULL)
  )
);

-- C. readiness_radar_export_audit
CREATE TABLE IF NOT EXISTS public.readiness_radar_export_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_at timestamptz NOT NULL DEFAULT now(),
  request_id uuid NOT NULL UNIQUE,
  lookback_days integer NOT NULL CHECK (lookback_days BETWEEN 1 AND 180),
  registration_count integer NOT NULL DEFAULT 0 CHECK (registration_count >= 0),
  attendance_count integer NOT NULL DEFAULT 0 CHECK (attendance_count >= 0),
  checkin_count integer NOT NULL DEFAULT 0 CHECK (checkin_count >= 0),
  response_status text NOT NULL CHECK (response_status IN ('success','rejected','error')),
  caller_fingerprint text NULL CHECK (caller_fingerprint IS NULL OR length(caller_fingerprint) <= 128),
  error_code text NULL CHECK (error_code IS NULL OR length(error_code) <= 100)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fs_weekly_checkins_registration_id ON public.family_squares_weekly_checkins (registration_id);
CREATE INDEX IF NOT EXISTS idx_fs_next_step_reviews_status_generated ON public.family_squares_next_step_reviews (review_status, generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_fs_next_step_reviews_tier_score ON public.family_squares_next_step_reviews (readiness_tier, readiness_score DESC);
CREATE INDEX IF NOT EXISTS idx_readiness_radar_export_audit_requested_at ON public.readiness_radar_export_audit (requested_at DESC);

-- Privileges: deny everyone by default
REVOKE ALL ON public.family_squares_weekly_checkins FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.family_squares_next_step_reviews FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.readiness_radar_export_audit FROM PUBLIC, anon, authenticated;

-- Admin (authenticated + has_role admin, enforced by RLS) access
GRANT SELECT, INSERT, UPDATE ON public.family_squares_weekly_checkins TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.family_squares_next_step_reviews TO authenticated;
GRANT SELECT ON public.readiness_radar_export_audit TO authenticated;

-- Edge Function (service_role) minimum privileges
GRANT SELECT ON public.family_squares_weekly_checkins TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.family_squares_next_step_reviews TO service_role;
GRANT SELECT, INSERT ON public.readiness_radar_export_audit TO service_role;

-- RLS
ALTER TABLE public.family_squares_weekly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_squares_weekly_checkins FORCE ROW LEVEL SECURITY;
ALTER TABLE public.family_squares_next_step_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_squares_next_step_reviews FORCE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_radar_export_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_radar_export_audit FORCE ROW LEVEL SECURITY;

-- Policies: admins only (no broad authenticated access)
DROP POLICY IF EXISTS "Admins can view weekly checkins" ON public.family_squares_weekly_checkins;
CREATE POLICY "Admins can view weekly checkins"
  ON public.family_squares_weekly_checkins FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert weekly checkins" ON public.family_squares_weekly_checkins;
CREATE POLICY "Admins can insert weekly checkins"
  ON public.family_squares_weekly_checkins FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update weekly checkins" ON public.family_squares_weekly_checkins;
CREATE POLICY "Admins can update weekly checkins"
  ON public.family_squares_weekly_checkins FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view next step reviews" ON public.family_squares_next_step_reviews;
CREATE POLICY "Admins can view next step reviews"
  ON public.family_squares_next_step_reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert next step reviews" ON public.family_squares_next_step_reviews;
CREATE POLICY "Admins can insert next step reviews"
  ON public.family_squares_next_step_reviews FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update next step reviews" ON public.family_squares_next_step_reviews;
CREATE POLICY "Admins can update next step reviews"
  ON public.family_squares_next_step_reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view export audit" ON public.readiness_radar_export_audit;
CREATE POLICY "Admins can view export audit"
  ON public.readiness_radar_export_audit FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));