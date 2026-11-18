DROP POLICY IF EXISTS "Members read recording worksheet files" ON storage.objects;
CREATE POLICY "Members read recording worksheet files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'recording-worksheets'
  AND (select auth.uid()) IS NOT NULL
  AND (
    public.is_active_family_member((select auth.uid()))
    OR public.has_role((select auth.uid()), 'moderator'::public.app_role)
  )
  AND EXISTS (
    SELECT 1 FROM public.recording_worksheets w
    JOIN public.zoom_call_recordings r ON r.id = w.recording_id
    WHERE w.file_path = objects.name AND r.is_published
  )
);