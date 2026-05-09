import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-report-secret",
};

interface ConversionEvent {
  event_name: string;
  page_path: string | null;
  label: string | null;
  target_href: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const revenueIntentTerms = [
  "booking",
  "book",
  "consultation",
  "coaching",
  "intervention",
  "readiness",
  "freedom",
  "nme",
  "next_step",
  "phone",
  "call",
  "payment",
  "provider",
];

const readinessTerms = ["intervention", "readiness", "freedom_interventions", "nme_bridge_intervention"];

const increment = (map: Map<string, number>, key: string | null | undefined) => {
  const clean = typeof key === "string" && key.trim().length > 0 ? key.trim() : "unknown";
  map.set(clean, (map.get(clean) || 0) + 1);
};

const toTopList = (map: Map<string, number>) =>
  [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

const includesAny = (value: string, terms: string[]) => {
  const lower = value.toLowerCase();
  return terms.some((term) => lower.includes(term));
};

const metadataValue = (metadata: Record<string, unknown> | null, keys: string[]) => {
  if (!metadata) return null;

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }

  return null;
};

const eventDestination = (event: ConversionEvent) =>
  event.target_href ||
  event.label ||
  metadataValue(event.metadata, ["destination", "cta", "revenue_path", "next_step", "href", "target"]) ||
  null;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reportSecret = Deno.env.get("SOBER_HELPLINE_REPORT_SECRET");
    const providedSecret = req.headers.get("x-report-secret");

    if (!reportSecret || providedSecret !== reportSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const since = new Date();
    since.setDate(since.getDate() - 30);
    const sinceIso = since.toISOString();

    const [eventsResult, registrationsResult, followupsResult] = await Promise.all([
      supabase
        .from("conversion_events")
        .select("event_name,page_path,label,target_href,metadata,created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(5000),
      supabase
        .from("zoom_meeting_registrations")
        .select("id,created_at", { count: "exact", head: true })
        .gte("created_at", sinceIso),
      supabase
        .from("family_squares_followup_queue")
        .select("id,created_at", { count: "exact", head: true })
        .gte("created_at", sinceIso),
    ]);

    if (eventsResult.error) throw eventsResult.error;
    if (registrationsResult.error) throw registrationsResult.error;

    const events = (eventsResult.data ?? []) as ConversionEvent[];
    const byEvent = new Map<string, number>();
    const topPages = new Map<string, number>();
    const topDestinations = new Map<string, number>();
    let pageViews = 0;
    let revenueIntentClicks = 0;
    let consultationRequests = 0;
    let interventionReadinessClicks = 0;
    let answerPageViews = 0;
    let answerPageClicks = 0;
    let answerFamilySquaresClicks = 0;
    let answerCoachingClicks = 0;
    let answerInterventionClicks = 0;
    const answerPages = new Map<string, { views: number; clicks: number }>();

    const incrementAnswer = (slug: string, key: "views" | "clicks") => {
      const clean = slug.trim() || "unknown";
      const current = answerPages.get(clean) || { views: 0, clicks: 0 };
      current[key] += 1;
      answerPages.set(clean, current);
    };

    events.forEach((event) => {
      const eventName = event.event_name || "unknown";
      const destination = eventDestination(event);
      const answerSlug =
        metadataValue(event.metadata, ["answer_slug"]) ||
        event.page_path?.split("/").filter(Boolean).pop() ||
        "unknown";
      const intentText = [
        eventName,
        event.page_path,
        event.label,
        event.target_href,
        destination,
        metadataValue(event.metadata, ["source", "revenue_path", "next_step"]),
      ].filter(Boolean).join(" ");

      increment(byEvent, eventName);
      increment(topPages, event.page_path || metadataValue(event.metadata, ["page_path", "current_path", "path"]));
      increment(topDestinations, destination);

      if (eventName === "page_view") pageViews += 1;
      if (includesAny(intentText, revenueIntentTerms)) revenueIntentClicks += 1;
      if (includesAny(intentText, ["book", "booking", "consultation", "coaching"])) consultationRequests += 1;
      if (includesAny(intentText, readinessTerms)) interventionReadinessClicks += 1;

      if (eventName === "family_answer_view") {
        answerPageViews += 1;
        incrementAnswer(answerSlug, "views");
      }

      if (eventName === "family_answer_click" || eventName === "family_answer_hub_click") {
        answerPageClicks += 1;
        incrementAnswer(answerSlug, "clicks");
      }

      if (eventName === "family_answer_click" && includesAny(intentText, ["family-squares", "family_squares"])) answerFamilySquaresClicks += 1;
      if (eventName === "family_answer_click" && includesAny(intentText, ["book-consultation", "coaching", "private"])) answerCoachingClicks += 1;
      if (eventName === "family_answer_click" && includesAny(intentText, ["intervention-help", "intervention_readiness", "readiness"])) answerInterventionClicks += 1;
    });

    const topAnswerPages = [...answerPages.entries()]
      .map(([slug, counts]) => ({ slug, ...counts }))
      .sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
      .slice(0, 10);

    const response = {
      window_days: 30,
      totals: {
        events: events.length,
        page_views: pageViews,
        revenue_intent_clicks: revenueIntentClicks,
        consultation_requests: consultationRequests,
        intervention_readiness_clicks: interventionReadinessClicks,
        advertiser_inquiries: 0,
        registrations: registrationsResult.count || 0,
        family_followups_queued: followupsResult.error ? 0 : followupsResult.count || 0,
        answer_page_views: answerPageViews,
        answer_page_clicks: answerPageClicks,
        answer_family_squares_clicks: answerFamilySquaresClicks,
        answer_coaching_clicks: answerCoachingClicks,
        answer_intervention_clicks: answerInterventionClicks,
      },
      by_event: toTopList(byEvent),
      top_pages: toTopList(topPages),
      top_destinations: toTopList(topDestinations),
      top_answer_pages: topAnswerPages,
      owner_email_summary: {
        headline: "Sober Helpline answer-engine funnel",
        answer_metrics: [
          { label: "Answer page views", value: answerPageViews },
          { label: "Answer page clicks", value: answerPageClicks },
          { label: "Family Squares clicks from answers", value: answerFamilySquaresClicks },
          { label: "Coaching clicks from answers", value: answerCoachingClicks },
          { label: "Intervention clicks from answers", value: answerInterventionClicks },
        ],
        top_answer_pages: topAnswerPages.slice(0, 5),
        recommended_action:
          topAnswerPages.length > 0
            ? `Feature ${topAnswerPages[0].slug} on the homepage and Start Here page this week.`
            : "Let answer-page traffic accumulate, then feature the highest-view/highest-click answer on the homepage.",
      },
      latest_events: events.slice(0, 25).map((event) => ({
        event_name: event.event_name,
        page_path: event.page_path,
        destination: eventDestination(event),
        created_at: event.created_at,
      })),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("sober-helpline-revenue-report error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
