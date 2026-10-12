import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const files = ['src/pages/MondayZoomRegistration.tsx', 'src/pages/FamilySquaresKiosk.tsx', 'public/monday-zoom-registration/index.html', 'public/zoom.html', 'supabase/functions/register-zoom-meeting/index.ts', 'supabase/functions/auto-register-zoom/index.ts'];
const cases = [
 ['2026-10-13T02:59:59Z','2026-10-12'], ['2026-10-13T03:00:00Z','2026-10-19'], ['2026-10-13T03:30:00Z','2026-10-19'],
 ['2026-11-03T03:59:59Z','2026-11-02'], ['2026-11-03T04:00:00Z','2026-11-09'], ['2026-11-03T04:30:00Z','2026-11-09'],
 ['2026-03-10T02:59:59Z','2026-03-09'], ['2026-03-10T03:30:00Z','2026-03-16'],
 ['2026-03-08T09:30:00Z','2026-03-09'], ['2026-11-01T09:30:00Z','2026-11-02'],
 ['2026-10-12T07:00:00Z','2026-10-12'], ['2026-10-14T12:00:00Z','2026-10-19'],
];
let count = 0;
for (const timezone of ['UTC','Asia/Tokyo','America/New_York','America/Los_Angeles']) {
 process.env.TZ = timezone;
 for (const file of files) {
  const source = fs.readFileSync(file,'utf8');
  const helper = source.match(/function getNextMeetingDate\(now = new Date\(\)\) \{[\s\S]*?\n\s*\}(?=\s*\n)/)?.[0];
  assert.ok(helper, file);
  const fn = vm.runInNewContext(helper + ';getNextMeetingDate', { Date, Intl });
  for (const [now, expected] of cases) { assert.equal(fn(new Date(now)),expected,`${file} ${timezone} ${now}`); count++; }
 }
}
console.log(`PASS ${count} executed source-helper cases: cutoff, DST, midnight and host-timezone parity`);
