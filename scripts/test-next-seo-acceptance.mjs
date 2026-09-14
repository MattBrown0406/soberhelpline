import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=process.env.SEO_TEST_OUT || 'test-results/next-seo';
const origin=process.env.SEO_TEST_ORIGIN || 'http://127.0.0.1:4387';
await fs.mkdir(out,{recursive:true});
const slugs=['first-al-anon-meeting-what-to-expect','alcohol-blackouts-explained-family-guide'];
const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext();
await ctx.route('**/*',r=>new URL(r.request().url()).origin===origin && r.request().method()==='GET'?r.continue():r.abort());
const page=await ctx.newPage();
const extract=()=>{const el=document.querySelector('[data-article-content]');return {text:el.textContent.replace(/\s+/g,' ').trim(),headings:[...el.querySelectorAll('h2,h3')].map(e=>[e.tagName,e.textContent]),links:[...el.querySelectorAll('a')].map(e=>[e.textContent,e.getAttribute('href')]),lists:el.querySelectorAll('ul,ol').length};};
const result={articles:[],destinations:[],schema:[],mobile:[],initialCounts:[]};
for(const slug of slugs){
 const route='/blog/'+slug;
 const raw=await(await ctx.request.get(origin+route)).text();
 const rawpage=await ctx.newPage();await rawpage.route('**/*',r=>r.abort());await rawpage.setContent(raw);
 const initial=await rawpage.evaluate(extract);
 assert.equal(await rawpage.locator('h1').count(),1);assert.equal(await rawpage.locator('[data-article-content]').count(),1);
 assert.equal(await rawpage.locator('noscript [data-article-content]').count(),0);
 for(const width of [390,1280]){
 await page.setViewportSize({width,height:900});await page.goto(origin+route);await page.getByRole('button',{name:'Share this article',exact:true}).waitFor();
 const rendered=await page.evaluate(extract);assert.deepEqual(rendered,initial);
 assert.equal(await page.locator('[data-article-content]').count(),1);
 assert.equal(await page.locator('article h1').count(),1);
 assert(!rendered.text.includes('[LINK:'));assert(!/(?:^|\s)#{2,3} /.test(rendered.text));
 result.articles.push({route,width,parity:true,headings:rendered.headings.length,links:rendered.links.length,lists:rendered.lists});
 }
 const before=await fs.readFile(path.join(out,'before-'+slug+'.html'),'utf8').catch(()=>null);
 const textStats=async html=>{await rawpage.setContent(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<(\/?)noscript\b[^>]*>/gi,'<$1div>'));return rawpage.evaluate(()=>{const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const parts=[];while(walker.nextNode())parts.push(walker.currentNode.textContent);const body=parts.join(' ').replace(/\s+/g,' ').trim();return {words:body.split(/\s+/).filter(Boolean).length,characters:body.length};});};
 result.initialCounts.push({route,before:before ? await textStats(before) : null,after:await textStats(raw),method:'DOM text nodes joined with spaces; script/style removed; noscript parsed as div; whitespace-normalized'});
 for(const [label,href] of initial.links){
  if(!href.startsWith('/'))continue;
  await page.goto(origin+route);await page.getByRole('button',{name:'Share this article',exact:true}).waitFor();
  const a=page.locator('[data-article-content] a').filter({hasText:label}).first();
  const popupPromise=page.waitForEvent('popup');await a.click();const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded');
  await popup.waitForFunction(()=>document.querySelector('h1') && !document.body.innerText.includes('Loading...'));
  const state=await popup.evaluate(()=>({h1:document.querySelector('h1').textContent,body:document.body.innerText,canonical:document.querySelector('link[rel=canonical]')?.href}));
  assert(!/Post not found|Page Not Found/.test(state.body));result.destinations.push({href,label,h1:state.h1,canonical:state.canonical});await popup.close();
 }
 await rawpage.close();
}
for(const width of [320,360,390,430,768,1280]){
 await page.setViewportSize({width,height:900});await page.goto(origin+'/family-support');await page.getByRole('heading',{name:'Free Family Support Resources',exact:true}).waitFor();
 const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,clippedControls:[...document.querySelectorAll('main button,main a')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left<0||r.right>innerWidth+1);}).map(e=>e.textContent)}));
 assert.equal(geometry.width,geometry.scroll);assert.deepEqual(geometry.clippedControls,[]);
 const link=page.locator('a[href="/blog/first-al-anon-meeting-what-to-expect"]');await link.focus();await page.keyboard.press('Tab');
 const focus=await page.evaluate(()=>({href:document.activeElement.getAttribute('href'),outline:getComputedStyle(document.activeElement).outlineStyle}));
 result.mobile.push({...geometry,keyboard:focus});
}
for(const route of ['/addiction-family-coaching','/family-coaching','/intervention-help','/family-readiness-intensive','/family-consultation','/']){
 await page.goto(origin+route);await page.locator('h1').first().waitFor();await page.waitForTimeout(600);
 const s=await page.evaluate(()=>({h1:document.querySelector('h1').textContent,body:document.body.innerText,canonical:document.querySelector('link[rel=canonical]')?.href,schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent))}));
 if(route==='/addiction-family-coaching')assert(!/Routing notes|coaching-intent traffic|routes paid interest/.test(s.body));
 const check=o=>{if(Array.isArray(o))o.forEach(check);else if(o&&typeof o==='object'){if(o.sameAs)assert(!JSON.stringify(o.sameAs).match(/freedominterventions\.com|nomoreenabling\.com|partywreckers\.com/));Object.values(o).forEach(check);}};s.schemas.forEach(check);
 result.schema.push({route,h1:s.h1,canonical:s.canonical,schemaCount:s.schemas.length});
}
await fs.writeFile(out+'/acceptance-browser.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));await browser.close();
