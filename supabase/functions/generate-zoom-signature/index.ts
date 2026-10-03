import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function base64url(source: ArrayBuffer | Uint8Array): string {
  let str = "";
  const bytes = new Uint8Array(source);
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function generateSignature(sdkKey: string, sdkSecret: string, meetingNumber: string, role: number): Promise<string> {
  const iat = Math.round(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sdkKey,
    appKey: sdkKey,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp,
  };

  const encodedHeader = base64url(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const message = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sdkSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const encodedSignature = base64url(signature);

  return `${message}.${encodedSignature}`;
}

// deno-lint-ignore no-explicit-any
type AdminClient = any;

/**
 * Who may join as host (role 1): an admin, or the consultation provider whose
 * booking this meeting belongs to (providers host their own sessions from the
 * provider dashboard; those meetings don't start without a host).
 */
async function mayHost(adminClient: AdminClient, userId: string, meetingNumber: unknown): Promise<boolean> {
  const { data: isAdmin } = await adminClient.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (isAdmin === true) return true;

  const meetingId = String(meetingNumber ?? "").replace(/\D/g, "");
  if (!meetingId) return false;
  const { data: providers } = await adminClient
    .from("consultation_providers")
    .select("id")
    .eq("user_id", userId);
  const providerIds = ((providers ?? []) as { id: string }[]).map((p) => p.id);
  if (providerIds.length === 0) return false;
  const { data: bookings } = await adminClient
    .from("consultation_bookings")
    .select("id")
    .eq("zoom_meeting_id", meetingId)
    .in("provider_id", providerIds)
    .limit(1);
  return (bookings ?? []).length > 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const body = await req.json();
    const { meetingNumber, role = 0, guestEmail, guestName } = body ?? {};
    const normalizedRole = Number(role);

    if (![0, 1].includes(normalizedRole)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let emailToCheck: string | undefined;
    let nameToCheck: string | undefined;
    // Host (role 1) only for admins and the meeting's consultation provider;
    // everyone else joins as an attendee.
    let grantedRole = 0;

    // Try to resolve a real signed-in user first
    if (authHeader?.startsWith("Bearer ")) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );

      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
      // The public anon key is a valid JWT too, so a host request needs a real
      // user (sub), not just valid claims.
      const userId = claimsError ? undefined : claimsData?.claims?.sub as string | undefined;

      if (normalizedRole === 1 && !userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (normalizedRole === 1 && userId) {
        grantedRole = (await mayHost(adminClient, userId, meetingNumber)) ? 1 : 0;
        if (grantedRole === 0) console.warn("generate-zoom-signature: host role refused; joining as attendee");
      }

      emailToCheck = claimsData?.claims?.email as string | undefined;
    } else if (normalizedRole === 1) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For guests (no auth user), use the email/name they typed on the join page
    if (!emailToCheck && typeof guestEmail === "string") {
      emailToCheck = guestEmail.trim();
    }
    if (typeof guestName === "string") {
      nameToCheck = guestName.trim();
    }

    if (emailToCheck || nameToCheck) {
      const { data: blockedFlag } = await adminClient.rpc("is_meeting_blocked", {
        _email: emailToCheck ?? "",
        _name: nameToCheck ?? "",
      });

      if (blockedFlag === true) {
        console.warn(`Blocked SDK signature request: email=${emailToCheck} name=${nameToCheck}`);
        return new Response(JSON.stringify({ error: "You are not able to join this meeting. Please contact matt@soberhelpline.com." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }


    if (!meetingNumber) {
      return new Response(JSON.stringify({ error: "meetingNumber is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sdkKey = Deno.env.get("ZOOM_MEETING_SDK_KEY");
    const sdkSecret = Deno.env.get("ZOOM_MEETING_SDK_SECRET");

    if (!sdkKey || !sdkSecret) {
      console.error("ZOOM_MEETING_SDK_KEY or ZOOM_MEETING_SDK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Zoom SDK credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signature = await generateSignature(sdkKey, sdkSecret, String(meetingNumber), grantedRole);

    return new Response(JSON.stringify({ signature, sdkKey, role: grantedRole }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating Zoom signature:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
