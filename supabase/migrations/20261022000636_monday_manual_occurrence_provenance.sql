BEGIN;
-- Evidence of a manual action, NOT the mutable seat source or auto-enrolment
-- preference. No historical backfill. Deliberately no cascading seat FK: app
-- snapshot deletion, source promotion and seat retention must not erase evidence.
CREATE TABLE public.monday_manual_occurrences (
  email text NOT NULL CHECK (email = lower(btrim(email)) AND email <> ''),
  meeting_date date NOT NULL CHECK (extract(isodow FROM meeting_date) = 1),
  first_recorded_at timestamptz NOT NULL DEFAULT now(),
  channel text NOT NULL CHECK (channel IN ('public', 'legacy', 'kiosk')),
  PRIMARY KEY (email, meeting_date)
);
ALTER TABLE public.monday_manual_occurrences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.monday_manual_occurrences FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT ON public.monday_manual_occurrences TO service_role;
-- Do not assert continuous capture merely because the migration was installed.
CREATE TABLE public.monday_manual_history_coverage (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  complete_since timestamptz
);
INSERT INTO public.monday_manual_history_coverage (singleton) VALUES (true);
ALTER TABLE public.monday_manual_history_coverage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.monday_manual_history_coverage FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, UPDATE ON public.monday_manual_history_coverage TO service_role;

-- A single transaction saves/promotes the seat AND records manual evidence.
-- Replay preserves all participant fields, consent and delivery claims.
CREATE FUNCTION public.register_monday_manual(_registration jsonb, _channel text)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  r public.zoom_meeting_registrations;
  saved record;
BEGIN
  IF _channel IS NULL OR _channel NOT IN ('public', 'legacy', 'kiosk') THEN
    RAISE EXCEPTION 'Invalid manual channel' USING ERRCODE = '22023';
  END IF;
  r := jsonb_populate_record(NULL::public.zoom_meeting_registrations, _registration);
  r.email := lower(btrim(r.email));
  IF r.email IS NULL OR r.email = '' OR r.name IS NULL OR btrim(r.name) = ''
     OR r.meeting_date IS NULL OR extract(isodow FROM r.meeting_date) <> 1
     OR r.meeting_date < (now() AT TIME ZONE 'America/Los_Angeles')::date THEN
    RAISE EXCEPTION 'Invalid registration' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.zoom_meeting_registrations
    (user_id, name, email, phone, question, request_follow_up, consent_email_list,
     meeting_date, auto_register, preferred_contact_date, preferred_contact_time,
     preferred_timezone, language, registration_source)
  VALUES (r.user_id, r.name, r.email, coalesce(r.phone,''), coalesce(r.question,''),
    coalesce(r.request_follow_up,false), coalesce(r.consent_email_list,false),
    r.meeting_date, coalesce(r.auto_register,false), r.preferred_contact_date,
    r.preferred_contact_time, r.preferred_timezone, coalesce(r.language,'en'),
    CASE WHEN _channel = 'kiosk' THEN 'kiosk' ELSE 'website' END)
  ON CONFLICT (lower(btrim(email)), meeting_date) DO UPDATE
    SET registration_source = CASE
      WHEN zoom_meeting_registrations.registration_source = 'app' THEN 'website'
      ELSE zoom_meeting_registrations.registration_source END
  RETURNING zoom_meeting_registrations.*, (xmax <> 0) AS already_registered INTO saved;
  INSERT INTO public.monday_manual_occurrences (email, meeting_date, channel)
    VALUES (r.email, r.meeting_date, _channel) ON CONFLICT DO NOTHING;
  RETURN jsonb_build_object('already_registered', saved.already_registered,
    'registration', jsonb_build_object('id', saved.id, 'name', saved.name, 'email', saved.email));
END $$;
REVOKE ALL ON FUNCTION public.register_monday_manual(jsonb, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_monday_manual(jsonb, text) TO service_role;

-- Aggregate in SQL: no Data API row limit or multiple-page snapshot ambiguity.
-- Before certified capture, non-ledger seats remain unclassified: even auto/app
-- seats might have received an unrecorded manual action. After certification,
-- newly created non-ledger seats have no recorded manual action. Never infer
-- manual evidence from source or preference; keep pre-cutover ambiguity.
CREATE FUNCTION public.monday_manual_history(_email text, _meeting_date date)
RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  WITH manual AS (
    SELECT meeting_date FROM public.monday_manual_occurrences
    WHERE email = lower(btrim(_email))
      AND meeting_date < least(_meeting_date, (now() AT TIME ZONE 'America/Los_Angeles')::date)
  ), unknown AS (
    SELECT DISTINCT r.meeting_date FROM public.zoom_meeting_registrations r
    WHERE lower(btrim(r.email)) = lower(btrim(_email))
      AND r.meeting_date < least(_meeting_date, (now() AT TIME ZONE 'America/Los_Angeles')::date)
      AND NOT EXISTS (SELECT 1 FROM manual m WHERE m.meeting_date = r.meeting_date)
      AND (r.created_at IS NULL OR r.created_at < coalesce(
        (SELECT complete_since FROM public.monday_manual_history_coverage WHERE singleton),
        'infinity'::timestamptz))
  )
  SELECT jsonb_build_object('verifiedManual', (SELECT count(*) FROM manual),
    'unclassified', (SELECT count(*) FROM unknown),
    'completeSince', (SELECT complete_since FROM public.monday_manual_history_coverage WHERE singleton))
$$;
REVOKE ALL ON FUNCTION public.monday_manual_history(text, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.monday_manual_history(text, date) TO service_role;
COMMIT;
