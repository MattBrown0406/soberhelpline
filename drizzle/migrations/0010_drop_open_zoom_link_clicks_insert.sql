DROP POLICY IF EXISTS "Anyone can insert link clicks" ON public.zoom_link_clicks;
GRANT ALL ON public.zoom_link_clicks TO service_role;