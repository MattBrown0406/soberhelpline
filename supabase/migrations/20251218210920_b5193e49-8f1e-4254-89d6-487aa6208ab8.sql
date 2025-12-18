-- Add column to profiles table to track code of conduct agreement
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS agreed_to_code_of_conduct boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS code_of_conduct_agreed_at timestamp with time zone;

-- Add RLS policy for admins to view all profiles (for family member management)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to update profiles (for revoking access)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));