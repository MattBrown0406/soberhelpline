// The "stop weekly registration" link in emails to people who are registered
// for Family Squares automatically each week.
//
// The link carries the registration id and a signature made with a server
// secret, so only someone holding the email can use it and nobody can stop
// another person's registration by guessing an id.

const PURPOSE = "stop-auto-registration:v1:";
const SITE = "https://soberhelpline.com";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function sign(registrationId: string): Promise<string | null> {
  const secret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
  if (!secret || !UUID.test(registrationId)) return null;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(PURPOSE + registrationId.toLowerCase()));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** The link for one registration, or null when it cannot be made (no secret configured). */
export async function stopAutoRegistrationUrl(registrationId: string): Promise<string | null> {
  const token = await sign(registrationId);
  return token ? `${SITE}/stop-weekly-registration?rid=${encodeURIComponent(registrationId)}&t=${token}` : null;
}

/** Whether a link's signature is the one this server made for that registration. */
export async function isValidStopToken(registrationId: unknown, token: unknown): Promise<boolean> {
  if (typeof registrationId !== "string" || typeof token !== "string" || !/^[0-9a-f]{64}$/.test(token)) return false;
  const expected = await sign(registrationId);
  if (!expected) return false;
  // Constant-time comparison.
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return difference === 0;
}
