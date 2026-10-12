-- Service-only, row-locked item merging shared by the batch and member form.
-- Keep exact items separately: substring matching loses valid questions and
-- splitting arbitrary member text loses multiline retry identity.
BEGIN;
ALTER TABLE public.zoom_meeting_registrations ADD COLUMN question_items text[];
UPDATE public.zoom_meeting_registrations SET question_items =
  CASE WHEN btrim(question) = '' THEN ARRAY[]::text[]
    WHEN registration_source = 'app' THEN ARRAY(SELECT regexp_replace(regexp_replace(line, '^• ', ''), ' \(from the app\)$', '') FROM unnest(string_to_array(question, E'\n')) AS line)
    ELSE ARRAY[btrim(question)] END;
CREATE FUNCTION public.merge_monday_registration_questions(_email text, _meeting_date date, _questions text[], _from_app boolean DEFAULT false)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE target public.zoom_meeting_registrations%ROWTYPE; item text; items text[]; rendered text;
BEGIN
  IF _questions IS NULL OR cardinality(_questions) > 10 THEN
    RAISE EXCEPTION 'Invalid questions' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO target FROM public.zoom_meeting_registrations
    WHERE lower(btrim(email)) = lower(btrim(_email)) AND meeting_date = _meeting_date FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  items := target.question_items;
  IF items IS NULL THEN
    items := CASE WHEN btrim(coalesce(target.question, '')) = '' THEN ARRAY[]::text[]
      WHEN target.registration_source = 'app' THEN ARRAY(SELECT regexp_replace(regexp_replace(line, '^• ', ''), ' \(from the app\)$', '') FROM unnest(string_to_array(target.question, E'\n')) AS line)
      ELSE ARRAY[btrim(target.question)] END;
  END IF;
  rendered := target.question;
  FOREACH item IN ARRAY _questions LOOP
    IF item IS NULL OR btrim(item) = '' OR length(item) > 1000 THEN
      RAISE EXCEPTION 'Invalid question' USING ERRCODE = '22023';
    END IF;
    item := btrim(item);
    IF NOT (item = ANY(items)) THEN
      items := array_append(items, item);
      rendered := concat_ws(E'\n', nullif(btrim(rendered), ''), CASE WHEN _from_app THEN '• ' || item || ' (from the app)' ELSE item END);
    END IF;
  END LOOP;
  UPDATE public.zoom_meeting_registrations SET question = coalesce(rendered, ''), question_items = items WHERE id = target.id;
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.merge_monday_registration_questions(text, date, text[], boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.merge_monday_registration_questions(text, date, text[], boolean) TO service_role;
CREATE OR REPLACE FUNCTION public.append_monday_registration_question(_email text, _meeting_date date, _question text)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  IF _question IS NULL OR btrim(_question) = '' OR length(_question) > 1000 THEN
    RAISE EXCEPTION 'Invalid question' USING ERRCODE = '22023';
  END IF;
  RETURN public.merge_monday_registration_questions(_email, _meeting_date, ARRAY[_question], false);
END $$;
COMMIT;
