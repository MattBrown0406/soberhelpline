CREATE TABLE public.meeting_qa_archive (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meeting_date DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_qa_archive TO authenticated;
GRANT ALL ON public.meeting_qa_archive TO service_role;

ALTER TABLE public.meeting_qa_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all Q&A"
ON public.meeting_qa_archive
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Members and moderators view published Q&A"
ON public.meeting_qa_archive
FOR SELECT
TO authenticated
USING (
  is_published = true
  AND (
    public.has_role(auth.uid(), 'moderator'::public.app_role)
    OR public.is_active_family_member(auth.uid())
  )
);

CREATE TRIGGER update_meeting_qa_archive_updated_at
BEFORE UPDATE ON public.meeting_qa_archive
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();