
-- =========================================================
-- coaching_checkout_orders
-- =========================================================
CREATE TABLE public.coaching_checkout_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_nonce TEXT NOT NULL UNIQUE,
  app_booking_ref TEXT NOT NULL,
  app_account_ref TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 15000 CHECK (amount_cents = 15000),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
  service_type TEXT NOT NULL DEFAULT 'plan_review_coaching',
  paypal_order_id TEXT UNIQUE,
  paypal_capture_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','captured','failed','refunded','reversed','expired')),
  token_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coaching_orders_booking_ref ON public.coaching_checkout_orders(app_booking_ref);
CREATE INDEX idx_coaching_orders_status ON public.coaching_checkout_orders(status);

GRANT ALL ON public.coaching_checkout_orders TO service_role;

ALTER TABLE public.coaching_checkout_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_checkout_orders FORCE ROW LEVEL SECURITY;

-- No policies for anon/authenticated: table is edge-function-only via service_role.

CREATE TRIGGER coaching_checkout_orders_updated_at
  BEFORE UPDATE ON public.coaching_checkout_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- app_payment_bridge_outbox
-- =========================================================
CREATE TABLE public.app_payment_bridge_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  coaching_order_id UUID NOT NULL REFERENCES public.coaching_checkout_orders(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  last_error TEXT,
  last_response_status INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_app_payment_outbox_pending
  ON public.app_payment_bridge_outbox(next_attempt_at)
  WHERE delivered_at IS NULL;

GRANT ALL ON public.app_payment_bridge_outbox TO service_role;

ALTER TABLE public.app_payment_bridge_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_payment_bridge_outbox FORCE ROW LEVEL SECURITY;

CREATE TRIGGER app_payment_bridge_outbox_updated_at
  BEFORE UPDATE ON public.app_payment_bridge_outbox
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
