-- account-cleanup: when an account is deleted, her member-area rows go too.
--
-- The new member-area tables do not reference auth.users (foreign keys to the
-- auth schema are not allowed here). public.profiles already does (ON DELETE
-- CASCADE), so deleting an account deletes its profile row, and this trigger
-- then removes what she wrote and what was recorded about her in the new
-- tables. Idempotent. It can never block a deletion: any error becomes a
-- WARNING.

CREATE OR REPLACE FUNCTION public.cleanup_member_area_rows()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    DELETE FROM public.workbook_entries WHERE user_id = OLD.id;
    DELETE FROM public.member_learning_paths WHERE user_id = OLD.id;
    DELETE FROM public.member_visits WHERE user_id = OLD.id;
    DELETE FROM public.member_email_log WHERE user_id = OLD.id;
    DELETE FROM public.forum_notification_log WHERE recipient_user_id = OLD.id;
  EXCEPTION WHEN others THEN
    RAISE WARNING 'cleanup_member_area_rows skipped for %: %', OLD.id, SQLERRM;
  END;
  RETURN OLD;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_member_area_rows() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS cleanup_member_area_rows_trg ON public.profiles;
CREATE TRIGGER cleanup_member_area_rows_trg
AFTER DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.cleanup_member_area_rows();
