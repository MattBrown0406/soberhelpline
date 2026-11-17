DROP POLICY "Active members can view recordings" ON public.zoom_call_recordings;

CREATE POLICY "Active members can view recordings"
ON public.zoom_call_recordings
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR (
    is_published
    AND (
      public.is_active_family_member(auth.uid())
      OR public.has_role(auth.uid(), 'moderator'::app_role)
    )
  )
);