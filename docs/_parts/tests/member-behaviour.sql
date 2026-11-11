\set ON_ERROR_STOP off
\set VERBOSITY terse
CREATE OR REPLACE FUNCTION pg_temp.as_user(uid text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN PERFORM set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, false); END $$;
CREATE OR REPLACE FUNCTION pg_temp.as_service() RETURNS void LANGUAGE plpgsql AS $$
BEGIN PERFORM set_config('request.jwt.claims', '{"role":"service_role"}', false); END $$;
\set B '\'00000000-0000-0000-0000-00000000000b\''
\set E '\'00000000-0000-0000-0000-00000000000e\''
\set C '\'00000000-0000-0000-0000-00000000000c\''

-- Welcome email: PayPal row inserted pending, then activated -> exactly one post.
SELECT pg_temp.as_service(); SET ROLE service_role;
INSERT INTO public.provider_subscriptions (user_id, status, paypal_subscription_id) VALUES (:B, 'pending', 'I-WELCOME1');
SELECT 'after pending insert, welcome posts: ' || count(*) FROM net.calls WHERE url LIKE '%send-welcome-email';
UPDATE public.provider_subscriptions SET status = 'active' WHERE user_id = :B;
SELECT 'after activation, welcome posts: ' || count(*) FROM net.calls WHERE url LIKE '%send-welcome-email';
UPDATE public.provider_subscriptions SET status = 'cancelled' WHERE user_id = :B;
UPDATE public.provider_subscriptions SET status = 'active' WHERE user_id = :B;
SELECT 'after cancel+reactivate, welcome posts: ' || count(*) FROM net.calls WHERE url LIKE '%send-welcome-email';
INSERT INTO public.provider_subscriptions (user_id, status, plan_type) VALUES (:E, 'active', 'app');
SELECT 'app-plan member, welcome posts still: ' || count(*) FROM net.calls WHERE url LIKE '%send-welcome-email';
SELECT 'welcome body has secret+email: ' || (body ? 'cron_secret' AND body ->> 'email' = 'member@example.invalid') FROM net.calls WHERE url LIKE '%send-welcome-email' LIMIT 1;
RESET ROLE;
-- Missing cron secret never blocks the membership write
DELETE FROM public.site_settings WHERE key = 'cron_secret';
SELECT pg_temp.as_service(); SET ROLE service_role;
INSERT INTO public.provider_subscriptions (user_id, status) VALUES (:C, 'active');
SELECT 'insert without cron secret succeeded: ' || count(*) FROM public.provider_subscriptions WHERE user_id = :C;
RESET ROLE;
INSERT INTO public.site_settings (key, value) VALUES ('cron_secret', 'test-cron-secret');

-- Learning path: own row only
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000b'); SET ROLE authenticated;
INSERT INTO public.member_learning_paths (user_id, track_id) VALUES (:B, 'boundary-setting');
INSERT INTO public.member_learning_paths (user_id, track_id) VALUES (:E, 'boundary-setting');
SELECT 'paths visible to member B: ' || count(*) FROM public.member_learning_paths;
-- Workbook: own rows, no update
INSERT INTO public.workbook_entries (user_id, exercise_id, output, score) VALUES (:B, 'stress-check', '{"x":1}', 12);
INSERT INTO public.workbook_entries (user_id, exercise_id) VALUES (:E, 'stress-check');
UPDATE public.workbook_entries SET score = 1;
SELECT 'workbook rows for B / score unchanged: ' || count(*) || ' / ' || max(score) FROM public.workbook_entries;
INSERT INTO public.workbook_entries (user_id, exercise_id) VALUES (:B, 'Bad Id!');
-- Visits: today only, own only, once per day
INSERT INTO public.member_visits (user_id, first_path) VALUES (:B, '/member-home');
INSERT INTO public.member_visits (user_id, first_path) VALUES (:B, '/member-home');
INSERT INTO public.member_visits (user_id, visit_date) VALUES (:B, current_date - 3);
INSERT INTO public.member_visits (user_id) VALUES (:E);
SELECT 'member reads visits: ' || count(*) FROM public.member_visits;
-- Preferences: own row, can't move to another user
INSERT INTO public.user_notification_preferences (user_id, reply_notifications) VALUES (:B, false);
UPDATE public.user_notification_preferences SET user_id = :E WHERE user_id = :B;
SELECT 'prefs: ' || user_id::text || ' reply=' || reply_notifications FROM public.user_notification_preferences;
-- Ledgers hidden from members; reports refuse non-admins
SELECT 'member sees email log: ' || count(*) FROM public.member_email_log;
SELECT * FROM public.get_member_engagement(4);
RESET ROLE;

-- Admin reports
SELECT pg_temp.as_service(); SET ROLE service_role;
INSERT INTO public.education_progress (user_id, resource_type, resource_path, resource_name, status, completed_at) VALUES
 (:B, 'guide', '/why-willpower-fails', 'Why Willpower Fails', 'completed', now()),
 (:B, 'worksheet', '/workbook/stress-check', 'Nervous system check-in', 'completed', now());
INSERT INTO public.forum_posts (topic_id, user_id, title, content) VALUES ('ask-community', :B, 'Hello', 'First post');
RESET ROLE;
SELECT pg_temp.as_user('00000000-0000-0000-0000-00000000000a'); SET ROLE authenticated;
SELECT 'admin sees visits: ' || count(*) FROM public.member_visits;
SELECT week_start, members_visited, active_members, guides_completed, exercises_started, exercises_completed, forum_threads, paths_chosen FROM public.get_member_engagement(2);
SELECT section, label, started, completed FROM public.get_member_engagement_breakdown(30);
RESET ROLE;
