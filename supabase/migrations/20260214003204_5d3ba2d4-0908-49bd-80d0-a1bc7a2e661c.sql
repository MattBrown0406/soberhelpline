
-- Add meeting_date column to associate each registration with a specific Monday
ALTER TABLE public.zoom_meeting_registrations 
  ADD COLUMN meeting_date DATE NOT NULL DEFAULT (
    CASE 
      WHEN EXTRACT(DOW FROM CURRENT_DATE) <= 1 
        THEN CURRENT_DATE + ((1 - EXTRACT(DOW FROM CURRENT_DATE))::int)
      ELSE CURRENT_DATE + ((8 - EXTRACT(DOW FROM CURRENT_DATE))::int)
    END
  );
