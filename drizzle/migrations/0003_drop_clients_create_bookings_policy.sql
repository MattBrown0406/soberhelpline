-- Coaching bookings are created only by the book-consultation edge function
-- (service role, after PayPal has captured the payment) and by admins
-- ("Admins manage bookings"). This policy let any signed-in user insert a
-- booking for themselves straight through the API. New rows default to
-- status 'confirmed', so the Zoom recovery job then created a Zoom meeting
-- and emailed both sides for a booking nobody paid for.
-- Table grants stay as they are: admins insert through the admin policy, and
-- the service role bypasses row-level security.
DROP POLICY IF EXISTS "Clients create bookings" ON public.consultation_bookings;