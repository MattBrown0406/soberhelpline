"""Delta-only Postgres 17 regression gate in an explicitly disposable container.
Usage: python scripts/test-monday-registration-db.py sh-monday-idempotency-test
Does not query or alter production. This is NOT a full historical migration replay.
"""
import pathlib
import subprocess
import sys
import time

container = sys.argv[1]
assert container.startswith('sh-monday-idempotency-test'), 'Refuse non-test container'
root = pathlib.Path(__file__).resolve().parents[1]
migration = next((root / 'supabase/migrations').glob('*_monday_registration_idempotency.sql')).read_text()
base = ['docker', 'exec', '-i', container, 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'monday_test', '-At']

def sql(text, ok=True):
    result = subprocess.run(base, input=text, text=True, capture_output=True)
    if ok:
        assert result.returncode == 0, result.stderr
    else:
        assert result.returncode != 0, 'Expected database rejection'
    return result.stdout.strip(), result.stderr

subprocess.run(['docker', 'exec', container, 'createdb', '-U', 'postgres', 'monday_test'], check=True)
# Minimal affected-table baseline; explicit fields match checked-in table history.
sql('''CREATE TABLE public.zoom_meeting_registrations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, name text NOT NULL,
 email text NOT NULL, phone text NOT NULL, question text NOT NULL,
 request_follow_up boolean NOT NULL DEFAULT false, consent_email_list boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), meeting_date date NOT NULL,
 auto_register boolean NOT NULL DEFAULT false, language text NOT NULL DEFAULT 'en',
 registration_source text NOT NULL DEFAULT 'website');
ALTER TABLE public.zoom_meeting_registrations ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.zoom_meeting_registrations TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.zoom_meeting_registrations TO authenticated;
GRANT INSERT ON public.zoom_meeting_registrations TO anon;
CREATE POLICY admin_update ON public.zoom_meeting_registrations FOR UPDATE TO authenticated USING (false);
''')
sql("INSERT INTO public.zoom_meeting_registrations (email,name,phone,question,meeting_date) VALUES (' Person@EXAMPLE.test ','first','','','2026-10-12'),('person@example.test','second','','','2026-10-12');")
_, error = sql(migration, ok=False)
assert 'reviewed reconciliation' in error
assert sql("SELECT count(*) FROM public.zoom_meeting_registrations;")[0] == '2'
assert sql("SELECT count(*) FROM information_schema.columns WHERE table_name='zoom_meeting_registrations' AND column_name='confirmation_claimed_at';")[0] == '0'
print('PASS migration refuses legacy duplicates without data loss or partial DDL')
# Synthetic fixtures only: production reconciliation requires a reviewed data plan.
sql('TRUNCATE public.zoom_meeting_registrations;')
sql(migration)
assert sql("SELECT has_table_privilege('anon','public.zoom_meeting_registrations','INSERT'), has_table_privilege('authenticated','public.zoom_meeting_registrations','INSERT'), has_column_privilege('authenticated','public.zoom_meeting_registrations','confirmation_claimed_at','UPDATE'), has_column_privilege('authenticated','public.zoom_meeting_registrations','question','UPDATE');")[0] == 'f|f|f|t'
assert sql("SELECT has_function_privilege('anon','public.ensure_monday_registration(text,text,date)','EXECUTE'),has_function_privilege('authenticated','public.ensure_monday_registration(text,text,date)','EXECUTE'),has_function_privilege('service_role','public.ensure_monday_registration(text,text,date)','EXECUTE');")[0] == 'f|f|t'
print('PASS private function grants, direct-insert denial, delivery-claim protection')
assert sql("SET ROLE service_role; SELECT public.ensure_monday_registration(' Person@example.test ','Person','2026-10-12');")[0].endswith('f')
assert sql("SET ROLE service_role; SELECT public.ensure_monday_registration('PERSON@EXAMPLE.test','Other name','2026-10-12');")[0].endswith('t')
assert sql("SET ROLE service_role; SELECT public.ensure_monday_registration('person@example.test','Person','2026-10-19');")[0].endswith('f')
assert sql("SELECT count(*),count(DISTINCT meeting_date),min(name) FROM public.zoom_meeting_registrations;")[0] == '2|2|Person'
sql("UPDATE public.zoom_meeting_registrations SET registration_source='app' WHERE meeting_date='2026-10-12'; SELECT public.ensure_monday_registration('person@example.test','Ignored','2026-10-12');")
assert sql("DELETE FROM public.zoom_meeting_registrations WHERE registration_source='app' RETURNING id;")[0] == 'DELETE 0'
print('PASS normalized identity, retry preserves details, new week allowed, app mirror promotion durable')

