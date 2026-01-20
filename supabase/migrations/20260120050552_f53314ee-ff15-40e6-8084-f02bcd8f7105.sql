-- Create table to track promo code usage limits
CREATE TABLE public.promo_code_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  max_uses INTEGER NOT NULL DEFAULT 25,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read promo code usage (for displaying remaining count)
CREATE POLICY "Anyone can view promo code usage"
ON public.promo_code_usage
FOR SELECT
USING (true);

-- Only service role can update (will be done via edge function)
-- No INSERT/UPDATE/DELETE policies for regular users

-- Insert the FREE6 promo code with 25 uses
INSERT INTO public.promo_code_usage (code, max_uses, current_uses, is_active)
VALUES ('FAMILY6', 25, 0, true);

-- Create function to increment usage and check availability
CREATE OR REPLACE FUNCTION public.use_promo_code(promo_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  promo_record RECORD;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT * INTO promo_record
  FROM promo_code_usage
  WHERE code = UPPER(promo_code)
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid promo code');
  END IF;
  
  IF NOT promo_record.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'Promo code is no longer active');
  END IF;
  
  IF promo_record.current_uses >= promo_record.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'Promo code limit reached');
  END IF;
  
  -- Increment the usage count
  UPDATE promo_code_usage
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE code = UPPER(promo_code);
  
  RETURN jsonb_build_object(
    'success', true,
    'remaining', promo_record.max_uses - promo_record.current_uses - 1
  );
END;
$$;

-- Create function to get remaining uses (public access)
CREATE OR REPLACE FUNCTION public.get_promo_remaining(promo_code TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT GREATEST(0, max_uses - current_uses)
  FROM promo_code_usage
  WHERE code = UPPER(promo_code) AND is_active = true;
$$;