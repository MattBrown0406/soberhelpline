
-- Make client_user_id nullable to allow guest bookings
ALTER TABLE public.consultation_bookings 
  ALTER COLUMN client_user_id DROP NOT NULL;

-- Add RLS policy for guest booking inserts (no auth required)
-- We'll use the edge function with service role, but also allow anon inserts
-- Actually, we'll handle all inserts via edge function with service role
-- so we don't need to open up anon insert access directly.
-- The existing "Block anon insert bookings" policy with false will be fine
-- since our edge function uses service_role which bypasses RLS.
