-- Convert marchman_act_assistance boolean to legal_assistance_types array
ALTER TABLE provider_submissions DROP COLUMN IF EXISTS marchman_act_assistance;

-- Add the legal_assistance_types array column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_submissions' 
    AND column_name = 'legal_assistance_types'
  ) THEN
    ALTER TABLE provider_submissions ADD COLUMN legal_assistance_types text[];
  END IF;
END $$;