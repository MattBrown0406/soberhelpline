-- Update any existing consultation_providers records from 'approved' to 'active', 'pending' to 'inactive', 'suspended' to 'inactive'
-- Note: this is a schema-level change to update the RLS policy

-- Update RLS policy on provider_availability that references 'approved' status
DROP POLICY IF EXISTS "View approved provider availability" ON public.provider_availability;
CREATE POLICY "View active provider availability"
ON public.provider_availability
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM consultation_providers cp
    WHERE cp.id = provider_availability.provider_id
    AND cp.status = 'active'
  )
);