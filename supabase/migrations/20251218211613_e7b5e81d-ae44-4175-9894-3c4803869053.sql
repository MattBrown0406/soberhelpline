-- Add column to track webinar reminder opt-in preference
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS webinar_reminders_opted_in boolean DEFAULT false;