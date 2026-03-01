
-- Make user_id nullable so non-authenticated users can register
ALTER TABLE public.zoom_meeting_registrations ALTER COLUMN user_id DROP NOT NULL;

-- Drop the old insert policy that requires active membership
DROP POLICY IF EXISTS "Members can insert registrations" ON public.zoom_meeting_registrations;
DROP POLICY IF EXISTS "Block anonymous insert" ON public.zoom_meeting_registrations;
DROP POLICY IF EXISTS "Block anonymous select" ON public.zoom_meeting_registrations;
DROP POLICY IF EXISTS "Block anonymous update" ON public.zoom_meeting_registrations;
DROP POLICY IF EXISTS "Block anonymous delete" ON public.zoom_meeting_registrations;

-- Allow anyone (including anon) to insert registrations
CREATE POLICY "Anyone can register for zoom meetings"
ON public.zoom_meeting_registrations
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view their own registration by email (for duplicate checks)
-- Keep admin select policy as-is
CREATE POLICY "Authenticated users can view own registrations"
ON public.zoom_meeting_registrations
FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Drop old admin select since we merged it above
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.zoom_meeting_registrations;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.zoom_meeting_registrations;
