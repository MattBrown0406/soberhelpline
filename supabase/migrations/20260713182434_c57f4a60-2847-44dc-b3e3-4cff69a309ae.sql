
ALTER TABLE public.app_payment_bridge_outbox
  ADD COLUMN IF NOT EXISTS leased_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lease_id UUID;

CREATE INDEX IF NOT EXISTS idx_app_payment_outbox_claimable
  ON public.app_payment_bridge_outbox(next_attempt_at)
  WHERE delivered_at IS NULL;

-- Atomically lease a batch of pending rows.
CREATE OR REPLACE FUNCTION public.claim_app_payment_outbox_batch(
  p_batch_size INTEGER DEFAULT 25,
  p_lease_seconds INTEGER DEFAULT 120
)
RETURNS TABLE(
  id UUID,
  event_id TEXT,
  payload JSONB,
  attempt_count INTEGER,
  lease_id UUID,
  leased_until TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lease UUID := gen_random_uuid();
  v_until TIMESTAMPTZ := now() + make_interval(secs => GREATEST(30, p_lease_seconds));
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT o.id
    FROM public.app_payment_bridge_outbox o
    WHERE o.delivered_at IS NULL
      AND o.next_attempt_at <= now()
      AND (o.leased_until IS NULL OR o.leased_until <= now())
    ORDER BY o.created_at ASC
    LIMIT GREATEST(1, p_batch_size)
    FOR UPDATE SKIP LOCKED
  ),
  claimed AS (
    UPDATE public.app_payment_bridge_outbox o
       SET leased_until = v_until,
           lease_id     = v_lease,
           updated_at   = now()
      FROM candidates c
     WHERE o.id = c.id
     RETURNING o.id, o.event_id, o.payload, o.attempt_count
  )
  SELECT c.id, c.event_id, c.payload, c.attempt_count, v_lease, v_until
    FROM claimed c;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_app_payment_outbox_batch(INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_app_payment_outbox_batch(INTEGER, INTEGER) TO service_role;

-- Release a lease with delivery outcome, only if still lease-owned.
CREATE OR REPLACE FUNCTION public.release_app_payment_outbox_lease(
  p_lease_id UUID,
  p_id UUID,
  p_delivered BOOLEAN,
  p_attempt_count INTEGER,
  p_next_attempt_at TIMESTAMPTZ,
  p_last_error TEXT,
  p_last_response_status INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows INTEGER;
BEGIN
  IF p_delivered THEN
    UPDATE public.app_payment_bridge_outbox
       SET delivered_at         = now(),
           attempt_count        = p_attempt_count,
           last_response_status = p_last_response_status,
           last_error           = NULL,
           leased_until         = NULL,
           lease_id             = NULL,
           updated_at           = now()
     WHERE id = p_id
       AND lease_id = p_lease_id
       AND delivered_at IS NULL;
  ELSE
    UPDATE public.app_payment_bridge_outbox
       SET attempt_count        = p_attempt_count,
           next_attempt_at      = p_next_attempt_at,
           last_response_status = p_last_response_status,
           last_error           = p_last_error,
           leased_until         = NULL,
           lease_id             = NULL,
           updated_at           = now()
     WHERE id = p_id
       AND lease_id = p_lease_id
       AND delivered_at IS NULL;
  END IF;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.release_app_payment_outbox_lease(UUID, UUID, BOOLEAN, INTEGER, TIMESTAMPTZ, TEXT, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_app_payment_outbox_lease(UUID, UUID, BOOLEAN, INTEGER, TIMESTAMPTZ, TEXT, INTEGER) TO service_role;
