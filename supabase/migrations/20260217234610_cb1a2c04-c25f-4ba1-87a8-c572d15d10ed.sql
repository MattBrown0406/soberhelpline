
ALTER TABLE public.zoom_meeting_registrations
  ADD COLUMN preferred_contact_date text,
  ADD COLUMN preferred_contact_time text,
  ADD COLUMN preferred_timezone text DEFAULT 'America/Los_Angeles';
