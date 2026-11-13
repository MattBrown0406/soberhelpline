// Text messages through Twilio, sent from the registered messaging service.
// Three function secrets are needed: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and
// TWILIO_MESSAGING_SERVICE_SID. Without all three nothing is sent.

/** site_settings key. Texting is off unless its value is exactly "true". */
export const SMS_ENABLED_SETTING = "family_squares_sms_enabled";

export const SMS_CONSENT_TEXT =
  "I agree to receive text message reminders from Sober Helpline about Family Squares at this number. " +
  "About one message per meeting. Message and data rates may apply. Reply STOP to cancel, HELP for help.";

export function smsConfigured(): boolean {
  return Boolean(
    Deno.env.get("TWILIO_ACCOUNT_SID") && Deno.env.get("TWILIO_AUTH_TOKEN") && Deno.env.get("TWILIO_MESSAGING_SERVICE_SID"),
  );
}

/** A US or Canadian mobile number as +1XXXXXXXXXX, or null if it is not one. */
export function normalizeNorthAmericanPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  // Area codes and exchanges never start with 0 or 1.
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? `+1${digits}` : null;
}

export interface SmsResult {
  ok: boolean;
  messageId?: string;
  /** The person has replied STOP: Twilio refuses to text them (error 21610). */
  optedOut?: boolean;
  error?: string;
}

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const serviceSid = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");
  if (!accountSid || !authToken || !serviceSid) return { ok: false, error: "texting is not configured" };

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, MessagingServiceSid: serviceSid, Body: body }).toString(),
  });
  const data = await response.json().catch(() => ({}));
  if (response.ok) return { ok: true, messageId: typeof data?.sid === "string" ? data.sid : undefined };
  return {
    ok: false,
    optedOut: data?.code === 21610,
    error: `Twilio error [${response.status}] ${data?.code ?? ""}`.trim(),
  };
}
