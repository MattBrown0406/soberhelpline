export type RegistrationSource = "kiosk" | "automatic" | "app" | "unknown";

export interface SourceRecord {
  registration_source?: string | null;
}

/** Per-registration attribution, never identity, consent, or authorization.
 * The legacy migration backfilled every existing row with 'website', and
 * automatic writers also omit this field. That default is NOT website evidence.
 * 'app' rows are written only by the app-family-squares-sync function (RSVPs
 * and questions from the Sober Helpline app).
 * Do not infer source from dates, email matches, auto_register, or device data.
 */
export function registrationSource(record: SourceRecord): RegistrationSource {
  if (record.registration_source === "kiosk") return "kiosk";
  if (record.registration_source === "automatic") return "automatic";
  if (record.registration_source === "app") return "app";
  return "unknown";
}

export const registrationSourceLabels: Record<RegistrationSource, string> = {
  kiosk: "Kiosk",
  automatic: "Automatic",
  app: "App",
  unknown: "Unknown",
};
