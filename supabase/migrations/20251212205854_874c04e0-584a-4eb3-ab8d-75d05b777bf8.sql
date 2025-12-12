-- Remove the IP address column from provider_clicks to address privacy concerns
-- IP addresses are personally identifiable information and create GDPR/CCPA compliance risks

ALTER TABLE public.provider_clicks DROP COLUMN IF EXISTS ip_address;