DEPLOY TWO FUNCTIONS AND PUBLISH: ONE-PAGE MEMBERSHIP SIGN-UP. Read all of this before doing anything.

Background: main has a new one-page family membership sign-up for visitors who have no account yet.
- New function `membership-quick-start` (public, `verify_jwt = false` in `supabase/config.toml`). It creates the account with the normal sign-up call (so the normal "confirm your email" message is sent), saves the name, phone and forum username, and asks `paypal-subscriptions` for the PayPal subscription. It reads `PAYPAL_CLIENT_ID` and `PAYPAL_MODE`, which already exist. It needs no new secret.
- `paypal-subscriptions`: one added path at the top. A request that carries the service role key may name the account it acts for, and only to start or activate a FAMILY membership. Everything else in that function is unchanged, including prices, promo codes and the signed-in checkout.
- Website: `/family-membership?start=1` is the new page. The membership sales page buttons lead to it. People who already have an account keep the existing checkout.
- No database change. No new table, column, policy, job or schedule.

DO NOT TOUCH
- public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, the schema monday_notification_private and its control row, and the table zoom_meeting_registrations. Do NOT run any activation, probe or pilot step for the Monday notification ledger.
- paypal-webhook, paypal-reprice-members (never run it), paypal-sync-all, paypal-admin-sync.
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

0b. Report yes or no for each, changing nothing:
- Is email confirmation required for new sign-ups? (Expected: yes.)
- Do the allowed sign-in redirect addresses cover `https://soberhelpline.com/family-membership`? (The older sign-up already sends people there.)
- Does the database function `public.auth_user_id_by_email(text)` exist?
- Are the secrets `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET_KEY` present? (Names only. Never print a value.)

If email confirmation is NOT required, STOP and tell me. Do not deploy.

STEP 1. Nothing to set. Go to step 2.

STEP 2. Deploy
Deploy only these two functions, unchanged from main:
- paypal-subscriptions
- membership-quick-start

Then Publish the website.

STEP 3. Report
- The two function names and whether each deployed.
- Whether `membership-quick-start` is deployed as public (no JWT check) and `paypal-subscriptions` still has its JWT check.
- The four yes/no answers from step 0b.
- Whether the website publish was requested.
- Any 401 or 500 responses from these two functions in the logs since the deploy (counts only).

Do not do anything else.
