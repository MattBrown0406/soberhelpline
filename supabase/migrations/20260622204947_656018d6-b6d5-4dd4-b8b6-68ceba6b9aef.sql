-- Allow anyone (anon + authenticated) to log conversion events.
-- Reads remain admin-only.
CREATE POLICY "Anyone can insert conversion events"
  ON public.conversion_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- promo_code_usage: explicit deny policies for client writes. All write
-- operations are funneled through the SECURITY DEFINER public.use_promo_code()
-- RPC, which runs with elevated privileges and is the only safe path.
CREATE POLICY "Block client inserts on promo_code_usage"
  ON public.promo_code_usage
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Block client updates on promo_code_usage"
  ON public.promo_code_usage
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Block client deletes on promo_code_usage"
  ON public.promo_code_usage
  FOR DELETE
  TO anon, authenticated
  USING (false);

COMMENT ON TABLE public.promo_code_usage IS
  'Write access is intentionally restricted to the SECURITY DEFINER public.use_promo_code() RPC. Client roles have no direct write privileges.';