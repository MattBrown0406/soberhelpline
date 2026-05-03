import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Mail, Phone, RefreshCw, TrendingUp } from "lucide-react";

type LeadStage = "Booked" | "Started Booking" | "Monday Zoom";

interface FamilyLead {
  id: string;
  stage: LeadStage;
  name: string | null;
  email: string;
  phone: string | null;
  plan: string | null;
  source: string;
  detail: string | null;
  createdAt: string;
  interventionInterest: boolean;
  leadScore: number;
  leadTier: string;
  revenuePath: string | null;
  leadReasons: string[];
  nextAction: string | null;
  nmeAttributed: boolean;
}

interface ZoomRegistrationRecord {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  question: string | null;
  request_follow_up: boolean | null;
  meeting_date: string | null;
  created_at: string;
  lead_score?: number | null;
  lead_tier?: string | null;
  revenue_path?: string | null;
  lead_reasons?: string[] | null;
  next_revenue_action?: string | null;
  followup_sequence_status?: string | null;
  next_followup_at?: string | null;
  nme_attributed?: boolean | null;
}

interface ZoomQueryResult {
  data: ZoomRegistrationRecord[] | null;
  error: { message?: string } | null;
}

interface UntypedZoomQuery {
  select(columns: string): UntypedZoomQuery;
  order(column: string, options: { ascending: boolean }): UntypedZoomQuery;
  limit(count: number): Promise<ZoomQueryResult>;
}

interface UntypedSupabase {
  from(table: "zoom_meeting_registrations"): UntypedZoomQuery;
}

const stageVariant: Record<LeadStage, "default" | "secondary" | "outline"> = {
  Booked: "default",
  "Started Booking": "secondary",
  "Monday Zoom": "outline",
};

const formatPlan = (plan: string | null) => {
  if (!plan || plan === "single") return "Crisis coaching";
  if (plan === "emergency") return "Emergency Game Plan";
  if (plan === "stabilization") return "Family Stabilization";
  if (plan === "parallel-recovery" || plan === "parallel") return "Parallel Recovery";
  if (plan === "family-readiness-intensive") return "Readiness Intensive";
  return plan;
};

const formatRevenuePath = (path: string | null) => {
  if (!path) return null;
  if (path === "family_readiness_intensive") return "Readiness Intensive";
  if (path === "crisis_coaching") return "Crisis Coaching";
  if (path === "family_membership") return "Family Membership";
  if (path === "family_squares") return "Family Squares";
  return path.split("_").join(" ");
};

const formatLeadTier = (tier: string) => {
  if (tier === "intervention_priority") return "Intervention priority";
  if (tier === "coaching_likely") return "Coaching likely";
  if (tier === "support_nurture") return "Support nurture";
  if (tier === "booked") return "Booked";
  if (tier === "booking_started") return "Booking started";
  return tier.split("_").join(" ");
};

