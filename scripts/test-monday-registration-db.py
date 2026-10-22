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
 registration_source text NOT NULL DEFAULT 'website',
 preferred_contact_date text, preferred_contact_time text, preferred_timezone text);
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
sql(next((root / 'supabase/migrations').glob('*_monday_registration_review_fixes.sql')).read_text())
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
sql("UPDATE public.zoom_meeting_registrations SET registration_source='app', phone='private-phone', question='private-question', consent_email_list=true, auto_register=true WHERE email='bridge@example.test';")
overlap("SELECT public.ensure_monday_registration('bridge@example.test','Bridge','2026-10-12');", "DELETE FROM public.zoom_meeting_registrations WHERE email='bridge@example.test' AND registration_source='app';", True, 'DELETE 0')
assert sql("SELECT registration_source FROM public.zoom_meeting_registrations WHERE email='bridge@example.test';")[0] == 'website'
assert sql("SELECT name,phone,question,consent_email_list,auto_register FROM public.zoom_meeting_registrations WHERE email='bridge@example.test';")[0] == 'Bridge|private-phone|private-question|t|t'
print('PASS observed lock wait: stale batch deletion cannot delete ensured app mirror; personal/consent fields preserved')
claim = "UPDATE public.zoom_meeting_registrations SET confirmation_claimed_at=now() WHERE email='bridge@example.test' AND confirmation_claimed_at IS NULL RETURNING id;"
overlap(claim, claim, True, 'UPDATE 0')
print('PASS observed real lock waits: concurrent inserts, bridge ensures, delivery claims')
assert sql("SELECT public.append_monday_registration_question('person@example.test','2026-10-12','A question');")[0] == 't'
assert sql("SELECT public.append_monday_registration_question('PERSON@example.test','2026-10-12','A question');")[0] == 't'
assert sql("SELECT question FROM public.zoom_meeting_registrations WHERE email='person@example.test' AND meeting_date='2026-10-12';")[0] == 'A question'
assert sql("SELECT has_function_privilege('authenticated','public.append_monday_registration_question(text,date,text)','EXECUTE');")[0] == 'f'
print('PASS authenticated-email member questions preserve one registration and dedupe retries')
# Exact identity: a substring is a different item; multiline retries remain one item.
sql("SELECT public.append_monday_registration_question('person@example.test','2026-10-12','question');")
sql("SELECT public.append_monday_registration_question('person@example.test','2026-10-12',E'multi\\nline'); SELECT public.append_monday_registration_question('person@example.test','2026-10-12',E'multi\\nline');")
assert sql("SELECT cardinality(question_items),question FROM public.zoom_meeting_registrations WHERE email='person@example.test' AND meeting_date='2026-10-12';")[0] == '3|A question\nquestion\nmulti\nline'
for first, second in [('member first', 'batch second'), ('batch first', 'member second')]:
    member = f"SELECT public.append_monday_registration_question('person@example.test','2026-10-12','{first if first.startswith('member') else second}');"
    batch = f"SELECT public.merge_monday_registration_questions('person@example.test','2026-10-12',ARRAY['{second if second.startswith('batch') else first}']);"
    overlap(member if first.startswith('member') else batch, batch if first.startswith('member') else member, True, 't')
    text = sql("SELECT question FROM public.zoom_meeting_registrations WHERE email='person@example.test' AND meeting_date='2026-10-12';")[0]
    assert first in text and second in text
print('PASS observed lock waits in BOTH member/batch orderings; exact and multiline retry identity')
# Opposite promotion/delete ordering: deletion wins first, ensure recreates durably.
sql("UPDATE public.zoom_meeting_registrations SET registration_source='app' WHERE email='bridge@example.test';")
overlap("DELETE FROM public.zoom_meeting_registrations WHERE email='bridge@example.test' AND registration_source='app';", "SELECT public.ensure_monday_registration('bridge@example.test','Bridge','2026-10-12');", True, 'f')
assert sql("SELECT registration_source FROM public.zoom_meeting_registrations WHERE email='bridge@example.test';")[0] == 'website'
assert sql("SELECT has_function_privilege('anon','public.merge_monday_registration_questions(text,date,text[],boolean)','EXECUTE'),has_function_privilege('authenticated','public.merge_monday_registration_questions(text,date,text[],boolean)','EXECUTE');")[0] == 'f|f'
sql("SELECT public.merge_monday_registration_questions('person@example.test','2026-10-12',ARRAY['question'],true);")
assert sql("SELECT cardinality(question_items) FROM public.zoom_meeting_registrations WHERE email='person@example.test' AND meeting_date='2026-10-12';")[0] == '7'
print('PASS delete-first ensure durability, cross-writer exact retry identity, and shared merge private grants')
# Prospective manual evidence: additive migration must not alter old rows.
import json
before = sql("SELECT jsonb_agg(to_jsonb(r) ORDER BY id) FROM public.zoom_meeting_registrations r;")[0]
sql(next((root / 'supabase/migrations').glob('*_monday_manual_occurrence_provenance.sql')).read_text())
assert sql("SELECT jsonb_agg(to_jsonb(r) ORDER BY id) FROM public.zoom_meeting_registrations r;")[0] == before
assert sql("SELECT count(*) FROM public.monday_manual_occurrences;")[0] == '0'
assert sql("SELECT complete_since IS NULL FROM public.monday_manual_history_coverage;")[0] == 't'
print('PASS additive migration leaves every historical row unchanged and coverage uncertified')
next_monday = sql("SELECT (date_trunc('week', now() AT TIME ZONE 'America/Los_Angeles')::date + 7)::text;")[0]
def manual(email, channel='public', **fields):
    data = dict(email=email, name='Manual Person', meeting_date=next_monday, **fields)
    return "SELECT public.register_monday_manual('%s'::jsonb, '%s')->>'already_registered';" % (json.dumps(data).replace("'", "''"), channel)
