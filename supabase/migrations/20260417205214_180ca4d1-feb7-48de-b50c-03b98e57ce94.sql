
CREATE TABLE public.abandoned_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_email TEXT NOT NULL,
  client_name TEXT,
  client_phone TEXT,
  plan_type TEXT,
  provider_id UUID,
  provider_name TEXT,
  selected_date DATE,
  selected_time TEXT,
  last_step INTEGER DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  followup_sent_at TIMESTAMPTZ,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_abandoned_bookings_email ON public.abandoned_bookings(client_email);
CREATE INDEX idx_abandoned_bookings_completed ON public.abandoned_bookings(completed, followup_sent_at, created_at);

ALTER TABLE public.abandoned_bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous booking attempts)
CREATE POLICY "Anyone can create abandoned booking record"
ON public.abandoned_bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can update by id (client provides the id from initial insert)
CREATE POLICY "Anyone can update abandoned booking by id"
ON public.abandoned_bookings FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view all abandoned bookings"
ON public.abandoned_bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER abandoned_bookings_updated_at
BEFORE UPDATE ON public.abandoned_bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
