DEPLOY SIX FUNCTIONS AND PUBLISH: EMAIL COORDINATION, STOP LINK IN THE CONFIRMATION EMAIL, TEXT REMINDERS ON/OFF PAGE. Read all of this before doing anything.

Background: main has small changes to six existing functions and one new website page.
- `send-zoom-registration-email`: one added line at the bottom of the English confirmation email, only for people who are registered automatically each week: a "Stop weekly registration" link. Nothing else in that function changed: same revision string, same claim and delivery steps.
- `process-family-squares-followups`: on Mondays it holds a follow-up for anyone not registered for that night (they get the "come tonight" email that morning instead). It goes out Tuesday.
- `send-weekly-blog-digest`: skips non-members who are in their first week of follow-up emails.
- `send-zoom-starting-soon`: adds one line, "Get this reminder by text message", while text reminders are switched on.
- `family-squares-sms-optin`: adds opting out by number, and lets active members sign up without registering.
- `send-family-squares-sms-reminders`: also texts opted-in active members.
- Website: a new page, /text-reminders.

DO NOT TOUCH
- public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, the schema monday_notification_private and its control row, and the table zoom_meeting_registrations. Do NOT run any activation, probe or pilot step for the Monday notification ledger: it is already active and must stay exactly as it is.
- Every setting, secret, table, job and schedule. No migrations. No manual invocations of any function (including no `rollout_probe` request).
- Any function not named in step 2.
- Never print a secret value, a job command or a header. Counts only: no names, no email addresses, no phone numbers.

WHEN: not on a Monday. Not on a Wednesday between 7 AM and 9 AM Pacific.

STEP 0. Checks (read-only)
0a. On the synced main branch all of these must be true, or STOP and tell me main is not synced:
- `supabase/functions/send-zoom-registration-email/index.ts` contains the text `stopWeeklyLine` and still contains the text `monday-ledger-disabled-v1`.
- `supabase/functions/_shared/followupQuiet.ts` exists.
- `supabase/functions/family-squares-sms-optin/index.ts` contains the text `opt_out`.
- `src/pages/TextReminders.tsx` exists.

0b. The confirmation email must be working before it is touched. Paste this result:

```sql
SELECT enabled, activated_at IS NOT NULL AS has_been_activated
FROM monday_notification_private.control;
```

`enabled` must be true. If it is not, STOP: do not deploy anything.

STEP 1. Nothing to set. Go to step 2.

STEP 2. Deploy
Deploy only these six functions, unchanged from main:
- send-zoom-registration-email
- process-family-squares-followups
- send-weekly-blog-digest
- send-zoom-starting-soon
- family-squares-sms-optin
- send-family-squares-sms-reminders

STEP 3. Publish
Publish the frontend.

STEP 4. Final checks (read-only, no invocations)

```sql
SELECT enabled, activated_at IS NOT NULL AS has_been_activated
FROM monday_notification_private.control;

SELECT status_code, left(content, 140) AS body_start, count(*) AS responses, max(created) AS last_seen
FROM net._http_response
WHERE created >= now() - interval '70 minutes'
GROUP BY status_code, left(content, 140)
ORDER BY last_seen DESC;
```

`enabled` must still be true. If any response is a 401 or 500, report its status and body.

REPORT
Say plainly which six functions were deployed, whether the frontend was published, that the Monday notification control row is unchanged and enabled, and that no schedule, setting or secret changed.

TO UNDO: redeploy the previous version of whichever function is a problem. Nothing else needs reversing.
