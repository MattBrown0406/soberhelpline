PUBLISH THE VISITOR-PATH CHANGES AND DEPLOY ONE FUNCTION. Read all of this before doing anything.

Background: main now has website changes that invite article readers to the free Monday meeting, give the free guide a real sign-up form, put the menu on every page for phones, shorten the membership sign-up, and track membership sign-ups. One edge function changed: `track-conversion-event` now accepts the membership events the website already sends (it used to reject them).

DO NOT TOUCH
- Monday night registration: public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, monday_notification_private, zoom_meeting_registrations.
- Any job, schedule, table, setting or secret. No schema migrations. No manual invocations of any function.
- Any function other than the one named in step 1.
- Never print a secret value, a job command or a header. Counts and times only: no names, no email addresses.

STEP 0. Check
On the synced main branch:
- `supabase/functions/track-conversion-event/index.ts` must contain the text `membership_signup_success`.
- `src/components/MondayInvite.tsx` must exist.
If either check fails, STOP and tell me main is not synced.

STEP 1. Deploy
Deploy only `track-conversion-event`, unchanged from main. Nothing else about it changed: it only accepts more event names.

STEP 2. Publish
Publish the frontend so the website changes go live.

STEP 3. Check (read-only)

```sql
SELECT event_name, count(*) AS events, max(created_at) AS last_seen
FROM public.conversion_events
WHERE created_at >= now() - interval '7 days'
GROUP BY event_name
ORDER BY events DESC;
```

Paste the result. It is normal for the membership events to be missing right after publishing: they appear as visitors use the site.

REPORT
Say plainly whether `track-conversion-event` was deployed, whether the frontend was published, and paste the table from step 3.
