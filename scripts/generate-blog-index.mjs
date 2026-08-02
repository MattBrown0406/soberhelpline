import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const blogPath = path.join(root, 'src', 'data', 'blogPosts.ts');
const outPath = path.join(root, 'public', 'blog-index.json');

const source = fs.readFileSync(blogPath, 'utf8');

// Split on each post's slug marker; fields appear in a stable order per entry.
const chunks = source.split(/\n\s{4}slug:\s*"/).slice(1);

const field = (chunk, name) => {
  const match = chunk.match(new RegExp(`\\n\\s+${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return match ? match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : '';
};

const posts = chunks.map((chunk) => {
  const slug = chunk.slice(0, chunk.indexOf('"'));
  return {
    slug,
    title: field(chunk, 'title'),
    category: field(chunk, 'category'),
    author: field(chunk, 'author'),
    date: field(chunk, 'date'),
    excerpt: field(chunk, 'excerpt'),
  };
}).filter((p) => p.slug && p.title && p.date);

posts.sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), posts }, null, 2));
console.log(`Generated blog index with ${posts.length} posts -> ${path.relative(root, outPath)}`);
