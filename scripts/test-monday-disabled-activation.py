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
    migration=next((root/'supabase/migrations').glob('*_monday_notification_disabled_activation.sql')).read_text()
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
    # All runtime claims disabled, including a registration saved after installation.
    def insert(email, created="clock_timestamp()", day="2026-10-26"):
        return sql(f"insert into public.zoom_meeting_registrations(email,name,phone,question,meeting_date,created_at) values('{email}','test','','','{day}',{created}) returning id;")
    def start(name, text, interactive=False):
        p=subprocess.Popen(base[:3]+['-e',f'PGAPPNAME={name}']+base[3:]+([] if interactive else ['-c',text]),stdin=subprocess.PIPE if interactive else None,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
        if interactive:
            p.stdin.write(text+'\n'); p.stdin.flush()
        return p
    def wait(name, field, expected):
        deadline=time.monotonic()+10
        while time.monotonic()<deadline:
            if sql(f"select {field} from pg_stat_activity where application_name='{name}';")==expected: return
            time.sleep(.03)
        raise AssertionError(f'{name}: never observed {field}={expected}')
    def end(p):
        p.stdin.write('commit;\n\\q\n'); p.stdin.flush()
        out,err=p.communicate(timeout=10)
        assert p.returncode==0,err
        return out.strip()
    during=insert('during@example.test')
    vanished=insert('vanished@example.test')
    # Models an old worker retaining an already-persisted identity, then unrelated
    # legacy cleanup removing it before the activation snapshot.
    sql(f"delete from public.zoom_meeting_registrations where id='{vanished}';")
    check('disabled runtime returns no claim and consumes no attempt',sql('set role service_role;'+claim(during,email='during@example.test'))=='')
    check('installed disabled',sql('select enabled,activated_at is null from monday_notification_private.control;')=='f|t')
    def activate(ack, risk='true', revision='monday-ledger-disabled-v1'):
        return f"select monday_notification_private.activate('{revision}','{ack}',{risk});"
    ack=json.loads(sql("set role service_role; select public.monday_notification_status('monday-ledger-disabled-v1',true);"))['acknowledgment']
    sql(f"update monday_notification_private.revision_acks set observed_at=clock_timestamp()-interval '11 minutes' where id='{ack}';")
    sql(activate(ack),False)
    ack=json.loads(sql("set role service_role; select public.monday_notification_status('monday-ledger-disabled-v1',true);"))['acknowledgment']
    for role in ['anon','authenticated']:
        sql(f"set role {role}; select public.monday_notification_status('monday-ledger-disabled-v1',true);",False)
        for table in ['control','revision_acks','legacy_rows']:
            sql(f'set role {role}; select * from monday_notification_private.{table};',False)
    check('expired ACK and client access to all rollout objects rejected',True)
    sql(activate(str(uuid.uuid4())),False)
    sql(activate(ack,risk='false'),False)
    sql(activate(ack,revision='wrong'),False)
    sql('set role service_role;'+activate(ack),False)
    sql('set role service_role; update monday_notification_private.control set enabled=true;',False)
    sql('begin isolation level repeatable read;'+activate(ack),False)
    check('activation requires fresh matching ACK, explicit risk, admin and READ COMMITTED',True)
    sql(f"alter table public.zoom_meeting_registrations alter column created_at drop not null; update public.zoom_meeting_registrations set created_at=null where id='{during}';")
    sql(activate(ack),False)
    check('snapshot error rolls back enabling and new holds',sql("select enabled from monday_notification_private.control;")== 'f'
          and sql("select count(*) from monday_notification_private.deliveries where email_key='during@example.test';")=='0')
    sql(f"update public.zoom_meeting_registrations set created_at=clock_timestamp() where id='{during}'; alter table public.zoom_meeting_registrations alter column created_at set not null;")
    # Preserve IDs that existed at install even if subsequently mutated or deleted.
    sql(f"update public.zoom_meeting_registrations set email='edited@example.test',meeting_date='2026-11-02',created_at=clock_timestamp()+interval '1 day' where id='{old}';")
    # Writer is already holding ROW EXCLUSIVE; activation must wait and then see it.
    queued_id=str(uuid.uuid4())
    writer=start('activation_writer',f"begin; insert into public.zoom_meeting_registrations(id,email,name,phone,question,meeting_date) values('{queued_id}','queued@example.test','queued','','','2026-10-26');",True)
    wait('activation_writer','state','idle in transaction')
    activator=start('activation_cutover','begin; set local lock_timeout=\'15s\'; set local statement_timeout=\'30s\';'+activate(ack),True)
    wait('activation_cutover','wait_event_type','Lock')
    end(writer)
    wait('activation_cutover','state','idle in transaction')
    activation_before=snapshot()
    # While activation holds SHARE until commit, a new insert and a claim wait.
    post_id=str(uuid.uuid4())
    after=start('activation_after',f"insert into public.zoom_meeting_registrations(id,email,name,phone,question,meeting_date,created_at) values('{post_id}','after@example.test','after','','','2026-10-26',clock_timestamp());")
    waiting_claim=start('activation_claim','set role service_role;'+claim(during,email='during@example.test'))
    wait('activation_after','wait_event_type','Lock')
    wait('activation_claim','wait_event_type','Lock')
    boundary=end(activator)
    out,err=after.communicate(timeout=10); assert after.returncode==0,err
    out,err=waiting_claim.communicate(timeout=10); assert waiting_claim.returncode==0,err
    check('claim waits for activation then observes hold, never a partial snapshot',out.strip()=='')
    activation_after=snapshot()
    check('activation preserves every preexisting registration field and all seven child tables',
          json.loads(activation_before[0])==[r for r in json.loads(activation_after[0]) if r['id']!=post_id]
          and activation_before[1:]==activation_after[1:])
    check('activation captured prior uncommitted insert after observed lock wait',sql(claim(queued_id,email='queued@example.test'))=='')
    check('activation timestamp exact, post-lock insert eligible',sql(f"select created_at > (select activated_at from monday_notification_private.control) from public.zoom_meeting_registrations where id='{post_id}';")=='t' and bool(sql(claim(post_id,email='after@example.test'))))
    check('mutation of installation ID stays held',sql(f"select public.claim_monday_notification('{old}','edited@example.test','2026-11-02','owner');")=='')
    # New duplicate ID after activation still held for every preactivation email/week.
    late=insert(' QUEUED@example.test ')
    check('late normalized same-week duplicate held for both recipients',all(sql(claim(late,kind=k,email='queued@example.test'))=='' for k in ['owner','attendee']))
    sql(f"delete from public.zoom_meeting_registrations where id='{queued_id}';")
    check('hold survives legacy row deletion',sql(claim(late,email='queued@example.test'))=='')
    equal=insert('equal@example.test',f"'{boundary}'::timestamptz")
    check('created_at exactly activation boundary rejected',sql(claim(equal,email='equal@example.test'))=='')
    backdated=insert('backdated@example.test',f"'{boundary}'::timestamptz-interval '1 microsecond'")
    check('old transaction/backdated insert rejected by full timestamp',sql(claim(backdated,email='backdated@example.test'))=='')
    historic=insert('historical-new@example.test',day='2000-01-03')
    check('postactivation historical occurrence insert cannot replay',sql(f"select public.claim_monday_notification('{historic}','historical-new@example.test','2000-01-03','owner');")=='')
    # Same identity next week is NOT lifetime-suppressed.
    next_week=insert('queued@example.test',day='2026-11-02')
    check('held identity eligible for genuinely new future occurrence',bool(sql(f"select public.claim_monday_notification('{next_week}','queued@example.test','2026-11-02','owner');")))
    sql(activate(ack),False)
    check('activation cannot replay/reset ledger',sql('select activated_at from monday_notification_private.control;')==boundary)
    # Counterexample is intentional: a legacy worker ignoring this ledger can
    # attempt mail for a NEW postactivation registration also claimed by new code.
    sql('create table legacy_provider_attempts(registration_id uuid);')
    sql(f"insert into legacy_provider_attempts values('{post_id}');")
    check('mixed-version counterexample: postactivation legacy routing is NOT fenced',sql(f"select count(*) from legacy_provider_attempts l join monday_notification_private.deliveries d on d.registration_id=l.registration_id where l.registration_id='{post_id}';")=='1')
    check('mixed in-flight preactivation reference remains held on new side',sql(claim(during,email='during@example.test'))=='')
    recreated=insert('vanished@example.test')
    check('counterexample: transient preactivation identity deleted between snapshots is unknowable',bool(sql(claim(recreated,email='vanished@example.test'))))

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
    pilot=insert('pilot@example.test')
    outside=insert('outside-pilot@example.test')
    sql("update monday_notification_private.control set pilot_email_key='pilot@example.test',pilot_meeting_date='2026-10-26',claim_deadline=clock_timestamp()+interval '10 minutes';")
    sql("set role service_role; update monday_notification_private.control set pilot_email_key=null,pilot_meeting_date=null,claim_deadline=null;",False)
    check('bounded pilot rejects unrelated fresh occurrence',sql(claim(outside,email='outside-pilot@example.test'))=='')
    check('bounded pilot admits one occurrence owner',bool(sql(claim(pilot,email='pilot@example.test'))))
    sql("update monday_notification_private.control set claim_deadline=clock_timestamp()-interval '1 microsecond';")
    check('bounded pilot expires before unclaimed attendee; runtime cannot widen it',sql(claim(pilot,kind='attendee',email='pilot@example.test'))=='')
    sql("update monday_notification_private.control set claim_deadline=clock_timestamp()+interval '10 minutes';")
    check('bounded pilot recipient claims still independent',bool(sql(claim(pilot,kind='attendee',email='pilot@example.test'))))
    sql(migration,False)
    check('accidental migration replay fails closed without resetting state',sql(f"select state from monday_notification_private.deliveries where token='{token}';")=='accepted')
    print('PASS standalone duplicate-bearing notification delta (not full-chain/live-schema proof)',flush=True)
finally:
    subprocess.run(['docker','rm','-fv',container],capture_output=True)
    check('test container removed',subprocess.run(['docker','inspect',container],capture_output=True).returncode!=0)