counter = 0
def overlap(first, second, second_ok, expected_tail):
    global counter
    counter += 1
    name1, name2 = f'monday_first_{counter}', f'monday_second_{counter}'
    cmd1 = base[:3] + ['-e', f'PGAPPNAME={name1}'] + base[3:]
    cmd2 = base[:3] + ['-e', f'PGAPPNAME={name2}'] + base[3:]
    a = subprocess.Popen(cmd1, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    assert a.stdin is not None
    a.stdin.write('BEGIN;\n' + first + '\n'); a.stdin.flush()
    deadline = time.monotonic() + 10
    while time.monotonic() < deadline:
        if sql(f"SELECT state FROM pg_stat_activity WHERE application_name='{name1}';")[0] == 'idle in transaction': break
        time.sleep(.05)
    else: raise AssertionError('First transaction not ready')
    b = subprocess.Popen(cmd2 + ['-c', second], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    deadline = time.monotonic() + 10
    while time.monotonic() < deadline:
        if sql(f"SELECT wait_event_type FROM pg_stat_activity WHERE application_name='{name2}';")[0] == 'Lock': break
        time.sleep(.05)
    else: raise AssertionError('Did not observe concurrent database lock wait')
    a.stdin.write('COMMIT;\n\\q\n'); a.stdin.flush()
    out_a, err_a = a.communicate(timeout=10)
    out_b, err_b = b.communicate(timeout=10)
    assert a.returncode == 0, err_a
    if second_ok: assert b.returncode == 0 and out_b.strip().endswith(expected_tail), (out_b, err_b)
    else: assert b.returncode != 0 and expected_tail in err_b, (out_b, err_b)

insert = "INSERT INTO public.zoom_meeting_registrations(email,name,phone,question,meeting_date,auto_register) VALUES ('race@example.test','Auto','','','2026-10-12',true);"
overlap(insert, insert.replace('race@example.test', ' RACE@example.test '), False, 'zoom_registration_email_meeting_unique')
assert sql("SELECT count(*) FROM public.zoom_meeting_registrations WHERE lower(btrim(email))='race@example.test';")[0] == '1'
overlap("SELECT public.ensure_monday_registration('bridge@example.test','Bridge','2026-10-12');", "SELECT public.ensure_monday_registration('BRIDGE@example.test','Retry','2026-10-12');", True, 't')
sql("UPDATE public.zoom_meeting_registrations SET registration_source='app' WHERE email='bridge@example.test';")
overlap("SELECT public.ensure_monday_registration('bridge@example.test','Bridge','2026-10-12');", "DELETE FROM public.zoom_meeting_registrations WHERE email='bridge@example.test' AND registration_source='app';", True, 'DELETE 0')
assert sql("SELECT registration_source FROM public.zoom_meeting_registrations WHERE email='bridge@example.test';")[0] == 'website'
print('PASS observed lock wait: stale batch deletion cannot delete ensured app mirror')
claim = "UPDATE public.zoom_meeting_registrations SET confirmation_claimed_at=now() WHERE email='bridge@example.test' AND confirmation_claimed_at IS NULL RETURNING id;"
overlap(claim, claim, True, 'UPDATE 0')
print('PASS observed real lock waits: concurrent inserts, bridge ensures, delivery claims')
assert sql("SELECT public.append_monday_registration_question('person@example.test','2026-10-12','A question');")[0] == 't'
assert sql("SELECT public.append_monday_registration_question('PERSON@example.test','2026-10-12','A question');")[0] == 't'
assert sql("SELECT question FROM public.zoom_meeting_registrations WHERE email='person@example.test' AND meeting_date='2026-10-12';")[0] == 'A question'
assert sql("SELECT has_function_privilege('authenticated','public.append_monday_registration_question(text,date,text)','EXECUTE');")[0] == 'f'
print('PASS authenticated-email member questions preserve one registration and dedupe retries')
print('PASS all database delta gates (NOT full migration replay)')
