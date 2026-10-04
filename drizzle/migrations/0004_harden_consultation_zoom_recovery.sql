-- lovable-cron-fallback-reviewed: user-specified 15-minute retry window for missing Zoom links/emails on paid bookings
-- From 20260605224500_harden_consultation_zoom_recovery.sql, which never
-- reached production: explicit Zoom/notification state on bookings, so
-- process-consultation-booking can save the Zoom link and the recovery
-- job can retry missing links and emails.
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
    AND (zoom_meeting_url IS NULL OR zoom_status = 'failed'
         OR client_notified = false OR provider_notified = false);

UPDATE public.consultation_bookings
SET zoom_status = CASE
    WHEN zoom_meeting_url IS NOT NULL AND zoom_meeting_url <> '' THEN 'created'
    ELSE 'pending'
  END
WHERE zoom_status = 'pending';

-- Retry missing Zoom links / emails every 15 minutes. Sends the site's
-- cron secret, so it keeps working once enforce_function_auth is on.
DO $$
DECLARE v_job bigint;
BEGIN
  SELECT jobid INTO v_job FROM cron.job
   WHERE jobname = 'recover-consultation-zoom-links-every-15-minutes';
  IF v_job IS NOT NULL THEN PERFORM cron.unschedule(v_job); END IF;
  PERFORM cron.schedule(
    'recover-consultation-zoom-links-every-15-minutes',
    '*/15 * * * *',
    $cron$
    SELECT net.http_post(
      url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/recover-consultation-zoom-links',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := jsonb_build_object(
        'source', 'pg_cron',
        'cron_secret', (SELECT value FROM public.site_settings WHERE key = 'cron_secret')
      )
    );
    $cron$
  );
END $$;