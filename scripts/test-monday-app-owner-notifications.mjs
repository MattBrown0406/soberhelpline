import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { webcrypto } from 'node:crypto';

const event_id = '11111111-1111-4111-8111-111111111111';
const target = { registration_id: event_id, email: 'person@example.test', name: 'Test Person', question: '<private>\nQuestion', meeting_date: '2026-10-26', registration_source: 'app', event_kind: 'new_app_registration', rsvp: 'going', is_new_registration: true };
const code = ts.transpileModule(fs.readFileSync('supabase/functions/app-family-squares-owner-notification/index.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function harness() {
  let handler;
  const state = { target: { ...target }, calls: [], rpcCalls: [], claims: new Set(), outcomes: [], enabled: true, ledgerEnabled: true };
  const rpc = async (name, args) => {
    state.rpcCalls.push({ name, args });
    if (state.rpcError === name) return { data: null, error: {} };
    if (name === 'monday_app_owner_notification_status') return { data: { enabled: state.enabled, revision: state.wrongRevision ? 'wrong' : args._revision }, error: null };
    if (name === 'monday_notification_status') return { data: { enabled: state.ledgerEnabled, revision: args._revision }, error: null };
    if (name === 'monday_app_rsvp_notification_target') return { data: state.target, error: null };
    if (name === 'is_meeting_blocked') return { data: Boolean(state.blocked), error: null };
    if (name === 'claim_monday_notification') {
      const key = `${args._email.trim().toLowerCase()}|${args._meeting_date}|${args._kind}`;
      if (state.held || state.claims.has(key)) return { data: null, error: null };
      state.claims.add(key); return { data: key, error: null };
    }
    if (name === 'finish_monday_notification') { state.outcomes.push(args); return { data: true, error: null }; }
    throw new Error(`Unexpected RPC: ${name}`);
  };
  vm.runInNewContext(code, {
    exports: {}, Request, Response, TextEncoder, Uint8Array, crypto: webcrypto, console: { error() {} },
    Deno: { serve: h => { handler = h; }, env: { get: key => ({ MEMBERSHIP_SYNC_SECRET: 'synthetic-sync', SUPABASE_URL: 'https://synthetic.invalid', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service', SENDGRID_API_KEY: 'synthetic-email' })[key] } },
    require: id => {
      if (id.endsWith('/suppression.ts')) return { getSuppressedRecipients: async () => { if (state.suppressionError) throw new Error('suppression'); return new Set(state.suppressed ? ['matt@soberhelpline.com'] : []); } };
      if (id.endsWith('/cors')) return { corsHeaders: {} };
      if (id.includes('@supabase/supabase-js')) return { createClient: () => ({ rpc }) };
      if (id.endsWith('/mondayRegistration.ts')) return { validMeetingDate: date => date === '2026-10-26' };
      throw new Error(id);
    },
    fetch: async (url, options) => {
      assert.equal(url, 'https://api.sendgrid.com/v3/mail/send');
      state.calls.push(JSON.parse(options.body));
      if (state.transportError) throw new Error('timeout');
      return new Response(null, { status: state.providerFailure ? 500 : 202, headers: state.dispatchSuppressed ? { 'x-email-suppressed': 'true' } : {} });
    },
  });
  const post = async (body = { event_id }, authorized = true) => {
    const res = await handler(new Request('https://synthetic.invalid', { method: 'POST', headers: authorized ? { 'x-membership-sync-secret': 'synthetic-sync' } : {}, body: JSON.stringify(body) }));
    return { status: res.status, body: await res.json() };
  };
  return { state, post };
}
async function test(name, run) { await run(); console.log(`PASS ${name}`); }
await test('new app registration sends only to Matt and retains opt-out', async () => {
  const { state, post } = harness(); assert.equal((await post()).body.owner, 'accepted');
  assert.equal(state.calls.length, 1);
  assert.deepEqual(state.calls[0].personalizations, [{ to: [{ email: 'matt@soberhelpline.com' }] }]);
  assert.equal(state.calls[0].tracking_settings.subscription_tracking.enable, true);
  assert.ok(state.calls[0].content[0].value.includes('&lt;private&gt;\nQuestion'));
  assert.equal(state.rpcCalls.filter(c => c.name === 'claim_monday_notification')[0].args._kind, 'owner');
});
await test('repeated event and held occurrence cannot send again', async () => {
  const { state, post } = harness(); await post(); assert.equal((await post()).body.status, 'held_or_previously_attempted'); assert.equal(state.calls.length, 1);
  const held = harness(); held.state.held = true; await held.post(); assert.equal(held.state.calls.length, 0);
});
for (const [name, change] of [
  ['snapshot', { event_kind: 'snapshot' }], ['question only', { rsvp: null }], ['declined', { rsvp: 'declined' }],
  ['existing app registration', { is_new_registration: false }], ['website registration', { registration_source: 'website' }],
  ['question update', { event_kind: 'question_updated' }],
]) await test(`${name} is ineligible`, async () => {
  const { state, post } = harness(); Object.assign(state.target, change); assert.equal((await post()).body.status, 'not_eligible'); assert.equal(state.calls.length, 0); assert.equal(state.claims.size, 0);
});
await test('absent or failed receipt, including unsuccessful/conflicting insertion, sends nothing', async () => {
  for (const fail of [false, true]) { const { state, post } = harness(); state.target = null; if (fail) state.rpcError = 'monday_app_rsvp_notification_target'; await post(); assert.equal(state.calls.length, 0); assert.equal(state.claims.size, 0); }
});
for (const flag of ['suppressed', 'blocked', 'suppressionError', 'wrongRevision']) await test(`${flag} fails closed`, async () => {
  const { state, post } = harness(); state[flag] = true; await post(); assert.equal(state.calls.length, 0); assert.equal(state.claims.size, 0);
});
await test('both independent controls must be enabled; missing controls fail closed', async () => {
  for (const flag of ['enabled', 'ledgerEnabled']) { const { state, post } = harness(); state[flag] = false; assert.equal((await post()).body.notificationDisabled, true); assert.equal(state.calls.length, 0); assert.equal(state.rpcCalls.some(c => c.name === 'monday_app_rsvp_notification_target'), false); }
  for (const rpc of ['monday_app_owner_notification_status', 'monday_notification_status', 'claim_monday_notification']) { const { state, post } = harness(); state.rpcError = rpc; assert.equal((await post()).status, 503); assert.equal(state.calls.length, 0); }
});
await test('unauthenticated and caller supplied provenance rejected', async () => {
  const { state, post } = harness(); assert.equal((await post({ event_id }, false)).status, 401); assert.equal((await post({ event_id, registration_source: 'app' })).status, 400); assert.equal(state.rpcCalls.length, 0);
});
for (const flag of ['transportError', 'providerFailure', 'dispatchSuppressed']) await test(`${flag} retains claim and records nonacceptance`, async () => {
  const { state, post } = harness(); state[flag] = true; assert.equal((await post()).status, 502); assert.equal(state.outcomes[0]._accepted, false); await post(); assert.equal(state.calls.length, 1); assert.equal(state.claims.size, 1);
});
await test('failed acknowledgment retains claim without replay', async () => {
  const { state, post } = harness(); state.rpcError = 'finish_monday_notification'; assert.equal((await post()).status, 503); await post(); assert.equal(state.calls.length, 1); assert.equal(state.claims.size, 1);
});