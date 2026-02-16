
-- Consultation providers table
CREATE TABLE public.consultation_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT, -- e.g. "Licensed Clinical Social Worker"
  bio TEXT,
  photo_url TEXT,
  specialties TEXT[] DEFAULT '{}',
  paypal_email TEXT NOT NULL,
  session_rate NUMERIC NOT NULL DEFAULT 150,
  session_duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, suspended
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.consultation_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_providers FORCE ROW LEVEL SECURITY;

-- Block anonymous access
CREATE POLICY "Block anonymous select" ON public.consultation_providers FOR SELECT USING (false);
CREATE POLICY "Block anonymous insert" ON public.consultation_providers FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anonymous update" ON public.consultation_providers FOR UPDATE USING (false);
CREATE POLICY "Block anonymous delete" ON public.consultation_providers FOR DELETE USING (false);

-- Providers can manage their own profile
CREATE POLICY "Providers can view own profile" ON public.consultation_providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Providers can insert own profile" ON public.consultation_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Providers can update own profile" ON public.consultation_providers FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all
CREATE POLICY "Admins can manage providers" ON public.consultation_providers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone authenticated can see approved providers
CREATE POLICY "Authenticated users can view approved providers" ON public.consultation_providers FOR SELECT USING (auth.uid() IS NOT NULL AND status = 'approved');

-- Provider availability (recurring weekly slots)
CREATE TABLE public.provider_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.consultation_providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block anon select availability" ON public.provider_availability FOR SELECT USING (false);
CREATE POLICY "Block anon insert availability" ON public.provider_availability FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anon update availability" ON public.provider_availability FOR UPDATE USING (false);
CREATE POLICY "Block anon delete availability" ON public.provider_availability FOR DELETE USING (false);

-- Providers manage own availability
CREATE POLICY "Providers manage own availability" ON public.provider_availability FOR ALL 
  USING (EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_id AND cp.user_id = auth.uid()));

-- Authenticated users can view availability of approved providers
CREATE POLICY "View approved provider availability" ON public.provider_availability FOR SELECT 
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_id AND cp.status = 'approved'));

-- Admins
CREATE POLICY "Admins manage availability" ON public.provider_availability FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Consultation bookings
CREATE TABLE public.consultation_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.consultation_providers(id),
  client_user_id UUID NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, completed, cancelled, no_show
  amount_paid NUMERIC NOT NULL DEFAULT 150,
  paypal_order_id TEXT,
  zoom_meeting_url TEXT,
  zoom_meeting_id TEXT,
  zoom_passcode TEXT,
  intake_responses JSONB,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  provider_notified BOOLEAN DEFAULT false,
  client_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings FORCE ROW LEVEL SECURITY;

CREATE POLICY "Block anon select bookings" ON public.consultation_bookings FOR SELECT USING (false);
CREATE POLICY "Block anon insert bookings" ON public.consultation_bookings FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anon update bookings" ON public.consultation_bookings FOR UPDATE USING (false);
CREATE POLICY "Block anon delete bookings" ON public.consultation_bookings FOR DELETE USING (false);

-- Clients can view and create their own bookings
CREATE POLICY "Clients view own bookings" ON public.consultation_bookings FOR SELECT USING (auth.uid() = client_user_id);
CREATE POLICY "Clients create bookings" ON public.consultation_bookings FOR INSERT WITH CHECK (auth.uid() = client_user_id);

-- Providers can view bookings assigned to them
CREATE POLICY "Providers view their bookings" ON public.consultation_bookings FOR SELECT 
  USING (EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_id AND cp.user_id = auth.uid()));

-- Providers can update their bookings (mark complete, etc.)
CREATE POLICY "Providers update their bookings" ON public.consultation_bookings FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_id AND cp.user_id = auth.uid()));

-- Admins
CREATE POLICY "Admins manage bookings" ON public.consultation_bookings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Consultation payouts
CREATE TABLE public.consultation_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.consultation_bookings(id),
  provider_id UUID NOT NULL REFERENCES public.consultation_providers(id),
  amount NUMERIC NOT NULL,
  paypal_payout_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_payouts FORCE ROW LEVEL SECURITY;

CREATE POLICY "Block anon select payouts" ON public.consultation_payouts FOR SELECT USING (false);
CREATE POLICY "Block anon insert payouts" ON public.consultation_payouts FOR INSERT WITH CHECK (false);

-- Providers can view their own payouts
CREATE POLICY "Providers view own payouts" ON public.consultation_payouts FOR SELECT 
  USING (EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_id AND cp.user_id = auth.uid()));

-- Admins
CREATE POLICY "Admins manage payouts" ON public.consultation_payouts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_consultation_providers_updated_at
  BEFORE UPDATE ON public.consultation_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_bookings_updated_at
  BEFORE UPDATE ON public.consultation_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast booking lookups
CREATE INDEX idx_bookings_provider_date ON public.consultation_bookings(provider_id, booking_date);
CREATE INDEX idx_bookings_client ON public.consultation_bookings(client_user_id);
CREATE INDEX idx_availability_provider ON public.provider_availability(provider_id, day_of_week);
