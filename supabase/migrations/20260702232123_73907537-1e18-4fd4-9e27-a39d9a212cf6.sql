
ALTER TABLE public.provider_subscriptions
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancellation_reason text,
  ADD COLUMN IF NOT EXISTS paypal_cancel_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancellation_source text,
  ADD COLUMN IF NOT EXISTS access_ends_at timestamptz;
