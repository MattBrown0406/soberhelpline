import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { SITE_URL, sitemapPriority, sitemapChangefreq, excludedSitemapRoutes, canonicalRouteAliases } from './seo-routes.mjs';

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const blogPath = path.join(root, 'src', 'data', 'blogPosts.ts');
const familyAnswersPath = path.join(root, 'src', 'data', 'familyAddictionAnswers.ts');
const outPath = path.join(root, 'public', 'sitemap.xml');
const now = new Date().toISOString().slice(0, 10);

const appSource = fs.readFileSync(appPath, 'utf8');
const routeMatches = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
const legacyBlogAliasRoutes = new Set(
  [...appSource.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<BlogArticle\s*\/>\}/g)]
    .map((m) => m[1])
    .filter((route) => !route.startsWith('/blog/'))
);

const routes = [...new Set(routeMatches)]
  .filter((route) => route.startsWith('/'))
  .filter((route) => !route.includes(':'))
  .filter((route) => !excludedSitemapRoutes.has(route))
  .filter((route) => !canonicalRouteAliases.has(route))
  .filter((route) => !legacyBlogAliasRoutes.has(route))
  .filter((route) => !route.startsWith('/subscription/'))
  .sort((a, b) => a.localeCompare(b));

const blogSource = fs.readFileSync(blogPath, 'utf8');
const blogSlugMatches = [...blogSource.matchAll(/slug:\s*"([^"]+)"/g)];
const blogSlugs = blogSlugMatches
  .map((m) => `/blog/${m[1]}`)
  .filter((route) => !canonicalRouteAliases.has(route));
const blogLastModified = new Map(blogSlugMatches.map((match) => {
  const objectStart = blogSource.lastIndexOf('\n  {', match.index);
  const nextObjectStart = blogSource.indexOf('\n  {', match.index + match[0].length);
  const block = blogSource.slice(
    objectStart >= 0 ? objectStart : 0,
    nextObjectStart >= 0 ? nextObjectStart : blogSource.length,
  );
  const date = block.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  return [`/blog/${match[1]}`, date];
}));
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

const gitDateCache = new Map();
const gitLastModified = (relativePath) => {
  if (!relativePath) return now;
  if (gitDateCache.has(relativePath)) return gitDateCache.get(relativePath);
  const result = spawnSync('git', ['log', '-1', '--format=%cs', '--', relativePath], {
    cwd: root,
    encoding: 'utf8',
  });
  const date = result.status === 0 && /^\d{4}-\d{2}-\d{2}$/.test(result.stdout.trim())
    ? result.stdout.trim()
    : now;
  gitDateCache.set(relativePath, date);
  return date;
};

const componentFiles = new Map();
for (const [, component, pageFile] of appSource.matchAll(/import\s+([A-Za-z0-9_]+)\s+from\s+["']\.\/pages\/([^"']+)["']/g)) {
  componentFiles.set(component, `src/pages/${pageFile}.tsx`);
}
for (const [, component, pageFile] of appSource.matchAll(/const\s+([A-Za-z0-9_]+)\s*=\s*React\.lazy\(\(\)\s*=>\s*import\(["']\.\/pages\/([^"']+)["']\)\)/g)) {
  componentFiles.set(component, `src/pages/${pageFile}.tsx`);
}
for (const [, alias, target] of appSource.matchAll(/const\s+([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+);/g)) {
  if (componentFiles.has(target)) componentFiles.set(alias, componentFiles.get(target));
}

const routeSourceFiles = new Map();
for (const [, route, component] of appSource.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<([A-Za-z0-9_]+)/g)) {
  routeSourceFiles.set(route, componentFiles.get(component) || 'src/App.tsx');
}
const familyAnswersDate = gitLastModified('src/data/familyAddictionAnswers.ts');
const lastModifiedFor = (route) => {
  if (blogLastModified.get(route)) return blogLastModified.get(route);
  if (route.startsWith('/family-addiction-answers/')) return familyAnswersDate;
  return gitLastModified(routeSourceFiles.get(route) || 'src/App.tsx');
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((route) => `  <url>\n    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n    <lastmod>${lastModifiedFor(route)}</lastmod>\n    <changefreq>${sitemapChangefreq.get(route) ?? (route.startsWith('/blog/') ? 'monthly' : 'monthly')}</changefreq>\n    <priority>${sitemapPriority.get(route) ?? (route.startsWith('/blog/') ? '0.7' : '0.6')}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;

fs.writeFileSync(outPath, xml);
console.log(`Generated sitemap with ${urls.length} URLs -> ${path.relative(root, outPath)}`);
