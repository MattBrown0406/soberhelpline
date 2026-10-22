import { getSuppressedRecipients } from "../_shared/suppression.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validMeetingDate } from "../_shared/mondayRegistration.ts";

// Candidate only. Dedicated app controls and a verified event receipt are
// prerequisites, not installed by the existing sender-only migration.
const REVISION = "monday-app-owner-v1";
const LEDGER_REVISION = "monday-ledger-disabled-v1";
const OWNER = "matt@soberhelpline.com";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
}[character] ?? character));

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return json({});
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const secret = Deno.env.get("MEMBERSHIP_SYNC_SECRET");
  // Hash before comparing to avoid a secret-length-dependent comparison.
  const provided = req.headers.get("x-membership-sync-secret") ?? "";
  if (!secret) return json({ error: "not_configured" }, 503);
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  const [a, b] = await Promise.all([digest(secret), digest(provided)]);
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a[i] ^ b[i];
  if (!provided || mismatch !== 0) return json({ error: "unauthorized" }, 401);

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 2048) return json({ error: "payload_too_large" }, 413);
    body = JSON.parse(raw);
  } catch { return json({ error: "invalid_json" }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "invalid_event" }, 400);
  const input = body as Record<string, unknown>;
  if (Object.keys(input).some(key => key !== "event_id") || typeof input.event_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.event_id)) {
    return json({ error: "invalid_event" }, 400);
  }

  let token: string | null = null;
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("configuration");
    const admin = createClient(url, serviceKey);
    // The website sender's activation must never implicitly enable app mail.
    const { data: control, error: controlError } = await admin.rpc("monday_app_owner_notification_status", { _revision: REVISION });
    if (controlError || !control || control.revision !== REVISION || typeof control.enabled !== "boolean") throw new Error("app_control");
    if (!control.enabled) return json({ success: false, notificationDisabled: true });
    const { data: ledger, error: ledgerError } = await admin.rpc("monday_notification_status", {
      _revision: LEDGER_REVISION, _acknowledge: false,
    });
    if (ledgerError || !ledger || ledger.revision !== LEDGER_REVISION || typeof ledger.enabled !== "boolean") throw new Error("ledger_control");
    if (!ledger.enabled) return json({ success: false, notificationDisabled: true });

    // This future read-only RPC must return a persisted verified RSVP event,
    // bound to its successful insert. It must never infer an event from a batch
    // snapshot, created_at alone, ensure-registration, or caller identity fields.
    const { data: target, error: targetError } = await admin.rpc("monday_app_rsvp_notification_target", { _event_id: input.event_id });
    if (targetError) throw new Error("event_receipt");
    if (!target) return json({ success: false, status: "not_eligible" });
    if (target.event_kind !== "new_app_registration" || target.rsvp !== "going" ||
        target.is_new_registration !== true || target.registration_source !== "app") {
      return json({ success: false, status: "not_eligible" });
    }
    if (typeof target.registration_id !== "string" || typeof target.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target.email) || target.email.length > 254 ||
        typeof target.name !== "string" || !target.name.trim() || target.name.length > 120 ||
        typeof target.question !== "string" || target.question.length > 10000 || !validMeetingDate(target.meeting_date)) {
      throw new Error("invalid_receipt");
    }
    const { data: blocked, error: blockError } = await admin.rpc("is_meeting_blocked", {
      _email: target.email.trim().toLowerCase(), _name: target.name,
    });
    if (blockError || typeof blocked !== "boolean") throw new Error("blocklist");
    if (blocked) return json({ success: false, status: "suppressed" });
    const suppressed = await getSuppressedRecipients([OWNER]);
    if (suppressed.has(OWNER)) return json({ success: false, status: "suppressed" });
    const apiKey = Deno.env.get("SENDGRID_API_KEY");
    if (!apiKey) throw new Error("email_configuration");
    const html = `<h2>New “The Family Squares” Registration</h2><ul>
      <li><strong>Source:</strong> Sober Helpline App</li>
      <li><strong>Name:</strong> ${escapeHtml(target.name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(target.email)}</li>
      <li><strong>Meeting date:</strong> ${escapeHtml(target.meeting_date)}</li></ul>
      <h3>Submitted questions / comments</h3>
      <div style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(target.question || "No question or comment submitted.")}</div>`;
    const claim = await admin.rpc("claim_monday_notification", {
      _registration_id: target.registration_id, _email: target.email,
      _meeting_date: target.meeting_date, _kind: "owner",
    });
    if (claim.error) throw new Error("claim");
    if (claim.data === null) return json({ success: false, status: "held_or_previously_attempted" });
    if (typeof claim.data !== "string" || !claim.data) throw new Error("claim_result");
    token = claim.data;
    let accepted = false;
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: OWNER }] }],
          from: { email: OWNER, name: "Sober Helpline" },
          subject: `New App Registration — The Family Squares: ${target.name.replace(/[\r\n]/g, " ")}`,
          content: [{ type: "text/html", value: html }],
          tracking_settings: { subscription_tracking: { enable: true } },
        }),
      });
      accepted = response.ok && response.headers.get("x-email-suppressed") !== "true";
    } catch { /* Ambiguous provider outcomes retain their claim; never retry here. */ }
    const finish = await admin.rpc("finish_monday_notification", { _token: token, _accepted: accepted });
    if (finish.error || finish.data !== true) throw new Error("outcome");
    return json({ success: accepted, owner: accepted ? "accepted" : "failed_or_suppressed", reconciliationRequired: !accepted }, accepted ? 200 : 502);
  } catch {
    console.error("App owner notification unavailable; no automatic replay", { claimIssued: token !== null });
    return json({ success: false, error: "notification_unavailable", reconciliationRequired: token !== null }, 503);
  }
});