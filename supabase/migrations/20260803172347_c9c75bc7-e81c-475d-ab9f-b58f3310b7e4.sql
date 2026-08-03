-- forum_posts: no anon policy exists; remove unused table grants entirely.
REVOKE ALL ON public.forum_posts FROM anon;

-- zoom_meeting_registrations: public registration needs INSERT only, never SELECT.
REVOKE SELECT ON public.zoom_meeting_registrations FROM anon;
GRANT INSERT ON public.zoom_meeting_registrations TO anon;