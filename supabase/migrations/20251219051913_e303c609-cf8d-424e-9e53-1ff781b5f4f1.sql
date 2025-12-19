-- Create table for boundary worksheet responses
CREATE TABLE public.family_boundary_worksheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mindset_difficulties TEXT[],
  mindset_other TEXT,
  mindset_emotion TEXT,
  mindset_past_limits TEXT,
  problem_behavior TEXT,
  problem_frequency TEXT,
  impact_emotional TEXT,
  impact_safety TEXT,
  impact_finances TEXT,
  impact_family TEXT,
  boundary_statement TEXT,
  consequence_willing BOOLEAN,
  consequence_about_me BOOLEAN,
  consequence_consistent BOOLEAN,
  revised_boundary TEXT,
  pushback_responses TEXT[],
  pushback_fears TEXT,
  calm_response TEXT,
  support_person TEXT,
  support_methods TEXT[],
  warning_signs TEXT,
  signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.family_boundary_worksheets ENABLE ROW LEVEL SECURITY;

-- Users can view their own worksheets
CREATE POLICY "Users can view their own boundary worksheets"
ON public.family_boundary_worksheets
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own worksheets
CREATE POLICY "Users can insert their own boundary worksheets"
ON public.family_boundary_worksheets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_family_boundary_worksheets_user_id ON public.family_boundary_worksheets(user_id);
CREATE INDEX idx_family_boundary_worksheets_created_at ON public.family_boundary_worksheets(created_at DESC);