# Workstream B: notifications & email (2026-11-10)

## What it adds

- **Forum emails** (`send-forum-notifications`, every 15 minutes). It looks at forum activity from the last 48 hours and sends four kinds of email:
  - **Replies:** one email per thread to the member whose post got a reply.
  - **@mentions.**
  - **Followed topics:** one email per member, listing the new threads.
  - **Host alert:** a new question in "This Week's Meeting" goes to admins, with its title and text. It never names the author.

  Member emails never contain a post body or anyone's name. The reply email may show the member's own post title, and the followed-topics email may show thread titles. Each email is recorded in `forum_notification_log` before it is sent and removed again if the send fails. A failed email is retried on the next run while it is still inside the 48 hours.
- **Weekly member note** (`send-member-weekly-note`, Tuesday 4 PM Pacific). It contains:
  - last Monday's recording (or "will be posted soon");
  - how many questions were answered;
  - the member's next step on her path;
  - one workbook exercise;
  - the three busiest forum threads (titles only);
  - next Monday's meeting.

  Each member is recorded once per week in `member_email_log` (`weekly_note`, the Tuesday's date).
- **Welcome email fixed.** The trigger now fires when a website family membership is inserted active **or becomes active later**; PayPal rows start `pending`. It never fires for memberships from the app (`plan_type = 'app'`) and sends at most once per person. It posts to the project URL with the cron secret. The function is now `verify_jwt = false` and checks the secret itself. The SQL marks every existing member (any non-pending family membership row) as already welcomed, so nobody who joined before gets a welcome now.
- **Email settings card**: four switches stored in `user_notification_preferences` (new columns `reply_notifications`, `followed_topic_notifications`, `weekly_member_note`).
- **Monday reminder**: the "Submit a Question" button now opens `/family-forum/this-weeks-meeting?compose=1`.

## Order

1. **Run `notifications.sql` first** (one migration). It creates the columns and ledgers the functions need, replaces the welcome trigger, and schedules the three cron jobs. The jobs call functions that don't exist yet. Until step 2, the forum job just gets a 404 every 15 minutes, which does no harm, and the weekly jobs don't run until Tuesday.
2. **Deploy the edge functions right after**, from the synced code:
   - `send-forum-notifications` (new)
   - `send-member-weekly-note` (new)
   - `send-welcome-email` (changed; `verify_jwt = false` in `config.toml`)
   - `send-member-zoom-reminder` (one link changed)

   Workstream D's `workbook_entries` and C's `member_learning_paths` are read by the weekly note. If those tables aren't there yet, the note falls back: "Choose your path", and any exercise.

Secrets: no new secrets. Uses the existing `SENDGRID_API_KEY` and `site_settings.cron_secret`.

## Read-only checks (after the SQL)

```sql
-- new preference columns
select column_name, column_default from information_schema.columns
where table_schema = 'public' and table_name = 'user_notification_preferences'
  and column_name in ('reply_notifications', 'followed_topic_notifications', 'weekly_member_note');

-- ledgers exist, RLS on, no client policies (expect rls = true, policies = 0)
select c.relname, c.relrowsecurity as rls,
       (select count(*) from pg_policies p where p.tablename = c.relname) as policies
from pg_class c where c.relname in ('forum_notification_log', 'member_email_log');

-- members' own-row policies on preferences (expect 3: SELECT, INSERT, UPDATE)
select policyname, cmd from pg_policies where tablename = 'user_notification_preferences';

-- welcome trigger: INSERT OR UPDATE
select tgname, pg_get_triggerdef(oid) from pg_trigger where tgname = 'on_new_family_membership';

-- existing members marked as already welcomed
select count(*) from public.member_email_log where kind = 'welcome';

-- the three jobs (commands send cron_secret; no pasted keys)
select jobname, schedule, active, command ~* 'cron_secret' as sends_cron_secret
from cron.job where jobname in ('send-forum-notifications-15min',
  'send-member-weekly-note-a', 'send-member-weekly-note-b');
```

After deploy, the forum job's latest responses should be `200` (not `401` or `404`):

```sql
select r.id, r.status_code, left(r.content, 300) as content, r.created
from net._http_response r order by r.id desc limit 10;
```

## Dry runs (send nothing)

Ask Lovable to run either of these. They call the function with the cron secret and return counts plus one rendered sample:

```sql
select net.http_post(
  url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/' || fn,
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := jsonb_build_object(
    'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
    'dry_run', true),
  timeout_milliseconds := 150000
) as request_id, fn
from unnest(array['send-forum-notifications', 'send-member-weekly-note']) as fn;
-- a minute later:
select id, status_code, left(content, 2000) from net._http_response where id in (<id1>, <id2>);
```

The weekly dry run reports `active_members`, `opted_out`, `already_sent`, `to_send`, `recording_published`, `answered_count` and `threads`.

## Send yourself a test weekly note

Put your own address in place of `YOUR-ADDRESS` (don't save it in the repo). It sends one sample to that address only, with "[Test]" in the subject. It sends nothing to members and records nothing in the ledger:

```sql
select net.http_post(
  url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-member-weekly-note',
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := jsonb_build_object(
    'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
    'test_email', 'YOUR-ADDRESS'),
  timeout_milliseconds := 60000
) as request_id;
```

The sample uses the first path's first step, so it shows the "next step" block. Replace `test_email` with `'force', true` to run the real send outside Tuesday 4 PM. That emails every member who hasn't had this week's note, so only do it on purpose.

## Notes

- **Followed topics:** if a topic has many followers, the run sends at most 200 emails. The rest go on the next run.
- **Weekly note:** each run sends at most 250 emails or works for about 100 seconds. The six runs in the Tuesday 4 PM hour finish larger lists.
- **Welcome email:** if SendGrid fails, that person's welcome is not retried, because the claim was already made. The failure shows in the function's logs as `send-welcome-email error`. To re-send one by hand, post to `send-welcome-email` with a body of `cron_secret` (read from `site_settings`, as above), `email` and `firstName`. Never change a membership's status to trigger it.
