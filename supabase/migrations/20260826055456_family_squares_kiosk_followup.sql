-- Track shared-kiosk registrations separately from ordinary website registrations.
ALTER TABLE public.zoom_meeting_registrations
  ADD COLUMN IF NOT EXISTS registration_source text NOT NULL DEFAULT 'website',
  ADD CONSTRAINT zoom_meeting_registrations_source_check
    CHECK (registration_source IN ('website', 'kiosk', 'automatic'));

CREATE INDEX IF NOT EXISTS idx_zoom_registrations_source_meeting
  ON public.zoom_meeting_registrations (registration_source, meeting_date);

-- One deduplicated Tuesday invitation per kiosk email and meeting date.
CREATE TABLE IF NOT EXISTS public.family_squares_kiosk_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.zoom_meeting_registrations(id) ON DELETE CASCADE,
  meeting_date date NOT NULL,
  email text NOT NULL,
  email_normalized text NOT NULL,
  name text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sending', 'sent', 'suppressed', 'failed')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  claimed_at timestamptz,
  next_attempt_at timestamptz,
  sent_at timestamptz,
  suppressed_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meeting_date, email_normalized)
);

CREATE INDEX IF NOT EXISTS idx_family_squares_kiosk_followups_due
  ON public.family_squares_kiosk_followups (scheduled_for, next_attempt_at)
  WHERE status IN ('pending', 'failed');

ALTER TABLE public.family_squares_kiosk_followups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.family_squares_kiosk_followups FROM anon, authenticated;
GRANT ALL ON public.family_squares_kiosk_followups TO service_role;

-- Queue at 10:00 AM Pacific on the Tuesday after the registered Monday.
CREATE OR REPLACE FUNCTION public.queue_family_squares_kiosk_followup(_registration_id uuid)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  INSERT INTO public.family_squares_kiosk_followups (
    registration_id,
    meeting_date,
    email,
    email_normalized,
    name,
    scheduled_for
  )
  SELECT
    r.id,
    r.meeting_date,
    r.email,
    lower(trim(r.email)),
    r.name,
    ((r.meeting_date + 1)::date + time '10:00') AT TIME ZONE 'America/Los_Angeles'
  FROM public.zoom_meeting_registrations r
  WHERE r.id = _registration_id
    AND r.registration_source = 'kiosk'
    AND trim(r.email) <> ''
  ON CONFLICT (meeting_date, email_normalized)
  DO UPDATE SET
    registration_id = EXCLUDED.registration_id,
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    scheduled_for = EXCLUDED.scheduled_for,
    updated_at = now()
  WHERE public.family_squares_kiosk_followups.status IN ('pending', 'failed');
$$;

REVOKE ALL ON FUNCTION public.queue_family_squares_kiosk_followup(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.queue_family_squares_kiosk_followup(uuid) TO service_role;

-- Atomically claim a bounded batch so overlapping cron calls cannot send the same row.
CREATE OR REPLACE FUNCTION public.claim_family_squares_kiosk_followups(_limit integer DEFAULT 50)
RETURNS TABLE (
  queue_id uuid,
  registration_id uuid,
  meeting_date date,
  email text,
  name text,
  attempts integer
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  WITH due AS (
    SELECT q.id
    FROM public.family_squares_kiosk_followups q
    WHERE q.scheduled_for <= now()
      AND q.status IN ('pending', 'failed')
      AND q.attempts < 5
      AND (q.next_attempt_at IS NULL OR q.next_attempt_at <= now())
    ORDER BY q.scheduled_for, q.created_at
    FOR UPDATE SKIP LOCKED
    LIMIT greatest(1, least(coalesce(_limit, 50), 100))
  ), claimed AS (
    UPDATE public.family_squares_kiosk_followups q
    SET
      status = 'sending',
      claimed_at = now(),
      attempts = q.attempts + 1,
      last_error = NULL,
      updated_at = now()
    FROM due
    WHERE q.id = due.id
    RETURNING q.id, q.registration_id, q.meeting_date, q.email, q.name, q.attempts
  )
  SELECT
    claimed.id,
    claimed.registration_id,
    claimed.meeting_date,
    claimed.email,
    claimed.name,
    claimed.attempts
  FROM claimed;
$$;

REVOKE ALL ON FUNCTION public.claim_family_squares_kiosk_followups(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_family_squares_kiosk_followups(integer) TO service_role;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-family-squares-kiosk-followups') THEN
    PERFORM cron.unschedule('send-family-squares-kiosk-followups');
  END IF;
END $$;

-- Frequent polling keeps delivery DST-safe; rows themselves carry the exact
-- Tuesday 10:00 AM America/Los_Angeles timestamp and are claimed once.
SELECT cron.schedule(
  'send-family-squares-kiosk-followups',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-family-squares-kiosk-followups',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
        LIMIT 1
      )
    ),
    body := jsonb_build_object('source', 'pg_cron')
  );
  $$
);
