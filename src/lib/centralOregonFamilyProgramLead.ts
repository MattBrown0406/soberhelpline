import { supabase } from "@/integrations/supabase/client";

export interface CentralOregonLeadPayload {
  kind: "intake" | "seat-request" | "scholarship";
  name: string;
  email: string;
  phone: string;
  summary: Record<string, unknown>;
  consentEmailList?: boolean;
}

function formatLeadQuestion(kind: CentralOregonLeadPayload["kind"], summary: Record<string, unknown>) {
  return [
    `Central Oregon Family Program ${kind}`,
    "",
    ...Object.entries(summary).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value ?? "")}`),
  ].join("\n");
}

export async function submitCentralOregonLead(payload: CentralOregonLeadPayload) {
  const question = formatLeadQuestion(payload.kind, payload.summary);
  const meetingDate = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from("zoom_meeting_registrations").insert({
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    question,
    request_follow_up: true,
    consent_email_list: payload.consentEmailList ?? true,
    meeting_date: meetingDate,
    auto_register: false,
  });

  if (error) throw error;

  const [firstName, ...rest] = payload.name.trim().split(" ");
  void supabase.functions.invoke("add-to-mailchimp", {
    body: {
      email: payload.email.trim(),
      firstName: firstName || "",
      lastName: rest.join(" ") || "",
      tags: ["Central Oregon Family Program", `COFP-${payload.kind}`],
    },
  }).catch((err) => {
    console.error("Mailchimp sync failed for Central Oregon Family Program lead:", err);
  });
}
