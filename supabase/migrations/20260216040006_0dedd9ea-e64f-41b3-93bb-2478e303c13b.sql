
-- Table for Family Coaching Intake Assessment data
CREATE TABLE public.coaching_intake_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Section 1: Family Identification
  primary_contact_name TEXT,
  relationship_to_loved_one TEXT,
  relationship_other TEXT,
  multiple_family_members BOOLEAN DEFAULT false,
  family_members_list TEXT,
  
  -- Section 2: Loved One Profile
  loved_one_age TEXT,
  substances TEXT[] DEFAULT '{}',
  substance_other TEXT,
  current_status TEXT,
  history_overdose TEXT,
  overdose_date TEXT,
  history_violence TEXT,
  history_suicidal TEXT,
  history_details TEXT,
  
  -- Section 3: Current Stability Level
  household_stress_level INTEGER,
  conflict_frequency INTEGER,
  feel_safe TEXT,
  
  -- Section 4: Enabling & Boundaries
  enabling_behaviors TEXT[] DEFAULT '{}',
  written_boundaries TEXT,
  decision_makers_aligned TEXT,
  
  -- Section 5: Family Emotional Health
  sleep_quality TEXT,
  anxiety_level TEXT,
  emotionally_exhausted TEXT,
  outside_support TEXT,
  
  -- Section 6: Financial Risk Factors
  financial_risks TEXT[] DEFAULT '{}',
  
  -- Section 7: Couple/Family Alignment
  unified_approach TEXT,
  arguments_strain TEXT,
  
  -- Section 8: Goals for Coaching
  coaching_goals TEXT[] DEFAULT '{}',
  coaching_goal_other TEXT,
  most_urgent TEXT,
  
  -- Section 9: Readiness for Change
  readiness_enforce_boundaries INTEGER,
  readiness_stop_rescuing INTEGER,
  confidence_change INTEGER,
  
  -- Section 10: Risk Screen
  risk_indicators TEXT[] DEFAULT '{}',
  
  -- Internal scoring
  assigned_phase TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coaching_intake_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_intake_assessments FORCE ROW LEVEL SECURITY;

-- Block anonymous access
CREATE POLICY "Block anon select intake" ON public.coaching_intake_assessments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon insert intake" ON public.coaching_intake_assessments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon update intake" ON public.coaching_intake_assessments FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon delete intake" ON public.coaching_intake_assessments FOR DELETE USING (auth.uid() IS NOT NULL);

-- Users can manage their own assessments
CREATE POLICY "Users can view own intake" ON public.coaching_intake_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own intake" ON public.coaching_intake_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own intake" ON public.coaching_intake_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own intake" ON public.coaching_intake_assessments FOR DELETE USING (auth.uid() = user_id);

-- Providers can view intake assessments of their clients
CREATE POLICY "Providers can view client intake" ON public.coaching_intake_assessments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM consultation_bookings cb
    JOIN consultation_providers cp ON cp.id = cb.provider_id
    WHERE cb.client_user_id = coaching_intake_assessments.user_id
      AND cp.user_id = auth.uid()
  )
);

-- Admins can view all
CREATE POLICY "Admins can view all intake" ON public.coaching_intake_assessments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_coaching_intake_assessments_updated_at
  BEFORE UPDATE ON public.coaching_intake_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
