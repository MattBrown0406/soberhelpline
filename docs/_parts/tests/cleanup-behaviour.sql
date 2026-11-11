-- Deleting an account's profile removes her rows from the five member-area tables,
-- and the service role (edge functions) can use those tables.
\set ON_ERROR_STOP off
\set VERBOSITY terse
\set U '\'00000000-0000-0000-0000-0000000000c1\''
\set V '\'00000000-0000-0000-0000-0000000000c2\''
RESET ROLE;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', false);
INSERT INTO public.profiles (id, first_name, last_name) VALUES (:U, 'Test', 'One'), (:V, 'Test', 'Two') ON CONFLICT (id) DO NOTHING;
SET ROLE service_role;
INSERT INTO public.member_learning_paths (user_id, track_id) VALUES (:U, 'boundary-setting'), (:V, 'boundary-setting');
INSERT INTO public.workbook_entries (user_id, exercise_id, answers, output) VALUES (:U, 'boundary-script', '{}', '{}'), (:V, 'boundary-script', '{}', '{}');
INSERT INTO public.member_visits (user_id, first_path) VALUES (:U, '/member-home'), (:V, '/member-home');
INSERT INTO public.member_email_log (kind, period_key, user_id) VALUES ('weekly_note', '2026-11-10', :U), ('weekly_note', '2026-11-10', :V);
SELECT 'service role wrote rows for U: ' || (SELECT count(*) FROM public.member_learning_paths WHERE user_id = :U) + (SELECT count(*) FROM public.workbook_entries WHERE user_id = :U) + (SELECT count(*) FROM public.member_visits WHERE user_id = :U) + (SELECT count(*) FROM public.member_email_log WHERE user_id = :U);
RESET ROLE;
DELETE FROM public.profiles WHERE id = :U;
SELECT 'rows left for deleted account U: ' || (SELECT count(*) FROM public.member_learning_paths WHERE user_id = :U) + (SELECT count(*) FROM public.workbook_entries WHERE user_id = :U) + (SELECT count(*) FROM public.member_visits WHERE user_id = :U) + (SELECT count(*) FROM public.member_email_log WHERE user_id = :U);
SELECT 'rows kept for other account V: ' || (SELECT count(*) FROM public.member_learning_paths WHERE user_id = :V) + (SELECT count(*) FROM public.workbook_entries WHERE user_id = :V) + (SELECT count(*) FROM public.member_visits WHERE user_id = :V) + (SELECT count(*) FROM public.member_email_log WHERE user_id = :V);
DELETE FROM public.profiles WHERE id = :V;
