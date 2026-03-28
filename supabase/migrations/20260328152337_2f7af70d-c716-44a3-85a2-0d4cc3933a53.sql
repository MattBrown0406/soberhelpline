
CREATE TABLE public.pending_consultation_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paypal_order_id text,
  booking_payload jsonb NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pending_consultation_orders ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON TABLE public.pending_consultation_orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.pending_consultation_orders TO anon;
