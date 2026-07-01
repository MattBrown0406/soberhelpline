
-- 1) abandoned_bookings: require token-based updates for anonymous rows

ALTER TABLE public.abandoned_bookings
  ADD COLUMN IF NOT EXISTS edit_token uuid;

-- Backfill any existing rows so they remain updatable via the RPC
UPDATE public.abandoned_bookings SET edit_token = gen_random_uuid() WHERE edit_token IS NULL;

-- Drop the overly-permissive UPDATE policy
DROP POLICY IF EXISTS "Update only incomplete bookings and own row" ON public.abandoned_bookings;

-- Owners (authenticated) can still update their own incomplete rows directly
CREATE POLICY "Owners can update their own incomplete bookings"
ON public.abandoned_bookings
FOR UPDATE
TO authenticated
USING (completed = false AND auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (completed = false AND auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admins can update anything
CREATE POLICY "Admins can update abandoned bookings"
ON public.abandoned_bookings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Secure RPC anonymous clients call to update their own row using the edit_token
CREATE OR REPLACE FUNCTION public.update_abandoned_booking(
  _id uuid,
  _edit_token uuid,
  _client_email text,
  _client_name text,
  _client_phone text,
  _plan_type text,
  _provider_id uuid,
  _provider_name text,
  _selected_date date,
  _selected_time time,
  _last_step integer,
  _completed boolean DEFAULT false
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _id IS NULL OR _edit_token IS NULL THEN
    RAISE EXCEPTION 'id and edit_token are required';
  END IF;

  UPDATE public.abandoned_bookings
  SET client_email = COALESCE(_client_email, client_email),
      client_name = COALESCE(_client_name, client_name),
      client_phone = COALESCE(_client_phone, client_phone),
      plan_type = COALESCE(_plan_type, plan_type),
      provider_id = COALESCE(_provider_id, provider_id),
      provider_name = COALESCE(_provider_name, provider_name),
      selected_date = COALESCE(_selected_date, selected_date),
      selected_time = COALESCE(_selected_time, selected_time),
      last_step = COALESCE(_last_step, last_step),
      completed = COALESCE(_completed, completed),
      updated_at = now()
  WHERE id = _id
    AND edit_token = _edit_token
    AND completed = false;
END;
$$;

REVOKE ALL ON FUNCTION public.update_abandoned_booking(uuid, uuid, text, text, text, text, uuid, text, date, time, integer, boolean) FROM public;
GRANT EXECUTE ON FUNCTION public.update_abandoned_booking(uuid, uuid, text, text, text, text, uuid, text, date, time, integer, boolean) TO anon, authenticated;

-- 2) provider-logos storage: require uploads to live under a folder matching the user's id

DROP POLICY IF EXISTS "Authenticated users can upload provider logos" ON storage.objects;

CREATE POLICY "Users can upload provider logos into own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'provider-logos'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);
