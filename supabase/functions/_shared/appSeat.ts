// One app member's Family Squares seat, for app-family-squares-sync's
// ensure-registration when the database helper ensure_monday_app_registration
// is not there. Pure: the function does the reading and the one insert.

/** Same rule as app-family-squares-sync's own normalizeEmail. */
const normalizeEmail = (value: unknown) => (typeof value === "string" ? value.trim().toLowerCase() : "");

/** True when any registration on file for that Monday (website or app) is hers. */
export function hasSeat(rows: ReadonlyArray<{ email?: unknown }>, email: string): boolean {
  const wanted = normalizeEmail(email);
  return wanted !== "" && rows.some((row) => normalizeEmail(row.email) === wanted);
}

/**
 * The row the 15-minute batch inserts for a new app attendee with no
 * questions. No question_items: the live table may not have that column (the
 * batch drops it there too). An app row gets no confirmation email, no
 * marketing, no lead scoring and no follow-ups.
 */
export function newAppSeatRow(email: string, name: string, meetingDate: string): Record<string, unknown> {
  return {
    user_id: null,
    name,
    email: normalizeEmail(email),
    phone: "",
    question: "",
    request_follow_up: false,
    consent_email_list: false,
    auto_register: false,
    meeting_date: meetingDate,
    language: "en",
    registration_source: "app",
    lead_reasons: ["Sober Helpline app RSVP"],
    next_revenue_action: "none",
    followup_sequence_status: "not_applicable",
  };
}
