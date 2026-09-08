CREATE UNIQUE INDEX IF NOT EXISTS consultation_bookings_unique_active_slot
ON public.consultation_bookings (provider_id, booking_date, start_time)
WHERE status <> 'cancelled';