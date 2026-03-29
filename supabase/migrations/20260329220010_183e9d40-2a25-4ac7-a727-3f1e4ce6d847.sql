ALTER TABLE consultation_providers ADD COLUMN notification_email text;

UPDATE consultation_providers SET notification_email = 'katie@barrinterventions.com' WHERE id = '714fadfa-a938-4672-b13e-77d0ee82fab0';