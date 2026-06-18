-- ============================================================
-- Library features: recording metadata, Q&A archive, cron auth
-- ============================================================

-- 1. Extend zoom_call_recordings with tags, show notes, timestamps
ALTER TABLE public.zoom_call_recordings
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS show_notes TEXT,
  ADD COLUMN IF NOT EXISTS key_timestamps JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_zoom_call_recordings_tags
  ON public.zoom_call_recordings USING GIN (tags);

-- 2. Q&A archive — questions captured from Monday meetings
CREATE TABLE IF NOT EXISTS public.meeting_qa_archive (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meeting_date DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meeting_qa_tags
  ON public.meeting_qa_archive USING GIN (tags);

ALTER TABLE public.meeting_qa_archive ENABLE ROW LEVEL SECURITY;

-- Active members can read published Q&As
CREATE POLICY "Members can read published QA"
  ON public.meeting_qa_archive
  FOR SELECT
  USING (
    is_published = true
    AND (
      is_active_family_member(auth.uid())
      OR has_role(auth.uid(), 'admin'::public.app_role)
      OR has_role(auth.uid(), 'moderator'::public.app_role)
    )
  );

-- Admins can manage all Q&As
CREATE POLICY "Admins can manage QA"
  ON public.meeting_qa_archive
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_meeting_qa_archive_updated_at
  BEFORE UPDATE ON public.meeting_qa_archive
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.meeting_qa_archive TO authenticated;
GRANT ALL ON public.meeting_qa_archive TO service_role;

-- 3. Cron secret — pg_cron passes this to authenticate recovery calls
INSERT INTO public.site_settings (key, value)
SELECT 'cron_secret', gen_random_uuid()::text
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'cron_secret');

-- 4. Reschedule recovery cron to include the secret
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    BEGIN
      PERFORM cron.unschedule('recover-consultation-zoom-links-every-15-minutes');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    PERFORM cron.schedule(
      'recover-consultation-zoom-links-every-15-minutes',
      '*/15 * * * *',
      $cron$
      SELECT net.http_post(
        url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/recover-consultation-zoom-links',
        headers := '{"Content-Type":"application/json"}'::jsonb,
        body := ('{"source":"pg_cron","cron_secret":"' || (SELECT value FROM public.site_settings WHERE key = 'cron_secret') || '"}')::jsonb
      ) AS request_id;
      $cron$
    );
  END IF;
END $$;
