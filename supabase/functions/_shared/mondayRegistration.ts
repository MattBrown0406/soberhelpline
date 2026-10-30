export const ALREADY_REGISTERED_MESSAGE = "You’re already registered. We look forward to seeing you Monday evening!";

/** Only this constraint represents a same-person, same-session replay. */
export function isRegistrationDuplicate(error: { code?: string; message?: string } | null): boolean {
  return error?.code === "23505" &&
    Boolean(error.message?.includes("zoom_registration_email_meeting_unique"));
}

export function duplicateRegistrationResponse() {
  // Never disclose an existing row ID, join link, question, or contact details.
  return {
    success: true,
    status: "already_registered",
    alreadyRegistered: true,
    message: ALREADY_REGISTERED_MESSAGE,
    registration: null,
    registrationId: null,
    emailSent: false,
  };
}

export function validMeetingDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date.getUTCDay() === 1;
}

/** Do not trust user_id supplied by a public form. */
export async function registrationUserId(
  req: Request,
  email: string,
  client: { auth: { getUser: (token: string) => Promise<{ data: { user: { id: string; email?: string } | null }; error: unknown }> } },
): Promise<string | null> {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const { data, error } = await client.auth.getUser(header.slice(7));
  return !error && data.user?.email?.trim().toLowerCase() === email ? data.user.id : null;
}

/** Conflict acceptance must outlive a stale app snapshot delete. The RPC
 * atomically promotes, or recreates if deletion won first; no replay effects. */
export async function ensureDurableRegistration(
  client: { rpc: (name: string, args: Record<string, string>) => PromiseLike<{ data: unknown; error: unknown }> },
  email: string, name: string, meetingDate: string,
): Promise<void> {
  const { data, error } = await client.rpc("ensure_monday_registration", {
    _email: email, _name: name, _meeting_date: meetingDate,
  });
  if (error || typeof data !== "boolean") throw error ?? new Error("Registration not secured");
}

/** PostgREST/Postgres codes for a function or column the live database lacks. */
export const missingSchema = (error: { code?: string } | null | undefined) =>
  !!error && ["PGRST202", "PGRST204", "42703", "42883"].includes(error.code ?? "");

const escapeLike = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);

type SeatRow = { id: string; name: string; email: string };
type Client = {
  rpc: (name: string, args: Record<string, unknown>) => PromiseLike<{ data: any; error: any }>;
  from: (table: string) => any;
};

/**
 * The live database has never had the Oct 12/22 registration migrations applied,
 * so register_monday_manual does not exist there and every website/kiosk signup
 * failed. Use the RPC when present; otherwise save the seat on the existing table,
 * treating a same-email row for that Monday as already registered.
 */
export async function registerMondayManual(
  client: Client,
  channel: "public" | "legacy" | "kiosk",
  registration: Record<string, unknown> & { email: string; meeting_date: string },
): Promise<{ already_registered: boolean; registration: SeatRow | null }> {
  const { data, error } = await client.rpc("register_monday_manual", { _channel: channel, _registration: registration });
  if (!missingSchema(error)) {
    if (error || !data || typeof data.already_registered !== "boolean") throw error ?? new Error("Registration not secured");
    return data;
  }
  const { data: existing, error: lookupError } = await client.from("zoom_meeting_registrations")
    .select("id, name, email").ilike("email", escapeLike(registration.email))
    .eq("meeting_date", registration.meeting_date).limit(1);
  if (lookupError) throw lookupError;
  if (existing?.length) return { already_registered: true, registration: existing[0] };
  const { data: inserted, error: insertError } = await client.from("zoom_meeting_registrations")
    .insert(registration).select("id, name, email").single();
  if (isRegistrationDuplicate(insertError)) return { already_registered: true, registration: null };
  if (insertError || !inserted) throw insertError ?? new Error("Registration not secured");
  return { already_registered: false, registration: inserted };
}

/** Same fallback for member questions when append_monday_registration_question is absent. */
export async function appendMondayQuestion(client: Client, email: string, meetingDate: string, question: string): Promise<boolean> {
  const { data, error } = await client.rpc("append_monday_registration_question", {
    _email: email, _meeting_date: meetingDate, _question: question,
  });
  if (!missingSchema(error)) {
    if (error) throw error;
    return data === true;
  }
  const { data: rows, error: lookupError } = await client.from("zoom_meeting_registrations")
    .select("id, question").ilike("email", escapeLike(email)).eq("meeting_date", meetingDate).limit(1);
  if (lookupError) throw lookupError;
  const row = rows?.[0];
  if (!row) return false;
  const current: string = row.question ?? "";
  if (current.split("\n").includes(question)) return true;
  const { error: updateError } = await client.from("zoom_meeting_registrations")
    .update({ question: current.trim() ? `${current.trimEnd()}\n${question}` : question }).eq("id", row.id);
  if (updateError) throw updateError;
  return true;
}
