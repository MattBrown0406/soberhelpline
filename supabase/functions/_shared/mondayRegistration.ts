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
