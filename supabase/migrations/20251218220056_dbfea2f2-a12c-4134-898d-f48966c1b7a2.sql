-- Create private_messages table
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
ON public.private_messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Policy: Active members can send messages
CREATE POLICY "Active members can send messages"
ON public.private_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id 
  AND EXISTS (
    SELECT 1 FROM provider_subscriptions 
    WHERE user_id = auth.uid() 
    AND status = 'active' 
    AND provider_submission_id IS NULL
  )
);

-- Policy: Recipients can update messages (mark as read)
CREATE POLICY "Recipients can update messages"
ON public.private_messages
FOR UPDATE
USING (auth.uid() = recipient_id);

-- Policy: Users can delete their own messages
CREATE POLICY "Users can delete their messages"
ON public.private_messages
FOR DELETE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Add trigger for updated_at
CREATE TRIGGER update_private_messages_updated_at
BEFORE UPDATE ON public.private_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;