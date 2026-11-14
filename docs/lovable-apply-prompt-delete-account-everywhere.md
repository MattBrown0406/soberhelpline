DEPLOY THREE FUNCTIONS AND PUBLISH: DELETE AN ACCOUNT ON THE WEBSITE AND IN THE APP TOGETHER. Read all of this before doing anything.

Background: until now the website had no way for a member to delete their own account (the page only had an email link), and deleting an app account left the website account in place. Main now has:
- New function `delete-account` (`verify_jwt = true`). The signed-in member deletes their own account. In order: refuses staff and provider accounts; cancels any family membership PayPal is billing; asks the Sober Helpline app to delete the account with the same confirmed email; deletes the website login. If PayPal will not confirm a cancellation, nothing is deleted.
- New function `app-account-deleted` (`verify_jwt = false`). The app calls it, server to server, with the existing `MEMBERSHIP_SYNC_SECRET` in the `x-membership-sync-secret` header, when a member deletes their app account. Same steps for the website account with that email.
- `paypal-subscriptions`: the service-key path that already starts and activates a family membership for a named account may now also cancel one. Nothing else in that function changed.
- Shared code: `supabase/functions/_shared/accountDeletion.ts`.
- Website: `/delete-account` now has a real delete button for a signed-in member.

It uses secrets that already exist: `MEMBERSHIP_SYNC_SECRET`, `SENDGRID_API_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET_KEY`, and (optional) `MOBILE_SUPABASE_URL`. No new secret. No database change: no migration, table, column, policy, trigger or job.

DO NOT TOUCH
- public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, the schema monday_notification_private and its control row, and the table zoom_meeting_registrations. Do NOT run any activation, probe or pilot step for the Monday notification ledger.
- paypal-webhook, paypal-reprice-members (never run it), paypal-sync-all, paypal-admin-sync.
- Every setting, secret, table, job and schedule, and every sign-in (auth) setting. No migrations.
- No manual invocations of any function. In particular do NOT call `delete-account` or `app-account-deleted`, and do not delete, create or change any account, membership or row to test this.
- Any function not named in step 2.
- Never print a secret value, a job command or a header. Counts only: no names, no email addresses, no phone numbers.

WHEN: any day. Not on a Monday between 5 PM and 9 PM Pacific.

STEP 0. Checks (read-only)
0a. On the synced main branch all of these must be true, or STOP and tell me main is not synced:
- `supabase/functions/delete-account/index.ts`, `supabase/functions/app-account-deleted/index.ts` and `supabase/functions/_shared/accountDeletion.ts` exist.
- `supabase/functions/paypal-subscriptions/index.ts` contains the text `requestBody.action === 'cancel-subscription'`.
- `supabase/config.toml` contains `[functions.delete-account]` followed by `verify_jwt = true`, and `[functions.app-account-deleted]` followed by `verify_jwt = false`.
- `src/pages/DeleteAccount.tsx` contains the text `delete-account`.

0b. Report yes or no for each, changing nothing:
- Are the secrets `MEMBERSHIP_SYNC_SECRET` and `SENDGRID_API_KEY` present? (Names only. Never print a value.)
- Does the database function `public.auth_user_id_by_email(text)` exist?
- Does the database function `public.has_role` exist?
- Do the tables `provider_submissions`, `consultation_providers`, `surveys` and `pending_free_memberships` exist in the public schema?

If any answer is no, STOP and tell me which. Do not deploy.

STEP 1. Nothing to set. Go to step 2.

STEP 2. Deploy
Deploy only these three functions, unchanged from main:
- paypal-subscriptions
- delete-account
- app-account-deleted

Then Publish the website.

STEP 3. Report
- The three function names and whether each deployed.
- Whether `delete-account` and `paypal-subscriptions` are deployed with their JWT check, and `app-account-deleted` without one.
- The answers from step 0b.
- Whether the website publish was requested.
- Any 500 responses from these three functions in the logs since the deploy (counts only).

Do not do anything else.
