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

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "event", eventName: string, params?: Record<string, unknown>) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

const STORAGE_KEY = "soberhelpline_conversion_events";

export const trackConversionEvent = (eventName: ConversionEventName, payload: ConversionEventPayload = {}) => {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event_category: "family_funnel",
    event_label: payload.label || payload.source || eventName,
    page_path: payload.path || window.location.pathname,
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
