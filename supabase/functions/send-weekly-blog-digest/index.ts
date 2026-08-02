import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://soberhelpline.com";
const BLOG_INDEX_URL = `${SITE_URL}/blog-index.json`;
const ZOOM_REGISTRATION_URL = `${SITE_URL}/monday-zoom-registration`;
const SOBER_HELPLINE_APP_URL = "https://apps.apple.com/us/app/sober-helpline/id6780034996";
const FAMILY_BRIDGE_APP_URL = "https://apps.apple.com/app/id6744403069";
const COACHING_URL = "https://www.freedominterventions.com/book-intervention-consultation#booking";

interface BlogPost {
  slug: string;
  title: string;
  category?: string;
  date: string;
  excerpt?: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  };
  return (text || "").replace(/[&<>"']/g, (m) => map[m]);
}

// Current date in Pacific time as YYYY-MM-DD
function pacificToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

function pacificHour(): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles", hour: "numeric", hour12: false,
    }).format(new Date()),
  );
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC", month: "long", day: "numeric", year: "numeric",
  }).format(d);
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SendGrid error for ${to}: [${response.status}] ${errorText}`);
    return false;
  }
  return true;
}

function buildHtml(safeName: string, posts: BlogPost[]): string {
  const articles = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      return `
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
        ${p.category ? `<p style="margin:0 0 6px 0; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:#16a34a; font-weight:bold;">${escapeHtml(p.category)}</p>` : ""}
        <a href="${url}" style="font-size:18px; font-weight:bold; color:#166534; text-decoration:none;">${escapeHtml(p.title)}</a>
        <p style="margin:8px 0 12px 0; color:#374151; font-size:14px; line-height:1.6;">${escapeHtml(p.excerpt || "")}</p>
        <p style="margin:0; font-size:12px; color:#6b7280;">Published ${formatDate(p.date)}</p>
        <a href="${url}" style="display:inline-block; margin-top:12px; padding:10px 20px; background-color:#166534; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:bold; font-size:14px;">Read the article</a>
      </div>`;
    })
    .join("");

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
      <h1 style="color:#166534; font-size:24px; margin-bottom:4px;">This Week on Sober Helpline</h1>
      <p style="color:#6b7280; font-size:14px; margin-top:0;">New articles for families walking through addiction and recovery.</p>

      <p>Hi ${safeName},</p>
      <p>Here's what we published this week:</p>

      ${articles}

      <div style="background-color:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:24px; margin:28px 0; text-align:center;">
        <p style="margin:0 0 8px 0; font-size:18px; font-weight:bold; color:#166534;">Join "The Family Squares" Support Meeting</p>
        <p style="margin:0 0 16px 0; font-size:14px; color:#374151;">Free Monday night Zoom support for families. No cost, no pressure — just families who get it.</p>
        <a href="${ZOOM_REGISTRATION_URL}" style="display:inline-block; padding:14px 32px; background-color:#166534; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">Register for Monday's Meeting</a>
      </div>

      <div style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:24px; margin:24px 0; text-align:center;">
        <p style="margin:0 0 8px 0; font-size:18px; font-weight:bold; color:#111827;">📱 The Sober Helpline App</p>
        <p style="margin:0 0 16px 0; font-size:14px; color:#374151;">Family education, the Recovery Roadmap, Monday night meeting access, and your full membership library — right in your pocket.</p>
        <a href="${SOBER_HELPLINE_APP_URL}" style="display:inline-block; padding:14px 32px; background-color:#111827; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">Download the Sober Helpline App</a>
      </div>

      <div style="background-color:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:24px; margin:24px 0; text-align:center;">
        <p style="margin:0 0 8px 0; font-size:18px; font-weight:bold; color:#1e3a8a;">📲 The FamilyBridge App</p>
        <p style="margin:0 0 16px 0; font-size:14px; color:#374151;">AI-guided support for the hard conversations — boundaries, relapse worries, and what to say next.</p>
        <a href="${FAMILY_BRIDGE_APP_URL}" style="display:inline-block; padding:14px 32px; background-color:#1d4ed8; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">Download FamilyBridge</a>
        <p style="margin:20px 0 12px 0; font-size:14px; color:#374151;">Want to talk it through with me directly? Book a coaching session and we'll build a plan for your family.</p>
        <a href="${COACHING_URL}" style="display:inline-block; padding:12px 28px; background-color:#ffffff; border:2px solid #1d4ed8; color:#1d4ed8; text-decoration:none; border-radius:8px; font-weight:bold; font-size:15px;">Book a Coaching Session</a>
      </div>

      <p style="margin-top:24px;">— Matt</p>

      <p style="color:#6b7280; font-size:14px; margin-top:30px; border-top:1px solid #e5e7eb; padding-top:15px;">
        Questions? Call us at <strong>458-298-8008</strong>.
      </p>
      <p style="color:#6b7280; font-size:12px;">Sober Helpline — Supporting Families Through Recovery</p>
    </div>
  `;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const isCron = body.source === "cron";
    const testEmail: string | undefined = body.test_email;
    const dryRun: boolean = body.dry_run === true;
    const daysBack: number = Number(body.days_back) || 7;

    // Cron fires at two UTC hours to cover DST; only run at 8 AM Pacific.
    if (isCron && pacificHour() !== 8) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "not 8 AM Pacific" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Load blog index published with the site
    const indexRes = await fetch(`${BLOG_INDEX_URL}?t=${Date.now()}`);
    if (!indexRes.ok) {
      const text = await indexRes.text();
      console.error(`Blog index fetch failed [${indexRes.status}]: ${text}`);
      return new Response(
        JSON.stringify({ error: "Could not load blog index", status: indexRes.status }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const index = await indexRes.json();
    const allPosts: BlogPost[] = index.posts || [];

    const today = pacificToday();
    const cutoff = addDays(today, -daysBack);
    const recent = allPosts
      .filter((p) => p.date > cutoff && p.date <= today)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (recent.length === 0) {
      console.log(`No blog posts published since ${cutoff} — skipping blast.`);
      return new Response(
        JSON.stringify({ skipped: true, reason: "no new posts", cutoff }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subject = recent.length === 1
      ? `New this week: ${recent[0].title}`
      : `This week on Sober Helpline: ${recent.length} new articles for families`;

    if (testEmail) {
      const ok = await sendEmail(testEmail, subject, buildHtml("Friend", recent));
      return new Response(
        JSON.stringify({ test: true, sent: ok, posts: recent.map((p) => p.slug) }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: suppressed } = await adminSupabase
      .from("email_suppression_list")
      .select("email");
    const suppressedEmails = new Set(
      (suppressed || []).map((s: any) => (s.email || "").toLowerCase()),
    );

    const recipientMap = new Map<string, string>();

    // Active family members
    const { data: activeSubs } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .eq("status", "active");
    const memberUserIds = [...new Set((activeSubs || []).map((s: any) => s.user_id))];

    if (memberUserIds.length) {
      const { data: memberPrivate } = await adminSupabase
        .from("profile_private")
        .select("user_id, email")
        .in("user_id", memberUserIds);
      const { data: memberProfiles } = await adminSupabase
        .from("profiles")
        .select("id, first_name")
        .in("id", memberUserIds);
      const nameMap = new Map(memberProfiles?.map((p: any) => [p.id, p.first_name]) || []);
      for (const mp of memberPrivate || []) {
        const email = mp.email?.toLowerCase();
        if (!email || suppressedEmails.has(email)) continue;
        recipientMap.set(email, nameMap.get(mp.user_id) || "Friend");
      }
    }

    // Zoom registrants
    const { data: pastRegs } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email, name")
      .order("created_at", { ascending: false });
    for (const r of pastRegs || []) {
      const email = r.email?.toLowerCase();
      if (!email || suppressedEmails.has(email) || recipientMap.has(email)) continue;
      recipientMap.set(email, (r.name || "Friend").split(" ")[0]);
    }

    const recipients = [...recipientMap.entries()];

    if (dryRun) {
      return new Response(
        JSON.stringify({
          dry_run: true,
          recipient_count: recipients.length,
          posts: recent.map((p) => ({ slug: p.slug, date: p.date })),
          subject,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let sent = 0;
    let failed = 0;
    for (const [email, name] of recipients) {
      const ok = await sendEmail(email, subject, buildHtml(escapeHtml(name || "Friend"), recent));
      ok ? sent++ : failed++;
      await new Promise((r) => setTimeout(r, 60));
    }

    console.log(`Weekly blog digest: ${sent} sent, ${failed} failed, ${recent.length} posts.`);

    return new Response(
      JSON.stringify({ sent, failed, posts: recent.map((p) => p.slug) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("send-weekly-blog-digest error:", error?.message || error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
