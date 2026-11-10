-- Minimal stand-in for the live soberhelpline database: Supabase roles and
-- helpers, plus the tables the 2026-11-10 migrations touch, with the policies,
-- grants and triggers copied from the repo's migrations. Test data only.
\set ON_ERROR_STOP on

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $$;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

CREATE SCHEMA auth;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, email_confirmed_at timestamptz DEFAULT now());
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid
$$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$
  SELECT current_setting('request.jwt.claims', true)::jsonb ->> 'role'
$$;

-- pg_cron / pg_net stand-ins
CREATE SCHEMA cron;
CREATE TABLE cron.job (jobid bigserial PRIMARY KEY, jobname text UNIQUE, schedule text, command text, active boolean DEFAULT true);
CREATE FUNCTION cron.schedule(job_name text, schedule text, command text) RETURNS bigint LANGUAGE sql AS $$
  INSERT INTO cron.job (jobname, schedule, command) VALUES (job_name, schedule, command)
  ON CONFLICT (jobname) DO UPDATE SET schedule = excluded.schedule, command = excluded.command
  RETURNING jobid
$$;
CREATE FUNCTION cron.alter_job(job_id bigint, schedule text DEFAULT NULL, command text DEFAULT NULL, database text DEFAULT NULL, username text DEFAULT NULL, active boolean DEFAULT NULL)
RETURNS void LANGUAGE sql AS $$
  UPDATE cron.job SET command = coalesce(alter_job.command, cron.job.command), schedule = coalesce(alter_job.schedule, cron.job.schedule) WHERE jobid = job_id
$$;
CREATE SCHEMA net;
CREATE TABLE net.calls (id bigserial PRIMARY KEY, url text, headers jsonb, body jsonb, at timestamptz DEFAULT now());
CREATE FUNCTION net.http_post(url text, body jsonb DEFAULT '{}'::jsonb, params jsonb DEFAULT '{}'::jsonb, headers jsonb DEFAULT '{}'::jsonb, timeout_milliseconds integer DEFAULT 5000)
RETURNS bigint LANGUAGE sql AS $$ INSERT INTO net.calls (url, headers, body) VALUES (url, headers, body) RETURNING id $$;
CREATE PUBLICATION supabase_realtime;

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, role public.app_role NOT NULL, created_at timestamptz DEFAULT now(), UNIQUE (user_id, role));
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

CREATE TABLE public.site_settings (key text PRIMARY KEY, value text NOT NULL, is_public boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now(), updated_by uuid);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public settings" ON public.site_settings FOR SELECT USING (is_public);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;

CREATE TABLE public.profiles (id uuid PRIMARY KEY, first_name text NOT NULL DEFAULT '', last_name text NOT NULL DEFAULT '', username text, agreed_to_code_of_conduct boolean, code_of_conduct_agreed_at timestamptz, webinar_reminders_opted_in boolean, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
CREATE TABLE public.profile_private (user_id uuid PRIMARY KEY, email text NOT NULL, phone_number text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
ALTER TABLE public.profile_private ENABLE ROW LEVEL SECURITY;

-- Memberships (drizzle 0000)
CREATE TABLE public.provider_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, status text NOT NULL DEFAULT 'pending',
  plan_type text NOT NULL DEFAULT 'monthly', amount numeric NOT NULL DEFAULT 9.99, paypal_subscription_id text,
  provider_submission_id uuid, next_billing_date timestamptz, start_date timestamptz, access_ends_at timestamptz,
  app_grace_until timestamptz, cancelled_at timestamptz, cancellation_reason text, cancellation_source text,
  paypal_cancel_confirmed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.provider_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subs" ON public.provider_subscriptions FOR SELECT USING (auth.uid() = user_id);
GRANT SELECT, UPDATE ON public.provider_subscriptions TO authenticated;
GRANT ALL ON public.provider_subscriptions TO service_role;
CREATE FUNCTION public.prevent_provider_subscription_tampering() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  IF current_user = 'service_role' OR session_user = 'service_role'
     OR coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role'
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status OR NEW.access_ends_at IS DISTINCT FROM OLD.access_ends_at THEN
    RAISE EXCEPTION 'Only administrators or the payment service may modify subscription status or billing fields' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER prevent_provider_subscription_tampering BEFORE UPDATE ON public.provider_subscriptions FOR EACH ROW EXECUTE FUNCTION public.prevent_provider_subscription_tampering();
CREATE FUNCTION public.is_active_family_member(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.provider_subscriptions ps WHERE ps.user_id = _user_id AND ps.provider_submission_id IS NULL AND (
    (ps.status = 'active' AND (ps.access_ends_at IS NULL OR ps.access_ends_at > now()) AND (ps.plan_type IS DISTINCT FROM 'app' OR ps.app_grace_until IS NULL OR ps.app_grace_until > now()))
    OR (ps.status = 'cancelled' AND ps.access_ends_at IS NOT NULL AND ps.access_ends_at > now())))
$$;
GRANT EXECUTE ON FUNCTION public.is_active_family_member(uuid) TO authenticated, service_role;

-- Coaching providers and bookings (20260216004722, grants 20260326171018)
CREATE TABLE public.consultation_providers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id uuid NOT NULL UNIQUE, full_name text NOT NULL, title text, bio text,
  photo_url text, specialties text[] DEFAULT '{}', paypal_email text NOT NULL, notification_email text, session_rate numeric NOT NULL DEFAULT 150,
  session_duration_minutes integer NOT NULL DEFAULT 60, status text NOT NULL DEFAULT 'pending', timezone text NOT NULL DEFAULT 'America/Los_Angeles',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_providers FORCE ROW LEVEL SECURITY;
CREATE POLICY "Block anonymous insert" ON public.consultation_providers FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anonymous update" ON public.consultation_providers FOR UPDATE USING (false);
CREATE POLICY "Providers can view own profile" ON public.consultation_providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Providers can insert own profile" ON public.consultation_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Providers can update own profile" ON public.consultation_providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage providers" ON public.consultation_providers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
GRANT SELECT, INSERT, UPDATE ON public.consultation_providers TO authenticated;
GRANT ALL ON public.consultation_providers TO service_role;

CREATE TABLE public.consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider_id uuid NOT NULL REFERENCES public.consultation_providers(id), client_user_id uuid,
  client_name text NOT NULL, client_email text NOT NULL, client_phone text, booking_date date NOT NULL, start_time time NOT NULL, end_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'America/Los_Angeles', status text NOT NULL DEFAULT 'confirmed', amount_paid numeric NOT NULL DEFAULT 0,
  paypal_order_id text, coaching_plan_id uuid, intake_responses jsonb, zoom_meeting_url text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings FORCE ROW LEVEL SECURITY;
CREATE POLICY "Block anon update bookings" ON public.consultation_bookings FOR UPDATE USING (false);
CREATE POLICY "Clients view own bookings" ON public.consultation_bookings FOR SELECT USING (auth.uid() = client_user_id);
CREATE POLICY "Providers view their bookings" ON public.consultation_bookings FOR SELECT USING (EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_id AND cp.user_id = auth.uid()));
CREATE POLICY "Providers update their bookings" ON public.consultation_bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_id AND cp.user_id = auth.uid()));
CREATE POLICY "Admins manage bookings" ON public.consultation_bookings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
GRANT SELECT, INSERT, UPDATE ON public.consultation_bookings TO authenticated;
GRANT ALL ON public.consultation_bookings TO service_role;

