// Shared helper to enqueue events to the spine_outbox table.
// Forwarding errors must NEVER block the caller's user flow — callers should
// already be wrapping this in try/catch, but we also swallow internally as
// a defense-in-depth measure.

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export type SpineEventName =
  | "assessment_completed"
  | "session_booked"
  | "payment"
  | "contract_sent"
  | "contract_signed"
  | "cart_abandoned"
  | "lead_captured"
  | "checklist_downloaded";

export interface SpineUtm {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  term?: string | null;
  content?: string | null;
}

export interface SpinePayment {
  processor: string;
  amount_cents: number;
  kind: string;
}

export interface SpinePayload {
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  property: "soberhelpline";
  utm?: SpineUtm | null;
  props?: Record<string, unknown>;
  payment?: SpinePayment;
}

let cachedClient: SupabaseClient | null = null;
function getServiceClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  cachedClient = createClient(url, key);
  return cachedClient;
}

/**
 * Enqueue a single event to spine_outbox. Returns true on success, false otherwise.
 * Never throws — failures are logged but do not propagate.
 */
export async function enqueueSpineEvent(
  event_name: SpineEventName,
  payload: Omit<SpinePayload, "property"> & { property?: "soberhelpline" },
  client?: SupabaseClient,
): Promise<boolean> {
  try {
    const supabase = client ?? getServiceClient();
    if (!supabase) {
      console.error("[spine] no supabase client available");
      return false;
    }
    const fullPayload: SpinePayload = { property: "soberhelpline", ...payload };
    const { error } = await supabase.from("spine_outbox").insert({
      event_name,
      payload: fullPayload,
    });
    if (error) {
      console.error("[spine] enqueue failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[spine] enqueue exception:", err instanceof Error ? err.message : err);
    return false;
  }
}

/** Convenience: pull utm_* fields from an arbitrary object. */
export function extractUtm(src: Record<string, any> | null | undefined): SpineUtm | null {
  if (!src) return null;
  const utm: SpineUtm = {
    source: src.utm_source ?? src.utmSource ?? null,
    medium: src.utm_medium ?? src.utmMedium ?? null,
    campaign: src.utm_campaign ?? src.utmCampaign ?? null,
    term: src.utm_term ?? src.utmTerm ?? null,
    content: src.utm_content ?? src.utmContent ?? null,
  };
  const hasAny = Object.values(utm).some((v) => v !== null && v !== undefined && v !== "");
  return hasAny ? utm : null;
}
