-- Add Marchman Act assistance field for Florida attorneys
ALTER TABLE provider_submissions ADD COLUMN marchman_act_assistance boolean DEFAULT false;