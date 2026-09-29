// Side-effect module: import it at the top of any function that sends via SendGrid.
// It filters every SendGrid send against public.email_suppression_list so opted-out
// addresses never receive email, regardless of how the calling function builds its list.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";
const g = globalThis as any;

if (!g.__suppressionPatched) {
  g.__suppressionPatched = true;
  const originalFetch = globalThis.fetch.bind(globalThis);
  let cache: { set: Set<string>; at: number } | null = null;

  const loadSuppressed = async (): Promise<Set<string>> => {
    if (cache && Date.now() - cache.at < 60_000) return cache.set;
    try {
      const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      const { data } = await sb.from("email_suppression_list").select("email");
      const set = new Set<string>((data || []).map((r: any) => String(r.email).trim().toLowerCase()));
      cache = { set, at: Date.now() };
      return set;
    } catch (e) {
      console.error("suppression list load failed", e);
      return cache?.set ?? new Set();
    }
  };

  globalThis.fetch = async (input: any, init?: any) => {
    const url = typeof input === "string" ? input : input?.url;
    if (url === SENDGRID_URL && init?.body && typeof init.body === "string") {
      try {
        const payload = JSON.parse(init.body);
        const suppressed = await loadSuppressed();
        const keep = (r: any) => !suppressed.has(String(r?.email || "").trim().toLowerCase());
        payload.personalizations = (payload.personalizations || [])
          .map((p: any) => ({
            ...p,
            to: (p.to || []).filter(keep),
            ...(p.cc ? { cc: p.cc.filter(keep) } : {}),
            ...(p.bcc ? { bcc: p.bcc.filter(keep) } : {}),
          }))
          .filter((p: any) => p.to.length > 0);
        if (payload.personalizations.length === 0) {
          console.log("SendGrid send skipped: all recipients suppressed");
          return new Response(null, { status: 202 });
        }
        payload.tracking_settings = {
          ...(payload.tracking_settings || {}),
          subscription_tracking: { enable: true },
        };
        init = { ...init, body: JSON.stringify(payload) };
      } catch (e) {
        console.error("suppression filter error", e);
      }
    }
    return originalFetch(input, init);
  };
}
