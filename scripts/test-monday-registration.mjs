import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const root = process.cwd();
const message = 'You’re already registered. We look forward to seeing you Monday evening!';
const duplicate = { code: '23505', message: 'duplicate key violates unique constraint "zoom_registration_email_meeting_unique"' };
const today = '2026-10-12';
class Clock extends Date { constructor(...args) { super(...(args.length ? args : ['2026-10-12T12:00:00Z'])); } }

function harness() {
  const state = { manual: new Map(), settingsError: false, blocklistError: false, suppressionError: false, rows: [], calls: [], cancelled: false, blocked: false, failInsert: null, authUser: null, rpcError: null, claims: new Set(), fetchImpl: null, historyError: false, detailsError: false, logs: [], pageCap: 500 };
  const client = {
    auth: { getUser: async () => ({ data: { user: state.authUser }, error: null }) },
    rpc: async (name, args) => {
      if (state.rpcError) return { data: null, error: state.rpcError };
      if (name === 'monday_notification_status') {
        if (state.rolloutError) return { data: null, error: { message: 'unavailable' } };
        return { data: { revision: state.wrongRevision ? 'wrong' : args._revision, enabled: !state.disabled,
          acknowledgment: args._acknowledge ? 'probe-ack' : null }, error: null };
      }
      if (name === 'register_monday_manual') {
        if (state.failInsert) return { data: null, error: state.failInsert };
        const p = args._registration;
        let row = state.rows.find(r => r.email.trim().toLowerCase() === p.email && r.meeting_date === p.meeting_date);
        const existing = Boolean(row);
        if (!row) { row = { ...p, id: String(state.rows.length + 1) }; state.rows.push(row); }
        else if (row.registration_source === 'app') row.registration_source = 'website';
        const key = `${p.email}|${p.meeting_date}`;
        if (!state.manual.has(key)) state.manual.set(key, { email: p.email, meeting_date: p.meeting_date, channel: args._channel });
        return { data: { already_registered: existing, registration: { id: row.id, name: row.name, email: row.email } }, error: null };
      }
      if (name === 'monday_manual_history') {
        if (state.historyError) return { data: null, error: { message: 'unavailable' } };
        const prior = r => r.email.trim().toLowerCase() === args._email.trim().toLowerCase() && r.meeting_date < args._meeting_date && r.meeting_date < today;
        const manual = new Set([...state.manual.values()].filter(prior).map(r => r.meeting_date));
        const unknown = new Set(state.rows.filter(prior).map(r => r.meeting_date).filter(d => !manual.has(d)));
        return { data: { verifiedManual: manual.size, unclassified: unknown.size, completeSince: null }, error: null };
      }
      if (name === 'monday_notification_context') {
        if (state.historyError) return { data: null, error: { message: 'unavailable' } };
        const row = state.rows.find(r => r.id === args._registration_id);
        const same = r => r.email.trim().toLowerCase() === row.email.trim().toLowerCase();
        const prior = state.rows.filter(r => same(r) && r.meeting_date < row.meeting_date && r.meeting_date < today);
        return { data: { priorRegisteredWeeks: new Set(prior.map(r => r.meeting_date)).size,
          weeksWithAutomaticSource: new Set(prior.filter(r => r.registration_source === 'automatic').map(r => r.meeting_date)).size,
          comments: state.rows.filter(r => same(r) && r.meeting_date === row.meeting_date).map(r => ({ id:r.id, source:r.registration_source ?? null, question:r.question ?? null })) }, error: null };
      }
      if (name === 'claim_monday_notification') {
        if (state.claimFailure === args._kind) return { data: null, error: { message: 'unavailable' } };
        const key = `${args._email.trim().toLowerCase()}|${args._meeting_date}|${args._kind}`;
        if (state.claims.has(key)) return { data: null, error: null };
        state.claims.add(key);
        return { data: key, error: null };
      }
      if (name === 'finish_monday_notification') {
        if (state.finishFailure) return { data: false, error: { message: 'ack failed' } };
        state.outcomes ??= new Map(); state.outcomes.set(args._token, args._accepted);
        return { data: true, error: null };
      }
      if (name === 'is_meeting_blocked') return { data: state.blocked, error: null };
      if (name === 'append_monday_registration_question') {
        const row = state.rows.find(r => r.email.trim().toLowerCase() === args._email && r.meeting_date === args._meeting_date);
        if (row && !(row.question ?? '').split('\n').includes(args._question)) row.question = [row.question, args._question].filter(Boolean).join('\n');
        return { data: Boolean(row), error: null };
      }
      if (name === 'merge_monday_registration_questions' && state.legacySchema) return { data: null, error: { code: 'PGRST202', message: 'Could not find the function' } };
      if (name === 'merge_monday_registration_questions') {
        const row = state.rows.find(r => r.email.trim().toLowerCase() === args._email && r.meeting_date === args._meeting_date);
        if (row) for (const q of args._questions) {
          const rendered = args._from_app ? `• ${q} (from the app)` : q;
          if (!(row.question ?? '').split('\n').some(item => item === q || item === rendered)) row.question = [row.question, rendered].filter(Boolean).join('\n');
        }
        return { data: Boolean(row), error: null };
      }
      if (name === 'ensure_monday_registration') {
        const existing = state.rows.find(r => r.email.trim().toLowerCase() === args._email && r.meeting_date === args._meeting_date);
        if (existing) { if (existing.registration_source === 'app') existing.registration_source = 'website'; return { data: true, error: null }; }
        state.rows.push({ id: String(state.rows.length + 1), email: args._email, name: args._name, meeting_date: args._meeting_date, registration_source: 'website' });
        return { data: false, error: null };
      }
      if (name === 'ensure_monday_app_registration') {
        const existing = state.rows.find(r => r.email.trim().toLowerCase() === args._email && r.meeting_date === args._meeting_date);
        if (existing) return { data: true, error: null };
        state.rows.push({ id: String(state.rows.length + 1), email: args._email, name: args._name, meeting_date: args._meeting_date, registration_source: 'app' });
        return { data: false, error: null };
      }
      return { data: null, error: null };
    },
    from: (table) => {
      let op = 'select', payload, single = false, history = false, offset = 0, end = Infinity;
      const filters = [];
      const q = {
        select() { return q; }, insert(value) { op = 'insert'; payload = value; return q; },
        update(value) { op = 'update'; payload = value; return q; },
        eq(k, v) { filters.push(r => r[k] === v); return q; },
        neq(k, v) { filters.push(r => r[k] !== v); return q; },
        is(k, v) { filters.push(r => (r[k] ?? null) === v); return q; },
        ilike(k, v) { filters.push(r => {
          const value = v.replace(/^%|%$/g, '').replace(/\\([\\%_])/g, '$1').toLowerCase();
          return v.startsWith('%') ? r[k]?.toLowerCase().includes(value) : r[k]?.toLowerCase() === value;
        }); return q; },
        lt(k, v) { history = true; filters.push(r => r[k] < v); return q; },
        in(k, v) { filters.push(r => v.includes(r[k])); return q; },
        order() { return q; }, limit() { return q; }, range(a, b) { offset = a; end = b; return q; },
        single() { single = true; return q; }, maybeSingle() { single = true; return q; },
        then(resolve, reject) {
          return Promise.resolve().then(() => {
            if (table === 'cancelled_meeting_dates') return { data: state.cancelled ? { meeting_date: today, reason: 'Cancelled' } : null, error: null };
            if (table === 'meeting_blocklist' || table === 'site_settings') {
              const fail = table === 'site_settings' ? state.settingsError : state.blocklistError;
              if (fail === 'throw') throw new Error('lookup failed');
              return { data: single ? null : [], error: fail ? { message: 'lookup failed' } : null };
            }
            assert.equal(table, 'zoom_meeting_registrations');
            if (op === 'insert') {
              if (state.failInsert) return { data: null, error: state.failInsert };
              const items = Array.isArray(payload) ? payload : [payload];
              if (state.legacySchema && items.some(item => 'question_items' in item)) return { data: null, error: { code: 'PGRST204', message: "Could not find the 'question_items' column" } };
              if (items.some(item => state.rows.some(r => r.email.trim().toLowerCase() === item.email.trim().toLowerCase() && r.meeting_date === item.meeting_date))) return { data: null, error: duplicate };
              const added = items.map(item => { const row = { ...item, id: String(state.rows.length + 1) }; state.rows.push(row); return row; });
              return { data: single ? added[0] : added, error: null };
            }
            if ((history && state.historyError) || (!history && op === 'select' && state.detailsError)) return { data: null, error: { message: 'lookup failed' } };
            const rows = state.rows.filter(r => filters.every(f => f(r))).slice(offset, Math.min(end + 1, offset + state.pageCap));
            if (op === 'update') rows.forEach(r => Object.assign(r, payload));
            return { data: single ? rows[0] ?? null : rows, error: null };
          }).then(resolve, reject);
        },
      }; return q;
    },
  };
  function load(relative) {
    let handler;
    const filename = path.resolve(root, relative);
    const source = process.env.REVIEW_BASELINE_REF
      ? execFileSync('git', ['show', `${process.env.REVIEW_BASELINE_REF}:${relative}`], { encoding: 'utf8' })
      : fs.readFileSync(filename, 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const exports = {};
    const env = { SUPABASE_URL: 'https://test.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-service', MEMBERSHIP_SYNC_SECRET: 'test-sync', SENDGRID_API_KEY: 'test-sendgrid' };
    vm.runInNewContext(code, {
      exports, Request, Response, URL, URLSearchParams, TextEncoder, Uint8Array, Date: Clock, btoa, crypto: webcrypto,
      console: Object.fromEntries(["log", "warn", "error"].map(level => [level, (...args) => state.logs.push(args)])),
      Deno: { env: { get: key => env[key] }, serve: h => { handler = h; } },
      fetch: async (url, options) => { const call = { url, body: JSON.parse(options.body) }; state.calls.push(call); return state.fetchImpl ? state.fetchImpl(call) : new Response('{"success":true}', { status: 200 }); },
      require: id => {
        if (id.includes('/http/server.ts')) return { serve: h => { handler = h; } };
        if (id.includes('@supabase/supabase-js')) return { createClient: () => client };
        if (id.includes('/zod@')) return require('zod');
        if (id.endsWith('/spine.ts')) return { enqueueSpineEvent: async () => {}, extractUtm: () => ({}) };
        if (id.endsWith('/automationAuth.ts')) return { requireAutomationAuth: async () => null };
        if (id.endsWith('/suppression.ts')) return { getSuppressedRecipients: async () => { if (state.suppressionError) throw new Error('lookup failed'); return new Set(); } };
        if (id.endsWith('/mondayNotificationContext.ts')) return load('supabase/functions/_shared/mondayNotificationContext.ts').exports;
        if (id.endsWith('/mondayNotification.ts')) return load('supabase/functions/_shared/mondayNotification.ts').exports;
        if (id.endsWith('/mondayRegistrationHistory.ts')) return load('supabase/functions/_shared/mondayRegistrationHistory.ts').exports;
        if (id.endsWith('/mondayRegistration.ts')) return load('supabase/functions/_shared/mondayRegistration.ts').exports;
        throw new Error(`Unexpected import ${id}`);
      },
    }, { filename });
    return { handler, exports };
  }
  const post = async (handler, body, headers = {}) => {
    const response = await handler(new Request('https://test.invalid/', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }));
    return { status: response.status, body: await response.json() };
  };
  return { state, load, post };
}
const payload = { name: 'Test Person', email: 'Person@example.test', meeting_date: today, user_id: 'untrusted-user-id' };
let tests = 0;
async function test(name, fn) { if (process.env.REVIEW_TEST_FILTER && !name.includes(process.env.REVIEW_TEST_FILTER)) return; await fn(); tests++; console.log(`ok ${tests} - ${name}`); }
await test('public concurrent submits, retry, auto-registration replay and next week', async () => {
  const { state, load, post } = harness(); const { handler } = load('supabase/functions/public-register-monday-zoom/index.ts');
  const results = await Promise.all([post(handler, payload), post(handler, { ...payload, email: ' person@EXAMPLE.test ' })]);
  assert.deepEqual(results.map(r => r.body.alreadyRegistered).sort(), [false, true]);
  assert.equal(state.rows.length, 1); assert.equal(state.calls.length, 1); assert.equal(state.rows[0].user_id, null);
  state.rows[0].auto_register = true; const before = JSON.stringify(state.rows[0]);
  const replay = await post(handler, { ...payload, question: 'Do not overwrite', auto_register: false });
  assert.equal(replay.status, 200); assert.equal(replay.body.message, message); assert.equal(replay.body.registration, null);
  assert.equal(JSON.stringify(state.rows[0]), before); assert.equal(state.calls.length, 1);
  const next = await post(handler, { ...payload, meeting_date: '2026-10-19' });
  assert.equal(next.body.alreadyRegistered, false); assert.equal(state.rows.length, 2); assert.equal(state.calls.length, 2);
});
await test('public invalid/cancelled/DB failure fail closed and do not send', async () => {
  const { state, load, post } = harness(); const { handler } = load('supabase/functions/public-register-monday-zoom/index.ts');
  assert.equal((await post(handler, { ...payload, meeting_date: '2026-02-30' })).status, 400);
  assert.equal((await post(handler, { ...payload, meeting_date: '2026-10-05' })).status, 400);
  state.cancelled = true; assert.equal((await post(handler, payload)).status, 409); state.cancelled = false;
  state.failInsert = { code: '23505', message: 'unrelated constraint' }; assert.equal((await post(handler, payload)).status, 500);
  state.failInsert = null; state.rpcError = { message: 'private DB failure' }; assert.equal((await post(handler, payload)).status, 500);
  assert.equal(state.calls.length, 0);
});
await test('only verified matching Auth email links a user', async () => {
  const { state, load, post } = harness(); const { handler } = load('supabase/functions/public-register-monday-zoom/index.ts');
  state.authUser = { id: 'verified-user', email: 'person@example.test' };
  await post(handler, payload, { Authorization: 'Bearer user-token' }); assert.equal(state.rows[0].user_id, 'verified-user');
  await post(handler, { ...payload, email: 'other@example.test' }, { Authorization: 'Bearer user-token' }); assert.equal(state.rows[1].user_id, null);
});
await test('member questions append only for verified identity, without extra seat or email', async () => {
  const { state, load, post } = harness(); const { handler } = load('supabase/functions/public-register-monday-zoom/index.ts');
  await post(handler, payload);
  const question = { ...payload, question_only: true, question: 'Please discuss boundaries' };
  assert.equal((await post(handler, question)).status, 400);
  state.authUser = { id: 'verified-user', email: 'person@example.test' };
  const headers = { Authorization: 'Bearer verified-token' };
  assert.equal((await post(handler, question, headers)).body.questionSubmitted, true);
  await post(handler, question, headers);
  assert.equal(state.rows[0].question, question.question); assert.equal(state.rows.length, 1); assert.equal(state.calls.length, 1);
});
await test('legacy registration endpoint no longer overwrites or resends', async () => {
  const { state, load, post } = harness(); const { handler } = load('supabase/functions/register-zoom-meeting/index.ts');
  await post(handler, payload); const result = await post(handler, { ...payload, question: 'overwrite' });
  assert.equal(result.body.alreadyRegistered, true); assert.equal(result.body.message, message);
  assert.equal(state.calls.length, 1); assert.equal(state.rows.length, 1); assert.equal(state.rows[0].question, '');
});
await test('overlapping auto-registration jobs and manual retry send once', async () => {
  const { state, load, post } = harness(); state.rows.push({ ...payload, id: 'old', email: 'person@example.test', meeting_date: '2026-10-05', auto_register: true });
  const auto = load('supabase/functions/auto-register-zoom/index.ts').handler;
  await Promise.all([post(auto, {}), post(auto, {})]); assert.equal(state.rows.length, 2); assert.equal(state.calls.length, 1);
  const manual = load('supabase/functions/public-register-monday-zoom/index.ts').handler;
  assert.equal((await post(manual, payload)).body.alreadyRegistered, true); assert.equal(state.calls.length, 1);
});
await test('email sender service authorization plus atomic claim blocks all duplicate effects', async () => {
  const { state, load, post } = harness(); state.rows.push({ ...payload, id: 'reg', consent_email_list: true });
  const { handler } = load('supabase/functions/send-zoom-registration-email/index.ts');
  const body = { name: payload.name, email: payload.email, registration_id: 'reg', consentEmailList: true };
  assert.equal((await post(handler, body)).status, 401);
  const results = await Promise.all([post(handler, body, { Authorization: 'Bearer test-service' }), post(handler, body, { Authorization: 'Bearer test-service' })]);
  assert.equal(results.filter(r => r.body.suppressed).length, 1);
  assert.equal(state.calls.filter(c => c.url.includes('sendgrid')).length, 2); // one attendee + one admin, NOT two confirmations
  assert.equal(state.calls.filter(c => c.url.includes('add-to-mailchimp')).length, 1);
  assert.equal(state.outcomes.size, 2); assert.ok([...state.outcomes.values()].every(Boolean));
  await post(handler, body, { Authorization: 'Bearer test-service' }); assert.equal(state.calls.length, 3);
});
await test('private app ensure contract: unauthorized, new, repeat, date scope, failure', async () => {
  const { state, load, post } = harness(); const { handler } = load('supabase/functions/app-family-squares-sync/index.ts');
  const body = { action: 'ensure-registration', meeting_date: today, attendee: { email: ' Person@example.test ', name: 'Test Person' } };
  const headers = { 'x-membership-sync-secret': 'test-sync' };
  assert.equal((await post(handler, body)).status, 401);
  assert.deepEqual((await post(handler, body, headers)).body, { ok: true, already_registered: false, meeting_date: today });
  assert.equal((await post(handler, body, headers)).body.already_registered, true);
  assert.equal((await post(handler, { ...body, meeting_date: '2026-10-19' }, headers)).body.already_registered, false);
  // Ensured seats are app rows (no marketing); the app saves its RSVP right
  // after ensuring, so its next snapshot keeps the row.
  assert.ok(state.rows.every((row) => row.registration_source === 'app'));
  const listed = await post(handler, { meeting_date: today, attendees: [{ email: 'person@example.test', name: 'Test Person', rsvp: 'going', questions: [] }] }, headers);
  assert.equal(listed.status, 200); assert.equal(listed.body.removed, 0); assert.equal(state.rows.length, 2);
  state.cancelled = true; assert.equal((await post(handler, body, headers)).status, 409); state.cancelled = false;
  state.rpcError = { message: 'failed' }; assert.equal((await post(handler, body, headers)).status, 500);
  assert.equal(state.calls.length, 0); assert.equal(state.rows.length, 2);
});
await test('app batch still syncs when the October 12 schema is not applied', async () => {
  const { state, load, post } = harness(); state.legacySchema = true;
  state.rows.push({ ...payload, id: 'web', email: 'web@example.test', registration_source: 'website', question: 'Website question' });
  state.rows.push({ ...payload, id: 'app', email: 'app@example.test', name: 'App Person', registration_source: 'app', question: '' });
  const handler = load('supabase/functions/app-family-squares-sync/index.ts').handler;
  const body = { meeting_date: today, attendees: [
    { email: 'new@example.test', name: 'New Person', rsvp: 'going', questions: ['First question'] },
    { email: 'web@example.test', name: 'Test Person', rsvp: 'going', questions: ['From app'] },
    { email: 'app@example.test', name: 'App Person', rsvp: 'going', questions: ['App question'] },
  ] };
  for (let i = 0; i < 2; i++) {
    const result = await post(handler, body, { 'x-membership-sync-secret': 'test-sync' });
    assert.equal(result.status, 200); assert.equal(result.body.ok, true);
  }
  const fresh = state.rows.filter(r => r.email === 'new@example.test');
  assert.equal(fresh.length, 1); assert.equal(fresh[0].registration_source, 'app');
  assert.equal('question_items' in fresh[0], false); assert.equal(fresh[0].question, '• First question (from the app)');
  assert.equal(state.rows.find(r => r.id === 'web').question, 'Website question\n• From app (from the app)');
  assert.equal(state.rows.find(r => r.id === 'app').question, '• App question (from the app)');
  assert.equal(state.calls.length, 0);
});
for (const endpoint of ['public-register-monday-zoom', 'register-zoom-meeting', 'auto-register-zoom']) {
  await test(`${endpoint} promotes transient app row without overwriting details or effects`, async () => {
    const { state, load, post } = harness();
    const row = { ...payload, id: 'app-seat', email: 'person@example.test', registration_source: 'app', question: 'Private question', phone: 'private', consent_email_list: false, auto_register: true };
    state.rows.push(row); const before = { ...row, registration_source: 'website' };
    const result = await post(load(`supabase/functions/${endpoint}/index.ts`).handler, payload);
    assert.equal(result.status, 200); assert.deepEqual(row, before);
    assert.equal(state.calls.length, 0); assert.equal(state.rows.length, 1);
    if (endpoint !== 'auto-register-zoom') { assert.equal(result.body.message, message); assert.equal(result.body.registration, null); }
  });
}
await test('batch app/website questions use atomic merge and preserve member text on replay', async () => {
  for (const registration_source of ['app', 'website']) {
    const { state, load, post } = harness();
    state.rows.push({ ...payload, id: 'seat', email: 'person@example.test', registration_source, question: 'Member question' });
    const body = { meeting_date: today, attendees: [{ email: 'person@example.test', name: 'Changed', rsvp: 'going', questions: ['A question', 'question'] }] };
    const handler = load('supabase/functions/app-family-squares-sync/index.ts').handler;
    for (let i = 0; i < 2; i++) assert.equal((await post(handler, body, { 'x-membership-sync-secret': 'test-sync' })).status, 200);
    assert.equal(state.rows[0].question, 'Member question\n• A question (from the app)\n• question (from the app)');
    assert.equal(state.calls.length, 0);
  }
});
await test('owner receives escaped multiline comment without follow-up, persisted identity only', async () => {
  const { state, load, post } = harness();
  state.rows.push({ ...payload, id: 'reg', question: '<script>private & "quoted"</script>\nSecond line', request_follow_up: false });
  const result = await post(load('supabase/functions/send-zoom-registration-email/index.ts').handler,
    { registration_id: 'reg', email: 'attacker@example.test', name: 'Spoofed', consentEmailList: true }, { Authorization: 'Bearer test-service' });
  assert.equal(result.status, 200);
  const owner = state.calls.find(c => c.body.personalizations?.[0].to[0].email === 'matt@soberhelpline.com');
  const html = owner.body.content[0].value;
  assert.ok(html.includes('&lt;script&gt;private &amp; &quot;quoted&quot;&lt;/script&gt;\nSecond line'));
  assert.ok(html.includes('white-space:pre-wrap'));
  assert.ok(html.includes('Prior registration history'));
  assert.ok(!html.includes('Spoofed')); assert.ok(!html.includes('attacker@example.test'));
  assert.equal(state.calls.length, 2); // persisted opt-in is false, not caller's true
  assert.ok(!JSON.stringify(state.calls[0]).includes('Second line')); // attendee never gets private note
  assert.ok(!JSON.stringify(state.logs).includes('Second line'));
});
await test('history counts all sources with qualified provenance, normalized identity and distinct prior occurrences', async () => {
  const { state, load, post } = harness(); state.pageCap = 2;
  state.rows.push({ ...payload, id: 'reg', meeting_date: today });
  const row = (id, meeting_date, registration_source, email = ' PERSON@example.test ') => ({ id, meeting_date, registration_source, email });
  state.rows.push(row('1', '2026-09-07', 'kiosk'), row('2', '2026-09-07', 'kiosk'),
    row('3', '2026-09-14', 'automatic'), row('4', '2026-09-21', 'app'),
    row('5', '2026-09-28', 'website'), row('6', '2026-10-05', 'kiosk'),
    row('7', today, 'kiosk'), row('8', '2026-10-19', 'kiosk'), row('9', '2026-08-31', 'kiosk', 'xperson@example.test'));
  state.manual.set('first', { email: 'person@example.test', meeting_date: '2026-09-07', channel: 'public' });
  state.manual.set('second', { email: 'person@example.test', meeting_date: '2026-10-05', channel: 'kiosk' });
  state.rows[1].auto_register = true; // manual opt-in is NOT automatically generated
  const result = await post(load('supabase/functions/send-zoom-registration-email/index.ts').handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' });
  assert.equal(result.status, 200);
  const html = state.calls[1].body.content[0].value;
  assert.ok(html.includes('5 prior distinct registered week(s)'));
  assert.ok(html.includes('1 of those weeks include an explicitly automatic-source row'));
  assert.ok(html.includes('not an exact manual-signup total or an attendance count'));
});
await test('history failure is unavailable not zero and does not lose owner notification', async () => {
  const { state, load, post } = harness(); state.historyError = true;
  state.rows.push({ ...payload, id: 'reg', question: 'A private note' });
  assert.equal((await post(load('supabase/functions/send-zoom-registration-email/index.ts').handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' })).status, 200);
  assert.ok(state.calls[1].body.content[0].value.includes('not a zero count'));
  assert.ok(state.calls[1].body.content[0].value.includes('A private note'));
});
await test('details read failure does not consume claim or send partial owner context', async () => {
  const { state, load, post } = harness(); state.detailsError = true; state.rows.push({ ...payload, id: 'reg' });
  const result = await post(load('supabase/functions/send-zoom-registration-email/index.ts').handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' });
  assert.equal(result.status, 500); assert.equal(state.calls.length, 0); assert.equal(state.rows[0].confirmation_claimed_at, undefined);
});
for (const failure of ['owner-http', 'attendee-http', 'owner-network', 'owner-suppressed']) {
  await test(`notification ${failure} retains claim, waits for both, no replay or false completion`, async () => {
    const { state, load, post } = harness(); state.rows.push({ ...payload, id: 'reg' });
    state.fetchImpl = async call => {
      const owner = call.body.personalizations?.[0].to[0].email === 'matt@soberhelpline.com';
      const fail = failure.startsWith('owner') ? owner : !owner;
      if (fail && failure.endsWith('network')) throw new Error('private provider failure');
      if (fail && failure.endsWith('suppressed')) return new Response(null, { status: 202, headers: { 'x-email-suppressed': 'true' } });
      return new Response('{}', { status: fail ? 403 : 202 });
    };
    const handler = load('supabase/functions/send-zoom-registration-email/index.ts').handler;
    const result = await post(handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' });
    assert.equal(result.status, 502); assert.equal(result.body.reconciliationRequired, true);
    assert.equal(result.body.delivery[failure.startsWith('owner') ? 'owner' : 'attendee'], 'failed_or_suppressed');
    assert.equal(state.calls.length, 2); assert.equal(state.claims.size, 2); assert.equal(state.rows[0].confirmation_completed_at, undefined);
    assert.equal((await post(handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' })).body.suppressed, true);
    assert.equal(state.calls.length, 2);
  });
}
for (const endpoint of ['public-register-monday-zoom', 'register-zoom-meeting']) {
  await test(`${endpoint} detects HTTP email errors without losing seat or replaying effects`, async () => {
    const { state, load, post } = harness();
    state.fetchImpl = async () => new Response('{"error":"private provider body"}', { status: 500 });
    const handler = load(`supabase/functions/${endpoint}/index.ts`).handler;
    const result = await post(handler, { ...payload, question: 'Preserve my question' });
    assert.equal(result.status, 200); assert.equal(result.body.success, true); assert.equal(result.body.emailSent, false);
    assert.equal(state.rows[0].question, 'Preserve my question');
    assert.equal((await post(handler, payload)).body.alreadyRegistered, true); assert.equal(state.calls.length, 1);
    assert.ok(!JSON.stringify(state.logs).includes('private provider body'));
  });
}
await test('automatic writer records automatic provenance and notification failure count', async () => {
  const { state, load, post } = harness();
  state.rows.push({ ...payload, id: 'old', meeting_date: '2026-10-05', auto_register: true });
  state.fetchImpl = async () => new Response('{}', { status: 503 });
  const result = await post(load('supabase/functions/auto-register-zoom/index.ts').handler, {});
  assert.equal(result.body.notificationFailures, 1); assert.equal(state.rows[1].registration_source, 'automatic');
});
for (const failure of ['settingsError', 'blocklistError', 'suppressionError']) {
  for (const mode of [true, 'throw']) await test(`${failure} ${mode} fails before claim and recovers once`, async () => {
    const { state, load, post } = harness(); state.rows.push({ ...payload, id: 'reg' });
    state[failure] = mode;
    const handler = load('supabase/functions/send-zoom-registration-email/index.ts').handler;
    const send = () => post(handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' });
    assert.equal((await send()).status, 500); assert.equal(state.calls.length, 0);
    assert.equal(state.rows[0].confirmation_claimed_at, undefined);
    state[failure] = false;
    assert.equal((await send()).status, 200); assert.equal(state.calls.length, 2);
    await send(); assert.equal(state.calls.length, 2);
  });
}
for (const endpoint of ['public-register-monday-zoom', 'register-zoom-meeting']) {
  await test(`${endpoint} records existing auto manual action once, never infers consent or resends`, async () => {
    const { state, load, post } = harness();
    state.rows.push({ ...payload, email: 'person@example.test', id: 'auto', registration_source: 'automatic', auto_register: true, question: 'original' });
    const handler = load(`supabase/functions/${endpoint}/index.ts`).handler;
    await Promise.all([post(handler, payload), post(handler, payload)]);
    assert.equal(state.manual.size, 1); assert.equal(state.rows.length, 1); assert.equal(state.calls.length, 0);
    assert.equal(state.rows[0].registration_source, 'automatic'); assert.equal(state.rows[0].question, 'original');
    assert.equal([...state.manual.values()][0].channel, endpoint.startsWith('public') ? 'public' : 'legacy');
  });
}
await test('kiosk records manual action and new website opt-in is manual, question-only is not', async () => {
  const { state, load, post } = harness();
  const handler = load('supabase/functions/public-register-monday-zoom/index.ts').handler;
  await post(handler, { ...payload, auto_register: true, attribution: { pagePath: '/family-squares-kiosk' } });
  assert.equal([...state.manual.values()][0].channel, 'kiosk'); assert.equal(state.rows[0].auto_register, true);
  state.authUser = { id: 'verified', email: 'person@example.test' };
  const before = state.manual.size;
  await post(handler, { ...payload, question_only: true, question: 'question' }, { Authorization: 'Bearer verified' });
  assert.equal(state.manual.size, before); assert.equal(state.calls.length, 1);
  const missing = await post(handler, { ...payload, meeting_date: '2026-10-19', question_only: true, question: 'question' }, { Authorization: 'Bearer verified' });
  assert.equal(missing.status, 500); assert.equal(state.rows.length, 1); assert.equal(state.manual.size, before);
});
await test('disabled sender and authenticated revision probe have zero provider or CRM effects', async () => {
  const { state, load, post } = harness(); state.disabled = true;
  state.rows.push({ ...payload, id: 'reg', consent_email_list: true });
  const { handler } = load('supabase/functions/send-zoom-registration-email/index.ts');
  const result = await post(handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' });
  assert.equal(result.status, 200); assert.equal(result.body.success, false);
  assert.equal(result.body.notificationDisabled, true);
  assert.equal(state.calls.length, 0); assert.equal(state.claims.size, 0);
  const probe = await post(handler, { rollout_probe: true }, { Authorization: 'Bearer test-service' });
  assert.equal(probe.body.rollout.revision, 'monday-ledger-disabled-v1');
  assert.equal(probe.body.rollout.acknowledgment, 'probe-ack');
  state.disabled = false;
  assert.equal((await post(handler, { rollout_probe: true }, { Authorization: 'Bearer test-service' })).status, 200);
  assert.equal(state.calls.length, 0); assert.equal(state.claims.size, 0);
  assert.equal((await post(handler, { rollout_probe: true }, { Authorization: 'Bearer public' })).status, 401);
});
await test('rollout state errors and wrong revision fail closed before any effect', async () => {
  for (const flag of ['rolloutError', 'wrongRevision']) {
    const { state, load, post } = harness(); state[flag] = true;
    state.rows.push({ ...payload, id: 'reg', consent_email_list: true });
    const { handler } = load('supabase/functions/send-zoom-registration-email/index.ts');
    assert.equal((await post(handler, { registration_id: 'reg' }, { Authorization: 'Bearer test-service' })).status, 500);
    assert.equal(state.calls.length, 0); assert.equal(state.claims.size, 0);
  }
});
await test('duplicate-bearing sender claims occurrence not row, preserves conflicting fields and all current comments', async () => {
  const { state, load, post } = harness();
  state.rows.push({ ...payload, id: 'first', email: ' person@example.test ', question: '<b>first</b>\nraw', consent_email_list: false },
    { ...payload, id: 'second', email: 'PERSON@example.test', question: 'second raw', consent_email_list: true, user_id: 'other' });
  const before = JSON.stringify(state.rows);
  const handler = load('supabase/functions/send-zoom-registration-email/index.ts').handler;
  await Promise.all(state.rows.map(r => post(handler, { registration_id: r.id }, { Authorization: 'Bearer test-service' })));
  const mails = state.calls.filter(c => c.url.includes('sendgrid'));
  assert.equal(mails.length, 2); assert.equal(JSON.stringify(state.rows), before);
  const owner = mails.find(c => c.body.personalizations[0].to[0].email === 'matt@soberhelpline.com');
  assert.ok(owner.body.content[0].value.includes('&lt;b&gt;first&lt;/b&gt;\nraw'));
  assert.ok(owner.body.content[0].value.includes('second raw'));
  const attendee = mails.find(c => c !== owner);
  assert.ok(!attendee.body.content[0].value.includes('second raw'));
  assert.equal(state.calls.filter(c => c.url.includes('mailchimp')).length, 0); // no consent union
});
await test('legacy unknown holds send neither message nor marketing and do not claim acceptance', async () => {
  const { state, load, post } = harness(); state.rows.push({ ...payload, id: 'held', consent_email_list: true });
  for (const kind of ['attendee','owner']) state.claims.add(`person@example.test|${today}|${kind}`);
  const result = await post(load('supabase/functions/send-zoom-registration-email/index.ts').handler, { registration_id:'held' }, { Authorization:'Bearer test-service' });
  assert.equal(state.calls.length, 0); assert.equal(result.body.reconciliationRequired, true);
  assert.equal(result.body.delivery.owner, 'held_or_previously_attempted');
});
for (const kind of ['owner','attendee']) await test(`independent ${kind} claim failure can retry without replaying other recipient`, async () => {
  const { state, load, post } = harness(); state.rows.push({ ...payload, id:'reg' }); state.claimFailure=kind;
  const handler=load('supabase/functions/send-zoom-registration-email/index.ts').handler;
  const send=()=>post(handler,{registration_id:'reg'},{Authorization:'Bearer test-service'});
  assert.equal((await send()).status,502); assert.equal(state.calls.length,1);
  state.claimFailure=null; assert.equal((await send()).status,200); assert.equal(state.calls.length,2);
  await send(); assert.equal(state.calls.length,2);
});
await test('provider accepted but failed database ack never auto-replays', async () => {
  const { state, load, post } = harness(); state.rows.push({ ...payload, id:'reg' }); state.finishFailure=true;
  const handler=load('supabase/functions/send-zoom-registration-email/index.ts').handler;
  const send=()=>post(handler,{registration_id:'reg'},{Authorization:'Bearer test-service'});
  assert.equal((await send()).status,502); assert.equal(state.calls.length,2);
  state.finishFailure=false; await send(); assert.equal(state.calls.length,2);
});
console.log(`PASS: ${tests} actual-handler tests (synthetic database/provider IO; no live sends or database writes).`);
