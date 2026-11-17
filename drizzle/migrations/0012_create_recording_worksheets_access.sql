CREATE TABLE public.recording_worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id uuid NOT NULL REFERENCES public.zoom_call_recordings(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
  file_path text NOT NULL UNIQUE CHECK (file_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.pdf$'),
  file_name text NOT NULL CHECK (char_length(file_name) <= 120 AND file_name ~ '^[a-z0-9]+(-[a-z0-9]+)*\.pdf$'),
  file_size integer NOT NULL CHECK (file_size BETWEEN 1 AND 20971520),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX recording_worksheets_recording_idx
  ON public.recording_worksheets (recording_id, sort_order, created_at);

ALTER TABLE public.recording_worksheets ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.recording_worksheets FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recording_worksheets TO authenticated;
GRANT ALL ON public.recording_worksheets TO service_role;

-- Members (and moderators) see the worksheets of published recordings. Admins see all.
CREATE POLICY "Members can view worksheets of published recordings"
ON public.recording_worksheets
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR (
    (public.is_active_family_member(auth.uid()) OR public.has_role(auth.uid(), 'moderator'::app_role))
    AND EXISTS (
      SELECT 1 FROM public.zoom_call_recordings r
      WHERE r.id = recording_worksheets.recording_id AND r.is_published
    )
  )
);

-- Only admins add, change or remove worksheets.
CREATE POLICY "Admins can manage recording worksheets"
ON public.recording_worksheets
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins may upload, read, replace and remove files in this bucket (whether or not a row exists yet).
CREATE POLICY "Admins manage recording worksheet files"
ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'recording-worksheets' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'recording-worksheets' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Anyone else may read a file only if a worksheet row she is allowed to see points at it.
CREATE POLICY "Members read recording worksheet files"
ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'recording-worksheets'
  AND EXISTS (
    SELECT 1 FROM public.recording_worksheets w
    WHERE w.file_path = storage.objects.name
  )
);