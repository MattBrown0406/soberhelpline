# Forum (workstream A) — database notes

SQL: `docs/_parts/forum.sql` (one migration, idempotent, run top to bottom).

## Edge functions / secrets

- None to deploy for the forum itself.
- `supabase/functions/zoom-webhook/index.ts` (NOT changed here) still creates the
  after-meeting thread in the **archived** `share-story` space. See "Follow-ups".

## Order

1. Apply `forum.sql` **together with** (or before) publishing the frontend. The new
   frontend reads `forum_posts_secure.is_mine` / `author_is_staff` and calls the new RPCs
   `search_forum_members`, `find_forum_members_by_username`; the old frontend reads
   `forum_posts` directly, which stops working after section 5 of the SQL (members lose
   SELECT on `forum_posts.user_id`). Ship both in the same Lovable publish.
2. Ask Lovable to regenerate `src/integrations/supabase/types.ts` afterwards (the view
   gains two columns; three new RPCs). The code uses `untypedSupabase` for those until then.

## What the SQL does

- `forum_posts` select/insert policies use `is_active_family_member(auth.uid())` (plus
  admin/moderator) instead of raw `status = 'active'`. Staff can also post and update.
- Trigger `guard_forum_post_write_trg`: non-staff cannot pin, move or re-own posts, cannot
  start new conversations outside `this-weeks-meeting`, `ask-community`, `introductions`,
  and a reply always takes its parent's topic. Service role / admins / moderators bypass.
- `forum_posts_secure` is recreated as an owner-rights view (`security_invoker = false`)
  that filters to members + staff itself, masks `user_id` on anonymous posts, and adds
  `is_mine`, `author_is_staff`. SELECT granted to `authenticated` only.
  (Supabase's linter will flag "security definer view"; that is intentional here.)
- `authenticated` loses SELECT on `forum_posts.user_id` (keeps the other columns and all
  write grants). `forum_posts` leaves the `supabase_realtime` publication.
- `private_messages` insert: membership rule; recipient must be a member or staff; no
  messages to yourself.
- `forum_mentions` insert: only from your own, non-anonymous post.
- `forum_polls` / `forum_poll_options` insert: only on your own post.
- `get_public_profiles`: same signature; `first_name`/`last_name` now NULL unless the
  caller is an admin. New `search_forum_members(_query)` and
  `find_forum_members_by_username(_usernames)` return `(id, username)` only.
- `pending_topic_requests` is left alone (the request-a-topic UI is removed).

## Read-only checks — BEFORE

```sql
-- 1. Current forum_posts policies and grants (save the output).
select policyname, cmd, qual, with_check from pg_policies where tablename = 'forum_posts';
select grantee, privilege_type from information_schema.role_table_grants
 where table_name = 'forum_posts' order by grantee;

-- 2. Is forum_posts in the realtime publication?
select * from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'forum_posts';

-- 3. Nothing else depends on the view (the SQL drops and recreates it). Expect 0 rows.
select distinct dependent.relname
from pg_depend d
join pg_rewrite r on r.oid = d.objid
join pg_class dependent on dependent.oid = r.ev_class
join pg_class source on source.oid = d.refobjid
where source.relname = 'forum_posts_secure' and dependent.relname <> 'forum_posts_secure';

-- 4. Any OTHER policy or function that reads forum_posts.user_id as a member would
--    break when members lose that column. Expect only forum_posts' own policies.
select schemaname, tablename, policyname from pg_policies
 where (qual ilike '%forum_posts%' or with_check ilike '%forum_posts%') and tablename <> 'forum_posts';

-- 5. Topic ids in use (anything not in the code's list shows as "not found").
select topic_id, count(*) filter (where parent_post_id is null) as threads, count(*) as posts
from public.forum_posts group by 1 order by 2 desc;

-- 6. forum_posts must NOT force RLS on its owner (the view relies on owner rights).
select relname, relrowsecurity, relforcerowsecurity from pg_class where relname = 'forum_posts';
```

## Read-only checks — AFTER

```sql
-- 1. View is owner-rights and owned by the table owner (normally postgres).
select c.relname, c.reloptions, pg_get_userbyid(c.relowner) as owner
from pg_class c where c.relname in ('forum_posts_secure', 'forum_posts');

-- 2. Realtime: expect 0 rows.
select * from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'forum_posts';

-- 3. Column privileges: authenticated has SELECT on every column EXCEPT user_id.
select column_name, privilege_type from information_schema.column_privileges
 where table_name = 'forum_posts' and grantee = 'authenticated' order by 1;

-- 4. The view returns rows for a member and none for a non-member. Replace the uuids
--    with a real member's id and a signed-up non-member's id (read-only; rolls back).
begin;
  set local role authenticated;
  select set_config('request.jwt.claims', '{"sub":"<MEMBER_UUID>","role":"authenticated"}', true);
  select count(*) as member_sees, count(*) filter (where user_id is null) as masked_anonymous
  from public.forum_posts_secure;
  select set_config('request.jwt.claims', '{"sub":"<NON_MEMBER_UUID>","role":"authenticated"}', true);
  select count(*) as non_member_sees from public.forum_posts_secure;   -- expect 0
rollback;

-- 5. Members cannot read user_id directly (expect: permission denied for table forum_posts).
begin;
  set local role authenticated;
  select set_config('request.jwt.claims', '{"sub":"<MEMBER_UUID>","role":"authenticated"}', true);
  select user_id from public.forum_posts limit 1;
rollback;

-- 6. The new functions and trigger exist.
select proname from pg_proc where proname in
 ('is_forum_staff','is_forum_post_author','can_mention_from_post','guard_forum_post_write',
  'search_forum_members','find_forum_members_by_username','get_public_profiles');
select tgname from pg_trigger where tgrelid = 'public.forum_posts'::regclass and not tgisinternal;
```

Then, in the browser as a member: open `/family-forum`, open a space, post, reply,
delete your own reply (confirms writes still work without SELECT on `user_id`), post
anonymously and check another member account sees "Anonymous member".

## Follow-ups for other owners

- **zoom-webhook** (`supabase/functions/zoom-webhook/index.ts`, not edited): on
  `meeting.ended` it posts the "Share Your Takeaways" thread with `topic_id: 'share-story'`
  (an archived space) in three places: the 7-day unpin `update`, the duplicate check, and
  the `insert`. Change all three to `'this-weeks-meeting'`. Also: the duplicate check uses
  `.maybeSingle()` (errors if two pinned threads exist that day) and the UTC date; the
  body still has a placeholder Google review link (`YOUR_GOOGLE_REVIEW_LINK`) and a
  "Become a member / free trial" pitch that every reader (already a member) sees. It runs
  with the service role, so the new trigger does not block it.
- **Recordings date**: `recording.completed` stores `recording_date` from Zoom's UTC start
  time, so a Monday 7 PM Pacific meeting is dated Tuesday. The forum's "Last meeting" card
  matches Q&A rows on that date or the Monday before it.
- `src/data/familyEducationTracks.json`, `familyOnboardingSequence.json` (C) link to
  archived topic ids (`share-story`, `treatment-discussions`, `boundaries`, `self-care`).
  They still open (read + reply), but new posts there are impossible; point them at
  `ask-community` (or use `forumComposeLink`).
