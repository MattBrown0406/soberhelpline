REDEPLOY ONE FUNCTION: send-after-meeting-followup. Read all of this before doing anything.

Background: the after-meeting email was switched on for the meeting of 2026-11-16 and has not sent anything yet. Main has a safer version of the one function: it matches people in the room to registrants the same way the owner's Tuesday report does, stays silent when it cannot tell whether someone attended, and never sends the same person the same after-meeting email twice.

DO NOT TOUCH
- Monday night registration: public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, monday_notification_private, zoom_meeting_registrations.
- Every setting, table, secret, job and schedule. The schedule `send-after-meeting-followup-managed` stays exactly as it is. Job 48 and schedule 49 stay as they are.
- Any function other than the one named in step 1. No migrations. No publish. No manual invocations.
- Never print a secret value, a job command or a header. Counts only: no names, no email addresses.

WHEN: not on a Tuesday between 8 AM and 2 PM Pacific (that is when this function runs).

STEP 0. Check
On the synced main branch, `supabase/functions/send-after-meeting-followup/index.ts` must contain the text `already_welcomed` and import from `../_shared/attendeeNameMatch.ts`. If not, STOP and tell me main is not synced.

STEP 1. Deploy
Deploy only `send-after-meeting-followup`, unchanged from main.

STEP 2. Check (read-only)

```sql
SELECT (SELECT value FROM public.site_settings WHERE key = 'after_meeting_followups_start_date') AS first_meeting_covered,
       (SELECT count(*) FROM public.family_squares_followup_queue WHERE sequence_step = 0) AS step_0_rows;
```

REPORT
Say plainly that only `send-after-meeting-followup` was deployed, that its schedule is still enabled and unchanged, and paste the row from step 2.
