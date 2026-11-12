SWITCH ON THE FAMILY SQUARES FOLLOW-UP EMAILS FOR NEW REGISTRANTS ONLY. Read all of this before doing anything.

Background: the table family_squares_followup_queue holds about 561 follow-up emails that were queued since May and never sent, because legacy job 26 (process-family-squares-followups-hourly) has always been refused by its function. The owner wants the three-email sequence to run from now on, for people who register from now on. NONE of the emails already in the queue may ever be sent.

The function on main is now built for that:
- It sends nothing until the setting `family_squares_followups_start_at` exists, and never sends a row queued before that time.
- It accepts the managed scheduler's sign-in (the generated helper `supabase/functions/_shared/cron-auth.ts`), the same way send-forum-notifications does.
- It skips anything more than 3 days late, people who did not tick the email-list box, app and kiosk sign-ups, active members, and repeats.

DO NOT TOUCH
- Monday night registration: public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, monday_notification_private, and the table zoom_meeting_registrations (reading counts from it is fine; no changes).
- Any job, schedule, function, table or secret not named in a step below. No schema migrations. No manual invocations of any function. No publish (nothing in the frontend changed).
- Never edit `_shared/cron-auth.ts`. Never print a secret value, a job command or a header. Counts and times only in your report: no names, no email addresses.

WHEN: do not run this on a Monday between noon and 9 PM Pacific.

STEP 0. Checks before anything changes

0a. On the synced main branch:
- `supabase/functions/process-family-squares-followups/index.ts` must import `authenticateCronRequest` from `../_shared/cron-auth.ts` and must contain the text `family_squares_followups_start_at`.
- `supabase/functions/score-family-squares-registration/index.ts` must NOT contain the words `revenue ladder`.
If either check fails, STOP and tell me main is not synced.

0b. Read-only numbers before the change (paste them):

```sql
SELECT count(*) AS total,
       count(*) FILTER (WHERE sent_at IS NOT NULL) AS sent,
       count(*) FILTER (WHERE skipped_at IS NOT NULL) AS skipped,
       count(*) FILTER (WHERE sent_at IS NULL AND skipped_at IS NULL) AS waiting
FROM public.family_squares_followup_queue;

-- How many recent website registrations left the email-list box ticked.
SELECT count(*) AS queued_registrations_30d,
       count(*) FILTER (WHERE r.consent_email_list) AS box_ticked
FROM public.zoom_meeting_registrations r
WHERE r.created_at >= now() - interval '30 days'
  AND r.id IN (SELECT registration_id FROM public.family_squares_followup_queue);
```

`sent` must be 0. If it is not 0, STOP and report.

0c. The function checks membership with the service role. This must return true:

```sql
SELECT has_function_privilege('service_role', 'public.is_active_family_member(uuid)', 'EXECUTE') AS member_check_allowed;
```

If it returns false, STOP and report. Do not grant anything yourself.

STEP 1. Set the switch-on time and retire the old queue (data statements, not a schema migration)

Run these two statements in this order.

```sql
-- 1a. The switch-on time. Kept if it is already set.
INSERT INTO public.site_settings (key, value)
VALUES ('family_squares_followups_start_at', to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
ON CONFLICT (key) DO NOTHING;
```

```sql
-- 1b. Everything queued before the switch-on time is marked skipped. Nothing is deleted.
UPDATE public.family_squares_followup_queue
SET skipped_at = now(),
    error_message = 'skipped: queued before the sequence was switched on'
WHERE sent_at IS NULL
  AND skipped_at IS NULL
  AND created_at < (SELECT value::timestamptz FROM public.site_settings
                    WHERE key = 'family_squares_followups_start_at');
```

Then check:

```sql
SELECT (SELECT value FROM public.site_settings WHERE key = 'family_squares_followups_start_at') AS switched_on_at,
       count(*) AS total,
       count(*) FILTER (WHERE sent_at IS NOT NULL) AS sent,
       count(*) FILTER (WHERE skipped_at IS NOT NULL) AS skipped,
       count(*) FILTER (WHERE sent_at IS NULL AND skipped_at IS NULL) AS waiting
FROM public.family_squares_followup_queue;
```

Expected: `switched_on_at` has a time, `sent` is 0, `waiting` is 0. (`waiting` may be 3 or 6 only if someone registered in the few seconds after 1a.) If `switched_on_at` is empty, or `sent` is above 0, or `waiting` is above 6, STOP here and report. Do not deploy.

STEP 2. Deploy
Deploy only these two functions, unchanged from main:
- process-family-squares-followups
- score-family-squares-registration (only one sentence and one button label of the third email changed; Monday registration calls it in the background after a registration is already saved)

STEP 3. Create one managed HTTP schedule
POST with the JSON body `{"source":"cron"}` to process-family-squares-followups, schedule `35 * * * *` (hourly, UTC). It replaces a legacy job that also ran hourly, so usage does not go up.

STEP 4. Check the first run (wait until it has run once)

```sql
SELECT status_code, left(content, 120) AS body_start, count(*) AS responses,
       min(created) AS first_seen, max(created) AS last_seen
FROM net._http_response
WHERE created >= now() - interval '70 minutes'
GROUP BY status_code, left(content, 120)
ORDER BY last_seen DESC;
```

Expected new row: HTTP 200 with the body `{"sent":0,"skipped":0,"failed":0,"reasons":{}}`.
- `sent` must be 0 on this first run: the first email for a new registrant is due one day after they register, so nothing can be due yet. If `sent` is above 0, DISABLE the new schedule at once and put that at the top of your reply.
- If the body contains `"not_started":true`, the setting from step 1a is missing. Disable the new schedule and report.
- If the new schedule gets a 401 or 500, disable it and report the status and body.

STEP 5. Turn off legacy job 26
Only after step 4 shows the expected 200: remove legacy job 26, process-family-squares-followups-hourly (or disable it if removal is not available). Do not touch any other job id. If you cannot remove or disable it, say so and leave it.

STEP 6. Final checks

```sql
SELECT (SELECT value FROM public.site_settings WHERE key = 'family_squares_followups_start_at') AS switched_on_at,
       count(*) AS total,
       count(*) FILTER (WHERE sent_at IS NOT NULL) AS sent,
       count(*) FILTER (WHERE skipped_at IS NOT NULL) AS skipped,
       count(*) FILTER (WHERE sent_at IS NULL AND skipped_at IS NULL) AS waiting
FROM public.family_squares_followup_queue;
```

`sent` must still be 0. Also list the schedules for process-family-squares-followups, old and new, with id, schedule and enabled.

REPORT
For each step: what you did and what you saw, with the numbers from 0b, 1, 4 and 6. Say plainly whether the new schedule is enabled, whether job 26 is now off, and that no email was sent.

TO UNDO: disable the new schedule. Nothing else needs reversing.
