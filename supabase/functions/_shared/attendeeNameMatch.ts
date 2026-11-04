// Matching a Zoom display name to a registrant when the exact checks (registration,
// email, full name) found nobody. Zoom names and registration names often differ:
// "Sara" registers and joins as "Sara Vaday", "Kim Grady" joins as "Kim G",
// "Johnna MauriceTefft" joins as "johnna maurice". A loose match counts only when
// exactly one registrant fits, so a common first name never picks the wrong person.

/** Lower-case words, parentheses and punctuation dropped, emails ignored. */
export const nameWords = (value: unknown): string[] => {
  if (typeof value !== "string" || value.includes("@")) return [];
  return value.toLowerCase().replace(/\(.*?\)/g, " ").replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/).filter(Boolean);
};

const emailLetters = (email: string): string =>
  email.slice(0, Math.max(0, email.indexOf("@"))).replace(/[^a-z]/g, "");

/** "g" fits "grady", "maurice" fits "mauricetefft". */
const lastNamesFit = (a: string, b: string): boolean =>
  a.startsWith(b) || b.startsWith(a);

/**
 * How well one registration (name + email) fits a Zoom name.
 * "strong": same first name and fitting last names, or a first-name-only
 * registration whose email spells out the Zoom surname. "weak": same first name
 * and nothing contradicts it. "none": anything else.
 */
export function nameFit(regName: unknown, regEmail: string, zoomName: unknown): "strong" | "weak" | "none" {
  const r = nameWords(regName);
  const z = nameWords(zoomName);
  if (r.length === 0 || z.length === 0 || r[0] !== z[0]) return "none";
  const rLast = r.length > 1 ? r[r.length - 1] : "";
  const zLast = z.length > 1 ? z[z.length - 1] : "";
  if (rLast && zLast) return lastNamesFit(rLast, zLast) ? "strong" : "none";
  const surname = rLast || zLast;
  const letters = emailLetters(regEmail);
  if (surname.length >= 3 && letters.includes(surname.slice(0, 4))) return "strong";
  return "weak";
}

export interface Candidate { names: string[]; emails: string[] }

/**
 * The one candidate that fits zoomName, or undefined. A strong fit wins when it is
 * the only strong one; a weak fit counts only when it is the only fit of any kind
 * and allowWeak is true (the caller checks that no other attendee shares the name).
 */
export function looseMatch<T extends Candidate>(candidates: T[], zoomName: unknown, allowWeak: boolean): T | undefined {
  const strong: T[] = [];
  const weak: T[] = [];
  for (const c of candidates) {
    let best: "strong" | "weak" | "none" = "none";
    for (const n of c.names.length ? c.names : [""]) {
      for (const e of c.emails.length ? c.emails : [""]) {
        const fit = nameFit(n, e, zoomName);
        if (fit === "strong") best = "strong";
        else if (fit === "weak" && best === "none") best = "weak";
      }
    }
    if (best === "strong") strong.push(c);
    else if (best === "weak") weak.push(c);
  }
  if (strong.length === 1) return strong[0];
  if (strong.length === 0 && weak.length === 1 && allowWeak) return weak[0];
  return undefined;
}

/** First word of a display name, for checking that no other attendee shares it. */
export const firstWord = (value: unknown): string => nameWords(value)[0] ?? "";
