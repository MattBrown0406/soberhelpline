# Lovable section — Monday call from the app + Smart App Banner (2026-10-03)

This section is merged into the 2026-10-03 Lovable apply prompt. It covers:

- **Contract C:** the Sober Helpline app sends its Monday call RSVPs and questions to
  the new website function `app-family-squares-sync` every 15 minutes. They show up
  in Admin → Zoom settings with an "App" source label.
- **Contract D:** the Monday reminder emails skip people the app already reminds by
  push (the app's `family-squares-push-reachable`). If the app can't be reached, the
  emails go out exactly as before.
- **Follow-ups:** app registrants get the post-call emails without the App Store
  link or the website membership pitch, and never enter lead scoring or the revenue
  follow-up sequence.
- **Smart App Banner:** Safari on iPhone shows Open/Get for the Sober Helpline app.

Order is safe: every function works on today's database. Until the SQL below runs,
`app-family-squares-sync` can't add new app rows (the source check constraint
rejects `'app'`). It reports them as `schema_pending` and adds them on the next run
after the SQL. Questions from people who also registered on the website are merged
into their website registration even before the SQL.

---

## Prompt for Lovable (Monday call section)

### A. Read-only check first (include the results in your reply)

```sql
-- Triggers on the registrations table (expected: none).
select tgname, pg_get_triggerdef(t.oid)
from pg_trigger t
where tgrelid = 'public.zoom_meeting_registrations'::regclass
  and not tgisinternal;

-- Check constraints on the registrations table.
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.zoom_meeting_registrations'::regclass
  and contype = 'c';
```

If the first query returns any trigger (including a database webhook) that sends
email, calls an edge function, or queues follow-ups, **stop and tell me** before
running step B.

### B. Create and run this database migration (exactly as written, as one migration)

Idempotent. It changes no rows.

```sql
-- =====================================================================
-- Sober Helpline website — Monday call RSVPs from the app. 2026-10-03.
-- Idempotent. Changes no rows. Run as ONE migration (one transaction, so
-- there is no moment without a source check).
-- =====================================================================

-- 1. Allow registration_source = 'app' (rows written only by the
--    app-family-squares-sync edge function). Every existing row already
--    satisfies the old, narrower check, so the new one validates instantly.
--    Drops whichever check constraint currently covers registration_source
--    (by definition, not by name), then adds the widened one.
DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.zoom_meeting_registrations'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%registration_source%'
  LOOP
    EXECUTE format('ALTER TABLE public.zoom_meeting_registrations DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.zoom_meeting_registrations
  ADD CONSTRAINT zoom_meeting_registrations_source_check
  CHECK (registration_source IN ('website', 'kiosk', 'automatic', 'app'));

-- 2. At most one app row per person per meeting date, even if two sync runs
--    overlap. Only app rows are covered; website/kiosk duplicates are untouched.
--    No app rows can exist before step 1, so this cannot fail on existing data.
CREATE UNIQUE INDEX IF NOT EXISTS zoom_registrations_one_app_row_per_email_date
  ON public.zoom_meeting_registrations (lower(trim(email)), meeting_date)
  WHERE registration_source = 'app';
```

### C. Edge functions

Deploy these from the synced code:

- `app-family-squares-sync`: **NEW.** `verify_jwt = false` (already in
  `supabase/config.toml`). The Sober Helpline app calls it server-to-server. It
  checks the `x-membership-sync-secret` header against `MEMBERSHIP_SYNC_SECRET` itself.
- `send-member-zoom-reminder`: skips members the app reminds by push. Auth now also
  accepts the cron secret and service role key, plus everything it accepted before.
  It still requires one of them.
- `send-zoom-starting-soon`: skips people the app reminds by push. Registrants who
  came from the app don't get the "download the app" box. It now uses the shared
  automation auth, which only logs `automation_auth_unverified send-zoom-starting-soon`
  until `enforce_function_auth` is turned on.
- `resend-zoom-links`: the regular run skips people the app reminds by push. An
  explicit recipient list still emails everyone.
- `send-first-timer-followup`: app registrants get a welcome without the website
  membership pitch. It uses the shared automation auth (staged, as above).
- `send-attendee-followup`: app registrants get a thank-you without the membership
  pitch. **This one now always requires a credential** (cron secret, automation
  secret, service role key or a signed-in admin), because the caller chooses the
  recipients. Unauthenticated calls get 401.
- `process-family-squares-followups`: marks any queued follow-up for an app
  registration as skipped instead of sending it. Nothing queues those today; this is
  a backstop.
- `score-family-squares-registration`: returns without scoring or queueing for app
  registrations.

The shared file `supabase/functions/_shared/appPushReachable.ts` is new. It is
imported by `send-member-zoom-reminder`, `send-zoom-starting-soon` and
`resend-zoom-links`.

### D. Secrets: confirm each exists (don't print values)

- `MEMBERSHIP_SYNC_SECRET`: same value as in the Sober Helpline app project. It is
  used both ways in this section.
- `MOBILE_SUPABASE_URL`: optional here. It defaults to
  `https://rjlkbxqxshohgjmomyro.supabase.co`.
- `FOLLOWUP_AUTOMATION_SECRET`: already used by the follow-up functions.

### E. Tell me

- The results of step A (triggers, check constraints) from before the migration.
- That the migration ran, and the check constraint definition now includes `'app'`.
- That the index `zoom_registrations_one_app_row_per_email_date` exists.
- The list of functions you deployed from step C.
- Which secrets from step D were missing, if any.

---

## Post-deploy checklist (Matt)

1. **Publish the frontend in Lovable.** This ships the Smart App Banner in
   `index.html` and the "App" label in the admin registrations view.
2. **Smart App Banner.** On an iPhone, open https://soberhelpline.com and
   https://soberhelpline.com/monday-zoom-registration in Safari. The banner at the top
   shows Sober Helpline with **Open** (app installed) or **Get**. If you closed it
   once, Safari can hide it for a while; try a private tab. It never shows in Chrome
   or inside apps.
3. **Sync is live.** Within 15 minutes of the app's sync job running, Supabase → Edge
   Functions → `app-family-squares-sync` → Logs shows lines like
   `app-family-squares-sync meeting_date=2026-10-05 ... upserted=N removed=N skipped=N`.
   They must **not** say `schema_pending` (if they do, step B hasn't run). A call
   without the secret must get `401`.
4. **Admin view.** Admin → Zoom settings → Registration source → **App** lists the
   app RSVPs for the upcoming Monday, each with an "App" badge, and their questions
   appear under "Questions for …". Someone who registered on the website and also
   asked in the app has one registration, with the app questions marked
   "(from the app)". **Print Questions** shows "· App" next to app registrants.
5. **Reminders.** After Monday's reminder runs, the `send-zoom-starting-soon` and
   `send-member-zoom-reminder` logs show
   `push_reachable ...: checked=N handled_by_app=M failed_batches=0`. Until the app's
   `family-squares-push-reachable` is deployed you'll see `failed_batches=1` and
   `handled_by_app=0`. That's expected: everyone gets the email as before.
6. **No marketing for app RSVPs.** A test RSVP from the app produces no registration
   confirmation email, no Mailchimp contact, and no rows in
   `family_squares_followup_queue` for that registration.
