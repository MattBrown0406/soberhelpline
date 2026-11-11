\set ON_ERROR_STOP off
\set VERBOSITY terse
CREATE OR REPLACE FUNCTION pg_temp.as_user(uid text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN PERFORM set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, false); END $$;
\set A '\'00000000-0000-0000-0000-00000000000a\''
\set B '\'00000000-0000-0000-0000-00000000000b\''
\set C '\'00000000-0000-0000-0000-00000000000c\''
\set E '\'00000000-0000-0000-0000-00000000000e\''
-- B: active member. E: cancelled but paid through. C: no membership.
INSERT INTO public.provider_subscriptions (user_id, status) VALUES (:B, 'active');
INSERT INTO public.provider_subscriptions (user_id, status, access_ends_at) VALUES (:E, 'cancelled', now() + interval '10 days');

\echo == member B posts (named, anonymous) and tries an archived space
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000b'); SET ROLE authenticated;
INSERT INTO public.forum_posts (id, topic_id, user_id, title, content) VALUES ('10000000-0000-0000-0000-000000000001', 'ask-community', :B, 'Named thread', 'hello');
INSERT INTO public.forum_posts (id, topic_id, user_id, title, content, is_anonymous) VALUES ('10000000-0000-0000-0000-000000000002', 'ask-community', :B, 'Anon thread', 'secret', true);
INSERT INTO public.forum_posts (topic_id, user_id, title, content) VALUES ('share-story', :B, 'Archived', 'x');
INSERT INTO public.forum_posts (topic_id, user_id, title, content, is_pinned) VALUES ('introductions', :B, 'Pinned?', 'x', true);
INSERT INTO public.forum_posts (topic_id, user_id, title, content) VALUES ('ask-community', :E, 'As someone else', 'x');
SELECT 'B via view: ' || string_agg(title || ' mine=' || is_mine || ' uid=' || coalesce(left(user_id::text,0) || 'shown','hidden') || ' pinned=' || is_pinned, ' | ' ORDER BY title) FROM public.forum_posts_secure;
SELECT user_id FROM public.forum_posts LIMIT 1;
SELECT 'B base table without user_id rows: ' || count(*) FROM (SELECT id, title FROM public.forum_posts) t;
UPDATE public.forum_posts SET is_pinned = true WHERE id = '10000000-0000-0000-0000-000000000001';
UPDATE public.forum_posts SET content = 'edited' WHERE id = '10000000-0000-0000-0000-000000000001';
RESET ROLE;

\echo == member E (cancelled, paid through) reads, replies anonymously in a thread, messages B
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000e'); SET ROLE authenticated;
SELECT 'E via view: ' || string_agg(title || ' uid=' || CASE WHEN user_id IS NULL THEN 'hidden' ELSE 'shown' END || ' mine=' || is_mine, ' | ' ORDER BY title) FROM public.forum_posts_secure WHERE parent_post_id IS NULL;
INSERT INTO public.forum_posts (id, topic_id, user_id, content, parent_post_id, is_anonymous) VALUES ('10000000-0000-0000-0000-000000000003', 'introductions', :E, 'reply', '10000000-0000-0000-0000-000000000001', true);
SELECT 'reply took parent topic: ' || topic_id FROM public.forum_posts_secure WHERE id = '10000000-0000-0000-0000-000000000003';
DELETE FROM public.forum_posts WHERE id = '10000000-0000-0000-0000-000000000001';
SELECT 'E could not delete B''s thread, still there: ' || count(*) FROM public.forum_posts_secure WHERE id = '10000000-0000-0000-0000-000000000001';
INSERT INTO public.private_messages (sender_id, recipient_id, subject, content) VALUES (:E, :B, 'hi', 'hello');
INSERT INTO public.private_messages (sender_id, recipient_id, subject, content) VALUES (:E, :C, 'hi', 'to a non-member');
INSERT INTO public.forum_mentions (post_id, mentioned_user_id, mentioning_user_id) VALUES ('10000000-0000-0000-0000-000000000003', :B, :E);
INSERT INTO public.forum_polls (post_id, question) VALUES ('10000000-0000-0000-0000-000000000001', 'poll on someone else''s post');
SELECT 'profiles E sees: ' || string_agg(coalesce(username,'-') || '/' || coalesce(first_name,'') || '/' || coalesce(last_name,''), ', ') FROM public.get_public_profiles(ARRAY[:B, :A]::uuid[]);
SELECT 'search: ' || string_agg(username, ',') FROM public.search_forum_members('qui');
RESET ROLE;

\echo == non-member C
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000c'); SET ROLE authenticated;
SELECT 'C via view rows: ' || count(*) FROM public.forum_posts_secure;
SELECT 'C base rows: ' || count(*) FROM (SELECT id FROM public.forum_posts) t;
INSERT INTO public.forum_posts (topic_id, user_id, title, content) VALUES ('ask-community', :C, 'Non-member', 'x');
INSERT INTO public.private_messages (sender_id, recipient_id, subject, content) VALUES (:C, :B, 'hi', 'spam');
SELECT 'C search rows: ' || count(*) FROM public.search_forum_members('qui');
RESET ROLE;

\echo == admin A (not a paying member): sees authors of anonymous posts, pins, posts anywhere
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000a'); SET ROLE authenticated;
SELECT 'A via view: ' || string_agg(coalesce(title,'(reply)') || ' uid=' || CASE WHEN user_id IS NULL THEN 'hidden' ELSE 'shown' END, ' | ' ORDER BY created_at) FROM public.forum_posts_secure;
UPDATE public.forum_posts SET is_pinned = true WHERE id = '10000000-0000-0000-0000-000000000001';
INSERT INTO public.forum_posts (topic_id, user_id, title, content) VALUES ('this-weeks-meeting', :A, 'Host post', 'x');
SELECT 'A profiles: ' || string_agg(coalesce(username,'-') || '/' || coalesce(first_name,''), ', ') FROM public.get_public_profiles(ARRAY[:B]::uuid[]);
RESET ROLE;
SELECT 'final: ' || string_agg(coalesce(title,'(reply)') || ' pinned=' || is_pinned, ' | ' ORDER BY created_at) FROM public.forum_posts;
SELECT 'author_is_staff on host post: ' || bool_or(author_is_staff) FROM public.forum_posts_secure WHERE title = 'Host post';
\echo == service role (edge functions, webhook) unaffected
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', false); SET ROLE service_role;
INSERT INTO public.forum_posts (topic_id, user_id, title, content, is_pinned) VALUES ('this-weeks-meeting', :A, 'Webhook thread', 'x', true);
SELECT 'service reads user_id: ' || count(user_id) FROM public.forum_posts;
RESET ROLE;
SELECT 'realtime still publishes forum_posts: ' || count(*) FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='forum_posts';
