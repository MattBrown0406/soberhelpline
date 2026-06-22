-- =============================================================================
-- soberhelpline.com → Ecosystem Spine wiring
-- spine_outbox table + pg_cron drain schedule.
-- Edge functions (lead-magnet-signup, public-register-monday-zoom,
-- process-consultation-booking) write to this table directly.
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_outbox (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_name  text        NOT NULL,
  payload     jsonb       NOT NULL DEFAULT '{}',
  status      text        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'sent', 'failed')),
  attempts    int         NOT NULL DEFAULT 0,
  last_error  text,
  sent_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS spine_outbox_pending_idx ON spine_outbox (status, created_at)
  WHERE status IN ('pending', 'failed');

ALTER TABLE spine_outbox ENABLE ROW LEVEL SECURITY;
GRANT ALL ON spine_outbox TO service_role;

-- ─── Schedule drain every 5 minutes ──────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net  WITH SCHEMA extensions;

SELECT cron.schedule(
  'shl-web-drain-spine-outbox',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url     := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/drain-spine-outbox',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1
      )
    ),
    body    := jsonb_build_object('source', 'pg_cron', 'job', 'shl-web-drain-spine-outbox')
  );
  $$
);
