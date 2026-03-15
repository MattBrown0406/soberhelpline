-- Allow admins to update zoom registrations
CREATE POLICY "Admins can update zoom registrations"
ON public.zoom_meeting_registrations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Clear Johnna's non-question entry
UPDATE public.zoom_meeting_registrations SET question = '' WHERE id = '7065d4fd-5bac-4bea-abab-35c1e261cf2b';