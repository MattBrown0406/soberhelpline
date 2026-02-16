
-- Create coaching plans table to track multi-session plans
CREATE TABLE public.coaching_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL,
  provider_id UUID NOT NULL REFERENCES public.consultation_providers(id),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('emergency', 'stabilization')),
  total_sessions INTEGER NOT NULL DEFAULT 1,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  provider_payout_per_session NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coaching_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Block anon select coaching_plans" ON public.coaching_plans FOR SELECT USING (false);
CREATE POLICY "Block anon insert coaching_plans" ON public.coaching_plans FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anon update coaching_plans" ON public.coaching_plans FOR UPDATE USING (false);
CREATE POLICY "Block anon delete coaching_plans" ON public.coaching_plans FOR DELETE USING (false);

CREATE POLICY "Clients view own plans" ON public.coaching_plans FOR SELECT
  USING (auth.uid() = client_user_id);

CREATE POLICY "Clients create own plans" ON public.coaching_plans FOR INSERT
  WITH CHECK (auth.uid() = client_user_id);

CREATE POLICY "Providers view their plans" ON public.coaching_plans FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM consultation_providers cp
    WHERE cp.id = coaching_plans.provider_id AND cp.user_id = auth.uid()
  ));

CREATE POLICY "Admins manage plans" ON public.coaching_plans FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Providers update their plans" ON public.coaching_plans FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM consultation_providers cp
    WHERE cp.id = coaching_plans.provider_id AND cp.user_id = auth.uid()
  ));

-- Link bookings to plans
ALTER TABLE public.consultation_bookings ADD COLUMN coaching_plan_id UUID REFERENCES public.coaching_plans(id);

-- Trigger for updated_at
CREATE TRIGGER update_coaching_plans_updated_at
  BEFORE UPDATE ON public.coaching_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
