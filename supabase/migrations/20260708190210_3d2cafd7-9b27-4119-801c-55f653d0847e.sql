
DROP POLICY IF EXISTS "Recipients can update messages" ON public.private_messages;

CREATE POLICY "Recipients can update messages"
ON public.private_messages
FOR UPDATE
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

CREATE OR REPLACE FUNCTION public.prevent_private_message_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the updater is the recipient (and not the sender), only allow is_read to change
  IF auth.uid() = OLD.recipient_id AND auth.uid() <> OLD.sender_id THEN
    IF NEW.sender_id     IS DISTINCT FROM OLD.sender_id
    OR NEW.recipient_id  IS DISTINCT FROM OLD.recipient_id
    OR NEW.subject       IS DISTINCT FROM OLD.subject
    OR NEW.content       IS DISTINCT FROM OLD.content
    OR NEW.created_at    IS DISTINCT FROM OLD.created_at
    THEN
      RAISE EXCEPTION 'Recipients may only update the is_read status of a message'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_private_message_tampering_trg ON public.private_messages;
CREATE TRIGGER prevent_private_message_tampering_trg
BEFORE UPDATE ON public.private_messages
FOR EACH ROW EXECUTE FUNCTION public.prevent_private_message_tampering();
