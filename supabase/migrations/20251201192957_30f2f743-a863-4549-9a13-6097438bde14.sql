-- Create table to track provider card clicks
CREATE TABLE public.provider_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.provider_submissions(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  click_type TEXT NOT NULL DEFAULT 'card_view',
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_provider_clicks_provider_id ON public.provider_clicks(provider_id);
CREATE INDEX idx_provider_clicks_clicked_at ON public.provider_clicks(clicked_at);
CREATE INDEX idx_provider_clicks_session_id ON public.provider_clicks(session_id);

-- Enable RLS
ALTER TABLE public.provider_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for click tracking (no auth required to track)
CREATE POLICY "Anyone can insert clicks"
ON public.provider_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view click data
CREATE POLICY "Admins can view all clicks"
ON public.provider_clicks
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a view for aggregated click analytics
CREATE OR REPLACE VIEW public.provider_click_analytics AS
SELECT 
  ps.id as provider_id,
  ps.provider_name,
  ps.category,
  ps.city,
  ps.state,
  COUNT(pc.id) as total_clicks,
  COUNT(DISTINCT pc.session_id) as unique_visitors,
  COUNT(CASE WHEN pc.click_type = 'card_view' THEN 1 END) as card_views,
  COUNT(CASE WHEN pc.click_type = 'website_click' THEN 1 END) as website_clicks,
  COUNT(CASE WHEN pc.click_type = 'phone_click' THEN 1 END) as phone_clicks,
  COUNT(CASE WHEN pc.click_type = 'email_click' THEN 1 END) as email_clicks,
  COUNT(CASE WHEN pc.clicked_at >= NOW() - INTERVAL '7 days' THEN 1 END) as clicks_last_7_days,
  COUNT(CASE WHEN pc.clicked_at >= NOW() - INTERVAL '30 days' THEN 1 END) as clicks_last_30_days,
  MIN(pc.clicked_at) as first_click,
  MAX(pc.clicked_at) as last_click
FROM public.provider_submissions ps
LEFT JOIN public.provider_clicks pc ON ps.id = pc.provider_id
WHERE ps.status = 'approved'
GROUP BY ps.id, ps.provider_name, ps.category, ps.city, ps.state;