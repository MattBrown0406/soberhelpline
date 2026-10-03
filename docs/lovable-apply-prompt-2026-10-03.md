# Lovable apply prompt: function lockdown, membership syncs through the app, Monday call from the app (2026-10-03)

How to use: after the code for this change is on GitHub and Lovable has synced it,
paste everything in the "Prompt for Lovable" section below into Lovable as one
message. Lovable deploys edge-function code as soon as it syncs, before any SQL
runs. Every function in this change works against the current database, so that
order is safe.

What this change does:

1. **Locks down automation functions.** Mass-email and Zoom-changing functions
   could be triggered by anyone holding the website's public key. They now accept
   only:
   - a scheduled job sending the site's cron secret;
   - `FOLLOWUP_AUTOMATION_SECRET`;
   - the website's service role key;
   - a signed-in admin.

   Enforcement is **staged**. Until `site_settings.enforce_function_auth` is
   `'true'`, a call without credentials still runs and is logged as
   `automation_auth_unverified <function>`. The migration below adds the cron
   secret to the scheduled jobs that call these functions. The post-deploy
   checklist ends with turning enforcement on once the logs are clean.
2. **Locks down caller-chosen recipients and manual-only tools now (not
   staged).** These need credentials from the moment they deploy. No scheduled
   job calls them, so there is nothing to stage; left open, anyone with the
   public key could replace tonight's Zoom meeting, harvest registrant emails,
   mass-email, or send "payment declined" mail from matt@:
   - every call to `replace-tonight-zoom-meeting`, `send-zoom-comeback-outreach`,
     `send-family-squares-return`, `send-app-download-blast`,
     `send-price-increase-outreach`, `send-zoom-invitation-outreach`,
     `resend-zoom-links`, `send-payment-declined` and `send-cancellation-email`
     (no page or scheduled job calls them today; an admin's login, the
     automation secret or the service key still works);
   - every call to `send-apology-reregistration`;
   - `resend-zoom-links` with a `recipients` list;
   - `send-weekly-blog-digest` with `test_email`;
   - `send-zoom-invitation-outreach` with `ccEmail`;
   - `send-monthly-provider-analytics` with `testMode` + `testEmail`.
3. **Zoom host role.** `generate-zoom-signature` now signs host (role 1) only
   for admins and for the consultation provider whose booking owns that
   meeting. Before this, any signed-in user who opened `/join-meeting?...&role=1`
   joined as host. Everyone else now joins as an attendee.
4. **Membership syncs without the app's service-role key.** The two nightly syncs
   now use the app's own functions, with the shared `MEMBERSHIP_SYNC_SECRET`:
   - `sync-app-memberships` reads the app's `membership-export`;
   - `sync-website-to-app-entitlements` sends the website member list to the
     app's `membership-import`.

   Neither sync touches the app database directly any more. Afterwards the
   website no longer needs `MOBILE_SUPABASE_SERVICE_ROLE_KEY`.
