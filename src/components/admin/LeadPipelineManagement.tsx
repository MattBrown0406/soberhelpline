import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Mail, Phone, RefreshCw } from "lucide-react";

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

export function LeadPipelineManagement() {
  const [leads, setLeads] = useState<FamilyLead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
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
      supabase
        .from("zoom_meeting_registrations")
        .select("id, name, email, phone, question, request_follow_up, meeting_date, created_at")
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
      }));

    const zoomLeads: FamilyLead[] = (zoomRes.data || []).map((registration) => ({
      id: `zoom-${registration.id}`,
      stage: "Monday Zoom",
      name: registration.name,
      email: registration.email,
      phone: registration.phone || null,
      plan: registration.request_follow_up ? "Requested intervention follow-up" : "Free Monday support",
      source: "Monday Zoom registration",
      detail: registration.question || `Meeting ${registration.meeting_date}`,
      createdAt: registration.created_at,
      interventionInterest: registration.request_follow_up,
    }));

    setLeads([...bookingLeads, ...abandonedLeads, ...zoomLeads].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
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
  }), [leads]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.total}</div><p className="text-xs text-muted-foreground">recent leads</p></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.booked}</div><p className="text-xs text-muted-foreground">booked</p></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.intervention}</div><p className="text-xs text-muted-foreground">intervention interest</p></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-2xl font-bold">{stats.zoom}</div><p className="text-xs text-muted-foreground">Monday Zoom</p></CardContent></Card>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        This combines consultation bookings, abandoned bookings, and Monday Zoom registrations so family follow-up is visible in one place.
      </p>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Need</TableHead>
              <TableHead>Source / detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && !loading && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No recent family leads found</TableCell></TableRow>
            )}
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="text-sm">{formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={stageVariant[lead.stage]}>{lead.stage}</Badge>
                    {lead.interventionInterest && <Badge variant="outline">Intervention</Badge>}
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
                <TableCell className="text-sm">{lead.plan || "Not specified"}</TableCell>
                <TableCell className="max-w-md text-sm">
                  <div className="font-medium">{lead.source}</div>
                  {lead.detail && <div className="line-clamp-2 text-muted-foreground">{lead.detail}</div>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
