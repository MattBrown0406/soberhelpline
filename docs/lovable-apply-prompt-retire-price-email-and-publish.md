DEPLOY ONE FUNCTION AND PUBLISH: RETIRE THE OLD $14.99 EMAIL, AND SHOW THE REAL REGISTRATION PAGE AT ITS MAIN ADDRESS. Read all of this before doing anything.

Background: main has two small changes.
- `send-price-increase-outreach` is retired. It used to email an offer to "lock in $14.99/month"; membership is $9.99, so it must never send again. On main the function is now a no-op that answers `{ "retired": true, "sent": 0 }` and contains no email code.
- The static file `public/monday-zoom-registration/index.html` was removed, so `https://soberhelpline.com/monday-zoom-registration` shows the same page as `/family-squares`. `public/zoom.html` stays (renamed "Register for Family Squares"). No function changed for this; it only needs a publish.

DO NOT TOUCH
- public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, the schema monday_notification_private and its control row, and the table zoom_meeting_registrations. Do NOT run any activation, probe or pilot step for the Monday notification ledger.
- Every setting, secret and table. No migrations.
- No manual invocations of any function, including `send-price-increase-outreach`.
- Any function not named in step 2. Never run `paypal-reprice-members`.
- Never print a secret value, a job command or a header. Counts and job names only: no names of people, no email addresses, no phone numbers.

WHEN: not on a Monday.

STEP 0. Checks (read-only)
0a. On the synced main branch all of these must be true, or STOP and tell me main is not synced:
- `supabase/functions/send-price-increase-outreach/index.ts` contains the text `retired: true` and does NOT contain the text `sendgrid`.
- `public/monday-zoom-registration/index.html` does NOT exist.
- `public/zoom.html` exists and contains the text `Register for Family Squares`.

0b. Is anything scheduled to call the retired function? Paste this result (job names only, never the command text):

```sql
SELECT jobid, jobname, schedule, active
FROM cron.job
WHERE command ILIKE '%send-price-increase-outreach%';
```

Also say whether any managed (HTTP) scheduled job targets `send-price-increase-outreach`. Report only. Do not remove or change any job in this step.

STEP 1. Deploy
Deploy only this function, unchanged from main:
- send-price-increase-outreach

STEP 2. Publish the website.

STEP 3. If, and only if, step 0b found a scheduled job that calls `send-price-increase-outreach`, remove that job (it now does nothing) and tell me its name. Touch no other job.

STEP 4. Report
- Whether the function deployed.
- The result of step 0b, and the name of any job removed in step 3.
- Whether the website publish was requested.

Do not do anything else.
