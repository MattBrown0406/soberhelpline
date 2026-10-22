# Duplicate-compatible registration notification repair

> This is the earlier source rollout record. On branch `fix/monday-disabled-activation`, use `docs/monday-disabled-activation-rollout.md` instead: its standalone disabled installer **supersedes**, and must not follow, the original ledger installer below. The new document includes tested routing limitations and a bounded pilot; neither source sync nor a revision probe proves all old workers have disappeared.

## Deliverable and exact boundary

Branch `fix/monday-owner-compatible`, isolated worktree `/root/repos/soberhelpline-owner-compatible`, based on `origin/main` `ec0f49f246ebdff9a65895f0b6cde02705d220f6` (local `main` is older). Earlier owner/prerequisite worktrees are untouched. **No live queries, sends, migrations, deploys, pushes or cron changes were performed.**

This is an independently applicable notification delta, not a registration-system migration. It replaces only `send-zoom-registration-email` and its notification context dependency. Existing registration callers can keep their existing service-authorized `{registration_id, ...}` request; extra caller identity/consent fields are ignored. Do NOT deploy the registration/auto/app handlers from main as part of this release: those still depend on the absent October 12/22 registration RPCs/index. No claims about the unavailable deployed source are made.

Implemented:
- A private, service-only delivery ledger with uniqueness on normalized email + meeting date + recipient kind. Existing duplicate IDs share one claim, but owner and attendee outcomes are independent. It does not require a global index or ANY of the old migrations.
- The owner message always includes escaped, multiline-preserving questions/comments, independent of follow-up preference. It includes each currently retained row for the same email/week, labelled by original registration ID and source, without parsing or merging raw text.
- Prior **distinct registered weeks across all sources**, computed server-side, excluding current/future dates and the notified occurrence. Explicit automatic-source contributions are identified. Unknown/default source labels are not treated as verified manual provenance. This is not an attendance count or exact manual lifetime count.
- Same fixed owner, attendee HTML, calendar attachment, meeting links, languages, persisted-row marketing-consent decision, blocklist and shared suppression wrapper. No consent union across duplicate rows. No registration UPDATE/DELETE, new FK, trigger, canonical winner, membership model, campaign or cron changes. Existing operational/comment updates remain permitted.
- All pre-existing occurrence/recipient keys start in `legacy_unknown_hold`, with NULL attempted/accepted timestamps. No historical resend, fabricated delivery or provenance backfill. Current/future pre-existing keys are also held. Fresh post-cutover keys can send.
- Claims are not automatically cleared after rejection, timeout, suppression or acknowledgment failure. Only provider success records `accepted`; this does not mean inbox delivery. Pre-claim read/configuration failure is retryable without a claim. After a possible external attempt, operator reconciliation is required. A retry can complete a recipient whose claim never succeeded without resending the other recipient.

## What this deliberately does not solve

- It is invoked by existing callers, not a new scheduled sweeper. A registration saved without a sender invocation does not become an automatic notification. Same-week manual actions on an already-existing auto/app seat may not invoke the live sender at all; this delta does not change that registration contract. It is therefore a **notification restoration for eligible new occurrence invocations**, not a complete manual-action-event rollout.
- Historical held messages, manual resubmission comments that a live writer never persisted, and comments added after an occurrence notification was attempted are not automatically emailed. All persisted comments/history remain intact. Recovery sending requires separate approval and recipient-specific reconciliation; no release/reset/recovery command is bundled.
- Exact manual lifetime totals cannot be recovered from source/default/auto-register preference fields. No claim of continuous prospective manual-action evidence is made. Broader distinct registered-week history is usable now and is explicitly qualified.
- It neither fixes nor needs to fix every legacy writer's duplicate insertion behavior. It prevents duplicate attempts through THIS confirmation sender. Other campaigns and external senders are untouched.
- Existing source operational mutation/deletion behavior is not redesigned or newly prohibited. This patch itself never loses or merges history. Counts reflect retained rows at read time; it cannot recover records deleted before or independently of this patch.
- Historical holds and accepted/failed attempts are reported as `held_or_previously_attempted`, not acceptance. Success is true only when both recipient operations in this invocation were accepted. Claims are at-most-once attempts, not guaranteed delivery or automatic retries.
- The user-relayed SendGrid-key/local-suppression findings do not establish the original missing-email cause. Provider acceptance, suppression outside the local database and inbox delivery remain live verification questions; no denied/unavailable provider inspection is repeated.

## Deployment artifact allowlist

1. Apply **only** `supabase/migrations/20261022005150_monday_notification_ledger_compatible.sql` as an explicit Lovable SQL operation. It was generated with `supabase migration new`. Do not run `db push`, replay the old pending migrations, or mark old absent DDL applied. Existing migration history is unavailable; use the authorized runner's normal exact-file record for this NEW delta, not a fabricated repair of the old ledger.
2. Explicitly deploy backend function `send-zoom-registration-email` using this branch's:
   - `supabase/functions/send-zoom-registration-email/index.ts`
   - `supabase/functions/_shared/mondayNotificationContext.ts`
   - existing reviewed `supabase/functions/_shared/suppression.ts` (include in bundle; its global fetch wrapper must not be omitted).
3. Do not deploy `public-register-monday-zoom`, `register-zoom-meeting`, `auto-register-zoom`, `app-family-squares-sync`, app/site changes, unrelated functions or cron jobs. Source sync/publish is NOT backend deployment.