export function LeadPipelineManagement() {
  const [leads, setLeads] = useState<FamilyLead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const zoomDb = supabase as unknown as UntypedSupabase;
    const [bookingsRes, abandonedRes, zoomRes] = await Promise.all([
      supabase
        .from("consultation_bookings")
        .select("id, client_name, client_email, client_phone, intake_responses, amount_paid, booking_date, created_at, status")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("abandoned_bookings")
        .select("id, client_name, client_email, client_phone, plan_type, provider_name, selected_date, created_at, completed, last_step")
        .order("created_at", { ascending: false })
        .limit(100),
      zoomDb
        .from("zoom_meeting_registrations")
        .select("id, name, email, phone, question, request_follow_up, meeting_date, created_at, lead_score, lead_tier, revenue_path, lead_reasons, next_revenue_action, followup_sequence_status, next_followup_at, nme_attributed")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const firstError = bookingsRes.error || abandonedRes.error || zoomRes.error;
    if (firstError) {
      toast.error("Failed to load lead pipeline");
      setLoading(false);
      return;
    }

    const bookingLeads: FamilyLead[] = (bookingsRes.data || []).map((booking) => {
      const responses = booking.intake_responses as Record<string, string> | null;
      const reason = responses?.["Primary Reason for This Session"] || null;
      return {
        id: `booking-${booking.id}`,
        stage: "Booked",
        name: booking.client_name,
        email: booking.client_email,
        phone: booking.client_phone,
        plan: reason,
        source: "Consultation booking",
        detail: `${booking.status} · ${booking.booking_date} · $${booking.amount_paid}`,
        createdAt: booking.created_at,
        interventionInterest: reason?.toLowerCase().includes("intervention") || false,
        leadScore: 100,
        leadTier: "booked",
        revenuePath: "consultation_booking",
        leadReasons: ["Paid consultation booked"],
        nextAction: "Fulfill consult and identify next offer",
        nmeAttributed: false,
      };
    });

    const abandonedLeads: FamilyLead[] = (abandonedRes.data || [])
      .filter((record) => !record.completed)
      .map((record) => ({
        id: `abandoned-${record.id}`,
        stage: "Started Booking",
        name: record.client_name,
        email: record.client_email,
        phone: record.client_phone,
        plan: formatPlan(record.plan_type),
        source: "Abandoned booking",
        detail: `${record.provider_name || "No provider selected"} · step ${record.last_step ?? 0}${record.selected_date ? ` · ${record.selected_date}` : ""}`,
        createdAt: record.created_at,
        interventionInterest: record.plan_type === "family-readiness-intensive",
        leadScore: record.plan_type === "family-readiness-intensive" ? 78 : 58,
        leadTier: "booking_started",
        revenuePath: record.plan_type || "consultation_booking",
        leadReasons: ["Started paid booking but did not complete"],
        nextAction: "Recover abandoned booking",
        nmeAttributed: false,
      }));

    const zoomLeads: FamilyLead[] = (zoomRes.data || []).map((registration) => ({
      id: `zoom-${registration.id}`,
      stage: "Monday Zoom",
      name: registration.name,
      email: registration.email,
      phone: registration.phone || null,
      plan: registration.request_follow_up ? "Requested intervention follow-up" : "Free Monday support",
      source: "Monday Zoom registration",
      detail: [
        registration.question || `Meeting ${registration.meeting_date}`,
        registration.followup_sequence_status ? `Follow-up: ${registration.followup_sequence_status}` : null,
        registration.next_followup_at ? `Next: ${new Date(registration.next_followup_at).toLocaleDateString()}` : null,
      ].filter(Boolean).join(" · "),
      createdAt: registration.created_at,
      interventionInterest: registration.request_follow_up || registration.lead_tier === "intervention_priority",
      leadScore: registration.lead_score ?? (registration.request_follow_up ? 70 : 20),
      leadTier: registration.lead_tier || (registration.request_follow_up ? "coaching_likely" : "support_nurture"),
      revenuePath: registration.revenue_path || "family_squares",
      leadReasons: registration.lead_reasons || [],
      nextAction: registration.next_revenue_action || null,
      nmeAttributed: Boolean(registration.nme_attributed),
    }));

    setLeads([...bookingLeads, ...abandonedLeads, ...zoomLeads].sort((a, b) => {
      if (b.leadScore !== a.leadScore) return b.leadScore - a.leadScore;
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => ({
    total: leads.length,
    booked: leads.filter((lead) => lead.stage === "Booked").length,
    intervention: leads.filter((lead) => lead.interventionInterest).length,
    zoom: leads.filter((lead) => lead.stage === "Monday Zoom").length,
    highScore: leads.filter((lead) => lead.leadScore >= 70).length,
  }), [leads]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.total}</div><p className="text-xs text-muted-foreground">recent leads</p></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.booked}</div><p className="text-xs text-muted-foreground">booked</p></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.intervention}</div><p className="text-xs text-muted-foreground">intervention interest</p></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.highScore}</div><p className="text-xs text-muted-foreground">70+ lead score</p></CardContent></Card>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        This combines consultation bookings, abandoned bookings, and Monday Zoom registrations so the highest-value follow-ups rise to the top first.
      </p>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Need</TableHead>
              <TableHead>Source / detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && !loading && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No recent family leads found</TableCell></TableRow>
            )}
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="text-sm">{formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={stageVariant[lead.stage]}>{lead.stage}</Badge>
                    {lead.interventionInterest && <Badge variant="outline">Intervention</Badge>}
                    {lead.nmeAttributed && <Badge variant="secondary">NME</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 font-semibold">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      {lead.leadScore}
                    </div>
                    <Badge variant={lead.leadScore >= 70 ? "default" : lead.leadScore >= 45 ? "secondary" : "outline"}>
                      {formatLeadTier(lead.leadTier)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    {lead.name && <div className="font-medium">{lead.name}</div>}
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Mail className="h-3 w-3" /> {lead.email}
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <div>{lead.plan || "Not specified"}</div>
                  {lead.revenuePath && <div className="mt-1 text-xs text-muted-foreground">{formatRevenuePath(lead.revenuePath)}</div>}
                  {lead.nextAction && <div className="mt-1 text-xs text-primary">{formatRevenuePath(lead.nextAction) || lead.nextAction}</div>}
                </TableCell>
                <TableCell className="max-w-md text-sm">
                  <div className="font-medium">{lead.source}</div>
                  {lead.detail && <div className="line-clamp-2 text-muted-foreground">{lead.detail}</div>}
                  {lead.leadReasons.length > 0 && (
                    <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{lead.leadReasons.join(" · ")}</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
