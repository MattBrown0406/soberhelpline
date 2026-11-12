import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isValidStopToken } from "../_shared/stopAutoRegistration.ts";

// Lets a person stop their own weekly automatic registration for Family
// Squares from a link in the reminder email. Before this, only an admin could
// turn it off.
//
// Public endpoint: the signed link is the permission. It only ever clears the
// auto_register flag, for the address the link was sent to. Nothing is deleted
// and this week's registration stays in place.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Escapes LIKE wildcards so ilike() is a case-insensitive exact match. */
const exactPattern = (value: string) => value.trim().replace(/[\\%_]/g, "\\$&");

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  // Only a deliberate button press stops registration. Opening the link (or a
  // mail scanner fetching it) is a GET and changes nothing.
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null);
    const registrationId = body?.rid;
    if (!(await isValidStopToken(registrationId, body?.t))) return json({ error: "This link is not valid." }, 400);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: registration, error: lookupError } = await supabase
      .from("zoom_meeting_registrations").select("email").eq("id", registrationId).maybeSingle();
    if (lookupError) throw lookupError;
    const email = String((registration as { email: string | null } | null)?.email ?? "").trim();
    // The registration is gone: there is nothing left to stop.
    if (!email) return json({ ok: true, stopped: 0 });

    // The weekly job looks at every row that ever opted in, so all of this
    // address's rows are cleared, not just the one in the link. Rows are found
    // loosely (stray spaces, capitals) and then compared exactly here.
    const wanted = email.toLowerCase();
    const { data: candidates, error: findError } = await supabase
      .from("zoom_meeting_registrations")
      .select("id, email")
      .ilike("email", `%${exactPattern(email)}%`)
      .eq("auto_register", true);
    if (findError) throw findError;
    const ids = ((candidates ?? []) as { id: string; email: string | null }[])
      .filter((row) => String(row.email ?? "").trim().toLowerCase() === wanted)
      .map((row) => row.id);
    if (ids.length === 0) return json({ ok: true, stopped: 0 });

    const { data: cleared, error: updateError } = await supabase
      .from("zoom_meeting_registrations")
      .update({ auto_register: false })
      .in("id", ids)
      .eq("auto_register", true)
      .select("id");
    if (updateError) throw updateError;

    // A count only: no names or addresses leave this function.
    return json({ ok: true, stopped: (cleared ?? []).length });
  } catch (error: unknown) {
    console.error("stop-auto-registration error:", error instanceof Error ? error.message : error);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
