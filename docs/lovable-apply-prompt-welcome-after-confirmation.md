APPLY ONE MIGRATION AND PUBLISH: WELCOME EMAIL AFTER THE EMAIL ADDRESS IS CONFIRMED (second version, with a corrected check). The first version stopped at step 0b and changed nothing. Read all of this before doing anything.

Background: the member welcome email is sent by the database trigger `on_new_family_membership` on `public.provider_subscriptions`, through the function `public.trigger_welcome_email()`, when a family membership becomes active. With the one-page sign-up a membership becomes active before the person has confirmed their email, so the welcome arrived before they could sign in. Main now has:
- One migration, `supabase/migrations/20261114090000_welcome_email_after_confirmation.sql`. It replaces the body of `public.trigger_welcome_email()` and adds two functions, `public.send_member_welcome_if_due(uuid, boolean)` and `public.claim_member_welcome()`. The welcome now waits until the account's email is confirmed. It is still sent at most once per member (table `member_email_log`), through the same `send-welcome-email` function, with the same secret lookup.
- Website: a small check that calls `claim_member_welcome()` when a confirmation link has just signed someone in.

The migration touches only the public schema. It creates no table, column, policy or trigger, drops nothing, and does not create anything in the auth schema (it only reads `auth.users` inside the functions, as the existing function already does). It is safe to run twice.

DO NOT TOUCH
- The trigger on `public.provider_subscriptions` that calls `public.trigger_welcome_email()` (expected name `on_new_family_membership`): do not drop, recreate, rename, enable or disable it. It keeps pointing at that function.
- public-register-monday-zoom, auto-register-zoom, auto-create-monday-zoom, send-zoom-registration-email, the schema monday_notification_private and its control row, and the table zoom_meeting_registrations. Do NOT run any activation, probe or pilot step for the Monday notification ledger.
- Every setting, secret, table, job and schedule, and every sign-in (auth) setting. Email confirmation must stay ON.
- No function deploys: no edge function changed. No manual invocations of any function, and do not call `claim_member_welcome` or `send_member_welcome_if_due` yourself.
- Do not insert, update or delete any row in `provider_subscriptions`, `member_email_log` or `auth.users`.
- Never print a secret value, a job command or a header. Counts only: no names, no email addresses, no phone numbers.

WHEN: any day. Not on a Monday between 5 PM and 9 PM Pacific.

STEP 0. Checks (read-only)
0a. On the synced main branch all of these must be true, or STOP and tell me main is not synced:
- `supabase/migrations/20261114090000_welcome_email_after_confirmation.sql` exists and contains the text `claim_member_welcome`.
- `src/hooks/useWelcomeAfterConfirm.ts` exists.

0b. Paste this result. (An earlier version of this prompt looked in information_schema.triggers, which hides triggers from a read-only role and came back NULL. This version reads the system catalog instead.)

```sql
SELECT
  (SELECT string_agg(
            t.tgname || ' -> ' || p.proname || ' ['
            || concat_ws(', ',
                 CASE WHEN t.tgtype & 4  > 0 THEN 'INSERT' END,
                 CASE WHEN t.tgtype & 16 > 0 THEN 'UPDATE' END,
                 CASE WHEN t.tgtype & 8  > 0 THEN 'DELETE' END)
            || CASE WHEN t.tgenabled = 'D' THEN ', DISABLED' ELSE '' END || ']',
            '; ' ORDER BY t.tgname)
     FROM pg_trigger t
     JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE t.tgrelid = 'public.provider_subscriptions'::regclass
      AND NOT t.tgisinternal)                                                AS triggers_on_the_table,
  (SELECT pg_get_functiondef('public.trigger_welcome_email()'::regprocedure)
            LIKE '%member_email_log%')                                       AS welcome_function_is_the_current_one,
  (SELECT count(*) FROM public.member_email_log WHERE kind = 'welcome')      AS welcomes_logged_so_far,
  (SELECT count(*) FROM pg_extension WHERE extname = 'pg_net')               AS pg_net_installed;
```

All of these must be true, or STOP, paste the result and tell me. Do not apply anything:
- `triggers_on_the_table` includes a trigger that calls `trigger_welcome_email` on both INSERT and UPDATE and is not DISABLED. (Its name should be `on_new_family_membership`. If it has another name, say so, but that alone is not a reason to stop.)
- `welcome_function_is_the_current_one` is true.
- `pg_net_installed` is 1.

STEP 1. Apply one migration
Apply `supabase/migrations/20261114090000_welcome_email_after_confirmation.sql` exactly as written. If any statement is refused, STOP, tell me which statement and the error, and do not publish.

STEP 2. Publish the website.

STEP 3. Report (read-only). Paste this result:

```sql
SELECT
  to_regprocedure('public.send_member_welcome_if_due(uuid, boolean)') IS NOT NULL AS shared_function_exists,
  to_regprocedure('public.claim_member_welcome()') IS NOT NULL                    AS website_function_exists,
  has_function_privilege('authenticated', 'public.claim_member_welcome()', 'EXECUTE')                  AS signed_in_may_call_it,
  has_function_privilege('anon', 'public.claim_member_welcome()', 'EXECUTE')                           AS visitors_may_call_it,
  has_function_privilege('authenticated', 'public.send_member_welcome_if_due(uuid, boolean)', 'EXECUTE') AS signed_in_may_call_shared,
  (SELECT count(*) FROM pg_trigger t JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE t.tgrelid = 'public.provider_subscriptions'::regclass AND NOT t.tgisinternal
      AND p.proname = 'trigger_welcome_email' AND t.tgenabled <> 'D')             AS welcome_triggers_still_attached,
  (SELECT pg_get_functiondef('public.trigger_welcome_email()'::regprocedure)
            LIKE '%send_member_welcome_if_due%')                                  AS welcome_function_is_the_new_one,
  (SELECT count(*) FROM public.member_email_log WHERE kind = 'welcome')           AS welcomes_logged_now;
```

Expected: true, true, true, false, false, 1, true, and `welcomes_logged_now` equal to the number from step 0b (applying this must not send or log any welcome).

Also say: whether the migration applied, and whether the website publish was requested.

Do not do anything else.
