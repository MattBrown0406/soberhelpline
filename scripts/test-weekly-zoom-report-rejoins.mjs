import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';

// Exercise the real report handler with synthetic rows only: no network or live DB.
const matcherSource = await fs.readFile('supabase/functions/_shared/attendeeNameMatch.ts', 'utf8');
const matcher = await transformWithEsbuild(matcherSource, 'attendeeNameMatch.ts', { loader: 'ts', format: 'cjs' });
const matcherModule = { exports: {} };
vm.runInNewContext(matcher.code, { module: matcherModule, exports: matcherModule.exports });
const reportSource = await fs.readFile('supabase/functions/send-weekly-zoom-report/index.ts', 'utf8');
const report = await transformWithEsbuild(reportSource.replace(/^import .*;\n/gm, ''), 'report.ts', { loader: 'ts' });
const registration = (id, name) => ({ id, name, email: `${id}@example.invalid`, language: 'en', created_at: '', auto_register: false });
const session = (name, minutes, registration_id = null) => ({ participant_name: name, participant_email: null, duration_minutes: minutes, registration_id });

async function summarize(registrations, attendance) {
  let handler;
  let calls = 0;
  const results = [registrations, attendance, [], []];
  const createClient = () => ({ from() {
    const data = results[calls++];
    const query = { select: () => query, eq: () => query, gte: () => query,
      then: (resolve) => Promise.resolve({ data, error: null }).then(resolve) };
    return query;
  } });
  vm.runInNewContext(report.code, {
    ...matcherModule.exports, createClient, URL, Response, console,
    Deno: { serve: (fn) => { handler = fn; }, env: { get: () => undefined } },
    fetch: () => { throw new Error('Network and email sending are forbidden in this test'); },
  });
  assert.equal(typeof handler, 'function');
  const response = await handler({ method: 'GET', url: 'https://example.invalid/?preview=1&meeting_date=2026-11-02' });
  assert.equal(response.status, 200);
  return response.json();
}

const sara = registration('synthetic-sara', 'Sara Vaday');
const rejoined = await summarize([sara], [session('Sara', 12), session('Sara', 23)]);
assert.equal(rejoined.total_attendees, 1, 'Rejoining must not add a second attendee');
assert.equal(rejoined.registered_and_attended.length, 1);
assert.equal(rejoined.registered_and_attended[0].note, '(35 min)', 'Both sessions must contribute minutes');
assert.equal(rejoined.attended_without_registering.length, 0, 'A matched rejoin must not become a walk-in');

const exactThenLoose = await summarize([sara], [session('Sara Vaday', 10, sara.id), session('Sara', 20)]);
assert.equal(exactThenLoose.total_attendees, 1);
assert.equal(exactThenLoose.registered_and_attended[0].note, '(30 min)');
assert.equal(exactThenLoose.attended_without_registering.length, 0);

const ambiguous = await summarize([sara, registration('synthetic-other', 'Sara Jones')], [
  session('Sara Vaday', 10, sara.id), session('Sara', 20),
]);
assert.equal(ambiguous.registered_and_attended.length, 1, 'Already-attended registrants must still participate in ambiguity checks');
assert.equal(ambiguous.registered_and_attended[0].note, '(10 min)');
assert.equal(ambiguous.attended_without_registering.length, 1, 'Ambiguous first names must not be assigned to another registrant');
console.log('PASS weekly report: loose rejoins, exact-plus-loose rejoins, and ambiguous names; no network or emails');