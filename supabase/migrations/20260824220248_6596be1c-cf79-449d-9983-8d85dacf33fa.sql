select cron.unschedule('sync-website-to-app-entitlements-nightly') where exists (select 1 from cron.job where jobname = 'sync-website-to-app-entitlements-nightly');

select cron.schedule(
  'sync-website-to-app-entitlements-nightly',
  '30 10 * * *',
  $$
  select net.http_post(
    url:='https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/sync-website-to-app-entitlements',
    headers:='{"Content-Type": "application/json"}'::jsonb,
    body:=jsonb_build_object('cron_secret', (select value from public.site_settings where key = 'cron_secret'))
  ) as request_id;
  $$
);