5. **App RSVPs stay out of marketing and lead lists.** Monday-call RSVPs from the
   app arrive as registrations with `registration_source = 'app'` (W1's section).
   Those people never opted into email from the website, so every bulk or
   marketing sweep and every lead view skips them. Until W1's SQL allows `'app'`
   there are no such rows, so these filters change nothing before then.
6. **Monday call from the app** (W1's section, included by reference in step 2).

**Order: the app backend first, if you can.** The app's `membership-export` and
`membership-import` deploy with the app's backend release (currently held). Until
they are live, both nightly syncs stop with
`app_function_missing (404)` and change nothing: no grants and no revocations. One
side effect to watch: app subscribers' website access is kept alive by
`sync-app-memberships` refreshing `app_grace_until` (3 days). If the app functions
are still missing about 3 days after this deploys, app subscribers lose
website member pages. They get them back when they open a website link from
the app (app sign-in refreshes the grace) or when the sync works again. Step 0b
below shows whether the app functions are live.

---

## Prompt for Lovable

Please do these things in order and tell me the result of each.

### 0. Checks first (include the results in your reply)

**0a. Scheduled jobs that call edge functions.** This query is read-only and
doesn't print the job commands (some may contain pasted keys). For each job it
shows:
- whether the function is one of the locked-down ones;
- whether the command sends the cron secret, a secret header or an
  `Authorization` header;
- the role inside a pasted bearer token: `anon` is the public key and is **not**
  a credential; `service_role` is accepted.

```sql
select
  j.jobid,
  j.jobname,
  j.schedule,
  j.active,
  substring(j.command from '/functions/v1/([A-Za-z0-9_-]+)') as function_name,
  coalesce(substring(j.command from '/functions/v1/([A-Za-z0-9_-]+)') = any (array[
    'auto-create-monday-zoom', 'auto-register-zoom', 'replace-tonight-zoom-meeting',
    'resend-zoom-links', 'send-apology-reregistration', 'send-app-download-blast',
    'send-attendee-followup', 'send-cancellation-email', 'send-family-squares-return',
    'send-first-timer-followup', 'send-member-zoom-reminder',
    'send-monthly-provider-analytics', 'send-payment-declined',
    'send-price-increase-outreach', 'send-weekly-blog-digest',
    'send-zoom-comeback-outreach', 'send-zoom-invitation-outreach',
    'send-zoom-reengagement', 'send-zoom-starting-soon',
    'sync-app-memberships', 'sync-website-to-app-entitlements'
  ]), false) as locked_down,
  j.command ~* 'cron_secret' as sends_cron_secret,
  j.command ~* '(x-automation-secret|x-cron-secret)' as sends_secret_header,
  j.command ~* 'authorization' as sends_authorization,
  case when tok.payload is null then null else
    convert_from(decode(rpad(translate(tok.payload, '-_', '+/'),
                             ((length(tok.payload) + 3) / 4) * 4, '='), 'base64'),
                 'UTF8')::jsonb ->> 'role'
  end as bearer_token_role,
  j.command ~* 'net\.http_get' as uses_http_get
from cron.job j
left join lateral (
  select substring(j.command from 'Bearer\s+[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.') as payload
) tok on true
where j.command ilike '%/functions/v1/%'
order by locked_down desc, function_name, j.jobname;
```

If that query errors on the `bearer_token_role` column, run it again without
that column and say so.

These are the production jobs (as of 2026-10-03) that call a locked-down
function, so I expect `locked_down = true` for exactly these:

| Job | Schedule | Function |
| --- | --- | --- |
| `auto-create-monday-zoom-weekly` | `0 4 * * 2` | `auto-create-monday-zoom` |
| `auto-register-zoom-weekly` | `0 17 * * 2` | `auto-register-zoom` |
| `first-timer-followup-weekly-pdt` | `15 3 * * 2` | `send-first-timer-followup` |
| `first-timer-followup-weekly-pst` | `15 4 * * 2` | `send-first-timer-followup` |
| `monthly-provider-analytics-email` | `0 9 1 * *` | `send-monthly-provider-analytics` |
| `sync-app-memberships-nightly` | `0 10 * * *` | `sync-app-memberships` (already sends `cron_secret`) |
| `sync-website-to-app-entitlements-nightly` | `30 10 * * *` | `sync-website-to-app-entitlements` (already sends `cron_secret`) |
| `weekly-blog-digest-pt-a` | `0 15 * * 3` | `send-weekly-blog-digest` |
| `weekly-blog-digest-pt-b` | `0 16 * * 3` | `send-weekly-blog-digest` |
| `weekly-zoom-reengagement` | `0 15 * * 1` | `send-zoom-reengagement` |
| `zoom-starting-soon-pdt` | `0 1 * * 2` | `send-zoom-starting-soon` |
| `zoom-starting-soon-pst` | `0 2 * * 2` | `send-zoom-starting-soon` |

The other jobs call functions this change doesn't lock, so they need nothing
new:
- `deliver-app-payment-callback-every-minute`;
- `process-family-squares-followups-hourly`;
- `send-abandoned-booking-followup-hourly`;
- `send-family-squares-kiosk-followups`;
- the three `sync-zoom-attendance-*` jobs;
- `weekly-paypal-sync`;
- the two `weekly-zoom-report-*` jobs.

**0b. Are the app's membership functions live?** This posts an empty body
without any secret. A deployed function answers `401` and changes nothing; `404`
means it isn't deployed yet.

```sql
select net.http_post(
  url := 'https://rjlkbxqxshohgjmomyro.supabase.co/functions/v1/' || fn,
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := '{}'::jsonb
) as request_id, fn
from unnest(array['membership-export', 'membership-import']) as fn;
-- a few seconds later, with the two request ids from above:
select id, status_code from net._http_response where id in (<id1>, <id2>);
```

**0c. Current settings (no secret values):**

```sql
select key, value from public.site_settings where key = 'enforce_function_auth';
select exists (
  select 1 from public.site_settings where key = 'cron_secret' and length(value) > 0
) as cron_secret_is_set;
```

If `cron_secret_is_set` is false, **stop and tell me**. Otherwise continue with
step 1 without waiting.

### 1. Create and run this database migration (exactly as written, as one migration)

Idempotent: safe to run twice. It adds one setting and changes only the
commands of scheduled jobs that call a locked-down function without the cron
secret. No data rows change.

```sql
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
```

After the migration, **run the step 0a query again.** Every job with
`locked_down = true` should now show `sends_cron_secret = true`.

### 2. Edge functions

Redeploy these from the synced code. The shared file
`supabase/functions/_shared/automationAuth.ts` is new, so every function that
imports it must be deployed.

Automation functions that now need credentials. Enforcement is staged until
`enforce_function_auth = 'true'` for the scheduled ones; the manual-only
functions listed in principle 2 and the "now" paths are enforced at once. The ones
marked † also skip app RSVPs (`registration_source = 'app'`):

- `auto-create-monday-zoom`
- `auto-register-zoom`
- `replace-tonight-zoom-meeting`
- `resend-zoom-links` (a `recipients` list needs credentials now)
- `send-app-download-blast` †
- `send-cancellation-email`
- `send-family-squares-return` † (never copies app RSVPs into new registrations)
- `send-monthly-provider-analytics` (`testMode` + `testEmail` needs credentials now)
- `send-payment-declined` (also escapes the member's name in the email)
- `send-price-increase-outreach` †
- `send-weekly-blog-digest` † (`test_email` needs credentials now)
- `send-zoom-comeback-outreach` †
- `send-zoom-invitation-outreach` † (`ccEmail` needs credentials now)
- `send-zoom-reengagement` †
- `send-apology-reregistration`: always needs credentials now (the caller picks
  every recipient).

Other functions changed:

- `send-survey-emails` †: it selected a column the table doesn't have
  (`first_name`), so it never found anyone. It now uses `name`, escapes it, and
  refuses calls without an admin sign-in instead of skipping the check.
- `readiness-radar-family-squares-export` †: app RSVPs are not exported to the
  lead engine.
- `sober-helpline-revenue-report` †: the registration count leaves out app RSVPs.
- `generate-zoom-signature`: host (role 1) only for admins and the booking's
  consultation provider. Everyone else is signed as an attendee.
- `send-zoom-starting-soon`: also sends only in the 6 PM Pacific hour (its two
  cron jobs cover PDT and PST, so families no longer get the email twice);
  `{ "force": true }` overrides for a manual run.
- `send-zoom-reengagement`: also skips people the app already reminds.
- `readiness-radar-family-squares-export`: also strips questions asked in the
  app from the export.
- `process-consultation-booking`: provider payouts can only be triggered by an
  admin, the system, or that booking's own provider; only once the booking is
  completed; and only once per booking (a second request gets 409). The PayPal
  batch id is now per booking, so if PayPal received a payout whose reply was
  lost, a retry is refused instead of paying twice — check PayPal before
  retrying a payout marked failed. Before, any
  signed-in user could trigger a PayPal payout for any booking. Creating the
  Zoom meeting and emails is limited to the system, admins and the people on the
  booking.

Membership syncs (they keep their strict auth and now also accept
`FOLLOWUP_AUTOMATION_SECRET` and the service role key):

- `sync-app-memberships`: reads the app's `membership-export`.
- `sync-website-to-app-entitlements`: calls the app's `membership-import`.

**Also do every step of the "Prompt for Lovable (Monday call section)" in
`docs/lovable-section-monday-2026-10-03.md`:** its read-only check (A), its
migration (B), its edge functions (C), its secrets (D) and its report (E). Some
functions appear in both lists. Deploy each once, from the synced code.

### 3. Secrets: confirm each exists (don't print values)

- `MEMBERSHIP_SYNC_SECRET`: same value as in the Sober Helpline app project. Both
  nightly membership syncs now depend on it.
- `FOLLOWUP_AUTOMATION_SECRET`: accepted by every locked-down function (header
  `x-automation-secret` or `Authorization: Bearer`).
- `MOBILE_SUPABASE_URL`: optional, defaults to
  `https://rjlkbxqxshohgjmomyro.supabase.co`.
- `MOBILE_SUPABASE_SERVICE_ROLE_KEY`: no website code reads it any more. **Do not
  delete it in this step.** I will ask you to remove it after the post-deploy
  dry runs pass.

### 4. Tell me

- The results of step 0a (before the migration), 0b (the two status codes) and 0c.
- That the migration ran, any `cron job … left unchanged` notices it printed, and
  step 0a again after the migration. List every job with `locked_down = true` and
  `sends_cron_secret = false`.
- The current value of `enforce_function_auth` (expected `false`).
- The list of functions you deployed (this prompt and the Monday section).
- Which secrets from step 3 were missing, if any.
- Everything the Monday section's step E asks for.

---

## Post-deploy checklist (Matt)

1. **Publish the frontend in Lovable.** This ships:
   - the Monday section's frontend changes;
   - the lead views (Lead Pipeline, Revenue Command Center), which no longer
     count app RSVPs as leads;
   - the admin "App Subscription Sync" panel, which now shows *why* a run
     failed (for example "The app's membership-export function is not
     deployed yet").

2. **App functions live?** In step 0b, `401` for both means deployed. If you see
   `404`, release the app backend: its `membership-export` and
   `membership-import`. Until then, both syncs stop every night with
   `app_function_missing` and change nothing. See the 3-day note at the top.

3. **Dry-run both membership syncs.** Ask Lovable to run this. It calls each
   sync with the cron secret in dry-run mode and changes nothing:

   ```sql
   select net.http_post(
     url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/' || fn,
     headers := '{"Content-Type": "application/json"}'::jsonb,
     body := jsonb_build_object(
       'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
       'dry_run', true),
     timeout_milliseconds := 150000
   ) as request_id, fn
   from unnest(array['sync-app-memberships', 'sync-website-to-app-entitlements']) as fn;
   -- a minute later, using the two request ids from above:
   select id, status_code, content from net._http_response where id in (<id1>, <id2>);
   ```

   - **`sync-app-memberships`** should return `"ok": true` with:
     - `app_accounts`: app subscribers the app exported;
     - `granted` and `refreshed`;
     - `pending_invites`: app subscribers with no website account yet;
     - `revoke_candidates`;
     - `revocation_blocked`.
   - **`sync-website-to-app-entitlements`** should return `"ok": true` with:
     - `website_members`;
     - `matched_app_accounts`;
     - `no_app_account`;
     - `granted`, `refreshed` and `revoked` (what the app would do);
     - `revocation_blocked`.
   - **Errors:**
     - `app_function_missing`: the app functions aren't deployed (step 2).
     - `app_unauthorized`: `MEMBERSHIP_SYNC_SECRET` differs between the two
       projects.
     - `app_bad_response`: the app's reply didn't match the contract. Nothing
       was changed; send me the `details`.
   - **`revocation_blocked: true`:** the mass-revocation guard stopped it. Check
     the dry run, then run that sync once more the same way with
     `'allow_mass_revoke', true` in place of `'dry_run', true`.

4. **Remove `MOBILE_SUPABASE_SERVICE_ROLE_KEY`** from the website project's
   secrets, after both dry runs return `"ok": true`. The two syncs were its last
   readers. That key gave full access to the app database and was stored outside
   the app project. Consider rotating the app's service role key afterwards. That
   is an app-project change: update every place that uses it first.

5. **Watch the logs for a week, including a Monday and a Wednesday.** The
   Monday-night and Tuesday jobs run on UTC Tuesday; the blog digest runs on
   Wednesday. In Supabase → Edge Functions → Logs, search for
   `automation_auth_unverified`. Each line names a function that was called
   **without** credentials; once enforcement is on, that caller would get `401`.
   After the migration, the scheduled jobs in the step 0a table should not
   appear. `monthly-provider-analytics-email` only runs on the 1st, so for that
   job rely on step 0a (`sends_cron_secret = true`) rather than the logs. For
   each name you do see:
   - **A scheduled job the migration left unchanged** (step 4's list): add the
     cron secret by hand, using the pattern below.
   - **Something you run by hand** (Lovable, curl, a script): send the
     service role key as `Authorization: Bearer …`, or `x-automation-secret:
     <FOLLOWUP_AUTOMATION_SECRET>`, or call it as a signed-in admin.
   - **Nothing you recognise:** that is exactly what enforcement blocks. Leave it.

   Also look for `send-apology-reregistration: unauthorized call refused` and
   `401`s on the "now" paths in step 2. Those were refused immediately.

   **Adding the cron secret to a job by hand** (only for a job the migration
   left unchanged). Re-scheduling a job under its existing name replaces its
   command. Keep the name, schedule, URL and any existing body fields:

   ```sql
   -- 1. See the job (check the command holds no pasted key before sharing it).
   select jobid, jobname, schedule, command from cron.job where jobname = '<job name>';

   -- 2. Re-create it with the same name and schedule, adding cron_secret to the body.
   select cron.schedule(
     '<job name>',
     '<same schedule, e.g. 0 15 * * 1>',
     $cmd$
     select net.http_post(
       url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/<function name>',
       headers := '{"Content-Type": "application/json"}'::jsonb,
       body := jsonb_build_object(
                 'cron_secret', (select value from public.site_settings where key = 'cron_secret'))
               || '<the job''s existing body, or {}>'::jsonb
     ) as request_id;
     $cmd$
   );
   ```

   If the job uses `net.http_get` (no body), send the secret as a header instead:
   `headers := jsonb_build_object('Content-Type', 'application/json',
   'x-cron-secret', (select value from public.site_settings where key = 'cron_secret'))`.
   Every locked-down function accepts either form. Run step 0a again afterwards.

6. **Turn enforcement on** once a full week of logs shows no
   `automation_auth_unverified` lines you haven't fixed:

   ```sql
   INSERT INTO public.site_settings (key, value, is_public)
   VALUES ('enforce_function_auth', 'true', false)
   ON CONFLICT (key) DO UPDATE SET value = 'true', updated_at = now();
   ```

   It takes effect on the next call (no deploy). **Quick test (harmless):** a
   call to `send-weekly-blog-digest` with `{"dry_run": true}` and no credentials
   should now get `401`. With the cron secret in the body, it should return a
   dry-run summary (or `"skipped": true`), and no email is sent either way.

   **Roll back** (if a legitimate job starts failing with 401):

   ```sql
   UPDATE public.site_settings
   SET value = 'false', updated_at = now()
   WHERE key = 'enforce_function_auth';
   ```

   Calls without credentials run again (logged) from the next call on. Fix the
   job (step 5), then turn enforcement back on.

7. **Zoom host check.**
   - Signed in as an admin, open
     `/join-meeting?mn=<Monday meeting id>&pwd=<passcode>&role=1`. You join with
     host controls.
   - A consultation provider's "Join Session (In-Browser)" link on the provider
     dashboard still hosts that provider's own session.
   - Any other signed-in account using `role=1` joins as an attendee.
   - If someone else co-hosts the Monday call through the website, either give
     them the admin role or make them co-host from inside Zoom.

8. **Manual tools that now need credentials.** Run these from Lovable (service
   role) or with one of the secrets, not with the public key:
   - `replace-tonight-zoom-meeting`;
   - the one-off campaigns: `send-app-download-blast`,
     `send-price-increase-outreach`, `send-family-squares-return`,
     `send-apology-reregistration`;
   - test sends: blog digest `test_email`, provider analytics `testEmail`.

   The admin panels keep working for admins: "Run sync now" (App Subscription
   Sync) and "Send survey" (Surveys).
