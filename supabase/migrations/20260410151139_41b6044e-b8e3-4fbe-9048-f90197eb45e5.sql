ALTER TABLE public.zoom_meeting_registrations
ADD COLUMN auto_register boolean NOT NULL DEFAULT false;