
-- Remove the overly permissive SELECT policy we just added
DROP POLICY IF EXISTS "Anyone can view booking slots for scheduling" ON public.consultation_bookings;

-- Create a security definer function that only returns scheduling-relevant data
CREATE OR REPLACE FUNCTION public.get_booking_slots()
RETURNS TABLE(booking_date date, start_time time, end_time time, provider_id uuid, timezone text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cb.booking_date, cb.start_time, cb.end_time, cb.provider_id, cb.timezone
  FROM public.consultation_bookings cb
  WHERE cb.status IN ('confirmed', 'pending');
$$;
