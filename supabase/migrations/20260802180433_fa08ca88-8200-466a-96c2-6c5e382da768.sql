ALTER TABLE public.zoom_meeting_registrations ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es'));

-- Grant usage to authenticated/anon so the column is readable via the existing table policies
GRANT SELECT, INSERT, UPDATE ON public.zoom_meeting_registrations TO authenticated;
GRANT ALL ON public.zoom_meeting_registrations TO service_role;

-- Ensure anon can still insert public registrations (existing anonymous-insert pattern)
GRANT INSERT, SELECT ON public.zoom_meeting_registrations TO anon;