-- worksheet_responses
CREATE TABLE public.worksheet_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worksheet_key TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, worksheet_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.worksheet_responses TO authenticated;
GRANT ALL ON public.worksheet_responses TO service_role;

ALTER TABLE public.worksheet_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own worksheet responses"
ON public.worksheet_responses
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_worksheet_responses_updated_at
BEFORE UPDATE ON public.worksheet_responses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- zoom_call_recordings: add missing columns
ALTER TABLE public.zoom_call_recordings
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS show_notes TEXT,
  ADD COLUMN IF NOT EXISTS key_timestamps JSONB NOT NULL DEFAULT '[]'::jsonb;