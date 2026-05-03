import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AttributionPayload {
  fromNme?: boolean;
  pagePath?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char] || char));

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const scoreRegistration = (registration: {
  phone?: string | null;
  question?: string | null;
  request_follow_up?: boolean | null;
  auto_register?: boolean | null;
}, attribution: AttributionPayload) => {
  const question = (registration.question || "").toLowerCase();
  const reasons: string[] = [];
  let score = 10;

  if (registration.request_follow_up) {
    score += 30;
    reasons.push("requested private follow-up");
  }

  if (registration.phone) {
    score += 10;
    reasons.push("shared phone number");
  }

  if (registration.auto_register) {
    score += 5;
    reasons.push("wants recurring meeting reminders");
  }

  if (attribution.fromNme || attribution.utmSource === "nomoreenabling") {
    score += 10;
    reasons.push("came from No More Enabling");
  }

  const interventionTerms = ["intervention", "refuses", "refusing", "treatment", "rehab", "detox", "fentanyl", "meth", "overdose", "unsafe", "violence", "violent", "suicide", "911"];
  const coachingTerms = ["relapse", "boundary", "boundaries", "enabling", "adult child", "spouse", "husband", "wife", "money", "rent", "stealing", "lying"];

  if (interventionTerms.some((term) => question.includes(term))) {
    score += 30;
    reasons.push("intervention or treatment-readiness language");
  }

  if (coachingTerms.some((term) => question.includes(term))) {
    score += 15;
    reasons.push("coaching-fit family pattern language");
  }

  if (question.length > 180) {
    score += 10;
    reasons.push("detailed question");
  }

  const leadTier = score >= 70 ? "intervention_priority" : score >= 45 ? "coaching_likely" : "support_nurture";
  const revenuePath =
    leadTier === "intervention_priority"
      ? "family_readiness_intensive"
      : leadTier === "coaching_likely"
        ? "crisis_coaching"
        : "family_membership";
  const nextRevenueAction =
    leadTier === "intervention_priority"
      ? "call_and_offer_readiness"
      : leadTier === "coaching_likely"
        ? "offer_coaching"
        : "invite_back_and_membership";

  return {
    leadScore: Math.min(score, 100),
    leadTier,
    revenuePath,
    nextRevenueAction,
    leadReasons: reasons.length ? reasons : ["free support registrant"],
  };
};

