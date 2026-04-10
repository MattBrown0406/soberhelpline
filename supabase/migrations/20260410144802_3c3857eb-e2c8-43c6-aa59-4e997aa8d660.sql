
-- Track when registrants click the join link in their email
CREATE TABLE public.zoom_link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES public.zoom_meeting_registrations(id) ON DELETE CASCADE,
  registration_email text NOT NULL,
  registration_name text NOT NULL,
  meeting_date date NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Track actual Zoom attendance synced from Zoom Reports API
CREATE TABLE public.zoom_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date date NOT NULL,
  zoom_meeting_id text NOT NULL,
  participant_name text NOT NULL,
  participant_email text,
  join_time timestamptz NOT NULL,
  leave_time timestamptz,
  duration_minutes integer DEFAULT 0,
  registration_id uuid REFERENCES public.zoom_meeting_registrations(id) ON DELETE SET NULL,
  referral_registration_id uuid REFERENCES public.zoom_meeting_registrations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for quick lookups
CREATE INDEX idx_zoom_link_clicks_meeting_date ON public.zoom_link_clicks(meeting_date);
CREATE INDEX idx_zoom_link_clicks_registration_id ON public.zoom_link_clicks(registration_id);
CREATE INDEX idx_zoom_attendance_meeting_date ON public.zoom_attendance(meeting_date);

-- RLS: admin-only access
ALTER TABLE public.zoom_link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zoom_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage link clicks" ON public.zoom_link_clicks FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can manage attendance" ON public.zoom_attendance FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Allow anon insert for link click tracking
CREATE POLICY "Anyone can insert link clicks" ON public.zoom_link_clicks FOR INSERT WITH CHECK (true);

-- Block anon reads
CREATE POLICY "Block anon select clicks" ON public.zoom_link_clicks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon select attendance" ON public.zoom_attendance FOR SELECT USING (auth.uid() IS NOT NULL);
