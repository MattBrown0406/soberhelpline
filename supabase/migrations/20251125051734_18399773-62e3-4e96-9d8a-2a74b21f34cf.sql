-- Add travel_expenses_included column to provider_submissions table
ALTER TABLE public.provider_submissions 
ADD COLUMN travel_expenses_included boolean DEFAULT NULL;