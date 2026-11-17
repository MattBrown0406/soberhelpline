import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { formatDateOnly, pacificToday, parseDateOnly } from "../src/lib/dateOnly.ts";

Deno.test("a calendar date keeps its day", () => {
  assertEquals(formatDateOnly("2026-11-16", "MMM d, yyyy"), "Nov 16, 2026");
  assertEquals(formatDateOnly("2026-11-16", "EEEE"), "Monday");
  assertEquals(formatDateOnly("2026-03-09T00:00:00+00:00", "MMMM d"), "March 9");
});

Deno.test("a value that is not a date is returned unchanged", () => {
  assertEquals(formatDateOnly("soon", "MMM d"), "soon");
  assertEquals(formatDateOnly("2026-02-30", "MMM d"), "2026-02-30");
  assertEquals(formatDateOnly(null, "MMM d"), "");
  assertEquals(parseDateOnly(undefined), null);
});

Deno.test("Pacific today is the Pacific calendar date, not the UTC one", () => {
  // 7:30 PM Pacific on Monday Nov 16 is already Tuesday in UTC.
  assertEquals(pacificToday(new Date("2026-11-17T03:30:00Z")), "2026-11-16");
  // Daylight time: 11:30 PM Pacific on July 6.
  assertEquals(pacificToday(new Date("2026-07-07T06:30:00Z")), "2026-07-06");
  assertEquals(pacificToday(new Date("2026-07-07T07:30:00Z")), "2026-07-07");
});
