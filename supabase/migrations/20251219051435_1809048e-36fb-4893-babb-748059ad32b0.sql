-- Create table for control worksheet responses
CREATE TABLE public.family_control_worksheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  part1_stress TEXT,
  part1_managing TEXT,
  part1_wellbeing TEXT,
  part2_examples JSONB,
  part2_reflection_hardest TEXT,
  part2_reflection_cost TEXT,
  part3_examples JSONB,
  part3_reflection TEXT,
  part4_shifts JSONB,
  part5_stop_doing TEXT,
  part5_start_doing TEXT,
  part5_boundary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.family_control_worksheets ENABLE ROW LEVEL SECURITY;

-- Users can view their own worksheets
CREATE POLICY "Users can view their own worksheets"
ON public.family_control_worksheets
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own worksheets
CREATE POLICY "Users can insert their own worksheets"
ON public.family_control_worksheets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_family_control_worksheets_user_id ON public.family_control_worksheets(user_id);
CREATE INDEX idx_family_control_worksheets_created_at ON public.family_control_worksheets(created_at DESC);