-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view promo code usage" ON public.promo_code_usage;

-- Add admin-only SELECT policy
CREATE POLICY "Admins can view promo code usage"
ON public.promo_code_usage
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::public.app_role));