-- Enable security invoker on the view so it respects underlying table RLS
ALTER VIEW public.provider_click_analytics SET (security_invoker = on);