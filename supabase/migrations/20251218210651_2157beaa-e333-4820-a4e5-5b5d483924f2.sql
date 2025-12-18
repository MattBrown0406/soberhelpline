-- Add username column to profiles table for anonymous display in forums
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text;

-- Add a unique constraint on username (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique 
ON public.profiles (LOWER(username)) 
WHERE username IS NOT NULL;