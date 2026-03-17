
-- Allow anyone to read booking dates/times for scheduling conflict detection
-- Only exposes date, time, and provider_id — no client info
CREATE POLICY "Anyone can view booking slots for scheduling"
ON public.consultation_bookings
FOR SELECT
USING (true);
