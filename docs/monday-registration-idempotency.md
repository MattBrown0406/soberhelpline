# Monday Family Squares duplicate registration — source-only release

Website project: `anwqprmpzmcqbkttmxos`. This is **not** the mobile app project.
Base: `55947755a79c530a2024cc52c30b512197d13be8` (fresh origin/main).
No production mutations, sends, deployment, push or Lovable publication performed.

## Contracts

### Existing public/manual registration endpoints

`public-register-monday-zoom` and `register-zoom-meeting` return HTTP 200 for a repeat:

```json
{
  "success": true,
  "status": "already_registered",
  "alreadyRegistered": true,
  "message": "You’re already registered. We look forward to seeing you Monday evening!",
  "registration": null,
  "registrationId": null,
  "emailSent": false
}
```

The unique key is `(lower(trim(email)), meeting_date)`, not lifetime email. Normal repeated submissions do not change names, questions, consent, auto-registration preferences, identity or source, and never invoke email/marketing/scoring side effects. Public body `user_id` is ignored; only the verified request token with a matching email may link a user. There is no public email-search endpoint or new public read policy.

The existing signed-in member-question form explicitly sets `question_only: true`; matching verified-email requests may append a question to the existing seat through a private atomic RPC, returning `questionSubmitted: true`. It does not create another registration or email. Guests cannot use this mutation.

### Mobile bridge (pinned with app worker)

POST `app-family-squares-sync`, authenticated by existing `x-membership-sync-secret` / `MEMBERSHIP_SYNC_SECRET`:

```json
{
  "action": "ensure-registration",
  "meeting_date": "2026-10-12",
  "attendee": { "email": "verified@example.test", "name": "Verified person" }
}
```

Only after the atomic database operation succeeds:

```json
{ "ok": true, "already_registered": true, "meeting_date": "2026-10-12" }
```

`already_registered` is false for a new seat and true for an existing seat, including manual, auto-registered, or batch-app registrations. The bridge normalizes email, validates a real Monday within its existing current-through-21-days window, checks cancellation and blocklist, and fails non-2xx on denied/invalid/failed operations. It returns no IDs, contact details or Zoom links. The **app server** must derive verified account email and canonical occurrence; the shared secret must never be in the mobile client.

The existing batch `{meeting_date,attendees}` contract is unchanged. Ensured rows are durable `website` registrations; existing transient `app` mirrors are atomically promoted without overwriting contact/consent/question details. Batch deletion remains constrained to `registration_source='app'`. An absent/stale snapshot therefore cannot delete an ensured registration before native RSVP persistence. Real Postgres overlapping transactions verified this with an observed lock wait and `DELETE 0` after promotion.

The app bridge creates no confirmation email, marketing, CRM, or Zoom-provider calls; the app supplies access and reminders. Manual/auto website registration continues its one-time confirmation path.

## Routes and side effects traced

- `public/monday-zoom-registration/index.html` takes static precedence on direct navigation.
- React `MondayZoomRegistration.tsx` also serves `/family-squares`, `/monday-zoom-registration`, `/monday-zoom`, `/monday-night-zoom` and its member-question mode.
- `FamilySquaresKiosk.tsx` uses the same public function; it now renders the same friendly outcome and clears shared-device details.
- `auto-register-zoom` inserts through the same database uniqueness guard; overlapping runs skip conflict without sending.
- Legacy `register-zoom-meeting` previously rewrote existing data and resent emails; it now insert-or-returns the friendly repeat result.
- `send-zoom-registration-email` is service-only and atomically claims `confirmation_claimed_at` before sending attendee/admin confirmations or Mailchimp updates. Repeated invocation cannot resend.
- These paths use the existing shared meeting join details, not Zoom's registrant-creation API; no new provider registration call was introduced.

## Deployment gates (not executed)

1. Independent review of this source and the app companion commit; confirm current remote main before merge.
2. **Legacy duplicate reconciliation gate:** the migration deliberately aborts, transactionally and without deleting data, if existing normalized email/date duplicates exist. Read-only preflight (counts only):

   ```sql
   SELECT count(*) AS duplicate_groups FROM (
     SELECT 1 FROM public.zoom_meeting_registrations
     GROUP BY lower(btrim(email)), meeting_date HAVING count(*) > 1
   ) d;
   ```

   If nonzero, obtain approval for a reviewed consolidation/archive migration preserving questions, consent, links, attendance, lead scores and cascading follow-up references. Do not delete rows ad hoc or deploy functions assuming the unique index exists. Production was not queried, so this gate is **unverified**.
3. Run a complete migration-chain reset on an isolated backend. The provided SQL test is a minimal affected-table **delta** gate, not a full-chain replay or production catalog verification. Check for schema drift, historic migration collisions, privileges and all foreign keys.
4. Apply `20261012224330_monday_registration_idempotency.sql` to the website project, then deploy `public-register-monday-zoom`, `register-zoom-meeting`, `auto-register-zoom`, `send-zoom-registration-email`, and `app-family-squares-sync` with their shared imports. Do not enable the native caller before the bridge and RPC are available.
5. Publish the website separately through Lovable after approved source synchronization; app source/binary and app backend deployment are separate gates.
6. Approved synthetic integration verification across both real project boundaries, with explicit permission before any email/provider sends. No live registration was created in this work.

### Delivery trade-off

The email claim implements **at-most-once attempts**, not guaranteed delivery. If a process fails after claiming or SendGrid accepts a request but the response is lost, normal repeats intentionally do not resend. `confirmation_claimed_at` without `confirmation_completed_at` is an operator-reconciliation signal; never clear it blindly. Existing registrations are marked claimed by the migration because previous delivery cannot safely be inferred. No automated retry worker was introduced.

### Dependency baseline issue

`npm ci` fails on main's existing React/router peer conflict and out-of-sync lockfile. Verification used `npm install --legacy-peer-deps --package-lock=false --ignore-scripts`; package manifests/lockfiles were not changed. This does not close clean-install reproducibility.

## Executed checks

- `node scripts/test-monday-registration.mjs`: 8 tests executing actual transpiled handlers with synthetic database/provider IO (concurrency, auto/manual, retry, new week, private identity, questions, service claims, bridge and empty batch).
- `python scripts/test-monday-registration-db.py sh-monday-idempotency-test`: isolated PostgreSQL 17 delta gate; duplicate preflight rollback, index/normalized key, scoped dates, service-only grants, claim protection, real lock-wait concurrency, durable app promotion versus stale batch delete, member-question retries.
- `node scripts/test-monday-registration-browser.mjs`: 4 Chromium cases at 390px covering static and React routes with new/duplicate responses; every external request mocked or blocked.
- Vite production client build, TypeScript app check, Deno checks for all five changed edge handlers, scoped ESLint, staged whitespace check.

No app source was touched. The original website checkout's pre-existing changes were left in place.
