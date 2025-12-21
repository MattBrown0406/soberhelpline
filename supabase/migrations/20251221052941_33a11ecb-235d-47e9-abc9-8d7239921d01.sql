-- Fix: Explicitly block anonymous/public read access on provider_clicks
-- The table already has restrictive SELECT policies for admins and providers only,
-- but adding an explicit block and revoking grants will satisfy the scanner.

-- Revoke any lingering public/anon SELECT grants
REVOKE SELECT ON public.provider_clicks FROM anon;
REVOKE SELECT ON public.provider_clicks FROM public;

-- Add explicit block policy for anonymous users (belt and suspenders)
DROP POLICY IF EXISTS "Block anonymous read access" ON public.provider_clicks;
CREATE POLICY "Block anonymous read access"
ON public.provider_clicks
FOR SELECT
TO anon
USING (false);

-- Also lock down the analytics view
REVOKE ALL ON public.provider_click_analytics FROM anon;
REVOKE ALL ON public.provider_click_analytics FROM public;
GRANT SELECT ON public.provider_click_analytics TO authenticated;