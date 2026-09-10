GRANT INSERT ON public.abandoned_bookings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.abandoned_bookings TO authenticated;
GRANT ALL ON public.abandoned_bookings TO service_role;

GRANT INSERT ON public.guide_views TO anon;
GRANT SELECT, INSERT ON public.guide_views TO authenticated;
GRANT ALL ON public.guide_views TO service_role;