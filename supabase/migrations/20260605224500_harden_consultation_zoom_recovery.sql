-- Harden consultation booking Zoom/email recovery.
-- Adds explicit state so the system can distinguish "client really has a Zoom link"
-- from "booking exists but Zoom/email still needs retry."

ALTER TABLE public.consultation_bookings
  ADD COLUMN IF NOT EXISTS zoom_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (zoom_status IN ('pending', 'created', 'failed')),
  ADD COLUMN IF NOT EXISTS zoom_error_message TEXT,
  ADD COLUMN IF NOT EXISTS zoom_retry_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS zoom_last_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notification_error_message TEXT,
  ADD COLUMN IF NOT EXISTS last_notification_attempt_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_consultation_bookings_zoom_recovery
  ON public.consultation_bookings (booking_date, start_time)
  WHERE status = 'confirmed'
    AND (
      zoom_meeting_url IS NULL
      OR zoom_status = 'failed'
      OR client_notified = false
      OR provider_notified = false
    );

-- Backfill status for existing rows without changing existing notification flags.
UPDATE public.consultation_bookings
SET zoom_status = CASE
    WHEN zoom_meeting_url IS NOT NULL AND zoom_meeting_url <> '' THEN 'created'
    WHEN zoom_error_message IS NOT NULL THEN 'failed'
    ELSE 'pending'
  END
WHERE zoom_status IS NULL OR zoom_status = 'pending';

-- Run every 15 minutes so temporary Zoom/SendGrid failures recover without Matt having
-- to notice and manually send links. The function is idempotent: it reuses existing Zoom
-- links and only resends missing client/provider emails.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('recover-consultation-zoom-links-every-15-minutes');
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'recover-consultation-zoom-links-every-15-minutes',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/recover-consultation-zoom-links',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := '{"source":"pg_cron"}'::jsonb
  ) AS request_id;
  $$
);
