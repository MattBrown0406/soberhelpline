import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync('supabase/functions/_shared/suppression.ts', 'utf8');
function harness() {
  const state = { calls: [], rows: [], cap: 1, reads: 0, error: null };
  const context = vm.createContext({
    exports: {}, Response, Request, URL, console: { log() {}, error() {} },
    Deno: { env: { get: () => 'synthetic' } },
    fetch: async (url, options) => { state.calls.push({ url, body: JSON.parse(options.body) }); return new Response(null, { status: 202 }); },
    require: () => ({ createClient: () => ({ from: () => {
      let after = '', pattern = '';
      const q = {
        select() { return q; }, order() { return q; }, limit() { return q; },
        ilike(k, p) { pattern = p.slice(1, -1).replace(/\\([\\%_])/g, '$1').toLowerCase(); return q; },
        gt(k, v) { after = v; return q; },
        then(resolve, reject) { return Promise.resolve().then(() => {
          state.reads++;
          if (state.error === 'throw') throw new Error('private backend error');
          if (state.error === 'returned' || (state.error === 'later' && state.reads > 1)) return { data: null, error: { message: 'private backend error' } };
          return { data: state.rows.filter(r => r.id > after && r.email.toLowerCase().includes(pattern)).slice(0, state.cap), error: null };
        }).then(resolve, reject); },
      }; return q;
    } }) }),
  });
  vm.runInContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  const send = (email = 'matt@soberhelpline.com', extra = {}) => context.fetch('https://api.sendgrid.com/v3/mail/send', { body: JSON.stringify({ personalizations: [{ to: [{ email }], ...extra }] }) });
  return { state, context, send };
}
let tests = 0;
async function test(name, fn) { await fn(); console.log(`ok ${++tests} - ${name}`); }
await test('suppressed owner on capped second page never reaches provider', async () => {
  const { state, send } = harness();
  state.rows = [{ id: '1', email: 'xmatt@soberhelpline.com' }, { id: '2', email: ' MATT@soberhelpline.com ' }];
  const result = await send(); assert.equal(result.headers.get('x-email-suppressed'), 'true');
  assert.equal(state.calls.length, 0); assert.equal(state.reads, 2);
});
for (const error of ['returned', 'throw', 'later']) await test(`${error} lookup failure fails closed`, async () => {
  const { state, send } = harness(); state.error = error;
  state.rows = [{ id: '1', email: 'xmatt@soberhelpline.com' }];
  const result = await send(); assert.equal(result.status, 503); assert.equal(state.calls.length, 0);
  state.error = null; assert.equal((await send()).status, 202); assert.equal(state.calls.length, 1);
});
await test('no stale cache after new opt-out; cc/bcc filtering; unrelated fetch unaffected', async () => {
  const { state, send, context } = harness();
  assert.equal((await send()).status, 202); assert.equal(state.calls.length, 1);
  state.rows = [{ id: '1', email: 'matt@soberhelpline.com' }];
  await send(); assert.equal(state.calls.length, 1);
  await send('allowed@example.test', { cc: [{ email: 'MATT@soberhelpline.com' }], bcc: [{ email: 'matt@soberhelpline.com' }] });
  assert.equal(state.calls.length, 2); assert.equal(state.calls[1].body.personalizations[0].cc.length, 0);
  assert.equal(state.calls[1].body.personalizations[0].bcc.length, 0);
  assert.equal(state.calls[1].body.tracking_settings.subscription_tracking.enable, true);
  state.error = 'throw';
  await context.fetch('https://other.invalid', { body: '{}' }); assert.equal(state.calls.length, 3);
});
await test('wildcard identity literal, malformed payload blocked, URL and Request inputs checked', async () => {
  const { state, send, context } = harness(); state.rows = [{ id: '1', email: ' a_b%tag@example.test ' }];
  assert.equal((await send('A_B%tag@example.test')).headers.get('x-email-suppressed'), 'true');
  const url = 'https://api.sendgrid.com/v3/mail/send';
  assert.equal((await context.fetch(url, { body: 'not json' })).status, 503);
  state.error = 'throw';
  assert.equal((await context.fetch(new URL(url), { body: JSON.stringify({ personalizations: [{ to: [{ email: 'any@example.test' }] }] }) })).status, 503);
  assert.equal((await context.fetch(new Request(url, { method: 'POST', body: JSON.stringify({ personalizations: [{ to: [{ email: 'any@example.test' }] }] }) }))).status, 503);
  assert.equal(state.calls.length, 0);
});
console.log(`PASS ${tests} real suppression-wrapper tests; no live sends.`);