-- Directory listings (20260119023457, 20260217204751, 20260702232024)
CREATE TABLE public.provider_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), submitted_by uuid, category text NOT NULL, email text NOT NULL DEFAULT 'x@example.invalid',
  status text DEFAULT 'pending', created_at timestamptz DEFAULT now(),
  CONSTRAINT provider_submissions_status_check CHECK (status = ANY (ARRAY['pending','approved','rejected','draft']))
);
ALTER TABLE public.provider_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can insert submissions" ON public.provider_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "own submissions" ON public.provider_submissions FOR SELECT TO authenticated USING (auth.uid() = submitted_by OR has_role(auth.uid(), 'admin'));
CREATE POLICY "own submissions update" ON public.provider_submissions FOR UPDATE TO authenticated USING (auth.uid() = submitted_by OR has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE ON public.provider_submissions TO authenticated;
GRANT ALL ON public.provider_submissions TO service_role;
CREATE FUNCTION public.enforce_provider_submission_status_transition() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT ((OLD.status = 'draft' AND NEW.status = 'pending') OR (OLD.status = 'draft' AND NEW.status = 'draft') OR (OLD.status = 'pending' AND NEW.status = 'pending')) THEN
      RAISE EXCEPTION 'Invalid status transition from % to % for provider submission', OLD.status, NEW.status USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_enforce_provider_submission_status_transition BEFORE UPDATE ON public.provider_submissions FOR EACH ROW EXECUTE FUNCTION public.enforce_provider_submission_status_transition();

-- Coaching plans (20260216074817)
CREATE TABLE public.coaching_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, client_user_id uuid NOT NULL, provider_id uuid NOT NULL REFERENCES public.consultation_providers(id),
  plan_type text NOT NULL CHECK (plan_type IN ('emergency', 'stabilization')), total_sessions integer NOT NULL DEFAULT 1,
  completed_sessions integer NOT NULL DEFAULT 0, total_amount numeric NOT NULL, provider_payout_per_session numeric NOT NULL,
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coaching_plans ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.coaching_plans TO service_role;

-- Test people
INSERT INTO auth.users (id, email) VALUES
  ('00000000-0000-0000-0000-00000000000a', 'admin@example.invalid'),
  ('00000000-0000-0000-0000-00000000000b', 'member@example.invalid'),
  ('00000000-0000-0000-0000-00000000000c', 'stranger@example.invalid'),
  ('00000000-0000-0000-0000-00000000000d', 'provider@example.invalid'),
  ('00000000-0000-0000-0000-00000000000e', 'member2@example.invalid');
INSERT INTO public.user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-00000000000a', 'admin');
INSERT INTO public.site_settings (key, value) VALUES ('cron_secret', 'test-cron-secret'), ('enforce_function_auth', 'false');
