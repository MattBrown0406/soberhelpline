-- Add medication and MAT fields for sober living providers
ALTER TABLE provider_submissions ADD COLUMN medication_administration text;
ALTER TABLE provider_submissions ADD COLUMN accepts_mat_residents boolean DEFAULT false;