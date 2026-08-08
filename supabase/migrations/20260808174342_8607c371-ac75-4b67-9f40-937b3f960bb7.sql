DELETE FROM public.zoom_attendance a
USING public.zoom_attendance b
WHERE a.ctid > b.ctid
  AND a.meeting_date = b.meeting_date
  AND coalesce(lower(a.participant_email), lower(a.participant_name)) = coalesce(lower(b.participant_email), lower(b.participant_name))
  AND a.join_time = b.join_time;