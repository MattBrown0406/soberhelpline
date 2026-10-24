import assert from 'node:assert/strict';
import { closeAbandonedBooking } from '../src/lib/closeAbandonedBooking.ts';

const calls = [];
await closeAbandonedBooking('followed-up', async (id, changes) => {
  calls.push({ id, changes });
  return { id, ...changes };
});
assert.deepEqual(calls, [{ id: 'followed-up', changes: { completed: true } }]);
await assert.rejects(closeAbandonedBooking('followed-up', async () => null), /not confirmed/);
await assert.rejects(closeAbandonedBooking('followed-up', async () => ({ id: 'other', completed: true })), /not confirmed/);
await assert.rejects(closeAbandonedBooking('followed-up', async () => ({ id: 'followed-up', completed: false })), /not confirmed/);
await assert.rejects(closeAbandonedBooking('followed-up', async () => { throw new Error('Denied'); }), /Denied/);
console.log('Passed: only the selected lead is closed; missing, mismatched, incomplete, and denied updates fail closed.');