import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const source = fs.readFileSync(new URL('../src/lib/bookingTime.ts',import.meta.url),'utf8');
const js = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {bookingInstant,bookingDateTime} = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const cases = [
 ['2026-11-10','16:00','2026-11-11T00:00:00.000Z'],
 ['2026-03-07','09:00','2026-03-07T17:00:00.000Z'],
 ['2026-03-08','09:00','2026-03-08T16:00:00.000Z'],
 ['2026-10-31','09:00','2026-10-31T16:00:00.000Z'],
 ['2026-11-01','09:00','2026-11-01T17:00:00.000Z'],
 ['2026-03-29','09:00','2026-03-29T16:00:00.000Z'],
 ['2026-10-25','09:00','2026-10-25T16:00:00.000Z'],
];
let assertions=0;
for (const [date,time,utc] of cases) {
 assert.equal(bookingInstant(date,time).toISOString(),utc); assertions++;
 for (const zone of ['UTC','America/Los_Angeles','America/New_York','Europe/London']) {
   const expected = new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(utc));
   assert.equal(bookingDateTime(date,time,zone),expected); assertions++;
 }
}
assert.match(bookingDateTime('2026-11-10','16:00','UTC'),/Nov 11, 2026, 12:00 AM UTC/); assertions++;
assert.equal(bookingInstant('2026-03-08','09:00','America/New_York').toISOString(),'2026-03-08T13:00:00.000Z'); assertions++;
assert.equal(bookingInstant('2026-03-29','09:00','Europe/London').toISOString(),'2026-03-29T08:00:00.000Z'); assertions++;
assert.throws(()=>bookingInstant('2026-03-08','02:30')); assertions++;
console.log(JSON.stringify({passed:assertions,cases:cases.length,browserZone:process.env.TZ||'system'}));
