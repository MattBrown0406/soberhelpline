import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTION_DB_ID = "2bb286dad2cf81499fc8d8151ee033a8";

// ── Helpers ──

function skipWeekends(date: Date, daysToAdd: number): string {
  const d = new Date(date);
  let added = 0;
  while (added < daysToAdd) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  // If daysToAdd is 0 and today is a weekend, advance to Monday
  if (daysToAdd === 0) {
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
  }
  return d.toISOString().split("T")[0];
}

function todayPST(): Date {
  const now = new Date();
  const pst = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  return pst;
}

function detectUrgency(summary: string): { stage: string; followUpDays: number } {
  const s = summary.toLowerCase();
  if (/crisis|emergency|overdose|suicide|danger|hospital|dying|od'd|oding/.test(s)) {
    return { stage: "Hot Lead", followUpDays: 0 };
  }
  if (/intervention|intervene|get them help|get him help|get her help/.test(s)) {
    return { stage: "Intervention Lead", followUpDays: 1 };
  }
  if (/coaching|support|boundar|enabling|help me|help us|codepend/.test(s)) {
    return { stage: "Coaching Lead", followUpDays: 2 };
  }
  return { stage: "Information Request", followUpDays: 7 };
}

function extractSubstance(text: string): string | null {
  const s = text.toLowerCase();
  const substances = [
    "fentanyl", "heroin", "opioid", "opiate", "oxycodone", "percocet", "vicodin",
    "methamphetamine", "meth", "cocaine", "crack", "alcohol", "alcoholism",
    "marijuana", "cannabis", "weed", "benzodiazepine", "benzo", "xanax",
    "kratom", "adderall", "prescription", "pills", "pain medication",
  ];
  for (const sub of substances) {
    if (s.includes(sub)) return sub.charAt(0).toUpperCase() + sub.slice(1);
  }
  return null;
}

function extractRelationship(text: string): string | null {
  const s = text.toLowerCase();
  const relationships = [
    "wife", "husband", "son", "daughter", "mother", "father", "parent",
    "brother", "sister", "sibling", "spouse", "partner", "child",
    "grandson", "granddaughter", "grandchild", "friend", "fiancé", "fiance",
  ];
  for (const rel of relationships) {
    if (s.includes(rel)) return rel.charAt(0).toUpperCase() + rel.slice(1);
  }
  return null;
}

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return "Unknown";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── API Callers ──

