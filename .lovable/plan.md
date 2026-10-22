# App registration notifications for "The Family Squares"

## Requested result
New app registrations notify **matt@soberhelpline.com**, clearly marked **Source: Sober Helpline App** in the email, with the registrant's details, meeting date, and submitted questions.

## Scope of this approval
Prepare and test the source changes only. Database changes, deployment, activation, test emails, historical replays, and clearing delivery claims remain on hold. The existing exact reviewed migration and sender bundle will not be silently altered or released under their previous approval.

## Changes
- Add an owner-only app notification path; do not send extra attendee confirmations or add app registrants to marketing lists.
- Establish a trustworthy new-RSVP signal before enabling this path. Repeated app synchronization, existing registrations, question-only submissions, declines, and question updates must not generate new-registration emails.
- Identify the app from persisted, verified registration provenance rather than a caller-supplied display label. Do not relabel existing website registrations.
- Preserve every registration, duplicate, linked record, and existing delivery hold.
- Retain suppression checks and unsubscribe links.

## Technical details
- The current app interface mirrors complete RSVP snapshots every 15 minutes; a snapshot is not proof of when a person registered. Confirm whether an explicit RSVP event contract with the app is required so an initial sync cannot replay old registrations as new.
- Use independently claimed owner delivery, with idempotency for a normalized email and exact meeting occurrence. Missing or disabled notification controls fail closed.
- Use synthetic tests only: new app RSVP, repeated sync/event, existing registration, question-only, declined, insertion failure/conflict, suppressed owner, disabled controls, and owner-only delivery. Preserve the reviewed rollout's no-replay boundaries.

## Release blockers
- The notification installer remains unapplied because the migration runner rejected its transaction statements.
- App handler changes are outside the previous sender-only release allowlist and require a revised review and separate deployment/activation authorization.
- Real email receipt cannot be verified while sending remains prohibited.

