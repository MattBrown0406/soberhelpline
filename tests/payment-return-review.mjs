// Legacy payment handling is intentionally excluded from this UI-only release.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/pages/BookConsultation.tsx',import.meta.url),'utf8');
const baseline=execFileSync('git',['show','a157ff31019328b92284aa730ec6812ebaa20956:src/pages/BookConsultation.tsx'],{encoding:'utf8'});
for(const [start,end] of [
 ['  // Handle PayPal return','  useEffect(() => {\n    loadInit()'],
 ['  if (paidNotBooked) return (','\n  if (loading || paymentProcessing)'],
]) {
 const section=s=>s.slice(s.indexOf(start),s.indexOf(end,s.indexOf(start)));
 assert(source.includes(start)&&source.includes(end));
 assert.equal(section(source),section(baseline),'Payment flow must remain byte-identical to existing main');
}
console.log('PASS legacy payment handler and paid-conflict UI byte equality');
const origin=process.env.ORIGIN || 'http://127.0.0.1:4412';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM,headless:true,args:['--no-sandbox']});
try {
 for(const [name,status,result] of [
  ['legacy',200,{success:true,bookingIds:['synthetic']}],
  ['complete',200,{success:true,bookingIds:['synthetic'],processingComplete:true}],
  ['paid-conflict',500,{error:'conflict',paymentCaptured:true}],
 ]) {
  const context=await browser.newContext();const page=await context.newPage();let captures=0;
  await page.route('**/*',async route=>{
   const u=new URL(route.request().url());if(u.origin===origin)return route.continue();
   if(u.pathname.endsWith('/functions/v1/consultation-payment')){captures++;return route.fulfill({status,contentType:'application/json',body:JSON.stringify(result)});}
   if(u.hostname.endsWith('supabase.co'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   return route.abort();
  });
  await page.goto(`${origin}/book-consultation?token=synthetic-${name}&PayerID=synthetic`);
  if(name==='paid-conflict') {
   await page.getByText('Payment received',{exact:true}).waitFor();
   assert(!page.url().includes('coaching-onboarding'));
  } else await page.waitForURL('**/coaching-onboarding?plan=single');
  assert.equal(captures,1);assert.equal(await page.getByText('Payment / booking needs review',{exact:true}).count(),0);
  console.log('PASS unchanged payment response '+name);await context.close();
 }
}finally{await browser.close();}
