
ALTER TABLE public.zoom_call_recordings
  ADD COLUMN IF NOT EXISTS zoom_passcode TEXT;

COMMENT ON COLUMN public.zoom_call_recordings.zoom_passcode IS
  'Optional Zoom cloud recording passcode. The member UI appends it as ?pwd=... for Zoom links and also displays it as a fallback.';
