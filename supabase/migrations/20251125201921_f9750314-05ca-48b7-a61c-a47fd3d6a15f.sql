-- Create table for tracking provider subscriptions
CREATE TABLE public.provider_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_submission_id UUID REFERENCES public.provider_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  paypal_subscription_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'annual')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
  amount DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.provider_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.provider_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions"
ON public.provider_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update their own subscriptions"
ON public.provider_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.provider_subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all subscriptions
CREATE POLICY "Admins can update all subscriptions"
ON public.provider_subscriptions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_provider_subscriptions_updated_at
BEFORE UPDATE ON public.provider_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_provider_subscriptions_user_id ON public.provider_subscriptions(user_id);
CREATE INDEX idx_provider_subscriptions_paypal_id ON public.provider_subscriptions(paypal_subscription_id);