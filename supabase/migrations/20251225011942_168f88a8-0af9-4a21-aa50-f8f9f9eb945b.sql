-- Create table for pending topic requests that need moderator/admin approval
CREATE TABLE public.pending_topic_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requested_by UUID NOT NULL,
    topic_title TEXT NOT NULL,
    topic_description TEXT NOT NULL,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pending_topic_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own topic requests"
ON public.pending_topic_requests
FOR SELECT
USING (auth.uid() = requested_by);

-- Active members can insert their own requests
CREATE POLICY "Active members can create topic requests"
ON public.pending_topic_requests
FOR INSERT
WITH CHECK (
    auth.uid() = requested_by 
    AND EXISTS (
        SELECT 1 FROM provider_subscriptions
        WHERE provider_subscriptions.user_id = auth.uid()
        AND provider_subscriptions.status = 'active'
        AND provider_subscriptions.provider_submission_id IS NULL
    )
);

-- Moderators and admins can view all requests
CREATE POLICY "Moderators can view all topic requests"
ON public.pending_topic_requests
FOR SELECT
USING (
    has_role(auth.uid(), 'moderator'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can update requests (approve/reject)
CREATE POLICY "Admins can update topic requests"
ON public.pending_topic_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete requests
CREATE POLICY "Admins can delete topic requests"
ON public.pending_topic_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pending_topic_requests_updated_at
BEFORE UPDATE ON public.pending_topic_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();