The SQL verifies exact required column types, `service_role` BYPASSRLS, unfiltered access, and that the private namespace does not already exist. Unknown/mismatched schema fails transactionally rather than dropping/changing legacy objects. The preferred contact fields are expected to be text, as in repository DDL; a live mismatch is a bounded guard failure, not permission to coerce data. Existing rows must have nonempty normalized email and nonnull meeting date; invalid values also fail the transaction. Lock/statement timeouts bound the initial hold snapshot. A second application deliberately aborts rather than resetting claims.

## Staged release (requires operator approval; not executed)

1. Independent review this diff and test evidence. Operator verifies the function name/caller contract in Lovable's available view (only `registration_id` and service Authorization are required); do NOT repeat requests for full deployed exports, inaccessible migration history or empty logs. If an active caller cannot supply persisted ID/service authorization, stop at that concrete integration mismatch.
2. Arrange a short coordinated **notification-sender-only cutover**, draining old `send-zoom-registration-email` invocations before the hold snapshot and preventing old/new sender overlap. Do not turn off unrelated jobs or change registration/app data. Record registration IDs arriving during the notification pause for separate reconciliation; do not assume unknown live caller code guarantees retries or safe registration behavior during a pause. If the operator cannot isolate the sender safely, use a separately approved brief registration-maintenance window rather than silently risking overlap. This is a release coordination step, not a request for a system redesign.
3. Apply the exact new SQL once. A guard/timeout error rolls back; resolve that specific mismatch, not a broad migration replay. Read back the new functions, grants, RLS and state aggregates before activating the sender. Keep old/fresh unknown deliveries on hold rather than assuming unsent.
4. Deploy only the allowlisted backend bundle, verify deployment/version in Lovable, then resume sender invocations. Keep the private ledger on rollback; reverting to a row-claim-dependent main sender or dropping/resetting this ledger is NOT a safe rollback. If needed pause this sender and retain evidence while reverting to an operator-verified compatible artifact.
5. Only with separate live-send approval, perform one fresh registration under a controlled address/new occurrence that is not held. Verify both recipient results, ledger acceptance state, owner escaped comment + qualified count, attendee calendar/link parity and actual receipt. A repeated same-ID or duplicate-ID invocation must produce no new provider attempt. A legacy-held occurrence must not send. Do not bypass local/provider suppression or add recipients to make a smoke test pass.
6. Resume normal operation only after these exact checks. Investigate missing provider/inbox acceptance with authorized evidence separately. There is no automatic recovery sweep; missed pre-cutover notifications remain an explicit remaining item.

## Read-only post-apply checks (operator, no sends)

```sql
select recipient_kind, state, count(*)
from monday_notification_private.deliveries group by 1,2 order by 1,2;
select count(*) as false_legacy_timestamps
from monday_notification_private.deliveries
where state='legacy_unknown_hold' and
  (token is not null or attempted_at is not null or accepted_at is not null);
select p.proname, p.prosecdef, p.proconfig,
  has_function_privilege('anon',p.oid,'execute') as anon_execute,
  has_function_privilege('authenticated',p.oid,'execute') as authenticated_execute,
  has_function_privilege('service_role',p.oid,'execute') as service_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in
('monday_notification_context','claim_monday_notification','finish_monday_notification');
```

Expect zero false legacy timestamps; functions are SECURITY INVOKER, fixed empty search path, client execute false, service execute true. Private table RLS is enabled with no client policies/grants. Do not print private ledger email keys, comments or bearer tokens into general logs.

## Executed verification

- `node scripts/test-monday-registration.mjs`: **37 passing actual-handler tests with synthetic database/provider IO**. This includes baseline registration regressions, all-current-duplicate comments, independent recipient claims, consent nonunion, failed acknowledgments, preflight failures and held legacy outcomes. The unchanged registration tests are not evidence those handlers deploy on the live schema.
- `node scripts/test-monday-suppression.mjs`: **6 passing real-wrapper tests**, including suppression beyond API cap, thrown/returned/later-page errors, no stale cache, no leaked suppressed provider call.
- `python scripts/test-monday-notification-ledger.py`: real PostgreSQL 17.6 standalone-delta pass on a disposable, network-disabled duplicate-bearing synthetic table with app-partial uniqueness, FORCE RLS, conflicting fields and seven CASCADE/SET NULL incoming FK tables. Full row/child JSON equality, guard rollback, client ACL denials, observed two-session lock wait across different duplicate IDs, separate recipient claims, token fencing, stale identity rejection, 1,501 prior weeks beyond API caps, normal operational updates and safe replay rejection. Container removed and absence verified.
- `npx --yes deno@2.5.6 check --no-lock supabase/functions/send-zoom-registration-email/index.ts`: pass. This is a direct Edge typecheck, not a frozen CI/build claim.
- Baseline RED: `REVIEW_BASELINE_REF=ec0f49f246ebdff9a65895f0b6cde02705d220f6 REVIEW_TEST_FILTER='duplicate-bearing sender' node scripts/test-monday-registration.mjs` fails **4 sends versus expected 2**. The repaired test passes without swapping baseline files.
- `git diff --check`: pass. No full historical-chain replay or live-schema clone is claimed; missing live DDL facts are guarded at application time rather than invented. Earlier worktree status was rechecked and remains as found.

Reference consulted: current Supabase database function documentation (SECURITY INVOKER / grants), and changelog index; no new Supabase product API dependency was introduced.
