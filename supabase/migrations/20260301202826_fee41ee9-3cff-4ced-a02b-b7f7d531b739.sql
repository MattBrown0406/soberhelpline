
-- Create table for zoom call recordings
CREATE TABLE public.zoom_call_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  recording_date DATE NOT NULL,
  duration_minutes INTEGER,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.zoom_call_recordings ENABLE ROW LEVEL SECURITY;

-- Only active family members, moderators, or admins can view recordings
CREATE POLICY "Active members can view recordings"
ON public.zoom_call_recordings
FOR SELECT
USING (
  is_active_family_member(auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'moderator'::app_role)
);

-- Block anonymous access
CREATE POLICY "Block anonymous select recordings"
ON public.zoom_call_recordings
FOR SELECT
USING (false);

-- Admins can manage recordings
CREATE POLICY "Admins can manage recordings"
ON public.zoom_call_recordings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_zoom_call_recordings_updated_at
BEFORE UPDATE ON public.zoom_call_recordings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
