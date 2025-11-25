-- Add case management services field for interventionists
ALTER TABLE provider_submissions ADD COLUMN case_management_services boolean DEFAULT false;