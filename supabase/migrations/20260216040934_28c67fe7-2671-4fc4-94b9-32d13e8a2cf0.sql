
-- Table for Enabling Behavior Audit
CREATE TABLE public.enabling_behavior_audits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_score integer NOT NULL DEFAULT 0,
  risk_level text,
  financial_score integer DEFAULT 0,
  consequence_score integer DEFAULT 0,
  emotional_score integer DEFAULT 0,
  control_score integer DEFAULT 0,
  self_neglect_score integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.enabling_behavior_audits ENABLE ROW LEVEL SECURITY;

-- Block anon
CREATE POLICY "Block anon select audits" ON public.enabling_behavior_audits FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon insert audits" ON public.enabling_behavior_audits FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon update audits" ON public.enabling_behavior_audits FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon delete audits" ON public.enabling_behavior_audits FOR DELETE USING (auth.uid() IS NOT NULL);

-- User CRUD
CREATE POLICY "Users can view own audits" ON public.enabling_behavior_audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audits" ON public.enabling_behavior_audits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own audits" ON public.enabling_behavior_audits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own audits" ON public.enabling_behavior_audits FOR DELETE USING (auth.uid() = user_id);

-- Admin access
CREATE POLICY "Admins can view all audits" ON public.enabling_behavior_audits FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Provider access
CREATE POLICY "Providers can view client audits" ON public.enabling_behavior_audits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM consultation_bookings cb
    JOIN consultation_providers cp ON cp.id = cb.provider_id
    WHERE cb.client_user_id = enabling_behavior_audits.user_id AND cp.user_id = auth.uid()
  ));

CREATE TRIGGER update_enabling_behavior_audits_updated_at
  BEFORE UPDATE ON public.enabling_behavior_audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table for Family Readiness Assessment
CREATE TABLE public.family_readiness_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_score integer NOT NULL DEFAULT 0,
  phase text,
  boundary_score integer DEFAULT 0,
  enabling_score integer DEFAULT 0,
  emotional_score integer DEFAULT 0,
  alignment_score integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.family_readiness_assessments ENABLE ROW LEVEL SECURITY;

-- Block anon
CREATE POLICY "Block anon select readiness" ON public.family_readiness_assessments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon insert readiness" ON public.family_readiness_assessments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon update readiness" ON public.family_readiness_assessments FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Block anon delete readiness" ON public.family_readiness_assessments FOR DELETE USING (auth.uid() IS NOT NULL);

-- User CRUD
CREATE POLICY "Users can view own readiness" ON public.family_readiness_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own readiness" ON public.family_readiness_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own readiness" ON public.family_readiness_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own readiness" ON public.family_readiness_assessments FOR DELETE USING (auth.uid() = user_id);

-- Admin access
CREATE POLICY "Admins can view all readiness" ON public.family_readiness_assessments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Provider access
CREATE POLICY "Providers can view client readiness" ON public.family_readiness_assessments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM consultation_bookings cb
    JOIN consultation_providers cp ON cp.id = cb.provider_id
    WHERE cb.client_user_id = family_readiness_assessments.user_id AND cp.user_id = auth.uid()
  ));

CREATE TRIGGER update_family_readiness_assessments_updated_at
  BEFORE UPDATE ON public.family_readiness_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
