
-- =========================================
-- 1) provider_submissions status transition guard
-- =========================================
CREATE OR REPLACE FUNCTION public.enforce_provider_submission_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins bypass all transition rules
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Non-admins may only transition draft -> pending (submit for review),
    -- or keep pending/draft unchanged. Any other transition is blocked.
    IF NOT (
      (OLD.status = 'draft'   AND NEW.status = 'pending') OR
      (OLD.status = 'draft'   AND NEW.status = 'draft')   OR
      (OLD.status = 'pending' AND NEW.status = 'pending')
    ) THEN
      RAISE EXCEPTION 'Invalid status transition from % to % for provider submission', OLD.status, NEW.status
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_provider_submission_status_transition ON public.provider_submissions;
CREATE TRIGGER trg_enforce_provider_submission_status_transition
BEFORE UPDATE ON public.provider_submissions
FOR EACH ROW
EXECUTE FUNCTION public.enforce_provider_submission_status_transition();

-- =========================================
-- 2) roadmap_assessments: secure session_token default
-- =========================================
ALTER TABLE public.roadmap_assessments
  ALTER COLUMN session_token SET DEFAULT gen_random_uuid();

-- Backfill any legacy NULLs so uniqueness/lookups are safe
UPDATE public.roadmap_assessments
SET session_token = gen_random_uuid()
WHERE session_token IS NULL;

ALTER TABLE public.roadmap_assessments
  ALTER COLUMN session_token SET NOT NULL;

-- =========================================
-- 3) site_settings: replace hardcoded allowlist with is_public flag
-- =========================================
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Mark the known-public Monday Zoom keys as public
UPDATE public.site_settings
SET is_public = true
WHERE key IN ('monday_zoom_link', 'monday_zoom_meeting_id', 'monday_zoom_passcode');

DROP POLICY IF EXISTS "Public can read non-sensitive settings" ON public.site_settings;
CREATE POLICY "Public can read non-sensitive settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (is_public = true);
