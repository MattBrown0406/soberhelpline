DEPLOY THREE FUNCTIONS AND PUBLISH: ONE-PAGE MEMBERSHIP SIGN-UP AND OWNER NOTICES. It is safe to run this even if an earlier version of this prompt (two functions) was already run. Read all of this before doing anything.

Background: main has a new one-page family membership sign-up for visitors who have no account yet.
- New function `membership-quick-start` (public, `verify_jwt = false` in `supabase/config.toml`). It creates the account with the normal sign-up call (so the normal "confirm your email" message is sent), saves the name, phone and forum username, and asks `paypal-subscriptions` for the PayPal subscription. It reads `PAYPAL_CLIENT_ID` and `PAYPAL_MODE`, which already exist. It needs no new secret.
- `paypal-subscriptions`: one added path at the top. A request that carries the service role key may name the account it acts for, and only to start or activate a FAMILY membership. Everything else in that function is unchanged, including prices, promo codes and the signed-in checkout.
- Owner notices: the email sent when someone presses the pay button now says "checkout started (not paid yet)". A second email, "Membership approved by PayPal", is sent when a family membership first becomes active, from `paypal-subscriptions` (browser returns from PayPal) or `paypal-webhook` (PayPal's own notice). In `paypal-webhook` the only change is that notice: it reads the row's status before the existing update and sends one email afterwards. Signature checking and every update are unchanged. Shared code: `supabase/functions/_shared/membershipApprovedNotice.ts`. It uses `SENDGRID_API_KEY`, which already exists.
- Website: `/family-membership?start=1` is the new page. The membership sales page buttons lead to it. People who already have an account keep the existing checkout.
- No database change. No new table, column, policy, job or schedule.

DO NOT TOUCH
- public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, the schema monday_notification_private and its control row, and the table zoom_meeting_registrations. Do NOT run any activation, probe or pilot step for the Monday notification ledger.
- paypal-reprice-members (never run it), paypal-sync-all, paypal-admin-sync. The PayPal webhook address and its settings at PayPal.
- Every setting, secret, table, job and schedule, and every sign-in (auth) setting, including email confirmation, which must stay ON. No migrations.
- No manual invocations of any function. Do not create a test account, a test subscription or a test payment.
- Any function not named in step 2.
- Never print a secret value, a job command or a header. Counts only: no names, no email addresses, no phone numbers.

WHEN: any day. Not on a Monday between 5 PM and 9 PM Pacific.

STEP 0. Checks (read-only)
0a. On the synced main branch all of these must be true, or STOP and tell me main is not synced:
- `supabase/functions/membership-quick-start/index.ts` exists.
- `supabase/functions/paypal-subscriptions/index.ts` contains the text `onBehalfOfUserId` and the text `service-check`.
- `supabase/config.toml` contains `[functions.membership-quick-start]` followed by `verify_jwt = false`, and still contains `[functions.paypal-subscriptions]` followed by `verify_jwt = true`.
- `src/components/MembershipOneStepCheckout.tsx` exists.
- `supabase/functions/_shared/membershipApprovedNotice.ts` exists, and `supabase/functions/paypal-webhook/index.ts` contains the text `notifyMembershipApproved`.

0b. Report yes or no for each, changing nothing:
- Is email confirmation required for new sign-ups? (Expected: yes.)
- Do the allowed sign-in redirect addresses cover `https://soberhelpline.com/family-membership`? (The older sign-up already sends people there.)
- Does the database function `public.auth_user_id_by_email(text)` exist?
- Are the secrets `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET_KEY`, `PAYPAL_WEBHOOK_ID` and `SENDGRID_API_KEY` present? (Names only. Never print a value.)
- On the table `public.provider_subscriptions`, which events does the trigger `on_new_family_membership` fire on (INSERT, UPDATE, or both)? Report only that.

If email confirmation is NOT required, STOP and tell me. Do not deploy.

STEP 1. Nothing to set. Go to step 2.

STEP 2. Deploy
Deploy only these three functions, unchanged from main:
- paypal-subscriptions
- paypal-webhook
- membership-quick-start

Then Publish the website.

STEP 3. Report
- The three function names and whether each deployed.
- Whether `membership-quick-start` is deployed as public (no JWT check), `paypal-subscriptions` still has its JWT check, and `paypal-webhook` kept the setting it had.
- The answers from step 0b.
- Whether the website publish was requested.
- Any 401 or 500 responses from these three functions in the logs since the deploy (counts only).

Do not do anything else.
