-- Create member_warnings table to track warnings and removal recommendations
CREATE TABLE public.member_warnings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    moderator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    warning_type text NOT NULL CHECK (warning_type IN ('warning', 'removal_recommendation')),
    reason text NOT NULL,
    post_content text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
    admin_notes text,
    reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_warnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for member_warnings

-- Moderators can insert warnings
CREATE POLICY "Moderators can insert warnings"
ON public.member_warnings
FOR INSERT
TO authenticated
WITH CHECK (
    public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin')
);

-- Moderators can view their own warnings
CREATE POLICY "Moderators can view their own warnings"
ON public.member_warnings
FOR SELECT
TO authenticated
USING (
    moderator_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);

-- Admins can update warnings (to review them)
CREATE POLICY "Admins can update warnings"
ON public.member_warnings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete warnings
CREATE POLICY "Admins can delete warnings"
ON public.member_warnings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to manage user_roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_member_warnings_updated_at
    BEFORE UPDATE ON public.member_warnings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();