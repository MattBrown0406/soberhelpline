// Shared helpers for coaching-checkout HMAC token verification.
// Token format (compact, JWT-like):
//   base64url(headerJson).base64url(payloadJson).base64url(hmacSha256(header + "." + payload, SECRET))
//
// Payload shape (all fields required):
//   {
//     bref: string,        // app booking reference
//     aref: string,        // opaque app account reference
//     cents: 15000,        // MUST equal 15000
//     cur: "USD",          // MUST equal "USD"
//     svc: "plan_review_coaching",
//     nonce: string,       // unique per checkout, 16+ chars
//     exp: number          // unix seconds
//   }

export interface CoachingTokenPayload {
  bref: string;
  aref: string;
  cents: number;
  cur: string;
  svc: string;
  nonce: string;
  exp: number;
}

function b64urlDecode(input: string): Uint8Array {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}

export async function verifyCoachingToken(
  token: string,
  secret: string,
): Promise<{ ok: true; payload: CoachingTokenPayload } | { ok: false; reason: string }> {
  if (!secret) return { ok: false, reason: "bridge_secret_not_configured" };
  if (typeof token !== "string" || token.length < 20 || token.length > 4096) {
    return { ok: false, reason: "invalid_token_shape" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid_token_shape" };

  const [headerB64, payloadB64, sigB64] = parts;
  const expected = await hmacSha256(secret, `${headerB64}.${payloadB64}`);
  let provided: Uint8Array;
  try {
    provided = b64urlDecode(sigB64);
  } catch {
    return { ok: false, reason: "invalid_signature" };
  }
  if (!timingSafeEqual(expected, provided)) {
    return { ok: false, reason: "invalid_signature" };
  }

  let payload: CoachingTokenPayload;
  try {
    const json = new TextDecoder().decode(b64urlDecode(payloadB64));
    payload = JSON.parse(json);
  } catch {
    return { ok: false, reason: "invalid_payload" };
  }

  if (
    typeof payload.bref !== "string" || !payload.bref ||
    typeof payload.aref !== "string" || !payload.aref ||
    payload.cents !== 15000 ||
    payload.cur !== "USD" ||
    payload.svc !== "plan_review_coaching" ||
    typeof payload.nonce !== "string" || payload.nonce.length < 16 ||
    typeof payload.exp !== "number"
  ) {
    return { ok: false, reason: "invalid_payload" };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp <= nowSec) return { ok: false, reason: "token_expired" };
  // Sanity cap: token must not claim more than 24h validity from now.
  if (payload.exp - nowSec > 60 * 60 * 24) return { ok: false, reason: "token_ttl_too_long" };

  return { ok: true, payload };
}

export async function signBridgeCallback(
  secret: string,
  timestamp: string,
  nonce: string,
  bodyText: string,
): Promise<string> {
  const bodyHashBytes = new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bodyText)),
  );
  const bodyHashHex = Array.from(bodyHashBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const canonical = `${timestamp}.${nonce}.${bodyHashHex}`;
  const sig = await hmacSha256(secret, canonical);
  return b64urlEncode(sig);
}
