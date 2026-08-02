ALTER TABLE public.meeting_qa_archive
  ADD COLUMN IF NOT EXISTS source_registration_id uuid;

ALTER TABLE public.meeting_qa_archive
  ALTER COLUMN answer SET DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS meeting_qa_archive_source_registration_id_key
  ON public.meeting_qa_archive (source_registration_id)
  WHERE source_registration_id IS NOT NULL;