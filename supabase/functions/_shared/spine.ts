// Spine hub retired. This helper is kept as a no-op so existing callers
// (lead-magnet-signup, process-consultation-booking, public-register-monday-zoom)
// continue to build and run without change. Events are no longer forwarded.

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

/** No-op: spine hub retired. Always returns true so callers treat it as success. */
export async function enqueueSpineEvent(
  _event_name: SpineEventName,
  _payload: Omit<SpinePayload, "property"> & { property?: "soberhelpline" },
): Promise<boolean> {
  return true;
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
