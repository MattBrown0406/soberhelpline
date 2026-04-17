CREATE TABLE IF NOT EXISTS public.email_suppression_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  reason TEXT,
  added_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_suppression_email ON public.email_suppression_list (LOWER(email));

ALTER TABLE public.email_suppression_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage suppression list"
  ON public.email_suppression_list
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.email_suppression_list (email, reason)
VALUES ('gracerogers@me.com', 'User requested removal from future distribution lists')
ON CONFLICT (email) DO NOTHING;