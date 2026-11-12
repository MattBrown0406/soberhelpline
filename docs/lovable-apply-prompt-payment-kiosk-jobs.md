MOVE TWO REFUSED JOBS TO MANAGED SCHEDULING. Read all of this before doing anything.

Background: legacy jobs 28 (deliver-app-payment-callback-every-minute) and 38 (send-family-squares-kiosk-followups) are refused by their functions on every run, and their stored credential cannot be repaired with the available controls. The functions on main now also accept the managed scheduler's own sign-in (the generated helper `supabase/functions/_shared/cron-auth.ts`), the same way send-forum-notifications does. This prompt deploys those two functions, creates two managed schedules, checks them, and only then turns the two legacy jobs off.

DO NOT TOUCH
- Job 26 (process-family-squares-followups-hourly), its function, the secret FOLLOWUP_AUTOMATION_SECRET, or the table family_squares_followup_queue. That queue holds about 551 overdue emails that must NOT be sent. If any step here could make job 26 start succeeding, stop and tell me instead.
- Monday night registration: public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, monday_notification_private, zoom_meeting_registrations.
- Any other job, schedule, function, table or secret. No migrations. No manual invocations. No emails. No publish (nothing in the frontend changed).
- Never edit `_shared/cron-auth.ts`. Never print a secret value, a job command or a header.

STEP 0. Checks before anything changes

0a. On the synced main branch, both of these files must import `authenticateCronRequest` from `../_shared/cron-auth.ts`:
- `supabase/functions/deliver-app-payment-callback/index.ts`
- `supabase/functions/send-family-squares-kiosk-followups/index.ts`
If either does not, STOP and tell me main is not synced.

0b. Both queues must be empty:

```sql
SELECT count(*) AS waiting_payment_events
FROM public.app_payment_bridge_outbox WHERE delivered_at IS NULL;

SELECT count(*) AS waiting_kiosk_followups
FROM public.family_squares_kiosk_followups WHERE status IN ('pending', 'failed', 'sending');
```

If either number is not 0, STOP and report it. Do not continue.

STEP A. Deploy
Deploy only these two functions, unchanged from main:
- deliver-app-payment-callback
- send-family-squares-kiosk-followups

STEP B. Create two managed HTTP schedules
Each is a POST with the JSON body `{"source":"cron"}`.

| Function | Schedule (UTC) | Note |
|---|---|---|
| deliver-app-payment-callback | `*/5 * * * *` | Replaces a legacy job that runs every minute (1,440 calls a day). This is 288 a day, so usage goes down. |
| send-family-squares-kiosk-followups | `20 * * * *` | Replaces a legacy job that runs every 15 minutes (96 calls a day). This is 24 a day. |

If the platform will not allow every 5 minutes for the payment job, use `*/15 * * * *` instead and tell me. Do not go slower than that without asking.

STEP C. Check the new schedules (wait until each has run at least once)

```sql
SELECT status_code, left(content, 90) AS body_start, count(*) AS responses,
       min(created) AS first_seen, max(created) AS last_seen
FROM net._http_response
WHERE created >= now() - interval '70 minutes'
GROUP BY status_code, left(content, 90)
ORDER BY responses DESC;
```

Expected new rows:
- Payment job: HTTP 200, body starting `{"ok":true`. It will be either `{"ok":true,"delivered":0,"failed":0,...}` or `{"ok":true,"skipped":true,"reason":"callback_not_configured",...}`. Tell me which. (If it says callback_not_configured, the callback address or bridge secret is missing; do not set them, just report it.)
- Kiosk job: HTTP 200, body `{"claimed":0,"sent":0,"suppressed":0,"failed":0}`.

If either new schedule gets a 401 or 500, STOP. Leave the legacy jobs as they are and report the status and body.

STEP D. Turn off the two legacy jobs
Only after step C shows a 200 from each new schedule: remove legacy jobs 28 and 38 (or disable them if removal is not available). Do not touch any other job id. If you cannot remove or disable them, say so and leave them.

STEP E. Final checks

```sql
-- Refusals should stop for the payment body, and drop to one an hour for the other.
SELECT status_code, left(content, 90) AS body_start, count(*) AS responses, max(created) AS last_seen
FROM net._http_response
WHERE created >= now() - interval '20 minutes' AND status_code <> 200
GROUP BY status_code, left(content, 90);

-- None of the old follow-up emails may have gone out.
SELECT count(*) FILTER (WHERE sent_at IS NOT NULL) AS followups_sent,
       count(*) FILTER (WHERE sent_at IS NULL AND skipped_at IS NULL AND scheduled_for <= now()) AS still_waiting
FROM public.family_squares_followup_queue;
```

`followups_sent` must be 0. If it is above 0, say so at the top of your reply.
The only refusal still expected is `{"error":"Unauthorized"}` once an hour on the hour, from job 26. That is intended for now.

Also list the schedules for these two functions, old and new, with id, schedule and enabled.

REPORT
For each step: what you did and what you saw. Say plainly whether jobs 28 and 38 are now off and whether the payment function reported `callback_not_configured`.
