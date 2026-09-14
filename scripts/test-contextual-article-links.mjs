import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

// Approved navigation-only repair; page-level GSC evidence (Aug 16–Sep 12,
// 2026): first Al-Anon 52 impressions / 10.21 position; intervention 73 / 19.40.
// These are not query-level rankings or evidence for medical/metadata rewrites.
const baseline = '936b7ed249910a59967e4b673b2917b35cecd64b';
const source = (file) => process.env.SOURCE_REF
  ? execFileSync('git', ['show', `${process.env.SOURCE_REF}:${file}`], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  : fs.readFileSync(file, 'utf8');
const old = (file) => execFileSync('git', ['show', `${baseline}:${file}`], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
const blogFile = 'src/data/blogPosts.ts';
const blog = source(blogFile);
const broken = '[how alcohol affects the brain](/blog/dopamine-and-addiction-brain-science-for-families)';
const repaired = '[LINK:how alcohol affects the brain:/blog/dopamine-and-addiction-brain-science-families]';
assert.equal(blog, old(blogFile).replace(broken, repaired), 'Only the approved token changes; all article prose, titles, metadata, dates and authors stay identical');
assert.ok(blog.includes(repaired));
assert.ok(!blog.includes(broken));
const links = [
  ['src/pages/FamilySupport.tsx', 'first-al-anon-meeting-what-to-expect', 'What to expect at your first Al-Anon meeting', 'Family Support Groups'],
  ['src/pages/InterventionHelp.tsx', 'what-to-expect-during-an-intervention', 'what to expect during an intervention', 'The goal is not pressure. The goal is preparation.'],
];
for (const [file, slug, label, context] of links) {
  const route = `/blog/${slug}`;
  assert.equal(old(file).split(route).length - 1, 0, 'New incoming link absent at baseline');
  assert.equal(source(file).split(route).length - 1, 1, 'Exactly one contextual incoming link');
  assert.ok(source(file).includes(label));
  assert.ok(source(file).indexOf(route) > source(file).indexOf(context));
  assert.equal(blog.split(`slug: "${slug}"`).length - 1, 1, 'Unique existing destination');
}
assert.equal(blog.split('slug: "dopamine-and-addiction-brain-science-families"').length - 1, 1);
console.log('PASS: token repair, 2 genuinely new contextual links, 3 unique destinations, article corpus/metadata/author preservation');