for role in ['anon', 'authenticated']:
    for action in ['SELECT', 'INSERT', 'UPDATE', 'DELETE']:
        assert sql(f"SELECT has_table_privilege('{role}','public.monday_manual_occurrences','{action}');")[0] == 'f'
    for signature in ['register_monday_manual(jsonb,text)', 'monday_manual_history(text,date)']:
        assert sql(f"SELECT has_function_privilege('{role}','public.{signature}','EXECUTE');")[0] == 'f'
    sql(f'SET ROLE {role}; ' + manual('denied@example.test'), ok=False)
    sql(f"SET ROLE {role}; SELECT public.monday_manual_history('person@example.test','{next_monday}');", ok=False)
    # ACL defense AND independently exercise RLS even if SELECT is accidentally granted.
    assert sql(f"BEGIN; GRANT SELECT ON public.monday_manual_occurrences TO {role}; SET LOCAL ROLE {role}; SELECT count(*) FROM public.monday_manual_occurrences; ROLLBACK;")[0].splitlines()[-2] == '0'
assert sql("SELECT bool_and(relrowsecurity) FROM pg_class WHERE oid IN ('public.monday_manual_occurrences'::regclass,'public.monday_manual_history_coverage'::regclass);")[0] == 't'
assert sql("SELECT has_table_privilege('service_role','public.monday_manual_occurrences','UPDATE'),has_table_privilege('service_role','public.monday_manual_occurrences','DELETE');")[0] == 'f|f'
for channel in ['public', 'legacy', 'kiosk']:
    email = channel + '@example.test'
    assert sql('SET ROLE service_role; ' + manual(email, channel, auto_register=True))[0].endswith('false')
    assert sql('SET ROLE service_role; ' + manual(email.upper(), channel, auto_register=False))[0].endswith('true')
    assert sql(f"SELECT count(*),min(channel) FROM public.monday_manual_occurrences WHERE email='{email}';")[0] == f'1|{channel}'
    assert sql(f"SELECT auto_register FROM public.zoom_meeting_registrations WHERE email='{email}';")[0] == 't'
    sql(f"SET ROLE service_role; UPDATE public.monday_manual_occurrences SET channel='public' WHERE email='{email}';", ok=False)
print('PASS all three manual channels, retry idempotency, consent independence and service-only append-only/RLS boundary')

# True SQL concurrency: observe actual row/unique-key waits, not fixed sleeps.
for first_channel, second_channel in [('public','legacy'), ('kiosk','public')]:
    email = f'{first_channel}-race@example.test'
    overlap('SET ROLE service_role; ' + manual(email, first_channel), 'SET ROLE service_role; ' + manual(email.upper(), second_channel), True, 'true')
    assert sql(f"SELECT count(*), min(channel) FROM public.monday_manual_occurrences WHERE email='{email}';")[0] == f'1|{first_channel}'
auto_insert = f"INSERT INTO public.zoom_meeting_registrations(email,name,phone,question,meeting_date,registration_source,auto_register,consent_email_list) VALUES ('manual-auto@example.test','Automatic','phone','original','{next_monday}','automatic',true,true);"
overlap(auto_insert, manual('manual-auto@example.test'), True, 'true')
assert sql("SELECT registration_source,name,question,auto_register,consent_email_list FROM public.zoom_meeting_registrations WHERE email='manual-auto@example.test';")[0] == 'automatic|Automatic|original|t|t'
assert sql("SELECT count(*) FROM public.monday_manual_occurrences WHERE email='manual-auto@example.test';")[0] == '1'
overlap(manual('manual-first@example.test'), auto_insert.replace('manual-auto@example.test','manual-first@example.test'), False, 'zoom_registration_email_meeting_unique')
assert sql("SELECT count(*) FROM public.monday_manual_occurrences WHERE email='manual-first@example.test';")[0] == '1'
# Manual promotion survives a stale mirror delete in both transaction orderings.
for delete_first in [False, True]:
    email = f'mirror-{delete_first}@example.test'.lower()
    sql(auto_insert.replace('manual-auto@example.test', email).replace("'automatic'", "'app'"))
    delete = f"DELETE FROM public.zoom_meeting_registrations WHERE email='{email}' AND registration_source='app';"
    promote = manual(email)
    overlap(delete if delete_first else promote, promote if delete_first else delete, True, 'false' if delete_first else 'DELETE 0')
    assert sql(f"SELECT registration_source FROM public.zoom_meeting_registrations WHERE email='{email}';")[0] == 'website'
    assert sql(f"SELECT count(*) FROM public.monday_manual_occurrences WHERE email='{email}';")[0] == '1'
