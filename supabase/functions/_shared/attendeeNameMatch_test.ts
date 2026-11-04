import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { looseMatch, nameFit } from "./attendeeNameMatch.ts";

Deno.test("first-name registration matches a full Zoom name when the email agrees", () => {
  assertEquals(nameFit("Sara", "sara.example@x.com", "Sara Example"), "strong");
  assertEquals(nameFit("Kim Example", "k@x.com", "Kim E"), "strong");
  assertEquals(nameFit("Jo ExampleSmith", "j@x.com", "jo example"), "strong");
  assertEquals(nameFit("Jo Example", "j@x.com", "Jo Other"), "none");
});

Deno.test("a weak first-name fit counts only when nobody else fits", () => {
  const a = { names: ["Pat"], emails: ["p1@x.com"] };
  const b = { names: ["Pat Other"], emails: ["p2@x.com"] };
  const c = { names: ["Pat"], emails: ["p3@x.com"] };
  assertEquals(looseMatch([a], "Pat Example", true), a);
  assertEquals(looseMatch([a], "Pat Example", false), undefined);
  assertEquals(looseMatch([a, b], "Pat Example", true), a);
  assertEquals(looseMatch([a, c], "Pat Example", true), undefined);
  assertEquals(looseMatch([a, b], "Pat O", true), b);
});
