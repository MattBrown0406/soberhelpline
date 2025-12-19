-- Create table for family self-assessment results
CREATE TABLE public.family_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section1_score INTEGER NOT NULL DEFAULT 0,
  section2_score INTEGER NOT NULL DEFAULT 0,
  section3_score INTEGER NOT NULL DEFAULT 0,
  section4_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  reflection_answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.family_assessments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assessments
CREATE POLICY "Users can view their own assessments"
ON public.family_assessments
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own assessments
CREATE POLICY "Users can insert their own assessments"
ON public.family_assessments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_family_assessments_user_id ON public.family_assessments(user_id);
CREATE INDEX idx_family_assessments_created_at ON public.family_assessments(created_at DESC);