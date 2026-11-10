// Run: deno test supabase/functions/_shared/bookingRules_test.ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { checkSlotsBookable } from "./bookingRules.ts";

// A provider open Mondays 09:00–17:00 Pacific with nothing booked.
function calendar() {
  const tables: Record<string, unknown[]> = {
    provider_availability: [{ day_of_week: 1, start_time: "09:00:00", end_time: "17:00:00", timezone: "America/Los_Angeles" }],
    provider_date_overrides: [],
    consultation_bookings: [],
  };
  return {
    from(table: string) {
      const result = { data: tables[table] ?? [], error: null };
      const chain: Record<string, unknown> = {
        // deno-lint-ignore no-explicit-any
        then: (resolve: (value: typeof result) => any) => resolve(result),
      };
      for (const method of ["select", "eq", "in", "gte", "lte"]) chain[method] = () => chain;
      return chain;
    },
  };
}

const provider = { id: "p1", timezone: "America/Los_Angeles", session_duration_minutes: 60 };
const now = Date.parse("2026-11-10T20:00:00Z"); // Tuesday; 2026-11-16 is the next Monday
const slot = (start: string, end: string) => [{ booking_date: "2026-11-16", start_time: start, end_time: end, timezone: "America/Los_Angeles" }];

Deno.test("a 60-minute session on the provider's hourly grid is bookable", async () => {
  const result = await checkSlotsBookable(calendar(), provider, "single", slot("10:00:00", "11:00:00"), now);
  assert(result.ok);
});

Deno.test("the readiness intensive books the 90-minute times the booking page lists", async () => {
  for (const [start, end] of [["09:00:00", "10:30:00"], ["10:30:00", "12:00:00"], ["15:00:00", "16:30:00"]]) {
    const result = await checkSlotsBookable(calendar(), provider, "family-readiness-intensive", slot(start, end), now);
    assert(result.ok, `${start}–${end}`);
  }
});

Deno.test("the readiness intensive rejects a 60-minute or off-grid time", async () => {
  for (const [start, end] of [["10:00:00", "11:00:00"], ["10:00:00", "11:30:00"], ["16:30:00", "18:00:00"]]) {
    const result = await checkSlotsBookable(calendar(), provider, "family-readiness-intensive", slot(start, end), now);
    assert(!result.ok, `${start}–${end}`);
    if (!result.ok) assertEquals(result.code, "slot_unavailable");
  }
});

Deno.test("other plans still reject a 90-minute time", async () => {
  const result = await checkSlotsBookable(calendar(), provider, "single", slot("09:00:00", "10:30:00"), now);
  assert(!result.ok);
});
