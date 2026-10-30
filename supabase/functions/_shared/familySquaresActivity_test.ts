// Run: deno test supabase/functions/_shared/familySquaresActivity_test.ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { addDays, dormantEmails, isFirstMondayOfMonth, isLikelyMistypedEmail } from "./familySquaresActivity.ts";

Deno.test("mistyped addresses are caught, real ones are not", () => {
  for (const e of ["a@gmal.com", "a@comcast.bet", "a@comcast.neg", "a@lcloud.com", "a@hotmail.con", "a@hotmsil.com", "no-at-sign", "a@localhost"]) {
    assert(isLikelyMistypedEmail(e), e);
  }
  for (const e of ["a@gmail.com", "a@comcast.net", "a@icloud.com", "A@Hotmail.com ", "a@sasktel.net", "a@bendcable.com"]) {
    assert(!isLikelyMistypedEmail(e), e);
  }
});

Deno.test("first Monday of the month", () => {
  assert(isFirstMondayOfMonth("2026-11-02"));
  assert(!isFirstMondayOfMonth("2026-11-09"));
  assertEquals(addDays("2026-11-02", -56), "2026-09-07");
});

Deno.test("attendance matches by registration, then email, then full name", () => {
  const before = new Set(["reg@x.com", "mail@x.com", "name@x.com", "gone@x.com", "first@x.com"]);
  const people = [
    { email: "reg@x.com", name: "Reg One" },
    { email: "Mail@X.com", name: "Mail Two" },
    { email: "name@x.com", name: "Pat Q. Smith" },
    { email: "gone@x.com", name: "Gone Four" },
    { email: "first@x.com", name: "Kim" },
    { email: "new@x.com", name: "New Five" },
  ];
  const windowRegs = [
    { id: "r1", email: "reg@x.com", name: "Reg One" },
    { id: "r2", email: "gone@x.com", name: "Gone Four" },
    { id: "r3", email: "first@x.com", name: "Kim" },
  ];
  const attendance = [
    { registration_id: "r1", participant_email: null, participant_name: "iPhone" },
    { registration_id: null, participant_email: "mail@x.com", participant_name: "M" },
    { registration_id: null, participant_email: null, participant_name: "pat q smith" },
    { registration_id: null, participant_email: null, participant_name: "Kim" },
  ];
  // first@x.com registered as "Kim" only: a lone first name never matches.
  assertEquals([...dormantEmails(people, windowRegs, attendance, before)].sort(), ["first@x.com", "gone@x.com"]);
});

Deno.test("nobody registered only inside the window is dormant", () => {
  assertEquals(dormantEmails([{ email: "new@x.com", name: "New Person" }], [], [], new Set()).size, 0);
});
