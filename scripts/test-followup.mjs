import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base = process.argv[2];
const brand = process.argv[3];
assert.ok(base && ['fi','nme','sh'].includes(brand), 'usage: node scripts/test-followup.mjs URL fi|nme|sh');
const browser = await chromium.launch({headless:true});
let count=0;
try {
  for (const width of [320,1280]) {
    const ctx=await browser.newContext({viewport:{width,height:1000}});
    const page=await ctx.newPage();
    const calls=[],errors=[];
    let mode='reject';
    page.on('pageerror',e=>errors.push(e.message));
    await ctx.route('https://followup.187.77.196.68.sslip.io/**',async route=>{
      const req=route.request();calls.push({url:req.url(),body:req.postData()});
      if(req.url().endsWith('/challenge')) return route.fulfill({json:{token:'test-token'}});
      if(mode==='network') return route.abort();
      if(mode==='reject') return route.fulfill({status:400,json:{error:'Test rejection: correct your request.'}});
      if(mode==='malformed') return route.fulfill({json:{success:true}});
      return route.fulfill({json:{accepted:true,requestId:'test-reference-123'}});
    });
    await page.goto(base+'/next-step',{waitUntil:'networkidle'});
    async function guide(){
      await page.getByRole('button',{name:brand==='nme'?'Understanding my options':'Understanding options',exact:false}).click();
      if(brand==='sh'){
        await page.getByRole('radio').first().check();await page.getByRole('button',{name:'Read my guide',exact:true}).click();
      } else await page.getByRole('button',{name:brand==='fi'?'Compare kinds of support':'Support for me',exact:false}).click();
    }
    await guide();
    assert.equal(calls.length,0,'using guide must not contact followup service');
    await page.getByRole('button',{name:'Ask Matt to Follow Up',exact:true}).click();
    await page.getByLabel('Your name',{exact:true}).fill('Browser Test');
    assert.ok(calls.every(r=>r.url.endsWith('/challenge')&&!r.body),'opening sends no fields');
    assert.equal(await page.locator('input[name=share-guide]').isChecked(),false);
    assert.equal(await page.locator('input[name=followup-consent]').isChecked(),false);
    assert.equal(await page.getByRole('button',{name:'Send follow-up request'}).isDisabled(),true);
    await page.locator('input[name=followup-contact]').fill('503-836-2136');
    await page.locator('textarea[name=followup-note]').fill('Please call after lunch; no voicemail.');
    await page.locator('input[name=followup-consent]').check();
    await page.getByRole('button',{name:'Send follow-up request'}).click();
    await page.getByRole('alert').filter({hasText:'Test rejection'}).waitFor();
    let payload=JSON.parse(calls.find(r=>r.url.endsWith('/follow-up')).body);
    assert.equal(payload.shareGuide,false);assert.equal('guide' in payload,false);assert.equal(payload.consent,true);
    assert.equal(await page.locator('input[name=followup-name]').inputValue(),'Browser Test','failed submission must preserve editable form');
    mode='malformed';
    await page.getByRole('button',{name:'Send follow-up request'}).click();
    await page.getByRole('alert').filter({hasText:'could not confirm'}).waitFor();
    assert.equal(await page.getByText('Your request was delivered',{exact:false}).count(),0);
    await page.locator('input[name=share-guide]').check();
    const preview=await page.locator('.followup-preview pre').innerText();
    assert.ok(preview.includes('Understanding')&&preview.includes('\n'));
    await page.emulateMedia({media:'print'});
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.next-step-followup')).display === 'none', null, {timeout:5000});
    assert.equal(await page.locator('.next-step-followup').isVisible(),false,'private contact form excluded from print');
    await page.emulateMedia({media:'screen'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    mode='accept';await page.getByRole('button',{name:'Send follow-up request'}).click();
    await page.getByText('Your request was delivered to Matt’s notification inbox.',{exact:true}).waitFor();
    payload=JSON.parse(calls.filter(r=>r.url.endsWith('/follow-up')).at(-1).body);
    assert.equal(payload.guide,preview);assert.equal(payload.shareGuide,true);
    assert.equal(await page.locator('input[name=followup-name]').count(),0);
    await page.getByRole('button',{name:'Close confirmation'}).click();
    await page.getByRole('button',{name:'Ask Matt to Follow Up',exact:true}).click();
    assert.equal(await page.locator('input[name=followup-name]').inputValue(),'');
    await page.locator('input[name=followup-name]').fill('Do not retain');
    await page.getByRole('button',{name:'Cancel and clear form'}).click();
    await page.getByRole('button',{name:'Ask Matt to Follow Up',exact:true}).click();
    assert.equal(await page.locator('input[name=followup-name]').inputValue(),'');
    await page.locator('input[name=followup-name]').fill('Reset test');
    await page.getByRole('button',{name:brand==='nme'?'Reset guide':'Reset choices',exact:true}).click();
    assert.equal(await page.locator('input[name=followup-name]').count(),0);
    await guide();await page.getByRole('button',{name:'Ask Matt to Follow Up',exact:true}).click();
    assert.equal(await page.locator('input[name=followup-name]').inputValue(),'');
    assert.equal(await page.locator('input[name=share-guide]').isChecked(),false);
    assert.deepEqual(await page.evaluate(()=>[Object.keys(localStorage),Object.keys(sessionStorage)]),[[],[]]);
    assert.equal(page.url(),base+'/next-step');assert.deepEqual(errors,[]);
    await ctx.close();count++;
    console.log(`PASS ${brand} ${width}px: no automatic submission, explicit consent, opt-in choices, error truth, success, cancel/reset/privacy/print`);
  }
} finally {await browser.close();}
console.log(JSON.stringify({passed:true,brand,cases:count}));
