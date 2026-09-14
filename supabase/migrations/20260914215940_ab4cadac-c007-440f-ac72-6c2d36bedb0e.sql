DROP POLICY IF EXISTS "Owners can update their own incomplete bookings" ON public.abandoned_bookings;

CREATE POLICY "Owners can update their own incomplete bookings"
ON public.abandoned_bookings
FOR UPDATE
TO authenticated
USING ((completed = false) AND (auth.uid() IS NOT NULL) AND (auth.uid() = user_id))
WITH CHECK ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id));