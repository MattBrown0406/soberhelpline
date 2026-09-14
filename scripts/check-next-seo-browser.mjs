import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const out = process.env.SEO_TEST_OUT || 'test-results/next-seo';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({headless:true});
const context = await browser.newContext();
await context.route('**/*', r => new URL(r.request().url()).hostname === '127.0.0.1' && r.request().method() === 'GET' ? r.continue() : r.abort());
const page = await context.newPage();
const result = {mobile:[], articles:[]};
for (const width of [320,360,390,430,768,1280]) {
 await page.setViewportSize({width,height:900});
 await page.goto('http://127.0.0.1:4387/family-support');
 await page.getByRole('heading',{name:'Free Family Support Resources',exact:true}).waitFor();
 result.mobile.push(await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,90),right:e.getBoundingClientRect().right}))})));
}
for (const slug of ['first-al-anon-meeting-what-to-expect','alcohol-blackouts-explained-family-guide']) {
 const route='/blog/'+slug;
 const raw=await (await context.request.get('http://127.0.0.1:4387'+route)).text();
 await fs.writeFile(`${out}/${process.env.PHASE || 'before'}-${slug}.html`,raw);
 await page.goto('http://127.0.0.1:4387'+route);
 await page.getByRole('button',{name:'Share this article',exact:true}).waitFor();
 result.articles.push(await page.evaluate((route)=>({route,title:document.title,canonical:document.querySelector('link[rel=canonical]')?.href,h1:document.querySelector('article h1').textContent,body:document.querySelector('article .prose').innerText,headings:[...document.querySelectorAll('article .prose h2,article .prose h3')].map(e=>({tag:e.tagName,text:e.textContent})),links:[...document.querySelectorAll('article .prose a')].map(e=>({text:e.textContent,href:e.getAttribute('href')}))}),route));
}
await fs.writeFile(`${out}/${process.env.PHASE || 'before'}-browser.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result.mobile.map(({overflow,...x})=>({...x,overflow:overflow.slice(-5)})),null,2));
await browser.close();
