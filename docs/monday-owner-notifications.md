# Monday owner notifications and manual registration history — local only

## Scope and release status

- Worktree `/root/repos/soberhelpline-owner-notifications`, branch `fix/monday-owner-notifications`, base `8138e9c73da4b086c472088a6170d4696bbdfa4d`.
- Website backend `anwqprmpzmcqbkttmxos`, **not** SoberHelplineApp. Provider remains SendGrid; owner remains `matt@soberhelpline.com`.
- Local additive schema design was expressly authorized. Migration file was created with `npx --yes supabase@2.116.0 migration new monday_manual_occurrence_provenance`. No historical migration was renamed. Version prefixes are unique and the new migration sorts last.
- No live migration, registration, provider send, deployment, commit, push, publication, or native release was performed. Only a disposable local PostgreSQL database received synthetic test writes. Existing unrelated QA containers were not changed.
- Parent reports Supabase project access returns 403. Production catalog, deployed versions, logs, secrets, suppression status, provider activity and inbox delivery remain **unverified**. Local fixes are not proof of the production root cause.

## Notification fixes preserved and extended

1. Owner comments are rendered independently of the follow-up checkbox, HTML-escaped and multiline-preserving. Participant mail never receives the private comment or registration-history count. Stored identity/content, not caller-supplied details, are authoritative.
2. All three registration writers use a checked notification caller. HTTP errors, rejected fetches and synthetic suppression are not mistaken for delivery. A saved registration remains saved on notification failure; callers expose `emailSent:false` or `notificationFailures` without provider response bodies.
3. Shared `suppression.ts` now fails closed on returned database errors, thrown errors, malformed payloads and failed later pages. It queries actual normalized recipient identities, escapes LIKE wildcards, filters exact normalized matches, drains keyset pages to empty regardless of the API cap, and has no stale opt-out cache. It checks `to`, `cc`, and `bcc`, including URL/Request fetch inputs. Fully suppressed sends retain the distinguishable synthetic `202` marker; lookup failures return `503` without provider dispatch. No opt-out bypass or suppression deletion.
4. Sender reads details, blocklist, settings and history, renders both messages, verifies configuration, and preflights suppression **before** atomically claiming. Settings/blocklist/suppression preflight failures therefore consume no claim and can recover on a later authorized invocation. The wrapper rechecks suppression at actual dispatch.
5. Once claimed, all recipient outcomes are awaited with `allSettled`. Partial/ambiguous delivery retains the claim and no completion. Never clear a claim merely because a request failed. A wrapper lookup may fail after a successful preflight/claim; that still requires reconciliation because the other concurrent recipient may already have been dispatched. No automated resend/outbox was added.

### Shared suppression blast radius

The shared module affects every function importing it **when that function is rebuilt/deployed**. Non-SendGrid fetches pass through unchanged; SendGrid subscription tracking remains enabled. Lookup failures intentionally change from fail-open dispatch to HTTP 503. Existing callers outside this repair may not distinguish synthetic 202 suppression from provider acceptance; this patch does not claim to repair their reporting. Do not redeploy all functions just to distribute this module: inventory/test each separately approved consumer. Targeted recipient lookups and no cache increase database read frequency; validate latency and operational limits on staging.

## Durable prospective manual-action provenance

Migration: `supabase/migrations/20261022000636_monday_manual_occurrence_provenance.sql`.

