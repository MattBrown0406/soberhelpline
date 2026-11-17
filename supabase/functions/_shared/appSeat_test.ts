// Run: deno test supabase/functions/_shared/appSeat_test.ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { hasSeat, newAppSeatRow } from "./appSeat.ts";

const MONDAY = "2026-11-16";

Deno.test("a website row for that Monday is already her seat", () => {
  assert(hasSeat([{ email: "other@example.invalid" }, { email: "member@example.invalid" }], "member@example.invalid"));
});

Deno.test("an app row is her seat too, whatever the case or spacing on file", () => {
  assert(hasSeat([{ email: "  Member@Example.invalid " }], "member@example.invalid"));
  assert(hasSeat([{ email: "member@example.invalid" }], " MEMBER@example.invalid"));
});

Deno.test("nobody else's row counts, and rows without an email never match", () => {
  assert(!hasSeat([], "member@example.invalid"));
  assert(!hasSeat([{ email: "member2@example.invalid" }, { email: null }, {}], "member@example.invalid"));
  assert(!hasSeat([{ email: "" }, { email: null }], ""));
});

Deno.test("an address is matched whole, never as a pattern", () => {
  assert(!hasSeat([{ email: "memberXone@example.invalid" }], "member_one@example.invalid"));
  assert(!hasSeat([{ email: "a.member@example.invalid" }], "member@example.invalid"));
});

Deno.test("the new row is the batch's app row: no marketing, no follow-ups, no question_items", () => {
  assertEquals(newAppSeatRow(" Member@Example.invalid ", "Pat Example", MONDAY), {
    user_id: null,
    name: "Pat Example",
    email: "member@example.invalid",
    phone: "",
    question: "",
    request_follow_up: false,
    consent_email_list: false,
    auto_register: false,
    meeting_date: MONDAY,
    language: "en",
    registration_source: "app",
    lead_reasons: ["Sober Helpline app RSVP"],
    next_revenue_action: "none",
    followup_sequence_status: "not_applicable",
  });
  assert(!("question_items" in newAppSeatRow("member@example.invalid", "Pat Example", MONDAY)));
});
