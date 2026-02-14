
-- Create a key-value settings table for admin-configurable values
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings FORCE ROW LEVEL SECURITY;

-- Anyone authenticated can read settings
CREATE POLICY "Authenticated users can read settings" ON public.site_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can insert/update
CREATE POLICY "Admins can insert settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update settings" ON public.site_settings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Block anonymous
CREATE POLICY "Block anonymous select" ON public.site_settings FOR SELECT USING (false);
CREATE POLICY "Block anonymous insert" ON public.site_settings FOR INSERT WITH CHECK (false);
CREATE POLICY "Block anonymous update" ON public.site_settings FOR UPDATE USING (false);
CREATE POLICY "Block anonymous delete" ON public.site_settings FOR DELETE USING (false);

-- Seed the zoom link setting
INSERT INTO public.site_settings (key, value) VALUES ('monday_zoom_link', '');
