DEPLOY ONE FUNCTION: LET THE APP SHOW COACHING SESSIONS BOOKED ON THE WEBSITE. Read all of this before doing anything.

Background: main has one new function, `app-coaching-bookings` (`verify_jwt = false` in `supabase/config.toml`). The Sober Helpline app calls it, server to server, with the existing `MEMBERSHIP_SYNC_SECRET` in the `x-membership-sync-secret` header and one member's verified email. It answers with that member's coaching sessions from `consultation_bookings` (confirmed or completed, from the last 30 days onward): the time, the status, the coach's name and the Zoom join link. It reads only; it writes nothing. It never returns the passcode field, phone number, intake answers or payment amounts.

One shared file changed by one word: `_shared/bookingRules.ts` now exports its existing `zonedToUtcMs` helper. The functions that already use that file do not need redeploying.

No website page changed. No database change. No new secret.

DO NOT TOUCH
- book-consultation, process-consultation-booking, consultation-payment and every other booking or payment function.
- public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, the schema monday_notification_private and its control row, and the table zoom_meeting_registrations. Do NOT run any activation, probe or pilot step for the Monday notification ledger.
- Every setting, secret, table, job and schedule. No migrations.
- No manual invocations of any function.
- Any function not named in step 1.
- Never print a secret value, a job command or a header. Counts only: no names, no email addresses, no phone numbers, no Zoom links.

WHEN: any day.

STEP 0. Checks (read-only)
On the synced main branch all of these must be true, or STOP and tell me main is not synced:
- `supabase/functions/app-coaching-bookings/index.ts` exists.
- `supabase/config.toml` contains `[functions.app-coaching-bookings]` followed by `verify_jwt = false`.
- `supabase/functions/_shared/bookingRules.ts` contains the text `export function zonedToUtcMs`.

Also report yes or no, changing nothing: is the secret `MEMBERSHIP_SYNC_SECRET` present (name only), and does the database function `public.auth_user_id_by_email(text)` exist? If either is no, STOP and tell me.

STEP 1. Deploy only this function, unchanged from main:
- app-coaching-bookings

STEP 2. Report
- Whether the function deployed, and that it is deployed without a JWT check.
- The two yes/no answers from step 0.

Do not do anything else. Do not publish: no website page changed.
