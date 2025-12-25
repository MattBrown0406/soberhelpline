-- First, drop the dependent functions
DROP FUNCTION IF EXISTS public.get_my_provider_subscriptions_with_provider();
DROP FUNCTION IF EXISTS public.get_provider_subscriptions_with_provider_admin();

-- Now drop the insecure view
DROP VIEW IF EXISTS public.provider_subscriptions_with_provider;

-- Create a composite type for the return value
CREATE TYPE public.provider_subscription_with_provider AS (
  id uuid,
  user_id uuid,
  provider_submission_id uuid,
  paypal_subscription_id text,
  plan_type text,
  status text,
  amount numeric,
  start_date timestamptz,
  next_billing_date timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  provider_name text
);

-- Recreate the user function with proper security
CREATE OR REPLACE FUNCTION public.get_my_provider_subscriptions_with_provider()
RETURNS SETOF public.provider_subscription_with_provider
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    s.id,
    s.user_id,
    s.provider_submission_id,
    s.paypal_subscription_id,
    s.plan_type,
    s.status,
    s.amount,
    s.start_date,
    s.next_billing_date,
    s.created_at,
    s.updated_at,
    p.provider_name
  FROM public.provider_subscriptions s
  LEFT JOIN public.provider_submissions p ON s.provider_submission_id = p.id
  WHERE auth.uid() IS NOT NULL
    AND s.user_id = auth.uid()
  ORDER BY s.created_at DESC;
$$;

-- Recreate the admin function with proper security
CREATE OR REPLACE FUNCTION public.get_provider_subscriptions_with_provider_admin()
RETURNS SETOF public.provider_subscription_with_provider
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    s.id,
    s.user_id,
    s.provider_submission_id,
    s.paypal_subscription_id,
    s.plan_type,
    s.status,
    s.amount,
    s.start_date,
    s.next_billing_date,
    s.created_at,
    s.updated_at,
    p.provider_name
  FROM public.provider_subscriptions s
  LEFT JOIN public.provider_submissions p ON s.provider_submission_id = p.id
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY s.created_at DESC;
$$;