type ConversionEventName =
  | "coaching_click"
  | "monday_zoom_click"
  | "monday_zoom_registration_submit"
  | "intervention_readiness_click"
  | "freedom_interventions_click"
  | "phone_click"
  | "booking_provider_selected"
  | "booking_step_continue"
  | "booking_payment_start";

type ConversionEventPayload = {
  label?: string;
  path?: string;
  value?: number;
  planType?: string | null;
  providerName?: string | null;
  source?: string;
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

export const trackConversionEvent = (eventName: ConversionEventName, payload: ConversionEventPayload = {}) => {
  if (typeof window === "undefined") return;
  const inboundSource = getStoredInboundSource();

  const eventPayload = {
    event_category: "family_funnel",
    event_label: payload.label || payload.source || eventName,
    page_path: payload.path || window.location.pathname,
    ...inboundSource,
    ...payload,
  };

  window.gtag?.("event", eventName, eventPayload);
  window.plausible?.(eventName, { props: eventPayload });
  window.dataLayer?.push({ event: eventName, ...eventPayload });

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
