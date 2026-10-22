// Side-effect module shared by SendGrid callers. Fail closed on lookup/parse
// failures; never reuse stale opt-out data or treat a capped page as exhaustive.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";
const g = globalThis as any;

export async function getSuppressedRecipients(emails: string[]): Promise<Set<string>> {
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const suppressed = new Set<string>();
  for (const email of new Set(emails.map(e => e.trim().toLowerCase()))) {
    if (!email) throw new Error("Invalid email recipient");
    // Surrounding legacy whitespace/case is tolerated; wildcard characters in
    // email identities must be escaped. Exact normalized comparison is below.
    const pattern = `%${email.replace(/[\\%_]/g, "\\$&")}%`;
    let after: string | null = null;
    while (true) {
      let query = sb.from("email_suppression_list").select("id, email")
        .ilike("email", pattern).order("id").limit(500);
      if (after !== null) query = query.gt("id", after);
      const { data, error } = await query;
      if (error || !Array.isArray(data)) throw new Error("Suppression lookup unavailable");
      if (data.length === 0) break;
      if (data.some(row => typeof row.email !== "string" || typeof row.id !== "string")) {
        throw new Error("Invalid suppression lookup response");
      }
      if (data.some(row => row.email.trim().toLowerCase() === email)) {
        suppressed.add(email);
        break;
      }
      const next = data[data.length - 1].id;
      if (after !== null && next <= after) throw new Error("Suppression pagination did not advance");
      after = next;
    }
  }
  return suppressed;
}

if (!g.__suppressionPatched) {
  g.__suppressionPatched = true;
  const originalFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async (input: any, init?: any) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input?.url;
    if (url !== SENDGRID_URL) return originalFetch(input, init);
    try {
      const body = init?.body ?? (input instanceof Request ? await input.clone().text() : null);
      if (typeof body !== "string") throw new Error("Unsupported email payload");
      const payload = JSON.parse(body);
      if (!Array.isArray(payload.personalizations) || payload.personalizations.length === 0) {
        throw new Error("Invalid email personalizations");
      }
      const recipients = payload.personalizations.flatMap((p: any) => [...(p.to || []), ...(p.cc || []), ...(p.bcc || [])]);
      if (recipients.some((r: any) => typeof r?.email !== "string")) throw new Error("Invalid email recipient");
      const suppressed = await getSuppressedRecipients(recipients.map((r: any) => r.email));
      const keep = (r: any) => !suppressed.has(r.email.trim().toLowerCase());
      payload.personalizations = payload.personalizations.map((p: any) => ({
        ...p, to: (p.to || []).filter(keep),
        ...(p.cc ? { cc: p.cc.filter(keep) } : {}),
        ...(p.bcc ? { bcc: p.bcc.filter(keep) } : {}),
      })).filter((p: any) => p.to.length > 0);
      if (payload.personalizations.length === 0) {
        return new Response(null, { status: 202, headers: { "x-email-suppressed": "true" } });
      }
      payload.tracking_settings = {
        ...(payload.tracking_settings || {}), subscription_tracking: { enable: true },
      };
      init = { ...init, body: JSON.stringify(payload) };
    } catch {
      console.error("Email dispatch blocked: suppression check unavailable or payload invalid");
      return new Response(null, { status: 503, headers: { "x-email-suppression-error": "true" } });
    }
    return originalFetch(input, init);
  };
}
