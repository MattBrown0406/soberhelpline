# App owner notifications — source-only candidate

Nothing in this candidate authorizes installation, deployment, activation, messages, registration changes, or replay. The existing reviewed sender and exact migration remain unchanged.

The new `app-family-squares-owner-notification` function sends only to Matt, labels the source as Sober Helpline App, uses the existing owner occurrence claim, and imports the suppression wrapper first. It never sends attendee mail or invokes marketing synchronization. The snapshot handler is deliberately unchanged: its complete 15-minute mirror cannot prove a new RSVP happened.

## Required contracts before release

1. The app's real RSVP action needs a durable event UUID and verified event receipt, created only for a successful **new** app registration with `rsvp=going`. Synchronization snapshots, question-only actions, declines, updates, ensure-registration, unsuccessful inserts, and existing website/app registrations must not create this receipt. Use the app server's verified identity, not client-supplied provenance. The app delivers `{event_id: UUID}` with the existing server-to-server secret; no raw email/name fields are accepted by this notification endpoint.
2. A separately reviewed, service-only `monday_app_rsvp_notification_target(_event_id uuid)` must read that durable receipt and the matching unchanged registration identity, returning `registration_id,email,name,question,meeting_date,registration_source,event_kind,rsvp,is_new_registration`. It returns null for ineligible, unverified, stale/rekeyed, cancelled, preactivation, or unsuccessful events. It must not create or relabel registrations. Snapshot-created rows alone are not evidence. Event identity and cutoff must be enforced in the database, not inferred by this handler. Receipt storage must preserve history and all existing registrations/children.
3. A separately reviewed service-only `monday_app_owner_notification_status(_revision text)` returns `{revision:'monday-app-owner-v1',enabled:boolean}`. Installation starts disabled and requires separate operator authorization. Existing sender activation must not enable this path automatically. Missing/malformed controls fail closed.
4. The held notification ledger must be installed and separately activated. Its original revision remains `monday-ledger-disabled-v1`. Owner claims share the normalized-email/exact-meeting-date key, preserving historical holds and deduplicating against website owner notifications. No claims are cleared or released, including timeout or failed delivery acknowledgment.

The app event writer, receipt storage/read RPC and dedicated control are **not implemented or installed** here: the existing sync supplies no trustworthy real-time registration signal. Their review and the app team's event integration are release blockers. Do not deploy this endpoint against the current database and describe it as working.

## Verification

Run `node scripts/test-monday-app-owner-notifications.mjs` and the existing registration and suppression tests. All IO is synthetic. Tests establish handler behavior, not live routing, app receipt authenticity, database ACLs or inbox delivery. Sending remains prohibited.