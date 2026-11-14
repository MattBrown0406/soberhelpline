import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// The owner's notice that a family membership has actually been approved by
// PayPal. Before this, the only notice was sent when someone pressed the pay
// button ("Pending PayPal approval"), which reads like a finished sign-up even
// when the person never paid.
//
// Called from the two places a membership becomes active: the browser coming
// back from PayPal (paypal-subscriptions) and PayPal's own notice
// (paypal-webhook). Each caller sends it only when the row was not already
// active, so it normally arrives once.

const OWNER_ADDRESSES = ["matt@soberhelpline.com", "matt@freedominterventions.com"];

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export interface ApprovedMembershipRow {
  user_id: string;
  plan_type?: string | null;
  amount?: number | string | null;
}

/** Never throws: a failed notice must not affect the membership itself. */
export async function notifyMembershipApproved(
  admin: SupabaseClient,
  row: ApprovedMembershipRow,
  nextBillingTime?: string | null,
): Promise<void> {
  try {
    const apiKey = Deno.env.get("SENDGRID_API_KEY");
    if (!apiKey) {
      console.error("SENDGRID_API_KEY not configured, skipping membership approved notice");
      return;
    }

    const [{ data: profile }, { data: account }] = await Promise.all([
      admin.from("profiles").select("first_name, last_name").eq("id", row.user_id).maybeSingle(),
      admin.auth.admin.getUserById(row.user_id),
    ]);
    const name = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "Unknown";
    const email = account?.user?.email ?? "Unknown";
    const confirmed = !!account?.user?.email_confirmed_at;
    const price = row.amount != null && row.amount !== "" ? `$${Number(row.amount).toFixed(2)}` : "Unknown";
    const plan = row.plan_type === "annual" ? "annual" : "monthly";
    const firstPayment = nextBillingTime ? new Date(nextBillingTime) : null;
    const firstPaymentText = firstPayment && !Number.isNaN(firstPayment.getTime())
      ? firstPayment.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" })
      : null;

    const html = `<h2>Membership approved by PayPal</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Plan:</strong> ${plan}, ${price}</li>
        ${firstPaymentText ? `<li><strong>Next payment PayPal has scheduled:</strong> ${firstPaymentText}</li>` : ""}
        <li><strong>Status:</strong> Active. Member pages are open to this person.</li>
        <li><strong>Email address confirmed:</strong> ${confirmed ? "Yes" : "Not yet. They cannot sign in until they open the confirmation link that was emailed to them."}</li>
      </ul>`;

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: OWNER_ADDRESSES.map((address) => ({ email: address })) }],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
        subject: `Membership approved by PayPal: ${name}`,
        content: [{ type: "text/html", value: html }],
      }),
    });
    if (!response.ok) console.error(`membership approved notice failed [${response.status}]`);
  } catch (error) {
    console.error("membership approved notice error:", error instanceof Error ? error.message : error);
  }
}
