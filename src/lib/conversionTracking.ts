import { supabase } from "@/integrations/supabase/client";

type ConversionEventName =
  | "coaching_click"
  | "monday_zoom_click"
  | "monday_zoom_registration_view"
  | "monday_zoom_registration_submit"
  | "monday_zoom_registration_success"
  | "intervention_readiness_click"
  | "freedom_interventions_click"
  | "lead_magnet_signup"
  | "partner_page_click"
  | "phone_click"
  | "booking_provider_selected"
  | "booking_step_continue"
  | "booking_payment_start"
  | "nme_bridge_arrival"
  | "nme_bridge_family_squares_click"
  | "nme_bridge_lane_click"
  | "nme_bridge_coaching_click"
  | "nme_bridge_intervention_click"
  | "family_answer_view"
  | "family_answer_click"
  | "family_answer_hub_click"
  | "membership_trial_click"
  | "sober_helpline_app_store_click"
  | "kiosk_attract_view"
  | "kiosk_form_started"
  | "kiosk_registration_submit"
  | "kiosk_registration_success"
  | "kiosk_registration_failure"
  | "kiosk_app_qr_view"
  | "kiosk_offline_view"
  | "kiosk_help_view"
  | "kiosk_form_cleared"
  | "whatsapp_click";

type ConversionEventPayload = {
  label?: string;
  path?: string;
  value?: number;
  planType?: string | null;
  providerName?: string | null;
  source?: string;
  privacySafe?: boolean;
  [key: string]: string | number | boolean | null | undefined;
};

type StoredInboundSource = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  first_landing_path?: string;
  captured_at?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "event", eventName: string, params?: Record<string, unknown>) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

const STORAGE_KEY = "soberhelpline_conversion_events";
const SOURCE_STORAGE_KEY = "soberhelpline_inbound_source";

const getStoredInboundSource = (): StoredInboundSource => {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(window.localStorage.getItem(SOURCE_STORAGE_KEY) || "{}") as StoredInboundSource;
  } catch {
    return {};
  }
};

export const captureInboundSource = () => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const trackedParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
  const hasTrackedParams = trackedParams.some((key) => params.has(key));
  const existing = getStoredInboundSource();

  if (!hasTrackedParams && existing.captured_at) return;

  const nextSource: StoredInboundSource = {
    ...existing,
    referrer: existing.referrer || document.referrer || undefined,
    first_landing_path: existing.first_landing_path || window.location.pathname,
    captured_at: existing.captured_at || new Date().toISOString(),
  };

  trackedParams.forEach((key) => {
    const value = params.get(key);
    if (value) nextSource[key] = value;
  });

  try {
    window.localStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(nextSource));
  } catch {
    // Source capture should never interrupt someone seeking help.
  }
};

export const getInboundSource = () => getStoredInboundSource();

export const trackConversionEvent = (eventName: ConversionEventName, payload: ConversionEventPayload = {}) => {
  if (typeof window === "undefined") return;
  const { privacySafe = false, ...safePayload } = payload;
  const inboundSource = privacySafe ? {} : getStoredInboundSource();

  const eventPayload = {
    event_category: "family_funnel",
    event_label: safePayload.label || safePayload.source || eventName,
    page_path: safePayload.path || window.location.pathname,
    ...inboundSource,
    ...safePayload,
  };

  window.gtag?.("event", eventName, eventPayload);
  window.plausible?.(eventName, { props: eventPayload });
  window.dataLayer?.push({ event: eventName, ...eventPayload });

  void supabase.functions.invoke("track-conversion-event", {
    body: {
      event_name: eventName,
      page_path: eventPayload.page_path,
      page_title: document.title,
      source: eventPayload.source,
      label: eventPayload.event_label,
      target_href: safePayload.targetHref as string | undefined,
      utm_source: eventPayload.utm_source,
      utm_medium: eventPayload.utm_medium,
      utm_campaign: eventPayload.utm_campaign,
      utm_content: eventPayload.utm_content,
      utm_term: eventPayload.utm_term,
      referrer: privacySafe ? undefined : eventPayload.referrer || document.referrer || undefined,
      first_landing_path: eventPayload.first_landing_path,
      metadata: eventPayload,
    },
  }).catch(() => {
    // First-party measurement should never interrupt someone trying to get help.
  });

  if (privacySafe) return;

  try {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
    const nextEvents = [
      ...existing.slice(-49),
      {
        eventName,
        payload: eventPayload,
        timestamp: new Date().toISOString(),
      },
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
  } catch {
    // Tracking should never interrupt a family trying to get help.
  }
};

export const trackPhoneClick = (source: string) => {
  trackConversionEvent("phone_click", { source });
};

export const trackWhatsAppClick = (source: string) => {
  trackConversionEvent("whatsapp_click", { source });
};
