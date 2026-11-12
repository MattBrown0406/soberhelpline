INSTALL TEXT REMINDERS FOR THE MONDAY MEETING. THEY STAY SWITCHED OFF. Read all of this before doing anything.

Background: main now has text-message reminders for Family Squares. After registering, a person can enter a mobile number and tick an unticked consent box on the thank-you screen. An hour before each Monday meeting they are registered for, they get one text with the join link.

This prompt installs it and leaves it OFF. Nothing is shown to visitors and no text can be sent until the owner switches it on with a separate, later prompt. While it is off:
- the thank-you screen does not show the text-reminder box
- `family-squares-sms-optin` refuses every request
- `send-family-squares-sms-reminders` answers `{"switched_off":true}`

DO NOT TOUCH
- Monday night registration: public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, monday_notification_private. The table zoom_meeting_registrations is not altered (the new tables only refer to it).
- Any job, schedule, function, table, setting or secret not named in a step below.
- Do NOT create the setting `family_squares_sms_enabled`. Leaving it absent is what keeps texting off.
- No manual invocations of any function. Never print a secret value, a job command or a header. Counts only: no names, no email addresses, no phone numbers.

STEP 0. Check
On the synced main branch all of these must exist. If any is missing, STOP and tell me main is not synced.
- `supabase/migrations/20261113090000_family_squares_sms_reminders.sql`
- `supabase/functions/family-squares-sms-optin/index.ts`
- `supabase/functions/send-family-squares-sms-reminders/index.ts`
- `supabase/functions/_shared/twilioSms.ts`
- in `supabase/config.toml`: `[functions.family-squares-sms-optin]` and `[functions.send-family-squares-sms-reminders]`, each with `verify_jwt = false`

Also confirm this returns no row (texting must not already be on):

```sql
SELECT key, value FROM public.site_settings WHERE key = 'family_squares_sms_enabled';
```

STEP 1. Apply one migration
Apply `supabase/migrations/20261113090000_family_squares_sms_reminders.sql` exactly as written. It creates two new tables, `family_squares_sms_optins` and `family_squares_sms_log`, turns on row level security for both with no policies, and grants access to the service role only. It changes no existing table.

Then check:

```sql
SELECT c.relname AS table_name, c.relrowsecurity AS rls_on,
       (SELECT count(*) FROM pg_policies p WHERE p.schemaname = 'public' AND p.tablename = c.relname) AS policies,
       has_table_privilege('anon', c.oid, 'SELECT') AS anon_can_read,
       has_table_privilege('authenticated', c.oid, 'SELECT') AS signed_in_can_read
FROM pg_class c
WHERE c.relnamespace = 'public'::regnamespace
  AND c.relname IN ('family_squares_sms_optins', 'family_squares_sms_log');
```

Expected for both tables: `rls_on` true, `policies` 0, `anon_can_read` false, `signed_in_can_read` false. If not, STOP and report.

STEP 2. Three function secrets
Ask me for these three secrets through your secure secret form. Do not ask me to paste them into chat, and never print them:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_MESSAGING_SERVICE_SID`

If I skip this for now, carry on: the functions do nothing without them.

STEP 3. Deploy
Deploy only these three functions, unchanged from main:
- family-squares-sms-optin (new)
- send-family-squares-sms-reminders (new)
- track-conversion-event

STEP 4. Create one managed HTTP schedule
POST with the JSON body `{"source":"cron"}` to send-family-squares-sms-reminders, schedule `5 1,2 * * 2` (UTC: two runs on Monday evening Pacific; the function only acts in the 6 PM Pacific hour). While texting is off every run answers `{"switched_off":true}`.

STEP 5. Publish
Publish the frontend.

STEP 6. Final checks (read-only, no invocations)

```sql
SELECT (SELECT count(*) FROM public.family_squares_sms_optins) AS optins,
       (SELECT count(*) FROM public.family_squares_sms_log) AS texts_logged,
       (SELECT count(*) FROM public.site_settings WHERE key = 'family_squares_sms_enabled') AS switch_rows;
```

All three must be 0.

REPORT
Say plainly: whether the migration applied, the table from step 1, which secrets now exist (names only), which functions were deployed, whether the schedule is enabled, whether the frontend was published, and that texting is still off.

TO UNDO: disable the new schedule. The tables can stay; they are empty.
