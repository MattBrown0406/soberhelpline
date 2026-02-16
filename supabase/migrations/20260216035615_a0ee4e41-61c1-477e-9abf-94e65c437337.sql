
-- Table for Boundary Clarity Worksheet data
CREATE TABLE public.boundary_clarity_worksheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  values_list TEXT[] DEFAULT '{}',
  most_violated_value TEXT,
  problem_behavior TEXT,
  boundary_statement TEXT,
  boundary_clear BOOLEAN DEFAULT false,
  boundary_specific BOOLEAN DEFAULT false,
  boundary_about_me BOOLEAN DEFAULT false,
  boundary_enforceable BOOLEAN DEFAULT false,
  first_violation_response TEXT,
  second_violation_response TEXT,
  final_consequence TEXT,
  willing_to_follow_through TEXT,
  fears TEXT[] DEFAULT '{}',
  fear_other TEXT,
  fear_sentence TEXT,
  fear_emotional_or_factual TEXT,
  financial_aligns_values BOOLEAN,
  financial_removes_consequence BOOLEAN,
  financial_give_without_addiction BOOLEAN,
  financial_acting_from_fear BOOLEAN,
  unity_status TEXT,
  unity_resolution TEXT,
  communication_script TEXT,
  enforcement_stay_calm BOOLEAN DEFAULT false,
  enforcement_avoid_arguing BOOLEAN DEFAULT false,
  enforcement_repeat_once BOOLEAN DEFAULT false,
  enforcement_follow_through BOOLEAN DEFAULT false,
  enforcement_seek_support BOOLEAN DEFAULT false,
  self_reflection TEXT,
  coaching_phase TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.boundary_clarity_worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boundary_clarity_worksheets FORCE ROW LEVEL SECURITY;

-- Block anonymous access
CREATE POLICY "Block anon select" ON public.boundary_clarity_worksheets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon insert" ON public.boundary_clarity_worksheets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon update" ON public.boundary_clarity_worksheets FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon delete" ON public.boundary_clarity_worksheets FOR DELETE USING (auth.uid() IS NOT NULL);

-- Users can manage their own worksheets
CREATE POLICY "Users can view own worksheets" ON public.boundary_clarity_worksheets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own worksheets" ON public.boundary_clarity_worksheets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own worksheets" ON public.boundary_clarity_worksheets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own worksheets" ON public.boundary_clarity_worksheets FOR DELETE USING (auth.uid() = user_id);

-- Providers can view worksheets of clients who have booked with them
CREATE POLICY "Providers can view client worksheets" ON public.boundary_clarity_worksheets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM consultation_bookings cb
    JOIN consultation_providers cp ON cp.id = cb.provider_id
    WHERE cb.client_user_id = boundary_clarity_worksheets.user_id
      AND cp.user_id = auth.uid()
  )
);

-- Admins can view all
CREATE POLICY "Admins can view all worksheets" ON public.boundary_clarity_worksheets FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_boundary_clarity_worksheets_updated_at
  BEFORE UPDATE ON public.boundary_clarity_worksheets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
