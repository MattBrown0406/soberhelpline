// Saving a seat and provider acceptance are separate outcomes. Never turn an
// email outage into a registration retry (which could duplicate other effects).
export async function notifyMondayRegistration(registrationId: string): Promise<boolean> {
  try {
    const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-zoom-registration-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ registration_id: registrationId }),
    });
    const result = await response.json().catch(() => null);
    const accepted = response.ok && result?.success === true && result?.suppressed !== true;
    if (!accepted) console.error("Monday notification requires reconciliation", {
      registration_id: registrationId, http_status: response.status,
    });
    return accepted;
  } catch {
    console.error("Monday notification transport failed; reconciliation required", { registration_id: registrationId });
    return false;
  }
}
