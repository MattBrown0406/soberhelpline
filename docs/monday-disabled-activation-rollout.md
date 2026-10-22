# No-registration-maintenance notification cutover — conditional, not a routing guarantee

## Decision and scope

This candidate removes the need to **drain old invocations for retained preactivation occurrences**. It does **not** prove all traffic uses the new sender. Source base: freshly fetched `origin/main` `cad009097142a931e9eb101753add394896fb0ac`; isolated branch `fix/monday-disabled-activation`. Nothing pushed, deployed, migrated remotely, or emailed.

An unconditional claim that this protects **every** preactivation occurrence is invalid if an old worker can retain an identity that is deleted/rekeyed before either snapshot. A second independent counterexample is an old worker routed a fresh postactivation registration. Both are represented in executable SQL tests. No Supabase atomic worker-replacement or maximum-old-worker-lifetime guarantee is assumed. A runtime revision ACK proves that **one invocation** ran this release, not global routing.

**One explicit bounded release decision, not another maintenance checklist:** after verifying the deployed revision, approve a ten-minute pilot restricted in SQL to **one controlled normalized email + exact meeting date**, accepting possible overlap with legacy code for that occurrence, or leave this candidate disabled. The new sender can consume at most two recipient claims (owner + attendee) for that one occurrence and no new claims after the deadline. This bounds the *additional new-side attempts*, not old-worker behavior or the completion time of already-claimed provider calls. Existing registration APIs remain usable either way; new-side notifications for other identities remain held during the pilot. Do not describe a ten-minute wait as proof of global routing. Unrestricted activation remains a separate explicit risk decision, not an automatic result of a passing pilot. No acceptance is made on the user's behalf.

## Proven boundaries

1. Install the new private ledger **DISABLED**, with an initial conservative hold snapshot. The revised sender's first authenticated operation checks this state. Missing/malformed state, wrong revision or lookup error fails closed; disabled requests return HTTP 200 with `success:false, notificationDisabled:true`, with no provider/CRM attempt or delivery claim. HTTP 200 avoids inventing a registration failure contract; it does not promise caller retries. Existing callers continue using `{registration_id, ...}` and service authorization.
2. Deploy only the sender bundle while disabled. An authenticated `{rollout_probe:true}` request returns revision `monday-ledger-disabled-v1`, state and a newly persisted acknowledgment UUID. It reads no registration and sends no mail, even after activation. Operator also records the backend deployment receipt/version for the exact reviewed artifact; source synchronization is not deployment.
3. Operator activation requires that exact revision and a matching database ACK observed within ten minutes, explicit legacy-risk acceptance, READ COMMITTED and migration-owner privileges. It locks the private control row, then takes `SHARE` on registrations. It waits for preexisting writers; subsequent inserts/updates/deletes wait until activation commits. This is short **database write contention**, not a promise of zero registration latency or zero writer timeouts. Use the transaction timeouts below. No frontend/app maintenance, cron change or writer deployment is required.
4. After obtaining the registration lock, activation captures `clock_timestamp()` as an exact `timestamptz`, snapshots **all currently retained occurrences** (including future weeks) to both recipient holds and retains their registration IDs. Only after the snapshot does it enable claims in the same transaction. No snapshot/enable visibility gap; read-committed snapshots see writers the lock waited for. Rollback leaves disabled.
5. Claims take a shared control-row lock, so they cannot race partial activation. Eligibility requires `created_at > activated_at` using full timestamps, a nonhistorical meeting date, an ID not frozen in either snapshot and no existing normalized-email/meeting-date/recipient ledger key. Equality and backdated transactions fail closed. A transaction that began before activation but inserted afterward with default `now()` may therefore be conservatively skipped; there is no automatic recovery.
6. IDs remain frozen even if their email/date/created_at is later changed. Both installation-time and activation-time email/week keys remain held, regardless of later deletion. **Late duplicate rows with a new ID but the same normalized email and exact held meeting date cannot send either recipient.** A genuinely new next-week occurrence is not lifetime-suppressed. `meeting_date` remains the exact existing occurrence key; there is no inferred week truncation or timezone conversion of that date. The historical guard compares it with today's Los Angeles calendar date, not an invented event timestamp.
7. Neither installation nor activation changes any registration field, child row, FK, trigger, index, RLS policy or client grant. The only new writes are private notification records. No historical sweep/reset/replay exists. Ambiguous outcomes retain their claim. Owner/attendee claims remain independent; all original comment/history, consent and suppression behavior stays intact.

