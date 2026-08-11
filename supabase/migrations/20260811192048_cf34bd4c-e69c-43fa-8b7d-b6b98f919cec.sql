REVOKE ALL ON public.family_squares_weekly_checkins FROM service_role;
REVOKE ALL ON public.family_squares_next_step_reviews FROM service_role;
REVOKE ALL ON public.readiness_radar_export_audit FROM service_role;

GRANT SELECT ON public.family_squares_weekly_checkins TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.family_squares_next_step_reviews TO service_role;
GRANT SELECT, INSERT ON public.readiness_radar_export_audit TO service_role;

REVOKE ALL ON public.family_squares_weekly_checkins FROM PUBLIC, anon;
REVOKE ALL ON public.family_squares_next_step_reviews FROM PUBLIC, anon;
REVOKE ALL ON public.readiness_radar_export_audit FROM PUBLIC, anon;