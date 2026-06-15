CREATE TABLE public.meeting_blocklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  reason TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_meeting_blocklist_email ON public.meeting_blocklist (lower(email));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_blocklist TO authenticated;
GRANT ALL ON public.meeting_blocklist TO service_role;

ALTER TABLE public.meeting_blocklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage meeting blocklist"
  ON public.meeting_blocklist
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_meeting_blocklist_updated_at
  BEFORE UPDATE ON public.meeting_blocklist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_email_meeting_blocked(_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.meeting_blocklist
    WHERE lower(email) = lower(coalesce(_email, ''))
  );
$$;