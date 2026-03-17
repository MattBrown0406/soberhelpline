
-- Allow anyone to view active provider availability (non-sensitive scheduling data)
CREATE POLICY "Anyone can view active availability for scheduling"
ON public.provider_availability
FOR SELECT
USING (is_active = true);
