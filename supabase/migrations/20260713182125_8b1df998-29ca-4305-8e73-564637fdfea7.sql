
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Unschedule any pre-existing job with the same name (idempotent rerun).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'deliver-app-payment-callback-every-minute') THEN
    PERFORM cron.unschedule('deliver-app-payment-callback-every-minute');
  END IF;
END $$;

SELECT cron.schedule(
  'deliver-app-payment-callback-every-minute',
  '* * * * *',
  $$
  SELECT net.http_post(
    url     := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/deliver-app-payment-callback',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1
      )
    ),
    body    := jsonb_build_object('source', 'pg_cron', 'job', 'deliver-app-payment-callback-every-minute')
  );
  $$
);
