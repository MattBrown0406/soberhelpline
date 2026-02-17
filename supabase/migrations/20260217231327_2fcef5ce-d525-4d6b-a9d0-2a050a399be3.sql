
-- Table for date-specific availability overrides
CREATE TABLE public.provider_date_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.consultation_providers(id) ON DELETE CASCADE,
  override_date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  start_time TIME WITHOUT TIME ZONE,
  end_time TIME WITHOUT TIME ZONE,
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, override_date, start_time)
);

-- Enable RLS
ALTER TABLE public.provider_date_overrides ENABLE ROW LEVEL SECURITY;

-- Block anonymous access
CREATE POLICY "Block anon select date overrides" ON public.provider_date_overrides FOR SELECT USING (false);
CREATE POLICY "Block anon insert date overrides" ON public.provider_date_overrides FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anon update date overrides" ON public.provider_date_overrides FOR UPDATE USING (false);
CREATE POLICY "Block anon delete date overrides" ON public.provider_date_overrides FOR DELETE USING (false);

-- Providers manage their own overrides
CREATE POLICY "Providers manage own date overrides" ON public.provider_date_overrides FOR ALL
  USING (EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_date_overrides.provider_id AND cp.user_id = auth.uid()));

-- Admins manage all overrides
CREATE POLICY "Admins manage date overrides" ON public.provider_date_overrides FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active provider overrides (for booking page)
CREATE POLICY "View active provider date overrides" ON public.provider_date_overrides FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM consultation_providers cp WHERE cp.id = provider_date_overrides.provider_id AND cp.status = 'active'));

-- Trigger for updated_at
CREATE TRIGGER update_provider_date_overrides_updated_at
  BEFORE UPDATE ON public.provider_date_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
