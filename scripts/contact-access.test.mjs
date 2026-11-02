import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import test from 'node:test';
const read = path => process.env.CONTACT_BASELINE_REF
  ? execFileSync('git', ['show', `${process.env.CONTACT_BASELINE_REF}:${path}`], { encoding: 'utf8' })
  : readFileSync(path, 'utf8');
test('floating contact never collects details or claims delivery', () => {
  const source = read('src/components/StickyContactForm.tsx');
  assert.match(source, /to="\/contact"/);
  assert.doesNotMatch(source, /<form|<Input|<Textarea|setTimeout|toast\(|Message sent|fetch\(|\.invoke\(/);
  assert.match(source, /aria-label="Contact Sober Helpline"/);
  assert.match(source, /focus-visible:ring/);
});
test('shared phone remains labeled with 44px minimum target', () => {
  const source = read('src/components/Layout.tsx');
  assert.match(source, /aria-label="Call Sober Helpline"/);
  assert.match(source, /min-h-11 min-w-11/);
  assert.match(source, /trackPhoneClick\("layout_header"\)/);
});
