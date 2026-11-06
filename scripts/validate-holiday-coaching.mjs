import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');
const banner = read('src/components/HolidayCoachingBanner.tsx');
const home = read('src/pages/Index.tsx');
const booking = read('src/pages/BookConsultation.tsx');
const app = read('src/App.tsx');
assert(banner.includes('Make a plan before the holiday gathering.'));
assert(banner.includes('Plan your holiday coaching session'));
assert(banner.includes('to="/book-consultation?plan=single"'));
assert(banner.includes('Existing paid coaching'));
assert(!/workshop|guarantee|limited spots|book now|\$\d/i.test(banner));
assert(home.indexOf('<HolidayCoachingBanner />') > home.indexOf('<HomeHero />'));
for (const file of readdirSync('src/pages').filter(f => f.endsWith('.tsx') && f !== 'Index.tsx')) {
  assert(!read(`src/pages/${file}`).includes('HolidayCoachingBanner'), file);
}
assert(app.includes('path="/book-consultation" element={<BookConsultationPage />}'));
assert(booking.includes('urlParams.get("plan")'));
assert(booking.includes('new Set(["single",'));
assert(booking.includes('plan_type: planType && SERVER_PLAN_TYPES.has(planType) ? planType : "single"'));
assert(booking.includes('Choose a provider for a 60-minute video consultation'));
console.log('PASS: holiday copy, existing single-session paid route, homepage-only mount, booking plan contract.');
