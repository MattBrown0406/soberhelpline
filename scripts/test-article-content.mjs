import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const out=process.env.SEO_TEST_OUT || 'test-results/next-seo';
await fs.mkdir(out,{recursive:true});
const server = await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
try {
 const {default: Content}=await server.ssrLoadModule('/src/components/ArticleContent.tsx');
 const render=content=>renderToStaticMarkup(createElement(Content,{content}));
 const good=render('## Title\n\n### Sub\n\n- One\n- Two\n\n1. First\n2. Second\n\n[normal](/family-coaching) [LINK:[1]:https://example.org/a] **strong**\n\n**Legacy heading**');
 for(const tag of ['h2','h3','ul','ol','li','p','strong']) assert(good.includes(`<${tag}`),tag);
 assert(good.includes('href="/family-coaching"')); assert(good.includes('>[1]</a>'));
 for(const href of ['javascript:alert','data:text/html,test','vbscript:test','//evil.test','/\\evil.test','java\nscript:test']) {
  const bad=render(`[LINK:unsafe:${href}]`);assert(!bad.includes('href='),href);
 }
 assert(!render('<img src=x onerror=alert(1)><script>alert(1)</script>').includes('<img'));
 const {blogPosts,imageMap}=await server.ssrLoadModule('/src/data/blogPosts.ts');
 const {pilotSlugs,renderArticlePilot}=await server.ssrLoadModule('/src/lib/articlePilot.tsx');
 const posts=blogPosts.map(post=>({slug:post.slug,length:render(post.content || '').length,customTokens:(post.content?.match(/\[LINK:/g)||[]).length}));
 for(const slug of pilotSlugs){const html=renderArticlePilot(slug);assert(html.includes('data-article-content'));assert(!html.includes('## '));}
 assert.throws(()=>renderArticlePilot('admin'));
 const image=renderToStaticMarkup(createElement(Content,{content:'[IMAGE:cycleOfAddictionImg]',images:imageMap}));assert(image.includes('<img'));
 await fs.writeFile(`${out}/renderer-tests.json`,JSON.stringify({passed:true,posts,pilotSlugs},null,2));
 console.log(`PASS security, semantic, legacy/image fixtures; ${posts.length} article renders; exact two-pilot allowlist`);
} finally {await server.close();}