## The exact assumptions and residual risk

- For an old in-flight invocation whose persisted occurrence key is represented in either snapshot, the new sender stays held for that occurrence forever; the old invocation may finish without a global drain. This prevents a **new-side additional attempt**, not duplicates among old workers themselves.
- If routing continues to send **new postactivation registration IDs** to legacy code that does not consult this ledger, that old worker and a new worker can each attempt mail. Neither a revision ACK nor this migration can fence code that ignores it. Deployment acknowledgment is necessary evidence, not sufficient proof of no overlap.
- If a registration is inserted and then deleted/rekeyed between snapshots (or an older identity disappeared before installation), an old worker may already retain the vanished identity. A later row with that email/week can appear new. No snapshot-only additive ledger can recover such missing identity history. Captured IDs/keys are protected; unobserved old identity versions are not. This is not solved by saying an old request once referred to a persisted ID.
- Disabled-window registrations remain held at activation, even if no old worker ever sent them. This intentionally trades missing confirmations for no automatic historical replay. No claims of delivery restoration for those rows, caller retries, exact-once mail, or provider inbox delivery are made.

The optional bounded pilot is enforced by the same claim RPC: operator-only `pilot_email_key`, `pilot_meeting_date` and `claim_deadline` fields restrict eligible claims without changing writers. Runtime service credentials cannot widen or disable those restrictions. This provides an executable finite-risk choice; it does not certify unrestricted routing after the pilot. A zero-overlap global guarantee is not achievable inside this sender/private-ledger-only scope without stronger evidence/control.

## Exact release allowlist (not executed)

1. Apply **only** `supabase/migrations/20261022012700_monday_notification_disabled_activation.sql`. CLI-generated using Supabase 2.116.0. It is a standalone **superseding** installer, not a follow-up to `20261022005150_monday_notification_ledger_compatible.sql`. The latter remains historical source and **must not also be applied**. Do not run blanket `db push` or old pending migrations. Both installers reject an already-existing private namespace, so an incorrect sequence fails instead of resetting data. If the earlier ledger is actually installed, this is not its upgrade path: stop at that concrete mismatch.
2. Deploy only `send-zoom-registration-email/index.ts`, `_shared/mondayNotificationContext.ts`, and unchanged `_shared/suppression.ts`. Do not deploy registration/auto/app handlers, change their database contracts, or deploy unrelated main changes. Review the exact bundle and record its backend deployment receipt/version.
3. Make a service-authenticated backend request with JSON `{"rollout_probe":true}` through the normal endpoint. Read back the returned ACK row and control state below. Do not call the acknowledgment RPC directly and present that as deployed-worker evidence. Do not print service credentials.
4. Only after explicit approval of the above risks, run this exact transaction as the migration owner, substituting the returned UUID (not the example text):

```sql
begin isolation level read committed;
set local lock_timeout='5s';
set local statement_timeout='60s';
-- Recommended bounded pilot: use a controlled email and the actual occurrence.
-- Do NOT create its registration until after activation, or it will be held.
update monday_notification_private.control
set pilot_email_key=lower(btrim('<CONTROLLED-EMAIL>')),
    pilot_meeting_date='<MEETING-DATE>'::date,
    claim_deadline=clock_timestamp()+interval '10 minutes'
where singleton and not enabled and activated_at is null;
select monday_notification_private.activate(
  'monday-ledger-disabled-v1',
  '<ACK-UUID>'::uuid,
  true -- explicit user-approved legacy-overlap risk acceptance, NOT routing proof
);
commit;
```

