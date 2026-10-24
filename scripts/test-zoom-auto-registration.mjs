import assert from 'node:assert/strict';
import { autoRegistrationIds, autoRegistrationSubscribers, disableAutoRegistration } from '../src/lib/zoomAutoRegistration.ts';

const records = [
  { id: 'old', email: ' Person@example.com ', name: 'Person', auto_register: true, created_at: '2026-10-01' },
  { id: 'new', email: 'PERSON@example.com', name: 'Person New', auto_register: true, created_at: '2026-10-24' },
  { id: 'manual', email: 'person@example.com', name: 'Person', auto_register: false, created_at: '2026-10-24' },
  { id: 'other', email: 'other@example.com', name: 'Other', auto_register: true, created_at: '2026-10-24' },
];
assert.deepEqual(autoRegistrationSubscribers(records).map(r => r.id), ['other', 'new']);
assert.deepEqual(autoRegistrationIds(records, 'person@example.com'), ['old', 'new']);
const calls = [];
await disableAutoRegistration(autoRegistrationIds(records, 'person@example.com'), async (ids, changes) => {
  calls.push({ ids, changes });
  return ids;
});
assert.deepEqual(calls, [{ ids: ['old', 'new'], changes: { auto_register: false } }]);
await assert.rejects(disableAutoRegistration(['old', 'new'], async () => ['new']), /Not all records/);
await assert.rejects(disableAutoRegistration([], async () => []), /No active/);
await assert.rejects(disableAutoRegistration(['old'], async () => { throw new Error('Denied'); }), /Denied/);
console.log('Passed: distinct subscribers, all historical opt-ins, only auto_register changes, incomplete/denied updates fail closed.');