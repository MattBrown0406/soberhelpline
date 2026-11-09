import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const site = process.env.SITE || 'fi';
const origin = process.env.ORIGIN || `http://127.0.0.1:${site === 'fi' ? 4311 : 4312}`;
const out = process.env.EVIDENCE || new URL('../test-results/booking', import.meta.url).pathname;
fs.mkdirSync(out, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM || undefined, args: ['--no-sandbox'] });
const provider = { id: '11111111-1111-4111-8111-111111111111', full_name: 'Matt Brown', title: 'CIP', session_rate: 150, session_duration_minutes: 60, timezone: 'America/Los_Angeles', specialties: ['Family coaching'], status: 'active', bio: 'Synthetic provider fixture', photo_url: '/placeholder.svg' };
async function fixture(width = 390, timezoneId = 'UTC', failure = '', now = '2026-11-09T16:00:00Z') {
  const context = await browser.newContext({ viewport: { width, height: 844 }, timezoneId, reducedMotion: 'reduce' });
  const page = await context.newPage();
  // Date-only fixture: Playwright Clock also wraps animation timing and changes
  // native ResizeObserver/scroll ordering during prerender hydration.
  await page.addInitScript(timestamp => {
    const NativeDate = Date;
    function FixedDate(...args) {
      return new.target ? Reflect.construct(NativeDate, args.length ? args : [timestamp], new.target) : new NativeDate(timestamp).toString();
    }
    Object.setPrototypeOf(FixedDate, NativeDate);
    FixedDate.prototype = NativeDate.prototype;
    FixedDate.now = () => timestamp;
    window.Date = FixedDate;
  }, new Date(now).getTime());
  let fail = failure;
  const writes = [];
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === origin) return route.continue();
    if (url.hostname.endsWith('supabase.co')) {
      const path = url.pathname;
      let body = [];
      if (path.includes('consultation_providers_public')) body = [provider];
      if (path.includes('provider_availability')) body = Array.from({length:7}, (_,day_of_week) => ({ id: `day-${day_of_week}`, provider_id: provider.id, day_of_week, start_time: '09:00:00', end_time: '19:00:00', timezone: provider.timezone, is_active: true }));
      if (path.includes('square-booking')) {
        const data = request.postDataJSON();
        if (data.action !== 'get-available-slots') { writes.push(data); return route.abort(); }
        body = { slots: ['09:00', '16:00', '18:00'] };
      }
      if (path.includes('abandoned_bookings') || path.includes('update_abandoned_booking')) { writes.push({path, data: request.postDataJSON()}); body = {id:'22222222-2222-4222-8222-222222222222'}; }
      if (path.includes('/functions/') && !path.includes('square-booking')) {
        if (path.includes('track-conversion')) return route.fulfill({status:200,contentType:'application/json',body:'{}'});
        writes.push({path}); return route.abort();
      }
      if (fail.startsWith('network:') && path.includes(fail.slice(8))) return route.abort();
      if (fail.startsWith('delay:') && path.includes(fail.slice(6))) await new Promise(resolve=>setTimeout(resolve,1000));
      if (fail.startsWith('empty:') && path.includes(fail.slice(6))) body = site === 'fi' ? {slots:[]} : [];
      else if (fail && path.includes(fail)) return route.fulfill({status:503, contentType:'application/json', body:JSON.stringify({message:'Synthetic read failure'})});
      return route.fulfill({status:200, contentType:'application/json', body:JSON.stringify(body)});
    }
    return route.abort();
  });
  return { page, context, writes, recover: () => { fail=''; } };
}
async function check(name, fn) {
  if (process.env.TEST_FILTER && !new RegExp(process.env.TEST_FILTER).test(name)) return;
  try { await fn(); results.push({name, pass:true}); }
  catch(error) { results.push({name, pass:false, error:String(error.stack || error)}); }
  fs.writeFileSync(`${out}/${site}-browser-results.json`, JSON.stringify(results,null,2));
}
async function noOverflow(page) { const overflow = await page.evaluate(() => ({ width:innerWidth, scroll:document.documentElement.scrollWidth, nodes:[...document.querySelectorAll('body *')].filter(el => { const r=el.getBoundingClientRect(); return r.width && (r.right > innerWidth+1 || r.left < -1); }).slice(0,15).map(el=>({tag:el.tagName,class:el.className,text:el.textContent?.slice(0,80)})) })); assert(overflow.scroll <= overflow.width + 1, `horizontal overflow ${JSON.stringify(overflow)}`); }
async function shChoose(page, key='Enter') {
  const button = page.getByRole('button',{name:'Choose Matt Brown',exact:true});
  await button.waitFor(); await button.focus(); await page.keyboard.press(key);
  await page.getByText('Choose a Date and Time',{exact:true}).waitFor();
}
async function shDate(page) {
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option',{name:'Tuesday, November 10, 2026',exact:true}).click();
  await page.getByRole('radio').first().waitFor();
}
try {
for (const width of [320,390,768,1024,1440]) await check(`responsive-${width}`, async () => {
  const {page,context,writes} = await fixture(width);
  try {
    if (site === 'fi') {
      await page.goto(`${origin}/book-intervention-consultation?type=crisis-coaching&utm_source=qa#booking`);
      await page.getByTestId('selected-offer').waitFor();
      await page.waitForTimeout(400);
      assert.match(await page.getByTestId('selected-offer').innerText(), /60 minutes · \$150/);
      assert.match(page.url(), /utm_source=qa/);
      assert(!new URL(page.url()).searchParams.has('type'));
      assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Schedule an Appointment');
      const rect = await page.locator('#booking').boundingBox(); assert(rect.y >= 0 && rect.y < 150, `booking y=${rect.y}`);
      await page.getByRole('gridcell',{name:'10',exact:true}).click();
      await page.getByRole('button',{name:/Nov 11, 2026, 12:00 AM UTC/}).click();
      assert.match(await page.locator('#booking').innerText(), /Your appointment: Nov 11, 2026, 12:00 AM UTC/);
      assert.match(await page.locator('#booking').innerText(), /Provider time: Nov 10, 2026, 4:00 PM PST/);
    } else {
      await page.goto(`${origin}/book-consultation?plan=single`);
      await page.getByRole('button',{name:'Choose Matt Brown',exact:true}).waitFor();
      await noOverflow(page);
      await shChoose(page, width === 320 ? 'Space' : 'Enter');
      await shDate(page);
      await noOverflow(page);
      await page.screenshot({path:`${out}/${site}-slots-${width}.png`});
      assert.equal(await page.locator('a[aria-label="Contact Sober Helpline"]').count(),0);
      await page.getByRole('radio').nth(7).click();
      await page.getByRole('button',{name:'Next',exact:true}).click();
      await page.locator('#client_email').waitFor();
      await page.locator('#client_email').fill('synthetic@example.invalid');
      await page.waitForTimeout(1000);
      assert.equal(writes.length,0,'typing must not capture a recovery record');
      assert.match(await page.locator('#booking-save-notice').innerText(), /Selecting Next saves/);
    }
    await noOverflow(page);
    await page.screenshot({path:`${out}/${site}-${width}.png`});
    assert.equal(writes.length,0);
  } finally { await context.close(); }
});
if (site === 'fi') {
  await check('late-layout-settle-stops-on-user-input', async()=>{
    const {page,context}=await fixture();
    try {
      await page.goto(`${origin}/book-intervention-consultation?type=consultation#booking`);
      await page.getByTestId('selected-offer').waitFor();
      await page.evaluate(()=>{
        const section=document.getElementById('booking');
        const original=section.scrollIntoView.bind(section);
        window.__reanchors=0;section.scrollIntoView=(...args)=>{window.__reanchors++;original(...args)};
        const spacer=document.createElement('div');spacer.id='synthetic-layout-shift';spacer.style.height='400px';section.before(spacer);
      });
      await page.waitForTimeout(200);
      assert(await page.evaluate(()=>window.__reanchors>0));
      const rect=await page.locator('#booking').boundingBox();assert(rect.y>=0&&rect.y<150);
      await page.keyboard.press('Tab');
      await page.evaluate(()=>{window.__reanchors=0;document.getElementById('synthetic-layout-shift').style.height='800px'});
      await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.__reanchors),0);
    } finally {await context.close();}
  });
  await check('native-hash-and-query-without-hash', async()=>{
    const {page,context}=await fixture();
    try {
      await page.goto(`${origin}/book-intervention-consultation`);
      await page.locator('a[href="#booking"]').first().click();
      await page.waitForTimeout(300);
      assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'Schedule an Appointment');
      await page.goto(`${origin}/book-intervention-consultation?type=consultation&utm_campaign=test`);
      await page.getByTestId('selected-offer').waitFor();await page.waitForTimeout(300);
      assert.match(page.url(),/utm_campaign=test/);
      assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'Schedule an Appointment');
    } finally {await context.close();}
  });
  for (const type of ['consultation','crisis-coaching','readiness-intensive','aftercare-planning']) await check(`offer-${type}`, async () => {
    const {page,context} = await fixture();
    try { await page.goto(`${origin}/?type=${type}#booking`); await page.getByTestId('selected-offer').waitFor(); await page.waitForTimeout(300); assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()), 'Schedule an Appointment'); await page.getByRole('gridcell',{name:'10',exact:true}).click(); await page.getByRole('button',{name:/Nov 10, 2026, 5:00 PM UTC/}).waitFor(); }
    finally { await context.close(); }
  });
  await check('holiday-click-and-same-page-consult',async()=>{
    const {page,context} = await fixture();
    try {
      await page.goto(origin);
      await page.getByRole('link',{name:'Plan your holiday coaching session'}).click();
      await page.getByTestId('selected-offer').waitFor();
      await page.waitForTimeout(300);
      assert.match(await page.getByTestId('selected-offer').innerText(),/Crisis Coaching/);
      assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'Schedule an Appointment');
      await page.locator('a[href*="type=consultation"]').first().click();
      await page.waitForTimeout(300);
      assert.match(await page.getByTestId('selected-offer').innerText(),/15 minutes · Free/);
      assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'Schedule an Appointment');
    } finally { await context.close(); }
  });
  await check('availability-failure-retry', async()=>{
    const {page,context,recover} = await fixture(390,'UTC','square-booking');
    try { await page.goto(`${origin}/?type=consultation&date=2026-11-10&time=09:00#booking`); await page.getByRole('button',{name:'Retry availability'}).waitFor(); assert.equal(await page.locator('#name').count(),0); assert.equal(await page.getByText('No available times for this date.',{exact:true}).count(),0); recover(); await page.getByRole('button',{name:'Retry availability'}).click(); await page.getByRole('button',{name:/Nov 10, 2026, 5:00 PM UTC/}).waitFor(); }
    finally { await context.close(); }
  });
} else {
  for (const failure of ['consultation_providers_public','provider_availability','get_booking_slots','provider_date_overrides']) await check(`failure-retry-${failure}`,async()=>{
    const {page,context,recover,writes} = await fixture(390,'UTC',failure);
    try { await page.goto(`${origin}/book-consultation?plan=single`);
      if (failure==='consultation_providers_public') { await page.getByRole('button',{name:'Retry providers'}).waitFor(); recover(); await page.getByRole('button',{name:'Retry providers'}).click(); await page.getByRole('button',{name:'Choose Matt Brown'}).waitFor(); }
      else { await shChoose(page); await page.getByRole('button',{name:'Retry availability'}).waitFor(); assert.equal(await page.getByRole('radio').count(),0); assert(await page.getByRole('button',{name:'Next',exact:true}).isDisabled()); recover(); await page.getByRole('button',{name:'Retry availability'}).click(); await shDate(page); }
      assert.equal(writes.length,0);
    } finally { await context.close(); }
  });
  await check('contact-next-is-capture-boundary',async()=>{
    const {page,context,writes} = await fixture();
    try {
      await page.goto(`${origin}/book-consultation?plan=single`); await shChoose(page); await shDate(page);
      await page.getByRole('radio').first().click(); await page.getByRole('button',{name:'Next',exact:true}).click();
      await page.locator('#client_email').fill('synthetic@example.invalid');
      await page.locator('#client_name').fill('Synthetic Test');
      const selects=page.getByRole('combobox');
      await selects.nth(0).click(); await page.getByRole('option',{name:'Emergency Game Plan',exact:true}).click();
      await selects.nth(1).click(); await page.getByRole('option',{name:'Parent',exact:true}).click();
      await page.waitForTimeout(1000); assert.equal(writes.length,0);
      await page.getByRole('button',{name:'Next',exact:true}).click();
      await page.getByText('About the Individual',{exact:true}).waitFor();
      await page.waitForTimeout(300); assert.equal(writes.length,1); assert(writes[0].path.includes('abandoned_bookings'));
    } finally { await context.close(); }
  });
}
for (const zone of ['UTC','America/Los_Angeles','America/New_York','Europe/London']) for (const [date,now,utc] of [
  ['2026-03-08','2026-03-01T12:00:00Z','2026-03-08T16:00:00Z'],
  ['2026-11-01','2026-10-26T12:00:00Z','2026-11-01T17:00:00Z'],
]) await check(`timezone-${zone}-${date}`,async()=>{
  const {page,context} = await fixture(390,zone,'',now);
  try {
    const expected = new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(utc));
    if (site==='fi') {
      await page.goto(`${origin}/?type=consultation&date=${date}#booking`);
      await page.getByRole('button',{name:new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).waitFor();
    } else {
      await page.goto(`${origin}/book-consultation?plan=single`); await shChoose(page);
      await page.getByRole('combobox').nth(1).click();
      const dateLabel = new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date(`${date}T12:00:00Z`));
      await page.getByRole('option',{name:dateLabel,exact:true}).click();
      assert.match(await page.getByRole('radiogroup').innerText(),new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    }
  } finally { await context.close(); }
});
await check('loading-is-not-empty',async()=>{
  const {page,context}=await fixture(390,'UTC',site==='fi'?'delay:square-booking':'delay:provider_availability');
  try {
    await page.goto(site==='fi'?`${origin}/?type=consultation&date=2026-11-10#booking`:`${origin}/book-consultation`);
    if(site==='sh') await shChoose(page);
    await page.getByText(site==='fi'?'Loading available times…':'Checking availability…',{exact:true}).waitFor();
    assert.equal(await page.getByText(/No available (times|dates)/).count(),0);
    if(site==='sh') assert(await page.getByRole('button',{name:'Next',exact:true}).isDisabled());
    await page.getByText(site==='fi'?'Loading available times…':'Checking availability…',{exact:true}).waitFor({state:'hidden'});
  } finally {await context.close();}
});
await check('network-read-failure',async()=>{
  const {page,context} = await fixture(390,'UTC',site==='fi'?'network:square-booking':'network:provider_availability');
  try { await page.goto(site==='fi'?`${origin}/?type=consultation&date=2026-11-10#booking`:`${origin}/book-consultation`); if(site==='sh') await shChoose(page); await page.getByRole('button',{name:'Retry availability'}).waitFor(); } finally { await context.close(); }
});
await check('successful-empty-availability',async()=>{
  const {page,context} = await fixture(390,'UTC',site==='fi'?'empty:square-booking':'empty:provider_availability');
  try { await page.goto(site==='fi'?`${origin}/?type=consultation&date=2026-11-10#booking`:`${origin}/book-consultation`); if(site==='sh') await shChoose(page); await page.getByText(site==='fi'?'No available times for this date. Please choose another date.':'No available dates in this booking window. Please contact us for help.',{exact:true}).waitFor(); assert.equal(await page.getByRole('button',{name:'Retry availability'}).count(),0); } finally { await context.close(); }
});
} finally { await browser.close(); }
console.log(JSON.stringify(results,null,2));
if (results.some(r=>!r.pass)) process.exitCode=1;