print('PASS observed lock waits: manual/manual, auto/manual BOTH orders and app delete/manual BOTH orders')

# Any provenance write failure rolls the seat back, rather than acknowledging
# a saved seat with missing evidence. Test-only trigger is removed afterward.
sql("CREATE FUNCTION public.reject_test_manual() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic evidence failure'; END $$; CREATE TRIGGER reject_test_manual BEFORE INSERT ON public.monday_manual_occurrences FOR EACH ROW EXECUTE FUNCTION public.reject_test_manual();")
sql(manual('rollback@example.test'), ok=False)
assert sql("SELECT count(*) FROM public.zoom_meeting_registrations WHERE email='rollback@example.test';")[0] == '0'
sql('DROP TRIGGER reject_test_manual ON public.monday_manual_occurrences; DROP FUNCTION public.reject_test_manual();')
# Reject a backdated request instead of fabricating prior history.
sql(manual('backdated@example.test').replace(next_monday, '2000-01-03'), ok=False)
sql(manual('invalid-channel@example.test', 'automatic'), ok=False)
assert sql("SELECT count(*) FROM public.zoom_meeting_registrations WHERE email IN ('backdated@example.test','invalid-channel@example.test');")[0] == '0'
print('PASS evidence failure atomic rollback and backdated/invalid-origin rejection')

# Synthetic prior evidence includes duplicate actions, distinct dates, future
# dates, literal wildcard identity, historical auto/app/website/kiosk ambiguity.
sql("""INSERT INTO public.zoom_meeting_registrations(email,name,phone,question,meeting_date,registration_source,auto_register)
 SELECT ' Count%_@Example.test ','Old','','',date '2000-01-03' + n*7,
 CASE n % 4 WHEN 0 THEN 'website' WHEN 1 THEN 'app' WHEN 2 THEN 'automatic' ELSE 'kiosk' END, n % 2 = 0
 FROM generate_series(0,1004) n;
 INSERT INTO public.monday_manual_occurrences(email,meeting_date,channel)
 VALUES ('count%_@example.test','2000-01-03','public'),('count%_@example.test','2000-01-10','legacy'),('xcount%_@example.test','2000-01-17','kiosk');
""")
sql(manual('count%_@example.test', 'kiosk'))
history = json.loads(sql(f"SET ROLE service_role; SELECT public.monday_manual_history(' COUNT%_@EXAMPLE.test ','{next_monday}');")[0].splitlines()[-1])
assert history == dict(verifiedManual=2, unclassified=1003, completeSince=None), history
# Current requested occurrence excluded even if it is a past meeting.
assert json.loads(sql("SELECT public.monday_manual_history('count%_@example.test','2000-01-10');")[0])['verifiedManual'] == 1
# Future registrations for dates before the requested meeting still do not count.
future = sql(f"SELECT ('{next_monday}'::date + 7)::text;")[0]
assert json.loads(sql(f"SELECT public.monday_manual_history('count%_@example.test','{future}');")[0])['verifiedManual'] == 2
# Deletion or source changes do not erase captured evidence.
sql("DELETE FROM public.zoom_meeting_registrations WHERE lower(btrim(email))='count%_@example.test' AND meeting_date='2000-01-03';")
assert json.loads(sql(f"SELECT public.monday_manual_history('count%_@example.test','{next_monday}');")[0])['verifiedManual'] == 2
# RLS remains empty with actual rows, even when SELECT alone is granted.
assert sql("BEGIN; GRANT SELECT ON public.monday_manual_occurrences TO authenticated; SET LOCAL ROLE authenticated; SELECT count(*) FROM public.monday_manual_occurrences; ROLLBACK;")[0].splitlines()[-2] == '0'
# Cutover certification cannot retroactively classify old seats. Newly created
# nonmanual seats after cutover are known not to have a captured manual action.
sql("UPDATE public.monday_manual_history_coverage SET complete_since=clock_timestamp();")
sql("INSERT INTO public.zoom_meeting_registrations(email,name,phone,question,meeting_date,registration_source) VALUES ('count%_@example.test','after cutover','','','1999-12-27','automatic');")
certified = json.loads(sql(f"SELECT public.monday_manual_history('count%_@example.test','{next_monday}');")[0])
assert certified['verifiedManual'] == 2 and certified['unclassified'] == 1003 and certified['completeSince']
print('PASS SQL counts >1000 rows, normalized literal identity, unknown history, cutoff certification, no source/consent inference, current/future exclusion and evidence durability')
print('PASS all database delta gates (NOT full migration replay)')
