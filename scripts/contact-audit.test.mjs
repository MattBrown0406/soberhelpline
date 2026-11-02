import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ESLint } from 'eslint';
const read = path => process.env.CONTACT_BASELINE_REF ? execFileSync('git', ['show', `${process.env.CONTACT_BASELINE_REF}:${path}`], { encoding: 'utf8' }) : readFileSync(path, 'utf8');
test('WhatsApp destination encodes the existing displayed international number', () => {
  const contact = read('src/pages/Contact.tsx');
  const displayed = contact.match(/label="WhatsApp ([+\d -]+)"/)[1].replace(/\D/g, '');
  assert.equal(read('src/components/WhatsAppLink.tsx').match(/WHATSAPP_NUMBER = "(\d+)"/)[1], displayed);
  assert.ok(contact.includes('href={getWhatsAppUrl()}'));
  assert.ok(!contact.includes('wa.me/5038362136'));
  assert.match(read('src/components/AfterHoursSafetyStrip.tsx'), /href=\{getWhatsAppUrl\(\)\}/);
  assert.ok(!read('scripts/seo-routes.mjs').includes('wa.me/5038362136'));
});
test('WhatsApp actions and support button have 44px minimum targets', () => {
  const source = read('src/components/WhatsAppLink.tsx');
  assert.match(source, /h-11 w-11/);
  assert.match(source, /min-h-\[44px\] min-w-\[44px\]/);
  assert.match(read('src/pages/Contact.tsx'), /<Button asChild variant="outline" size="lg">/);
});
test('digest counter lint error is resolved without suppressing rules', async () => {
  const path = 'supabase/functions/send-weekly-blog-digest/index.ts';
  const source = read(path);
  const results = await new ESLint().lintText(source, {filePath:path});
  assert.equal(results[0].errorCount, 0, JSON.stringify(results[0].messages));
  const statement = source.match(/(?:ok \? sent\+\+ : failed\+\+;|if \(ok\) \{\s*sent\+\+;\s*\} else \{\s*failed\+\+;\s*\})/)[0];
  for (const ok of [true, false]) assert.deepEqual(new Function('ok', `let sent=2,failed=3;${statement};return [sent,failed]`)(ok), ok ? [3,3] : [2,4]);
});