- `monday_manual_occurrences` stores one service-recorded action per **normalized email + meeting date**, with first-recorded timestamp and `public`, `legacy`, or `kiosk` channel. It is independent of `auto_register` (a future enrollment preference) and mutable `registration_source` (including app durability promotion).
- `register_monday_manual(jsonb,text)` atomically saves/promotes the seat **and** inserts evidence. A provenance write failure rolls back the seat. Concurrent manual retries and auto/manual races cannot produce duplicate occurrences. Conflicts preserve participant fields, consent, existing question, and delivery claims; app mirrors are promoted durably, while existing automatic source remains automatic and receives independent manual evidence.
- Public and legacy handlers use that RPC. Kiosk uses the public handler; its channel is classified from caller-provided attribution.pagePath, so it is attribution, not proof of physical kiosk use. A captured manual action is a submission for an email, not proof of mailbox ownership. Caller-provided claim timestamps are not copied into the ledger. An ordinary repeat records the action once but does not resend email, marketing, scoring or kiosk follow-up effects.
- Question-only submissions use the existing verified-email append RPC, do not create seats, do not create manual evidence, and do not send a second registration email. A missing seat fails rather than fabricating a registration.
- Past-date manual submissions are rejected (Pacific calendar day) by both the public handler and SQL RPC. A fabricated backdated request cannot convert an unknown old occurrence into evidence. The legacy endpoint already selects the current/next meeting server-side.
- Automatic jobs and the app bridge never call the manual RPC. Their `website`, `automatic`, or `app` source values are not evidence of a manual action.
- RLS is enabled on both new tables with no client policies. `PUBLIC`, `anon`, and `authenticated` have no table access or RPC execution. RPCs are `SECURITY INVOKER` with empty search paths. Service role has ledger SELECT/INSERT, **not UPDATE/DELETE**. No cascading seat FK: deletion of a mirror or seat cannot erase evidence. This is deliberate retention of private email/date evidence; approve its retention/account-erasure handling before release rather than adding an unreviewed purge.
- There is **no historical backfill or historical row mutation**. Old kiosk/website/automatic/app seats can all lack evidence of a later manual action; none is relabeled or guessed.

## Count and completeness contract

`monday_manual_history(text,date)` performs a single service-only SQL aggregate, avoiding Data API page limits and inconsistent multi-page history reads:

- `verifiedManual`: distinct captured manual occurrences strictly before **both** the current registration's occurrence and today's Pacific calendar date. Current/future meetings are excluded even when registering weeks ahead. Repeat clicks count once. Attendance is not counted.
- `unclassified`: distinct retained prior seat occurrences without manual evidence whose creation predates certified continuous capture (or whose creation date is null). Until capture is certified, all non-ledger prior occurrences are unclassified. After certification, newly created seats without manual evidence are known not to have a captured manual action. Pre-cutover ambiguity remains; source and auto-enrollment preferences never establish manual evidence.
- `completeSince`: initially null in `monday_manual_history_coverage`. Installing the migration is **not** proof every manual writer has been upgraded. A release operator may certify the beginning of continuous capture only after all writers, in-flight old requests and rollback paths are accounted for.

The owner email shows verified count, separate unclassified count and coverage status. It never claims an exact lifetime total; deleted pre-cutover history and other email identities are not reconstructable. An aggregate lookup failure is explicitly **unavailable, not zero** and does not prevent the owner from receiving the submitted comment. Counts and ledger details are never returned by public registration endpoints.

## Manual entry paths

- Direct `/monday-zoom-registration/` static page → public handler.
- Legacy `/zoom.html` → public handler.
- React `/family-squares`, `/monday-zoom-registration`, `/monday-zoom`, `/monday-night-zoom` → public handler.
- `/family-squares-kiosk` → public handler with kiosk attribution.
- Legacy server endpoint `register-zoom-meeting` → same atomic manual RPC, channel `legacy`.
- App ensure/snapshot and automatic jobs are separate nonmanual writers. Source promotion remains compatible with their existing conflict/delete contract.

## Verification executed

- `node scripts/test-monday-registration.mjs`: **32 actual transpiled-handler tests**, synthetic DB/provider IO. Covers preserved notification behavior, service-only identity, private comments, duplicate/concurrent submissions, manual promotion of existing auto/app seats, channels, opt-in independence, question-only exclusion, unavailable history, claim retention and settings/blocklist/suppression preflight failure→recovery.
- `node scripts/test-monday-suppression.mjs`: **6 real-wrapper tests**. Includes capped second-page suppression, returned/thrown/later-page errors, zero provider calls on failure, no stale cache, cc/bcc, literal wildcard identities, malformed payload and URL/Request inputs.
- `python scripts/test-monday-registration-db.py sh-monday-idempotency-test-provenance`: PostgreSQL **17.6** affected-table **delta gate**. Runs both earlier idempotency migrations plus the new migration, verifies unchanged historical rows, grants/RLS even after temporary SELECT grants, append-only service ACLs, all channels, atomic rollback, backdate rejection, >1000-row SQL aggregation, cutoff certification and retained evidence. Real two-session tests observe `pg_stat_activity` **Lock** waits for manual/manual races, auto/manual in both orders, and app deletion/manual promotion in both orders. Also retains all previous duplicate, claim and question-merge SQL tests. This is **not a full migration-chain replay** or production catalog verification.
- `node scripts/test-monday-dates.mjs`: **288** passing source-helper cases.
- `node scripts/test-monday-registration-browser.mjs`: **8** Chromium route/new/repeat cases; external requests mocked or blocked.
- App TypeScript no-emit, four changed Edge-handler Deno checks (`--no-lock`), Vite production build, and whitespace checks pass. Vite retains large-chunk warnings. Dependencies were reused; no fresh `npm ci` or frozen-lockfile reproducibility claim.
- Existing baseline RED checks established the missing-comment and ignored-HTTP-status defects before this extension. Newly added SQL/handler tests are real executed local gates, not live provider verification.