async function quoFetch(path: string): Promise<any> {
  const QUO_API_KEY = Deno.env.get("QUO_API_KEY");
  if (!QUO_API_KEY) throw new Error("QUO_API_KEY not configured");

  const res = await fetch(`https://api.openphone.com/v1${path}`, {
    headers: { Authorization: QUO_API_KEY },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Quo API error [${res.status}] ${path}: ${txt}`);
  }
  return res.json();
}

async function notionFetch(path: string, method = "GET", body?: any): Promise<any> {
  const NOTION_API_TOKEN = Deno.env.get("NOTION_API_TOKEN");
  if (!NOTION_API_TOKEN) throw new Error("NOTION_API_TOKEN not configured");

  const opts: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_API_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`https://api.notion.com/v1${path}`, opts);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Notion API error [${res.status}] ${method} ${path}: ${txt}`);
  }
  return res.json();
}

async function findNotionPageByPhone(phone: string): Promise<any | null> {
  const data = await notionFetch(`/databases/${NOTION_DB_ID}/query`, "POST", {
    filter: {
      property: "Phone",
      phone_number: { equals: phone },
    },
    page_size: 1,
  });
  return data.results?.length > 0 ? data.results[0] : null;
}

async function appendCalloutToPage(pageId: string, summary: string, date: string, duration: string, urgency: string) {
  await notionFetch(`/blocks/${pageId}/children`, "PATCH", {
    children: [
      {
        object: "block",
        type: "callout",
        callout: {
          icon: { type: "emoji", emoji: "📞" },
          rich_text: [
            {
              type: "text",
              text: {
                content: `[${date}] ${urgency} | Duration: ${duration}\n${summary}`,
              },
            },
          ],
          color: urgency === "Hot Lead" ? "red_background" : urgency === "Intervention Lead" ? "orange_background" : "blue_background",
        },
      },
    ],
  });
}

async function updateNotionFollowUp(pageId: string, followUpDate: string) {
  await notionFetch(`/pages/${pageId}`, "PATCH", {
    properties: {
      "Follow-Up Date": { date: { start: followUpDate } },
    },
  });
}

async function createNotionPage(
  name: string,
  phone: string,
  stage: string,
  followUpDate: string,
  notes: string,
) {
  return await notionFetch("/pages", "POST", {
    parent: { database_id: NOTION_DB_ID },
    properties: {
      Name: { title: [{ text: { content: name } }] },
      Phone: { phone_number: phone },
      Source: { select: { name: "SoberHelpline" } },
      Status: { select: { name: stage } },
      "Follow-Up Date": { date: { start: followUpDate } },
      Notes: { rich_text: [{ text: { content: notes.slice(0, 2000) } }] },
    },
  });
}

// ── Main Handler ──

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", function: "quo-to-notion", timestamp: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const webhook = await req.json();
    console.log("Quo webhook received:", JSON.stringify(webhook).slice(0, 500));

    const eventType = webhook?.type || webhook?.event;
    if (eventType !== "call.summary.completed") {
      console.log(`Ignoring event type: ${eventType}`);
      return new Response(JSON.stringify({ skipped: true, reason: `Event type ${eventType} not handled` }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract callId from webhook payload
    const callId = webhook?.data?.callId || webhook?.data?.object?.callId || webhook?.data?.id;
    if (!callId) {
      console.error("No callId found in webhook payload");
      return new Response(JSON.stringify({ error: "No callId in payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Fetch call details
    const callData = await quoFetch(`/calls/${callId}`);
    const call = callData?.data || callData;
    console.log("Call direction:", call?.direction);

    // 3. Only process inbound
    if (call?.direction !== "inbound") {
      console.log("Skipping outbound call");
      return new Response(JSON.stringify({ skipped: true, reason: "Outbound call" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch transcript (best effort)
    let transcript = "";
    try {
      const txData = await quoFetch(`/calls/${callId}/transcription`);
      transcript = txData?.data?.text || txData?.text || txData?.transcript || "";
    } catch (e) {
      console.log("No transcript available:", e.message);
    }

    // Extract call info
    const callerPhone = call?.from || call?.participants?.find((p: any) => p.direction === "inbound")?.phoneNumber || "Unknown";
    const callerName = call?.contact?.firstName
      ? `${call.contact.firstName} ${call.contact.lastName || ""}`.trim()
      : "Inbound Lead (SoberHelpline)";
    const summary = webhook?.data?.summary || call?.summary || transcript || "No summary available";
    const duration = call?.duration || call?.talkDuration;
    const durationStr = formatDuration(duration);
    const wasTransferred = !!(call?.transferredTo || call?.transferredFrom);

    // 5. Detect urgency
    const textToAnalyze = `${summary} ${transcript}`;
    const { stage, followUpDays } = detectUrgency(textToAnalyze);
    const followUpDate = skipWeekends(todayPST(), followUpDays);

    // 6. Extract substance & relationship
    const substance = extractSubstance(textToAnalyze);
    const relationship = extractRelationship(textToAnalyze);

    const dateStr = todayPST().toISOString().split("T")[0];
    const notesText = [
      `Source: SoberHelpline - Inbound Call`,
      `Date: ${dateStr}`,
      `Duration: ${durationStr}`,
      `Urgency: ${stage}`,
      substance ? `Substance: ${substance}` : null,
      relationship ? `Relationship: ${relationship}` : null,
      ``,
      `Summary: ${summary}`,
    ].filter(Boolean).join("\n");

    // 4. Check if caller exists in Notion
    let isRepeatCaller = false;
    const existingPage = callerPhone !== "Unknown" ? await findNotionPageByPhone(callerPhone) : null;

    if (existingPage) {
      // 7. Update existing
      isRepeatCaller = true;
      console.log("Updating existing Notion page:", existingPage.id);
      await updateNotionFollowUp(existingPage.id, followUpDate);
      await appendCalloutToPage(existingPage.id, summary, dateStr, durationStr, stage);
    } else {
      // 8. Create new
      console.log("Creating new Notion page for:", callerPhone);
      await createNotionPage(callerName, callerPhone, stage, followUpDate, notesText);
    }

    const result = {
      success: true,
      urgency: stage,
      callerName,
      phone: callerPhone,
      pipelineStage: stage,
      substance: substance || "Not detected",
      relationship: relationship || "Not detected",
      duration: durationStr,
      transferred: wasTransferred,
      summarySnippet: summary.slice(0, 200),
      repeatCaller: isRepeatCaller,
      followUpDate,
    };

    console.log("Processed call:", JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("quo-to-notion error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
