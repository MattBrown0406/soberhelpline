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
  const state = { rows: [], calls: [], cancelled: false, blocked: false, failInsert: null, authUser: null, rpcError: null, claims: new Set() };
  const client = {
    auth: { getUser: async () => ({ data: { user: state.authUser }, error: null }) },
    rpc: async (name, args) => {
      if (state.rpcError) return { data: null, error: state.rpcError };
      if (name === 'is_meeting_blocked') return { data: state.blocked, error: null };
      if (name === 'append_monday_registration_question') {
        const row = state.rows.find(r => r.email.trim().toLowerCase() === args._email && r.meeting_date === args._meeting_date);
        if (row && !(row.question ?? '').split('\n').includes(args._question)) row.question = [row.question, args._question].filter(Boolean).join('\n');
        return { data: Boolean(row), error: null };
      }
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
      return { data: null, error: null };
    },
    from: (table) => {
      let op = 'select', payload, single = false;
      const filters = [];
      const q = {
        select() { return q; }, insert(value) { op = 'insert'; payload = value; return q; },
        update(value) { op = 'update'; payload = value; return q; },
        eq(k, v) { filters.push(r => r[k] === v); return q; },
        neq(k, v) { filters.push(r => r[k] !== v); return q; },
        is(k, v) { filters.push(r => (r[k] ?? null) === v); return q; },
        ilike(k, v) { filters.push(r => r[k]?.toLowerCase() === v.toLowerCase()); return q; },
        in(k, v) { filters.push(r => v.includes(r[k])); return q; },
        order() { return q; }, limit() { return q; }, range() { return q; },
        single() { single = true; return q; }, maybeSingle() { single = true; return q; },
        then(resolve, reject) {
          return Promise.resolve().then(() => {
            if (table === 'cancelled_meeting_dates') return { data: state.cancelled ? { meeting_date: today, reason: 'Cancelled' } : null, error: null };
            if (table === 'meeting_blocklist' || table === 'site_settings') return { data: single ? null : [], error: null };
            assert.equal(table, 'zoom_meeting_registrations');
            if (op === 'insert') {
              if (state.failInsert) return { data: null, error: state.failInsert };
              if (state.rows.some(r => r.email.trim().toLowerCase() === payload.email.trim().toLowerCase() && r.meeting_date === payload.meeting_date)) return { data: null, error: duplicate };
              const row = { ...payload, id: String(state.rows.length + 1) }; state.rows.push(row);
              return { data: single ? row : [row], error: null };
            }
            const rows = state.rows.filter(r => filters.every(f => f(r)));
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
      console: { log() {}, warn() {}, error() {} },
      Deno: { env: { get: key => env[key] }, serve: h => { handler = h; } },
      fetch: async (url, options) => { state.calls.push({ url, body: JSON.parse(options.body) }); return new Response('{}', { status: 200 }); },
      require: id => {
        if (id.includes('/http/server.ts')) return { serve: h => { handler = h; } };
        if (id.includes('@supabase/supabase-js')) return { createClient: () => client };
        if (id.includes('/zod@')) return require('zod');
        if (id.endsWith('/spine.ts')) return { enqueueSpineEvent: async () => {}, extractUtm: () => ({}) };
        if (id.endsWith('/automationAuth.ts')) return { requireAutomationAuth: async () => null };
        if (id.endsWith('/suppression.ts')) return {};
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
  const { state, load, post } = harness(); state.rows.push({ ...payload, id: 'reg' });
  const { handler } = load('supabase/functions/send-zoom-registration-email/index.ts');
  const body = { name: payload.name, email: payload.email, registration_id: 'reg', consentEmailList: true };
  assert.equal((await post(handler, body)).status, 401);
  const results = await Promise.all([post(handler, body, { Authorization: 'Bearer test-service' }), post(handler, body, { Authorization: 'Bearer test-service' })]);
  assert.equal(results.filter(r => r.body.suppressed).length, 1);
  assert.equal(state.calls.filter(c => c.url.includes('sendgrid')).length, 2); // one attendee + one admin, NOT two confirmations
  assert.equal(state.calls.filter(c => c.url.includes('add-to-mailchimp')).length, 1);
  assert.ok(state.rows[0].confirmation_completed_at);
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
  const snapshot = await post(handler, { meeting_date: today, attendees: [] }, headers);
  assert.equal(snapshot.status, 200); assert.equal(snapshot.body.removed, 0); assert.equal(state.rows.length, 2);
  state.cancelled = true; assert.equal((await post(handler, body, headers)).status, 409); state.cancelled = false;
  state.rpcError = { message: 'failed' }; assert.equal((await post(handler, body, headers)).status, 500);
  assert.equal(state.calls.length, 0); assert.equal(state.rows.length, 2);
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
console.log(`PASS: ${tests} actual-handler tests (synthetic database/provider IO; SQL concurrency tested separately).`);
