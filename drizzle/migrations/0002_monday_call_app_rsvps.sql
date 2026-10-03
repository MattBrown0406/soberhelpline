-- =====================================================================
-- Sober Helpline website — Monday call RSVPs from the app. 2026-10-03.
-- Idempotent. Changes no rows. Run as ONE migration (one transaction, so
-- there is no moment without a source check).
-- =====================================================================

-- 1. Allow registration_source = 'app' (rows written only by the
--    app-family-squares-sync edge function). Every existing row already
--    satisfies the old, narrower check, so the new one validates instantly.
--    Drops whichever check constraint currently covers registration_source
--    (by definition, not by name), then adds the widened one.
DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.zoom_meeting_registrations'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%registration_source%'
  LOOP
    EXECUTE format('ALTER TABLE public.zoom_meeting_registrations DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.zoom_meeting_registrations
  ADD CONSTRAINT zoom_meeting_registrations_source_check
  CHECK (registration_source IN ('website', 'kiosk', 'automatic', 'app'));

-- 2. At most one app row per person per meeting date, even if two sync runs
--    overlap. Only app rows are covered; website/kiosk duplicates are untouched.
--    No app rows can exist before step 1, so this cannot fail on existing data.
CREATE UNIQUE INDEX IF NOT EXISTS zoom_registrations_one_app_row_per_email_date
  ON public.zoom_meeting_registrations (lower(trim(email)), meeting_date)
  WHERE registration_source = 'app';