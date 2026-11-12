ADD THE MAILING ADDRESS TO THE FAMILY SQUARES FOLLOW-UP EMAILS. Read all of this before doing anything.

Background: the follow-up sender on main now adds a small line under each email with the business mailing address, which it reads from the setting `email_mailing_address`. The address is kept in the database, not in the code. Until the setting exists the emails simply go out without that line.

DO NOT TOUCH
- Monday night registration: public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, monday_notification_private, zoom_meeting_registrations.
- The setting `family_squares_followups_start_at`, the table family_squares_followup_queue, and every job and schedule (job 48 stays exactly as it is).
- Any function other than the one named in step 2. No schema migrations. No manual invocations. No publish.
- Never print a secret value, a job command or a header. Counts and times only: no names, no email addresses.

STEP 0. Check
On the synced main branch, `supabase/functions/process-family-squares-followups/index.ts` must contain the text `email_mailing_address`. If it does not, STOP and tell me main is not synced.

STEP 1. Save the address (a data statement, not a schema migration)

```sql
INSERT INTO public.site_settings (key, value, is_public)
VALUES ('email_mailing_address', '<MAILING ADDRESS>', false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

Then confirm there is exactly one row with that key and that `is_public` is false.

STEP 2. Deploy
Deploy only process-family-squares-followups, unchanged from main.

STEP 3. Check (read-only, do not wait)

```sql
SELECT status_code, left(content, 120) AS body_start, count(*) AS responses, max(created) AS last_seen
FROM net._http_response
WHERE created >= now() - interval '70 minutes' AND content LIKE '{"sent":%'
GROUP BY status_code, left(content, 120)
ORDER BY last_seen DESC;

SELECT count(*) AS total,
       count(*) FILTER (WHERE sent_at IS NOT NULL) AS sent,
       count(*) FILTER (WHERE skipped_at IS NOT NULL) AS skipped,
       count(*) FILTER (WHERE sent_at IS NULL AND skipped_at IS NULL) AS waiting
FROM public.family_squares_followup_queue;
```

The follow-up job runs at 35 minutes past each hour. If it has not run since the deploy, say so; do not invoke it yourself. If any response is a 401 or 500, report the status and body.

REPORT
What you did in each step and the numbers from step 3. Say plainly that job 48 is still enabled and unchanged.
