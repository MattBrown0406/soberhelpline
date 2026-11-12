SWITCH ON THE AFTER-MEETING EMAIL AND RETIRE THE MONDAY-NIGHT ONE. Read all of this before doing anything.

Background: until now, everyone who registered for Family Squares for the first time got one email at 8 PM Pacific on Monday (send-first-timer-followup). It could not tell who had actually attended, and it offered membership to all of them. Main now has a replacement:

- `send-after-meeting-followup` (new) runs on Tuesday morning. People for whom Monday was their first meeting in the room get a thank-you. People who registered for the first time and did not come get a "we missed you". Membership is only mentioned to people who attended.
- `send-first-timer-followup` is retired: it now answers `{"retired":true}` and sends nothing.
- `process-family-squares-followups` holds an email back if the same address got another Family Squares follow-up in the last 20 hours.
- `score-family-squares-registration`: the first of the three follow-up emails no longer offers membership (only its subject line and one button changed).
- `send-weekly-zoom-report` adds a four-week average and first-time / returning counts to the owner's Tuesday report.
- `send-zoom-starting-soon` adds one small line, only for people who are registered automatically each week: a "Stop weekly registration" link.
- `stop-auto-registration` (new) is what that link uses.

The new email sends nothing until the setting `after_meeting_followups_start_date` exists, never sends for a meeting before that date, only sends on Tuesday between 9 AM and 1 PM Pacific, and records each person before sending so nobody can get it twice.

DO NOT TOUCH
- Monday night registration: public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, monday_notification_private, and the table zoom_meeting_registrations (reading counts is fine; no changes).
- The settings `family_squares_followups_start_at` and `email_mailing_address`. Job 48 (process-family-squares-followups) stays exactly as it is.
- Any job, schedule, function, table or secret not named in a step below. No schema migrations. No manual invocations of any function.
- Never edit `_shared/cron-auth.ts`. Never print a secret value, a job command or a header. Counts, dates and job names only in your report: no people's names, no email addresses.

WHEN: do not run this on a Monday, or on a Tuesday before 2 PM Pacific. The reminder and report functions redeployed here do their work on Monday evening and Tuesday morning.

STEP 0. Checks before anything changes

0a. On the synced main branch all of these must be true. If any is not, STOP and tell me main is not synced.
- `supabase/functions/send-after-meeting-followup/index.ts` exists and contains the text `after_meeting_followups_start_date`.
- `supabase/functions/stop-auto-registration/index.ts` exists.
- `supabase/functions/send-first-timer-followup/index.ts` contains the text `retired: true`.
- `supabase/config.toml` has `[functions.send-after-meeting-followup]` and `[functions.stop-auto-registration]`, each with `verify_jwt = false`.

0b. The new email records each person as "step 0" in family_squares_followup_queue. Read-only:

```sql
SELECT contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.family_squares_followup_queue'::regclass
ORDER BY contype;

SELECT count(*) AS step_0_rows FROM public.family_squares_followup_queue WHERE sequence_step = 0;
```

There must be a UNIQUE constraint on (registration_id, sequence_step). There must be NO check constraint that limits sequence_step. `step_0_rows` must be 0. If any of these is not so, STOP and paste the result.

0c. The new email needs Monday's attendance to be recorded by Tuesday morning. Read-only:

```sql
SELECT meeting_date, to_char(meeting_date, 'Dy') AS day, count(*) AS attendance_rows,
       min(created_at) AS first_recorded, max(created_at) AS last_recorded
FROM public.zoom_attendance
WHERE meeting_date >= current_date - 30
GROUP BY meeting_date
ORDER BY meeting_date DESC;
```

Paste the result. If there are no rows dated on a Monday in the last 30 days, STOP after pasting: the email would never have anything to go on.

0d. List the scheduled jobs whose names contain `first-timer`, `sync-zoom-attendance`, `weekly-zoom-report` or `zoom-starting-soon`: id, name, schedule and whether enabled. Do not print their commands.

0e. Confirm, without printing its value, that the function secret `FOLLOWUP_AUTOMATION_SECRET` exists. If it does not, STOP.

STEP 1. Set the first meeting the new email covers (a data statement, not a schema migration)

```sql
-- The Monday on or after today, in Pacific time. Kept if it is already set.
INSERT INTO public.site_settings (key, value, is_public)
SELECT 'after_meeting_followups_start_date',
       to_char(d + ((8 - extract(isodow FROM d)::int) % 7), 'YYYY-MM-DD'),
       false
FROM (SELECT (now() AT TIME ZONE 'America/Los_Angeles')::date AS d) t
ON CONFLICT (key) DO NOTHING;

SELECT value AS first_meeting_covered,
       to_char(value::date, 'Dy') AS day
FROM public.site_settings WHERE key = 'after_meeting_followups_start_date';
```

`day` must be `Mon` and the date must be in the future. If not, STOP and report.

STEP 2. Deploy
Deploy only these seven functions, unchanged from main:
- send-after-meeting-followup (new)
- stop-auto-registration (new)
- send-first-timer-followup
- process-family-squares-followups
- score-family-squares-registration
- send-weekly-zoom-report
- send-zoom-starting-soon

STEP 3. Create one managed HTTP schedule
POST with the JSON body `{"source":"cron"}` to send-after-meeting-followup, schedule `10 16-20 * * 2` (UTC: five runs on Tuesday, covering 9 AM to 1 PM Pacific in both winter and summer time). Most runs answer "outside_send_window" or "already done"; that is expected.

STEP 4. The two old Monday-night jobs
Remove the legacy jobs `first-timer-followup-weekly-pdt` and `first-timer-followup-weekly-pst` (or disable them if removal is not available). They now call a retired function that sends nothing, so if you cannot remove or disable them, say so and leave them. Do not touch any other job.

STEP 5. Publish
Publish the frontend. It adds the page the "Stop weekly registration" link opens.

STEP 6. Final checks (read-only, do not wait for a run, do not invoke anything)

```sql
SELECT (SELECT value FROM public.site_settings WHERE key = 'after_meeting_followups_start_date') AS first_meeting_covered,
       (SELECT count(*) FROM public.family_squares_followup_queue WHERE sequence_step = 0) AS step_0_rows,
       (SELECT count(*) FROM public.family_squares_followup_queue WHERE sequence_step BETWEEN 1 AND 3 AND sent_at IS NOT NULL) AS sequence_emails_sent;

SELECT status_code, left(content, 140) AS body_start, count(*) AS responses, max(created) AS last_seen
FROM net._http_response
WHERE created >= now() - interval '70 minutes'
GROUP BY status_code, left(content, 140)
ORDER BY last_seen DESC;
```

`step_0_rows` must be 0 (nothing can have been sent yet). If any response in the last 70 minutes is a 401 or 500, report its status and body.

REPORT
For each step: what you did and what you saw, with the tables from 0b, 0c, 0d, 1 and 6. Say plainly: which functions were deployed, whether the new schedule is enabled, whether the two old jobs are gone, whether the frontend was published, and that job 48 is unchanged.

TO UNDO: disable the new schedule. Nothing else needs reversing (the old Monday-night email stays retired).
