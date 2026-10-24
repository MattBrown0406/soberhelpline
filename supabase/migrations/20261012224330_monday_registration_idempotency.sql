-- Do not silently destroy historic registrations or cascading follow-up records.
-- A pre-existing duplicate aborts this whole migration. Reconcile/archive those
-- records with an approved data migration before retrying (see release notes).
BEGIN;
LOCK TABLE public.zoom_meeting_registrations IN SHARE ROW EXCLUSIVE MODE;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM public.zoom_meeting_registrations
    GROUP BY lower(btrim(email)), meeting_date HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Existing duplicate Monday registrations require reviewed reconciliation before enabling idempotency';
  END IF;
END $$;

CREATE UNIQUE INDEX zoom_registration_email_meeting_unique
  ON public.zoom_meeting_registrations (lower(btrim(email)), meeting_date);

ALTER TABLE public.zoom_meeting_registrations
  ADD COLUMN confirmation_claimed_at timestamptz,
  ADD COLUMN confirmation_completed_at timestamptz;
-- Old sends cannot be proven unsent. Never replay them automatically.
UPDATE public.zoom_meeting_registrations SET confirmation_claimed_at = now();

-- Untrusted direct inserts bypass service validation and leak constraint status.
-- Public registration goes through the existing Edge Function instead.
REVOKE INSERT ON public.zoom_meeting_registrations FROM anon, authenticated;
-- Do not let an owner/admin client clear the delivery claim via a row update.
REVOKE UPDATE ON public.zoom_meeting_registrations FROM anon, authenticated;
DO $$ DECLARE columns text; BEGIN
  SELECT string_agg(quote_ident(attname), ', ' ORDER BY attnum) INTO columns
  FROM pg_attribute WHERE attrelid = 'public.zoom_meeting_registrations'::regclass
    AND attnum > 0 AND NOT attisdropped
    AND attname NOT IN ('confirmation_claimed_at', 'confirmation_completed_at');
  EXECUTE 'GRANT UPDATE (' || columns || ') ON public.zoom_meeting_registrations TO authenticated';
END $$;

-- The app bridge is the only caller. An atomic conflict update promotes a
-- transient app mirror before a concurrent batch deletion can remove it.
CREATE FUNCTION public.ensure_monday_registration(_email text, _name text, _meeting_date date)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE already_registered boolean;
BEGIN
  IF _email IS NULL OR btrim(_email) = '' OR _name IS NULL OR btrim(_name) = ''
     OR _meeting_date IS NULL OR extract(isodow FROM _meeting_date) <> 1 THEN
    RAISE EXCEPTION 'Invalid registration' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.zoom_meeting_registrations
    (email, name, meeting_date, user_id, registration_source, language,
     phone, question, auto_register, consent_email_list, request_follow_up)
  VALUES (lower(btrim(_email)), btrim(_name), _meeting_date, NULL, 'website', 'en',
    '', '', false, false, false)
  ON CONFLICT (lower(btrim(email)), meeting_date) DO UPDATE
    SET registration_source = CASE
      WHEN zoom_meeting_registrations.registration_source = 'app' THEN 'website'
      ELSE zoom_meeting_registrations.registration_source END
  RETURNING (xmax <> 0) INTO already_registered;
  RETURN already_registered;
END $$;
REVOKE ALL ON FUNCTION public.ensure_monday_registration(text, text, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_monday_registration(text, text, date) TO service_role;
-- The app's own ensure (app-family-squares-sync). A new seat is an app row,
-- exactly like the batch mirror's: marketing, lead scoring and follow-up
-- exclude registration_source = 'app', and the app reminds the member itself.
-- An existing row keeps its source. The app saves its RSVP right after this,
-- so its next 15-minute snapshot keeps (or restores) the app row.
CREATE FUNCTION public.ensure_monday_app_registration(_email text, _name text, _meeting_date date)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE already_registered boolean;
BEGIN
  IF _email IS NULL OR btrim(_email) = '' OR _name IS NULL OR btrim(_name) = ''
     OR _meeting_date IS NULL OR extract(isodow FROM _meeting_date) <> 1 THEN
    RAISE EXCEPTION 'Invalid registration' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.zoom_meeting_registrations
    (email, name, meeting_date, user_id, registration_source, language,
     phone, question, auto_register, consent_email_list, request_follow_up,
     lead_reasons, next_revenue_action, followup_sequence_status)
  VALUES (lower(btrim(_email)), btrim(_name), _meeting_date, NULL, 'app', 'en',
    '', '', false, false, false,
    ARRAY['Sober Helpline app RSVP'], 'none', 'not_applicable')
  ON CONFLICT (lower(btrim(email)), meeting_date) DO UPDATE
    SET registration_source = zoom_meeting_registrations.registration_source
  RETURNING (xmax <> 0) INTO already_registered;
  RETURN already_registered;
END $$;
REVOKE ALL ON FUNCTION public.ensure_monday_app_registration(text, text, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_monday_app_registration(text, text, date) TO service_role;
-- Preserve the signed-in member question form without inserting a second seat.
-- Only the edge handler (after verifying the account email) can call this helper.
CREATE FUNCTION public.append_monday_registration_question(_email text, _meeting_date date, _question text)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE affected integer;
BEGIN
  IF _question IS NULL OR btrim(_question) = '' OR length(_question) > 1000 THEN
    RAISE EXCEPTION 'Invalid question' USING ERRCODE = '22023';
  END IF;
  UPDATE public.zoom_meeting_registrations
  SET question = CASE WHEN strpos(coalesce(question, ''), btrim(_question)) > 0 THEN question
    ELSE concat_ws(E'\n', nullif(btrim(question), ''), btrim(_question)) END
  WHERE lower(btrim(email)) = lower(btrim(_email)) AND meeting_date = _meeting_date;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected = 1;
END $$;
REVOKE ALL ON FUNCTION public.append_monday_registration_question(text, date, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.append_monday_registration_question(text, date, text) TO service_role;
COMMIT;
