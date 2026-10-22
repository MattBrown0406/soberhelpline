"""Standalone delta gate on synthetic duplicate-bearing PostgreSQL 17 schema.
No production connection, no old migrations; destroys only its unique test container.
"""
import json
import pathlib
import subprocess
import time
import uuid
root = pathlib.Path(__file__).resolve().parents[1]
container = 'sh-owner-compatible-test-' + uuid.uuid4().hex[:10]
base = ['docker', 'exec', '-i', container, 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'owner_test', '-Atq']
def sql(text, ok=True):
    r = subprocess.run(base, input=text, text=True, capture_output=True)
    assert (r.returncode == 0) == ok, r.stderr or r.stdout
    return r.stdout.strip()
def check(label, condition):
    assert condition, label
    print('PASS', label, flush=True)
def claim(id, kind='owner', email='fresh@example.test'):
    return f"select public.claim_monday_notification('{id}','{email}','2026-10-26','{kind}');"
try:
    subprocess.run(['docker','run','--rm','-d','--network','none','--name',container,'-e','POSTGRES_PASSWORD=local-test-only','public.ecr.aws/supabase/postgres:17.6.1.165'],check=True,capture_output=True)
    until=time.monotonic()+90
    while time.monotonic()<until:
        if subprocess.run(['docker','exec',container,'pg_isready','-h','127.0.0.1','-U','postgres'],capture_output=True).returncode==0: break
        time.sleep(.2)
    else: raise AssertionError('TCP readiness timeout')
    subprocess.run(['docker','exec',container,'createdb','-U','postgres','owner_test'],check=True)
    sql('''create table public.zoom_meeting_registrations (
      id uuid primary key default gen_random_uuid(), user_id uuid, name text not null,
      email text not null, phone text not null, question text not null,
      request_follow_up boolean not null default false, consent_email_list boolean not null default false,
      created_at timestamptz not null default now(), meeting_date date not null,
      auto_register boolean not null default false, language text not null default 'en',
      registration_source text not null default 'website', preferred_contact_date text,
      preferred_contact_time text, preferred_timezone text, operational jsonb default '{"score":2}');
      alter table public.zoom_meeting_registrations enable row level security;
      alter table public.zoom_meeting_registrations force row level security;
      grant all on public.zoom_meeting_registrations to service_role;
      grant insert on public.zoom_meeting_registrations to anon;
      grant select,insert,update,delete on public.zoom_meeting_registrations to authenticated;
      create policy anon_insert on public.zoom_meeting_registrations for insert to anon with check(user_id is null);
      create unique index app_only on public.zoom_meeting_registrations(lower(btrim(email)),meeting_date) where registration_source='app';
      insert into public.zoom_meeting_registrations(email,name,phone,question,meeting_date,consent_email_list,user_id)
      select case when i=1 then ' OLD@example.test ' else 'old@example.test' end,'Name '||i,'phone '||i,E'Multiline\ncomment '||i,'2026-10-26',i%2=0,gen_random_uuid() from generate_series(1,4) i;
    ''')
    for i in range(7):
        action='cascade' if i<5 else 'set null'
        sql(f'create table public.child_{i}(id uuid primary key default gen_random_uuid(),registration_id uuid references public.zoom_meeting_registrations(id) on delete {action},note text); insert into public.child_{i}(registration_id,note) select id,question from public.zoom_meeting_registrations;')
    def snapshot():
        return [sql(f'select coalesce(jsonb_agg(to_jsonb(t) order by id),\'[]\'::jsonb) from public.{t} t;') for t in ['zoom_meeting_registrations']+[f'child_{i}' for i in range(7)]]
    before=snapshot()
    migration=next((root/'supabase/migrations').glob('*_monday_notification_ledger_compatible.sql')).read_text()
    sql('alter table public.zoom_meeting_registrations rename column phone to unexpected_phone;')
    sql(migration,False)
    check('schema guard rolls back all DDL',sql("select to_regnamespace('monday_notification_private') is null;")=='t')
    sql('alter table public.zoom_meeting_registrations rename column unexpected_phone to phone;')
    sql(migration)
    check('all historical fields, conflicts, raw comments and seven FK row sets unchanged',before==snapshot())
    check('legacy distinct occurrence held without invented attempt/acceptance',sql("select count(*),count(token),count(attempted_at),count(accepted_at) from monday_notification_private.deliveries;")=='2|0|0|0')
    old=sql('select id from public.zoom_meeting_registrations order by id limit 1;')
    check('legacy duplicate cannot send',sql(claim(old,email='old@example.test'))=='')
    check('original anon insert and RLS/force unchanged',sql("select has_table_privilege('anon','public.zoom_meeting_registrations','INSERT'),relrowsecurity,relforcerowsecurity from pg_class where oid='public.zoom_meeting_registrations'::regclass;")=='t|t|t')
    for role in ['anon','authenticated']:
        sql(f"set role {role}; select * from monday_notification_private.deliveries;",False)
        for expr in [f"public.monday_notification_context('{old}')",f"public.claim_monday_notification('{old}','old@example.test','2026-10-26','owner')",'public.finish_monday_notification(gen_random_uuid(),true)']:
            sql(f'set role {role}; select {expr};',False)
    check('client roles denied ledger and every RPC',True)
    fresh=[]
    for n in range(2):
        fresh.append(sql(f"insert into public.zoom_meeting_registrations(email,name,phone,question,meeting_date,consent_email_list) values ('{' Fresh@EXAMPLE.test ' if n else 'fresh@example.test'}','fresh','','comment {n}','2026-10-26',{str(bool(n)).lower()}) returning id;"))
    a=subprocess.Popen(base[:3]+['-e','PGAPPNAME=owner_claim_first']+base[3:],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    assert a.stdin is not None
    a.stdin.write('begin; set role service_role;'+claim(fresh[0])+'\n'); a.stdin.flush()
    deadline=time.monotonic()+10
    while time.monotonic()<deadline:
        if sql("select state from pg_stat_activity where application_name='owner_claim_first';")=='idle in transaction': break
        time.sleep(.05)
    else: raise AssertionError('first transaction not ready')
    b=subprocess.Popen(base[:3]+['-e','PGAPPNAME=owner_claim_second']+base[3:]+['-c','set role service_role;'+claim(fresh[1])],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    deadline=time.monotonic()+10
    while time.monotonic()<deadline:
        if sql("select wait_event_type from pg_stat_activity where application_name='owner_claim_second';")=='Lock': break
        time.sleep(.05)
    else: raise AssertionError('no observed lock wait')
    a.stdin.write('commit;\n\\q\n'); a.stdin.flush()
    out,err=a.communicate(timeout=10); out2,err2=b.communicate(timeout=10)
    check('observed concurrent duplicate-ID claim wait; one owner attempt',a.returncode==0 and b.returncode==0 and not out2.strip())
    token=out.strip()
    check('recipient independent claim',bool(sql(claim(fresh[1],kind='attendee'))))
    check('stale email identity rejected',bool(sql(claim(fresh[1],email='changed@example.test'),False)) is False)
    check('token fenced completion',sql(f"set role service_role;select public.finish_monday_notification('{token}',true);select public.finish_monday_notification('{token}',false);")=='t\nf')
    check('accepted not overwritten',sql(f"select state,accepted_at is not null from monday_notification_private.deliveries where token='{token}';")=='accepted|t')
    sql("insert into public.zoom_meeting_registrations(email,name,phone,question,meeting_date,registration_source) select 'fresh@example.test','history','','',date '1990-01-01'+7*i,case when i%2=0 then 'automatic' else 'website' end from generate_series(0,1500)i;")
    sql("insert into public.zoom_meeting_registrations(email,name,phone,question,meeting_date) values('FRESH@example.test','duplicate history','','','1990-01-01'),('fresh@example.test','future','','','2050-01-03'),('other@example.test','other','','','1980-01-07');")
    context=json.loads(sql(f"set role service_role;select public.monday_notification_context('{fresh[0]}');"))
    check('server aggregate exceeds API caps, distinct dates, all sources, current/future excluded',context['priorRegisteredWeeks']==1501 and context['weeksWithAutomaticSource']==751 and len(context['comments'])==2)
    sql(f"update public.zoom_meeting_registrations set operational='{{\"score\":3}}',question=question||' updated' where id='{fresh[0]}';")
    check('normal operational/comment updates remain permitted; no new trigger/FK on legacy table',sql("select count(*) from pg_trigger where tgrelid='public.zoom_meeting_registrations'::regclass and not tgisinternal;")=='0')
    sql(migration,False)
    check('accidental migration replay fails closed without resetting state',sql(f"select state from monday_notification_private.deliveries where token='{token}';")=='accepted')
    print('PASS standalone duplicate-bearing notification delta (not full-chain/live-schema proof)',flush=True)
finally:
    subprocess.run(['docker','rm','-fv',container],capture_output=True)
    check('test container removed',subprocess.run(['docker','inspect',container],capture_output=True).returncode!=0)
