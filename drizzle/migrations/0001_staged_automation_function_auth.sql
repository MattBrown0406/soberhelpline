-- =====================================================================
-- Sober Helpline website: staged auth for automation functions. 2026-10-03.
-- Idempotent (safe to run twice). Run as ONE migration.
-- =====================================================================

-- 1. The switch the edge functions read (supabase/functions/_shared/automationAuth.ts).
--    'false' = calls without credentials still run but are logged as
--    "automation_auth_unverified <function>"; 'true' = they get 401.
--    Never overwrites an existing value.
INSERT INTO public.site_settings (key, value, is_public)
VALUES ('enforce_function_auth', 'false', false)
ON CONFLICT (key) DO NOTHING;

-- 2. Scheduled jobs that call a locked-down function without the cron secret:
--    add it to the job's JSON body. Only the command changes. Name, schedule,
--    URL, headers and every other body field stay as they are; the new body is
--    the cron secret merged with the old body (old keys keep their values).
--    The secret is read from site_settings when the job runs, never pasted
--    into the job (same pattern as sync-website-to-app-entitlements-nightly).
--    Each rewritten command is first checked with EXPLAIN, which parses and
--    plans it without running it (nothing is sent). A job whose command can't
--    be rewritten safely is left unchanged and reported by a NOTICE and by the
--    follow-up check: no named body argument (positional call), net.http_get,
--    or a failed check.
DO $$
DECLARE
  j record;
  new_command text;
BEGIN
  FOR j IN
    SELECT jobid, jobname, command
    FROM cron.job
    WHERE command !~* 'cron_secret'
      AND command ~* 'net\.http_post'
      AND command ~* '\mbody\s*(:=|=>)'
      AND substring(command from '/functions/v1/([A-Za-z0-9_-]+)') = ANY (ARRAY[
        'auto-create-monday-zoom', 'auto-register-zoom', 'replace-tonight-zoom-meeting',
        'resend-zoom-links', 'send-apology-reregistration', 'send-app-download-blast',
        'send-attendee-followup', 'send-cancellation-email', 'send-family-squares-return',
        'send-first-timer-followup', 'send-member-zoom-reminder',
        'send-monthly-provider-analytics', 'send-payment-declined',
        'send-price-increase-outreach', 'send-weekly-blog-digest',
        'send-zoom-comeback-outreach', 'send-zoom-invitation-outreach',
        'send-zoom-reengagement', 'send-zoom-starting-soon',
        'sync-app-memberships', 'sync-website-to-app-entitlements'
      ])
  LOOP
    new_command := regexp_replace(
      j.command,
      '(\mbody\s*(:=|=>)\s*)',
      '\1jsonb_build_object(''cron_secret'', (select value from public.site_settings where key = ''cron_secret'')) || ',
      'i');
    BEGIN
      EXECUTE 'EXPLAIN ' || rtrim(new_command, E'; \n\r\t');
      PERFORM cron.alter_job(j.jobid, command := new_command);
      RAISE NOTICE 'cron job % now sends cron_secret', j.jobname;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'cron job % left unchanged (%)', j.jobname, SQLERRM;
    END;
  END LOOP;
END $$;