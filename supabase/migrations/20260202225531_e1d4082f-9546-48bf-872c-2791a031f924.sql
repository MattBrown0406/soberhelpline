-- Enable FORCE ROW LEVEL SECURITY on provider_subscriptions
-- This ensures RLS is enforced even for table owners and superusers
-- preventing any bypass of payment data protection
ALTER TABLE public.provider_subscriptions FORCE ROW LEVEL SECURITY;

-- Add a comment documenting the security rationale
COMMENT ON TABLE public.provider_subscriptions IS 'Contains sensitive payment data (amounts, PayPal subscription IDs). FORCE RLS enabled to prevent any bypass. Access restricted to authenticated users for their own records or admins only.';