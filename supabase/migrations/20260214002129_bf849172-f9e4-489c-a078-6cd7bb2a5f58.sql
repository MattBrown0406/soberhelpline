
CREATE TABLE public.zoom_meeting_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  question TEXT NOT NULL,
  request_follow_up BOOLEAN NOT NULL DEFAULT false,
  consent_email_list BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.zoom_meeting_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zoom_meeting_registrations FORCE ROW LEVEL SECURITY;

-- Block anonymous access
CREATE POLICY "Block anonymous select" ON public.zoom_meeting_registrations FOR SELECT USING (false);
CREATE POLICY "Block anonymous insert" ON public.zoom_meeting_registrations FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anonymous update" ON public.zoom_meeting_registrations FOR UPDATE USING (false);
CREATE POLICY "Block anonymous delete" ON public.zoom_meeting_registrations FOR DELETE USING (false);

-- Active family members can register
CREATE POLICY "Members can insert registrations" ON public.zoom_meeting_registrations
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id 
    AND public.is_active_family_member(auth.uid())
  );

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations" ON public.zoom_meeting_registrations
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations" ON public.zoom_meeting_registrations
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
