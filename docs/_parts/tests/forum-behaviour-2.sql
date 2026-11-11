-- Second forum behaviour test (run after forum-behaviour.sql on the same database).
-- Covers the review fixes: server-set created_at, one-level threads, length cap,
-- admin-only unmasking, moderators cannot re-own or un-anonymise, lapsed members
-- cannot edit/delete, mentions removed when a post goes anonymous.
\set ON_ERROR_STOP off
\set VERBOSITY terse
CREATE OR REPLACE FUNCTION pg_temp.as_user(uid text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN PERFORM set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, false); END $$;
\set A '\'00000000-0000-0000-0000-00000000000a\''
\set B '\'00000000-0000-0000-0000-00000000000b\''
\set E '\'00000000-0000-0000-0000-00000000000e\''
\set M '\'00000000-0000-0000-0000-0000000000dd\''
RESET ROLE;
INSERT INTO public.user_roles (user_id, role) VALUES (:M, 'moderator') ON CONFLICT DO NOTHING;

\echo == created_at is set by the server, on insert and update
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000b'); SET ROLE authenticated;
INSERT INTO public.forum_posts (id, topic_id, user_id, title, content, created_at) VALUES ('20000000-0000-0000-0000-000000000001', 'ask-community', :B, 'Future thread', 'x', '2031-01-01');
UPDATE public.forum_posts SET created_at = '2031-01-01', content = 'edited' WHERE id = '20000000-0000-0000-0000-000000000001';
SELECT 'created_at is not 2031: ' || (created_at < now() + interval '1 minute') || ', content=' || content FROM public.forum_posts WHERE id = '20000000-0000-0000-0000-000000000001';

\echo == a reply to a reply joins the same conversation
INSERT INTO public.forum_posts (id, topic_id, user_id, content, parent_post_id) VALUES ('20000000-0000-0000-0000-000000000002', 'introductions', :B, 'first reply', '20000000-0000-0000-0000-000000000001');
INSERT INTO public.forum_posts (id, topic_id, user_id, content, parent_post_id) VALUES ('20000000-0000-0000-0000-000000000003', 'introductions', :B, 'reply to the reply', '20000000-0000-0000-0000-000000000002');
SELECT 'nested reply parent is the thread: ' || (parent_post_id = '20000000-0000-0000-0000-000000000001') || ', topic=' || topic_id FROM public.forum_posts WHERE id = '20000000-0000-0000-0000-000000000003';

\echo == length cap (expect: too long)
INSERT INTO public.forum_posts (topic_id, user_id, title, content) VALUES ('ask-community', :B, 'Long', repeat('x', 20001));

\echo == moderator (not a member): moderates, but cannot see or change who wrote an anonymous post
SELECT pg_temp.as_user('00000000-0000-0000-0000-0000000000dd');
SELECT 'moderator view of anon thread: uid=' || CASE WHEN user_id IS NULL THEN 'hidden' ELSE 'shown' END FROM public.forum_posts_secure WHERE id = '10000000-0000-0000-0000-000000000002';
UPDATE public.forum_posts SET is_anonymous = false WHERE id = '10000000-0000-0000-0000-000000000002';
UPDATE public.forum_posts SET user_id = :M WHERE id = '10000000-0000-0000-0000-000000000001';
UPDATE public.forum_posts SET is_pinned = true WHERE id = '10000000-0000-0000-0000-000000000001';
SELECT 'moderator pinned it: ' || is_pinned FROM public.forum_posts_secure WHERE id = '10000000-0000-0000-0000-000000000001';
UPDATE public.forum_posts SET is_pinned = false WHERE id = '10000000-0000-0000-0000-000000000001';

\echo == admin sees the author of an anonymous post
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
SELECT 'admin view of anon thread: uid=' || CASE WHEN user_id IS NULL THEN 'hidden' ELSE 'shown' END FROM public.forum_posts_secure WHERE id = '10000000-0000-0000-0000-000000000002';

\echo == switching your own post to anonymous removes its mentions
RESET ROLE;
INSERT INTO public.forum_mentions (post_id, mentioned_user_id, mentioning_user_id) VALUES ('10000000-0000-0000-0000-000000000001', :E, :B);
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000b'); SET ROLE authenticated;
UPDATE public.forum_posts SET is_anonymous = true WHERE id = '10000000-0000-0000-0000-000000000001';
RESET ROLE;
SELECT 'mentions left on the now-anonymous post: ' || count(*) FROM public.forum_mentions WHERE post_id = '10000000-0000-0000-0000-000000000001';

\echo == lapsed member cannot edit or delete her old posts
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', false);
UPDATE public.provider_subscriptions SET status = 'expired' WHERE user_id = :B;
SELECT 'B is lapsed: ' || NOT public.is_active_family_member(:B);
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000b'); SET ROLE authenticated;
UPDATE public.forum_posts SET content = 'changed after lapsing';
DELETE FROM public.forum_posts;
RESET ROLE;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', false);
SELECT 'B posts still there after lapsed delete-all: ' || count(*) FILTER (WHERE user_id = :B) || ', edited after lapsing: ' || count(*) FILTER (WHERE content = 'changed after lapsing') FROM public.forum_posts;
UPDATE public.provider_subscriptions SET status = 'active' WHERE user_id = :B;
