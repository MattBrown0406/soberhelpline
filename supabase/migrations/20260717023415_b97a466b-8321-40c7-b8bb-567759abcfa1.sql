-- Unschedule the recurring drain job (safe if already gone)
DO $$
BEGIN
  PERFORM cron.unschedule('shl-web-drain-spine-outbox');
EXCEPTION WHEN OTHERS THEN
  -- job may not exist; ignore
  NULL;
END $$;

-- Drop the retired outbox table
DROP TABLE IF EXISTS public.spine_outbox;