## Final independent review

Approved for feature-branch delivery, not production deployment. The reviewer independently passed the 32 handler, 6 suppression, 288 date, 8 mocked-browser cases, TypeScript, whitespace, and real PostgreSQL delta/race gate; no new high/medium defects were found.

**Pre-existing production prerequisite:** migration `20260826055456_family_squares_kiosk_followup.sql` permits only `website`, `kiosk`, and `automatic` in the registration-source constraint. Existing app mirror code uses `app`, and no later checked-in constraint amendment was found. The delta harness omits this old constraint, so its passing app tests do not certify full-chain app integration. Inspect the authoritative production constraint and reconcile this explicitly before release; do not edit applied historical migrations or silently add a new schema change beyond the reviewed migration.

## Precise rollout prerequisites — none executed

1. Obtain independent final review and explicit release approval. Re-fetch/reconcile current main without overwriting unrelated work. Establish authorized access to **website** project `anwqprmpzmcqbkttmxos`; do not bypass the 403.
2. Verify deployed code, exact migration ledger and catalog: normalized email/date unique index; source constraint; confirmation claim/completion columns; ensure/append/merge RPC grants; actual table columns/types and triggers. Run a full isolated migration-chain reset and staging regression/advisor checks. The delta gate does not close that release gate. Do not blindly replay pending historical migrations or delete duplicates to make an index install.
3. Verify gateway/JWT configuration, service-role secret availability, SendGrid key presence, sender/domain verification, owner local suppression (boolean only), provider unsubscribe/bounce/block/spam state and delivery activity. Do not expose secret values/private notes or bypass opt-outs. Source defects do not establish which production failure caused missing mail.
4. Approve/apply **only** the new additive migration after confirming its prior-schema prerequisites. Keep coverage `complete_since=NULL`. Read back table ACL/RLS and RPC definitions. No records should be backfilled or relabeled. The new manual handlers must not be deployed before this RPC exists.
5. Deploy **sender first** with updated shared history/suppression modules; it accepts the registration-id contract. Then deploy **public-register-monday-zoom**, **register-zoom-meeting**, and **auto-register-zoom** with the existing checked-notification shared module. Deploy no unrelated function, app or provider changes. During the mixed-version interval, history remains explicitly uncertified.
6. After authorized synthetic staging/production smoke checks and after old in-flight/manual writers are drained, certify continuous capture with an explicitly reviewed timestamp in the singleton coverage row. Do **not** backdate to migration installation. Read it back. If any rollback reintroduces old manual writers, set certification to null and re-establish a later safe boundary after recovery; retain the ledger and old unknown history. A coverage assertion must never hide a gap.
7. Test new/repeated public, legacy and kiosk registration, automatic enrollment, manual promotion of an automatic/app seat, questions with follow-up unchecked, owner-private counts, and suppression/read-failure behavior. Any real registration/provider send requires separate explicit permission. Verify provider acceptance and inbox delivery separately; frontend publication alone cannot fix backend emails.
8. Monitor notification failures/incomplete claims. Reconcile already-missed owner notifications individually; do not replay participant confirmations or clear consumed claims blindly. A durable per-recipient outbox/retry system is outside this patch. Lovable source synchronization, Share → Publish and any native release remain separate approval boundaries.

The existing UI still uses its confirmation copy when `emailSent:false`; this repair adds truthful server/API outcomes, not a frontend delivery-warning redesign.
