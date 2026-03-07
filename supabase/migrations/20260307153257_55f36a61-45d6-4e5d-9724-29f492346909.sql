-- Restore table privileges required for public Zoom registration flow
GRANT INSERT ON TABLE public.zoom_meeting_registrations TO anon, authenticated;
GRANT SELECT ON TABLE public.zoom_meeting_registrations TO authenticated;