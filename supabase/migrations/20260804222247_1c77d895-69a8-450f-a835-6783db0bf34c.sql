ALTER TABLE public.provider_subscriptions DROP CONSTRAINT IF EXISTS provider_subscriptions_status_check;
ALTER TABLE public.provider_subscriptions ADD CONSTRAINT provider_subscriptions_status_check
  CHECK (status = ANY (ARRAY['pending'::text, 'active'::text, 'cancelled'::text, 'expired'::text, 'suspended'::text]));