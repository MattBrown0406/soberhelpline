-- Add faith based services and military/first responder care fields to provider_submissions table
ALTER TABLE provider_submissions
ADD COLUMN faith_based_services boolean DEFAULT false,
ADD COLUMN military_first_responder_care boolean DEFAULT false;