const buildFollowups = (registration: { id: string; name: string; email: string }, scoring: ReturnType<typeof scoreRegistration>) => {
  const firstName = escapeHtml((registration.name || "").trim().split(/\s+/)[0] || "there");
  const baseUrl = "https://soberhelpline.com";

  const pathCta =
    scoring.revenuePath === "family_readiness_intensive"
      ? { label: "Review the Family Readiness Intensive", url: `${baseUrl}/family-readiness-intensive`, copy: "If treatment refusal, relapse, or safety risk is the real issue, the next step may need more structure than the free room can provide." }
      : scoring.revenuePath === "crisis_coaching"
        ? { label: "Book a private coaching session", url: `${baseUrl}/book-consultation?plan=emergency`, copy: "If your family needs a specific plan for this week, a private session is the simplest paid next step." }
        : { label: "See the family membership", url: `${baseUrl}/family-membership`, copy: "If the free meeting helped, membership gives you recordings, education, tools, and a place to keep working between Mondays." };

  return [
    {
      registration_id: registration.id,
      email: registration.email,
      name: registration.name,
      lead_tier: scoring.leadTier,
      revenue_path: scoring.revenuePath,
      sequence_step: 1,
      subject: "After Family Squares: choose one next step",
      scheduled_for: addDays(1),
      body_html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1f2937; line-height: 1.65;">
          <p>Hi ${firstName},</p>
          <p>Thanks for registering for <strong>Family Squares</strong>. The goal is not to pressure your family into a big decision. It is to help you stop carrying the situation alone.</p>
          <p>A simple next step: write down the one question you most want answered before the next family conversation. Bring that into the meeting, or reply to this email if it feels more private.</p>
          <p>${pathCta.copy}</p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${pathCta.url}" style="background: #166534; color: white; padding: 13px 22px; border-radius: 8px; text-decoration: none; font-weight: bold;">${pathCta.label}</a>
          </p>
          <p>With you in this,<br>Matt Brown<br>Sober Helpline</p>
        </div>
      `,
    },
    {
      registration_id: registration.id,
      email: registration.email,
      name: registration.name,
      lead_tier: scoring.leadTier,
      revenue_path: scoring.revenuePath,
      sequence_step: 2,
      subject: "When the free meeting is not enough",
      scheduled_for: addDays(3),
      body_html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1f2937; line-height: 1.65;">
          <p>Hi ${firstName},</p>
          <p>Sometimes Family Squares is enough for the week. Sometimes it shows the family that the situation needs a more direct plan.</p>
          <p>Here is the filter I use: if the problem is urgent, private, unsafe, or stuck in treatment refusal, do not wait for the perfect moment. Get help sorting the next move.</p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${baseUrl}/family-squares-next-step" style="background: #1d4ed8; color: white; padding: 13px 22px; border-radius: 8px; text-decoration: none; font-weight: bold;">Pick the right support level</a>
          </p>
          <p>With you in this,<br>Matt Brown<br>Sober Helpline</p>
        </div>
      `,
    },
    {
      registration_id: registration.id,
      email: registration.email,
      name: registration.name,
      lead_tier: scoring.leadTier,
      revenue_path: scoring.revenuePath,
      sequence_step: 3,
      subject: "Keep the family from sliding back into the old pattern",
      scheduled_for: addDays(7),
      body_html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1f2937; line-height: 1.65;">
          <p>Hi ${firstName},</p>
          <p>A meeting can give relief. A plan is what keeps the family from sliding back into the same rescue, argument, silence, or panic.</p>
          <p>The revenue ladder on Sober Helpline is also a support ladder: free meeting, membership, private coaching, structured stabilization, and readiness work when intervention may be needed.</p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${baseUrl}/family-squares-next-step" style="background: #166534; color: white; padding: 13px 22px; border-radius: 8px; text-decoration: none; font-weight: bold;">See the next-step ladder</a>
          </p>
          <p>With you in this,<br>Matt Brown<br>Sober Helpline</p>
        </div>
      `,
    },
  ];
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registration_id, attribution = {} } = await req.json();
    if (!registration_id) {
      return new Response(JSON.stringify({ error: "registration_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: registration, error: registrationError } = await supabase
      .from("zoom_meeting_registrations")
      .select("id, name, email, phone, question, request_follow_up, auto_register")
      .eq("id", registration_id)
      .single();

    if (registrationError || !registration) throw registrationError || new Error("Registration not found");

    const scoring = scoreRegistration(registration, attribution as AttributionPayload);
    const followups = buildFollowups(registration, scoring);

    const { error: updateError } = await supabase
      .from("zoom_meeting_registrations")
      .update({
        lead_score: scoring.leadScore,
        lead_tier: scoring.leadTier,
        revenue_path: scoring.revenuePath,
        lead_reasons: scoring.leadReasons,
        nme_attributed: Boolean((attribution as AttributionPayload).fromNme || (attribution as AttributionPayload).utmSource === "nomoreenabling"),
        next_revenue_action: scoring.nextRevenueAction,
        followup_sequence_status: "queued",
        next_followup_at: followups[0].scheduled_for,
      })
      .eq("id", registration_id);

    if (updateError) throw updateError;

    const { error: queueError } = await supabase
      .from("family_squares_followup_queue")
      .upsert(followups, { onConflict: "registration_id,sequence_step" });

    if (queueError) throw queueError;

    return new Response(JSON.stringify({ success: true, scoring, queued: followups.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("score-family-squares-registration error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
