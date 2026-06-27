-- Remove the Martens sisters from the Monday Zoom / Family Squares meeting blocklist.
-- This removes both the broad last-name block and any email-based blocklist rows
-- that contain "martens" in the email address.

DELETE FROM public.meeting_blocklist
WHERE lower(coalesce(blocked_last_name, '')) = 'martens'
   OR lower(coalesce(email, '')) LIKE '%martens%';
