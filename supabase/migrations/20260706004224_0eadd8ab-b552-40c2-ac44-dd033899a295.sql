
-- 1) Cancelled meeting dates (public-readable for banners; admin-write)
CREATE TABLE IF NOT EXISTS public.cancelled_meeting_dates (
  meeting_date DATE PRIMARY KEY,
  reason TEXT NOT NULL DEFAULT 'This week''s meeting has been cancelled. Please join us next Monday at 7 PM PT.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cancelled_meeting_dates TO anon, authenticated;
GRANT ALL ON public.cancelled_meeting_dates TO service_role;

ALTER TABLE public.cancelled_meeting_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cancelled meeting dates"
ON public.cancelled_meeting_dates FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage cancelled meeting dates"
ON public.cancelled_meeting_dates FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_cancelled_meeting_dates_updated_at
BEFORE UPDATE ON public.cancelled_meeting_dates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Email polls
CREATE TABLE IF NOT EXISTS public.email_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  meeting_date DATE,
  option_1_label TEXT NOT NULL,
  option_2_label TEXT NOT NULL,
  closed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.email_polls TO authenticated;
GRANT ALL ON public.email_polls TO service_role;

ALTER TABLE public.email_polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage polls"
ON public.email_polls FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_email_polls_updated_at
BEFORE UPDATE ON public.email_polls
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Email poll votes (one row per recipient, includes voting token)
CREATE TABLE IF NOT EXISTS public.email_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.email_polls(id) ON DELETE CASCADE,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  choice SMALLINT CHECK (choice IN (1, 2)),
  voted_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (poll_id, recipient_email)
);

CREATE INDEX IF NOT EXISTS email_poll_votes_poll_id_idx ON public.email_poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS email_poll_votes_token_idx ON public.email_poll_votes(token);

GRANT SELECT, INSERT, UPDATE ON public.email_poll_votes TO authenticated;
GRANT ALL ON public.email_poll_votes TO service_role;

ALTER TABLE public.email_poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage poll votes"
ON public.email_poll_votes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_email_poll_votes_updated_at
BEFORE UPDATE ON public.email_poll_votes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Public RPCs (token-scoped): lookup + vote + tally
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
    (SELECT count(*) FROM public.email_poll_votes WHERE poll_id = p.id AND choice = 1) AS option_1_count,
    (SELECT count(*) FROM public.email_poll_votes WHERE poll_id = p.id AND choice = 2) AS option_2_count,
    (SELECT count(*) FROM public.email_poll_votes WHERE poll_id = p.id AND choice IS NOT NULL) AS total_votes
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
    (SELECT count(*) FROM public.email_poll_votes WHERE poll_id = _poll_id AND choice = 1),
    (SELECT count(*) FROM public.email_poll_votes WHERE poll_id = _poll_id AND choice = 2),
    (SELECT count(*) FROM public.email_poll_votes WHERE poll_id = _poll_id AND choice IS NOT NULL),
    _choice;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cast_poll_vote(UUID, SMALLINT) TO anon, authenticated;

-- 5) Insert the cancellation for the 7/6 meeting immediately
INSERT INTO public.cancelled_meeting_dates (meeting_date, reason)
VALUES (
  '2026-07-06',
  'This Monday''s (July 6) meeting has been cancelled — Matt is on a plane to Texas to help a family with an intervention during the normal meeting time. Please check back next Monday at 7 PM PT for the regularly scheduled meeting.'
)
ON CONFLICT (meeting_date) DO UPDATE
  SET reason = EXCLUDED.reason,
      updated_at = now();
