-- Run only in an isolated synthetic PostgreSQL database; never against the site.
CREATE SCHEMA auth;
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'moderator');
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$
 SELECT nullif(current_setting('test.user',true),'')::uuid;
$$;
CREATE FUNCTION public.has_role(uuid,public.app_role) RETURNS boolean LANGUAGE sql AS $$
 SELECT coalesce(current_setting('test.admin',true),'false')='true';
$$;
CREATE TABLE public.consultation_providers(id integer, user_id uuid, status text, full_name text);
CREATE TABLE public.consultation_bookings(id integer,client_user_id uuid,provider_id uuid,client_email text,amount_paid numeric,paypal_order_id text,coaching_plan_id uuid,status text);
CREATE TABLE public.provider_submissions(id integer,status text);
CREATE TABLE public.coaching_plans(id integer,client_user_id uuid NOT NULL,plan_type text CHECK(plan_type IN ('emergency','stabilization')));
\i drizzle/migrations/0006_website_audit_guards_20261110.sql
INSERT INTO consultation_providers VALUES(1,'00000000-0000-0000-0000-000000000001','active','Synthetic provider');
INSERT INTO consultation_bookings VALUES(1,'00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','synthetic@example.invalid',150,'synthetic-order',null,'confirmed');
SELECT set_config('test.user','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
 BEGIN INSERT INTO consultation_providers VALUES(2,auth.uid(),'active','Unauthorized'); RAISE EXCEPTION 'Provider self-creation allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 RAISE NOTICE 'PASS only administrators create providers';
END $$;
DO $$ BEGIN
 BEGIN UPDATE consultation_providers SET status='inactive'; RAISE EXCEPTION 'Provider status change allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 RAISE NOTICE 'PASS provider status protected';
END $$;
DO $$ BEGIN
 BEGIN UPDATE consultation_providers SET user_id=gen_random_uuid(); RAISE EXCEPTION 'Provider owner change allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 RAISE NOTICE 'PASS provider ownership protected';
END $$;
DO $$ DECLARE field text; BEGIN
 FOREACH field IN ARRAY ARRAY['client_user_id','provider_id','client_email','amount_paid','paypal_order_id','coaching_plan_id'] LOOP
  BEGIN
   EXECUTE CASE WHEN field='amount_paid' THEN 'UPDATE consultation_bookings SET amount_paid=125'
    WHEN field IN ('client_email','paypal_order_id') THEN format('UPDATE consultation_bookings SET %I=%L',field,'changed')
    ELSE format('UPDATE consultation_bookings SET %I=gen_random_uuid()',field) END;
   RAISE EXCEPTION 'Booking field % not protected',field;
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  RAISE NOTICE 'PASS booking field % protected',field;
 END LOOP;
 UPDATE consultation_bookings SET status='completed';
 IF (SELECT status FROM consultation_bookings WHERE id=1)<>'completed' THEN RAISE EXCEPTION 'Booking completion blocked'; END IF;
 RAISE NOTICE 'PASS provider can complete bookings';
END $$;
DO $$ BEGIN
 INSERT INTO provider_submissions VALUES(1,'approved');
 IF (SELECT status FROM provider_submissions WHERE id=1)<>'pending' THEN RAISE EXCEPTION 'Listing approval bypass'; END IF;
 INSERT INTO provider_submissions VALUES(2,'draft');
 IF (SELECT status FROM provider_submissions WHERE id=2)<>'draft' THEN RAISE EXCEPTION 'Draft lost'; END IF;
 RAISE NOTICE 'PASS new listings pending and drafts preserved';
END $$;
DO $$ BEGIN
 INSERT INTO coaching_plans VALUES(1,null,'parallel-recovery');
 IF NOT EXISTS(SELECT 1 FROM coaching_plans WHERE id=1 AND client_user_id IS NULL AND plan_type='parallel-recovery') THEN RAISE EXCEPTION 'Guest parallel-recovery plan blocked'; END IF;
 BEGIN INSERT INTO coaching_plans VALUES(2,null,'invalid'); RAISE EXCEPTION 'Unknown plan accepted'; EXCEPTION WHEN check_violation THEN NULL; END;
 RAISE NOTICE 'PASS guest plan, parallel-recovery and invalid-plan rejection';
END $$;
SELECT set_config('test.admin','true',false);
INSERT INTO consultation_providers VALUES(3,auth.uid(),'active','Synthetic admin-created provider');
UPDATE consultation_providers SET status='inactive',user_id=gen_random_uuid();
UPDATE consultation_bookings SET amount_paid=125;
INSERT INTO provider_submissions VALUES(3,'approved');
DO $$ BEGIN
 IF (SELECT status FROM provider_submissions WHERE id=3)<>'approved' THEN RAISE EXCEPTION 'Admin approval blocked'; END IF;
 RAISE NOTICE 'PASS admin creation and protected-field changes allowed';
END $$;