A timeout or guard error rolls back. Fix only that error; no registration-maintenance fallback is implicit. The ACK expires after ten minutes; refreshing a no-send probe is sufficient if it expires. No old-worker drain proof is required for the captured keys.

5. Read back the exact control row, ACK, grants and hold totals. Activation is irreversible through this function and cannot resnapshot/reset claims. With separate live-email approval, a new controlled occurrence can verify real recipient outcomes; tests here never send. Keep current/future held occurrences held. Rollback must retain private evidence and this compatible sender; do not roll back to an unknown legacy sender or drop the ledger.

```sql
select enabled,expected_revision,installed_at,activated_at,activation_ack,routing_risk_accepted,
       pilot_email_key,pilot_meeting_date,claim_deadline
from monday_notification_private.control;
select id,revision,observed_at from monday_notification_private.revision_acks
where id='<ACK-UUID>'::uuid;
select recipient_kind,state,count(*) from monday_notification_private.deliveries group by 1,2 order by 1,2;
select count(*) as fabricated_hold_attempts from monday_notification_private.deliveries
where state='legacy_unknown_hold' and (token is not null or attempted_at is not null or accepted_at is not null);
select has_function_privilege('service_role',
 'monday_notification_private.activate(text,uuid,boolean)','execute') as runtime_can_activate,
 has_column_privilege('service_role','monday_notification_private.control','enabled','update') as runtime_can_enable;
```

Expect zero fabricated timestamps, runtime activation/enable false. Service has UPDATE only on a dummy `lock_guard` column to permit `FOR SHARE`, not on control fields. All new tables have RLS and no client policies/grants; all RPCs are SECURITY INVOKER with fixed empty search path. The migration owner remains privileged, as before.

To stop **new** claims without a registration pause, the operator can transactionally `update monday_notification_private.control set enabled=false where singleton;`. Already issued claims/provider calls are not canceled, and old code remains outside this switch. Do not clear attempts or call activation again; recovery needs an explicit reviewed decision.

## Executable verification

- `python scripts/test-monday-disabled-activation.py`: disposable network-disabled PostgreSQL 17.6; synthetic duplicate-bearing FORCE-RLS schema, all-field/child equality at installation **and activation**, genuine concurrent insert/activation/claim lock waits, late normalized duplicates, timestamp equality/backdating, historical replay refusal, changed old IDs, held-key deletion, next-week eligibility, independent recipient claims, token fencing, client/runtime ACL denials, and explicit mixed-version/vanished-identity counterexamples. Synthetic provider-attempt rows model the counterexample only; they are not live legacy execution or fabricated provider results.
- `node scripts/test-monday-registration.mjs`: actual handler execution with synthetic DB/provider IO, including disabled/no-send probe, fail-closed status/revision failures, and previous compatible sender coverage.
- `node scripts/test-monday-suppression.mjs`: actual unchanged suppression wrapper with synthetic IO.
- `npx --yes deno@2.5.6 check --no-lock supabase/functions/send-zoom-registration-email/index.ts`: direct edge typecheck, not frozen CI or live deployment proof.

- Baseline RED: `REVIEW_BASELINE_REF=cad009097142a931e9eb101753add394896fb0ac REVIEW_TEST_FILTER='disabled sender and authenticated revision probe' node scripts/test-monday-registration.mjs` exits 1 (`success:true` versus required `false`); repaired handler passes. This reads the old Git ref without replacing files.

The original migration's existing SQL test remains separately runnable. Full historical migration-chain replay, live-schema clone, live caller behavior and provider routing are **not** claimed. See the companion test-output artifact for actual final execution.

References inspected: PostgreSQL 17 explicit table/row locking and READ COMMITTED isolation documentation; Supabase changelog index. These establish database semantics, not worker routing guarantees.
