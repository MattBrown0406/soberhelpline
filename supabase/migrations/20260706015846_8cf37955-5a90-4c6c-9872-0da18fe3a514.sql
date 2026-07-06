CREATE OR REPLACE FUNCTION public.get_poll_by_token(_token UUID)
RETURNS TABLE (
  poll_id UUID,
  title TEXT,
  question TEXT,
  option_1_label TEXT,
  option_2_label TEXT,
  meeting_date DATE,
  closed_at TIMESTAMPTZ,
  recipient_name TEXT,
  current_choice SMALLINT,
  voted_at TIMESTAMPTZ,
  option_1_count BIGINT,
  option_2_count BIGINT,
  total_votes BIGINT
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS poll_id,
    p.title,
    p.question,
    p.option_1_label,
    p.option_2_label,
    p.meeting_date,
    p.closed_at,
    v.recipient_name,
    v.choice AS current_choice,
    v.voted_at,
    (SELECT count(*) FROM public.email_poll_votes ev WHERE ev.poll_id = p.id AND ev.choice = 1) AS option_1_count,
    (SELECT count(*) FROM public.email_poll_votes ev WHERE ev.poll_id = p.id AND ev.choice = 2) AS option_2_count,
    (SELECT count(*) FROM public.email_poll_votes ev WHERE ev.poll_id = p.id AND ev.choice IS NOT NULL) AS total_votes
  FROM public.email_poll_votes v
  JOIN public.email_polls p ON p.id = v.poll_id
  WHERE v.token = _token;
$$;

GRANT EXECUTE ON FUNCTION public.get_poll_by_token(UUID) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.cast_poll_vote(_token UUID, _choice SMALLINT)
RETURNS TABLE (
  poll_id UUID,
  option_1_count BIGINT,
  option_2_count BIGINT,
  total_votes BIGINT,
  current_choice SMALLINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _poll_id UUID;
  _closed TIMESTAMPTZ;
BEGIN
  IF _choice NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid choice';
  END IF;

  SELECT v.poll_id, p.closed_at
    INTO _poll_id, _closed
  FROM public.email_poll_votes v
  JOIN public.email_polls p ON p.id = v.poll_id
  WHERE v.token = _token;

  IF _poll_id IS NULL THEN
    RAISE EXCEPTION 'Invalid token';
  END IF;

  IF _closed IS NOT NULL AND _closed < now() THEN
    RAISE EXCEPTION 'Poll is closed';
  END IF;

  UPDATE public.email_poll_votes
     SET choice = _choice,
         voted_at = now(),
         updated_at = now()
   WHERE token = _token;

  RETURN QUERY
  SELECT
    _poll_id,
    (SELECT count(*) FROM public.email_poll_votes ev WHERE ev.poll_id = _poll_id AND ev.choice = 1),
    (SELECT count(*) FROM public.email_poll_votes ev WHERE ev.poll_id = _poll_id AND ev.choice = 2),
    (SELECT count(*) FROM public.email_poll_votes ev WHERE ev.poll_id = _poll_id AND ev.choice IS NOT NULL),
    _choice;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cast_poll_vote(UUID, SMALLINT) TO anon, authenticated;