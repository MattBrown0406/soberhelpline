import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL, sitemapPriority, sitemapChangefreq, excludedSitemapRoutes } from './seo-routes.mjs';

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const blogPath = path.join(root, 'src', 'data', 'blogPosts.ts');
const familyAnswersPath = path.join(root, 'src', 'data', 'familyAddictionAnswers.ts');
const outPath = path.join(root, 'public', 'sitemap.xml');
const now = new Date().toISOString().slice(0, 10);

const appSource = fs.readFileSync(appPath, 'utf8');
const routeMatches = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

const routes = [...new Set(routeMatches)]
  .filter((route) => route.startsWith('/'))
  .filter((route) => !route.includes(':'))
  .filter((route) => !excludedSitemapRoutes.has(route))
  .filter((route) => !route.startsWith('/subscription/'))
  .sort((a, b) => a.localeCompare(b));

const blogSource = fs.readFileSync(blogPath, 'utf8');
const blogSlugs = [...blogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => `/blog/${m[1]}`);
const familyAnswersSource = fs.readFileSync(familyAnswersPath, 'utf8');
const familyAnswerRoutes = [...familyAnswersSource.matchAll(/slug:\s*"([^"]+)"/g)]
  .map((m) => `/family-addiction-answers/${m[1]}`);

const urls = [...new Set([...routes, ...blogSlugs, ...familyAnswerRoutes])].sort((a, b) => {
  if (a === '/') return -1;
  if (b === '/') return 1;
  if (a === '/blog') return -1;
  if (b === '/blog') return 1;
  return a.localeCompare(b);
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((route) => `  <url>\n    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${sitemapChangefreq.get(route) ?? (route.startsWith('/blog/') ? 'monthly' : 'monthly')}</changefreq>\n    <priority>${sitemapPriority.get(route) ?? (route.startsWith('/blog/') ? '0.7' : '0.6')}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;

fs.writeFileSync(outPath, xml);
console.log(`Generated sitemap with ${urls.length} URLs -> ${path.relative(root, outPath)}`);
