import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, DollarSign, Video, User, Trash2, Plus, Monitor, FileText, ShieldAlert, ClipboardCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import SEOHead from "@/components/SEOHead";
import BoundaryClarityWorksheet from "@/components/BoundaryClarityWorksheet";
import CoachingIntakeAssessment from "@/components/CoachingIntakeAssessment";
import EnablingBehaviorAudit from "@/components/EnablingBehaviorAudit";
import ProviderDateCalendar from "@/components/ProviderDateCalendar";
import FamilyReadinessAssessment from "@/components/FamilyReadinessAssessment";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ConsultationProviderDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [provider, setProvider] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [clientWorksheets, setClientWorksheets] = useState<any[]>([]);
  const [clientIntakes, setClientIntakes] = useState<any[]>([]);
  const [clientAudits, setClientAudits] = useState<any[]>([]);
  const [clientReadiness, setClientReadiness] = useState<any[]>([]);

  // New slot form
  const [newSlot, setNewSlot] = useState({ dayOfWeek: "1", startTime: "09:00", endTime: "10:00" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }

    const adminViewUserId = searchParams.get("admin_view");
    let resolvedProvider: any = null;

    if (adminViewUserId) {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      if (!roles || roles.length === 0) { navigate("/"); return; }

      const { data: providerData } = await supabase
        .from("consultation_providers")
        .select("*")
        .eq("user_id", adminViewUserId)
        .maybeSingle();

      if (!providerData) { toast({ title: "Provider not found" }); navigate("/admin"); return; }
      resolvedProvider = providerData;
      setIsAdminView(true);
    } else {
      const { data: providerData } = await supabase
        .from("consultation_providers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!providerData) { navigate("/family-education"); return; }
      if (providerData.status !== "active") {
        toast({ title: "Account inactive", description: "Your provider account is currently inactive. Please contact an administrator." });
        navigate("/");
        return;
      }
      resolvedProvider = providerData;
    }

    setProvider(resolvedProvider);

    // Load availability, bookings, payouts in parallel
    const [availRes, bookRes, payRes] = await Promise.all([
      supabase.from("provider_availability").select("*").eq("provider_id", resolvedProvider.id).order("day_of_week").order("start_time"),
      supabase.from("consultation_bookings").select("*").eq("provider_id", resolvedProvider.id).order("booking_date", { ascending: false }),
      supabase.from("consultation_payouts").select("*").eq("provider_id", resolvedProvider.id).order("created_at", { ascending: false }),
    ]);

    setAvailability(availRes.data || []);
    setBookings(bookRes.data || []);
    setPayouts(payRes.data || []);

    // Load client worksheets and intake assessments
    const clientUserIds = [...new Set((bookRes.data || []).map((b: any) => b.client_user_id))];
    if (clientUserIds.length > 0) {
      const [worksheetRes, intakeRes, auditRes, readinessRes] = await Promise.all([
        supabase.from("boundary_clarity_worksheets").select("*").in("user_id", clientUserIds).order("updated_at", { ascending: false }),
        supabase.from("coaching_intake_assessments").select("*").in("user_id", clientUserIds).order("updated_at", { ascending: false }),
        supabase.from("enabling_behavior_audits").select("*").in("user_id", clientUserIds).order("updated_at", { ascending: false }),
        supabase.from("family_readiness_assessments").select("*").in("user_id", clientUserIds).order("updated_at", { ascending: false }),
      ]);

      const clientNameMap: Record<string, string> = {};
      (bookRes.data || []).forEach((b: any) => {
        if (!clientNameMap[b.client_user_id]) clientNameMap[b.client_user_id] = b.client_name;
      });

      setClientWorksheets(
        (worksheetRes.data || []).map((w: any) => ({ ...w, client_name: clientNameMap[w.user_id] || "Unknown Client" }))
      );
      setClientIntakes(
        (intakeRes.data || []).map((w: any) => ({ ...w, client_name: clientNameMap[w.user_id] || "Unknown Client" }))
      );
      setClientAudits(
        (auditRes.data || []).map((w: any) => ({ ...w, client_name: clientNameMap[w.user_id] || "Unknown Client" }))
      );
      setClientReadiness(
        (readinessRes.data || []).map((w: any) => ({ ...w, client_name: clientNameMap[w.user_id] || "Unknown Client" }))
      );
    }

    setLoading(false);
  };

  const addSlot = async () => {
    if (!provider) return;
    const { error } = await supabase.from("provider_availability").insert({
      provider_id: provider.id,
      day_of_week: parseInt(newSlot.dayOfWeek),
      start_time: newSlot.startTime,
      end_time: newSlot.endTime,
      timezone: provider.timezone || "America/Los_Angeles",
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add slot", variant: "destructive" });
    } else {
      toast({ title: "Slot added" });
      loadData();
    }
  };

  const removeSlot = async (id: string) => {
    const { error } = await supabase.from("provider_availability").delete().eq("id", id);
    if (!error) {
      toast({ title: "Slot removed" });
      loadData();
    }
  };

  const toggleSlot = async (id: string, isActive: boolean) => {
    await supabase.from("provider_availability").update({ is_active: isActive }).eq("id", id);
    loadData();
  };

  const markComplete = async (bookingId: string) => {
    const { error } = await supabase
      .from("consultation_bookings")
      .update({ status: "completed" })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Error", description: "Failed to update booking", variant: "destructive" });
      return;
    }

    // Trigger payout via edge function
    try {
      const { data: payoutResult, error: payoutError } = await supabase.functions.invoke("process-consultation-booking", {
        body: { bookingId, action: "payout" },
      });
      if (payoutError) {
        console.error("Payout error:", payoutError);
        toast({ title: "Session completed", description: "Payout processing encountered an issue. Admin has been notified.", variant: "destructive" });
      } else {
        toast({ title: "Session completed & payout sent", description: `$${payoutResult?.amount || ''} payout has been processed.` });
      }
    } catch (err) {
      console.error("Payout invocation error:", err);
      toast({ title: "Session completed", description: "Payout will be processed shortly." });
    }

    loadData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Provider Dashboard | Sober Helpline" description="Manage your consultation availability, bookings, and payouts." noIndex={true} />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to={isAdminView ? "/admin" : "/"}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {isAdminView ? "Back to Admin" : "Back"}
            </Button>
          </Link>
          <img src={logo} alt="Sober Helpline" className="w-24 md:w-32 h-auto" />
        </div>

        {isAdminView && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-sm text-primary">
            <strong>Admin View:</strong> Viewing dashboard for <strong>{provider?.full_name}</strong>. Changes you make here will affect this provider's account.
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">{isAdminView ? `${provider?.full_name}'s Dashboard` : "Provider Dashboard"}</h1>

        <Tabs defaultValue="availability" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="availability" className="gap-2"><Calendar className="h-4 w-4" />Availability</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2"><Video className="h-4 w-4" />Bookings</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2"><FileText className="h-4 w-4" />Client Documents</TabsTrigger>
            <TabsTrigger value="payouts" className="gap-2"><DollarSign className="h-4 w-4" />Payouts</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Your Availability</CardTitle>
                <CardDescription>Set your recurring weekly availability for consultation sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3 items-end p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-xs">Day</Label>
                    <Select value={newSlot.dayOfWeek} onValueChange={(v) => setNewSlot({ ...newSlot, dayOfWeek: v })}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day, i) => <SelectItem key={i} value={String(i)}>{day}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Start</Label>
                    <Input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} className="w-32" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End</Label>
                    <Input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} className="w-32" />
                  </div>
                  <Button onClick={addSlot} size="sm" className="gap-1"><Plus className="h-4 w-4" />Add Slot</Button>
                </div>

                {availability.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No availability set. Add your first time slot above.</p>
                ) : (
                  <div className="space-y-2">
                    {availability.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Switch checked={slot.is_active} onCheckedChange={(v) => toggleSlot(slot.id, v)} />
                          <span className="font-medium">{DAYS[slot.day_of_week]}</span>
                          <span className="text-muted-foreground">
                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                          </span>
                          {!slot.is_active && <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeSlot(slot.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {provider && (
              <ProviderDateCalendar
                providerId={provider.id}
                timezone={provider.timezone || "America/Los_Angeles"}
              />
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{b.client_name}</p>
                            <p className="text-sm text-muted-foreground">{b.client_email}</p>
                          </div>
                          <Badge variant={b.status === "confirmed" ? "default" : b.status === "completed" ? "secondary" : "destructive"}>
                            {b.status}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{b.booking_date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}</span>
                        </div>
                        {b.zoom_meeting_id && (
                          <Link 
                            to={`/join-meeting?mn=${b.zoom_meeting_id}&pwd=${encodeURIComponent(b.zoom_passcode || "")}&role=1`}
                            className="text-primary hover:underline text-sm flex items-center gap-1"
                          >
                            <Monitor className="h-4 w-4" />Join Session (In-Browser)
                          </Link>
                        )}
                        {b.zoom_meeting_url && !b.zoom_meeting_id && (
                          <a href={b.zoom_meeting_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                            <Video className="h-4 w-4" />Join Zoom (External)
                          </a>
                        )}
                        {b.intake_responses && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-primary">View Intake Responses</summary>
                            <div className="mt-2 space-y-2 bg-muted/50 p-3 rounded">
                              {Object.entries(b.intake_responses as Record<string, string>).map(([q, a]) => (
                                <div key={q}>
                                  <p className="font-medium text-xs">{q}</p>
                                  <p className="text-muted-foreground">{a}</p>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                        {b.status === "confirmed" && (
                          <Button size="sm" onClick={() => markComplete(b.id)}>Mark as Completed</Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Client Documents</CardTitle>
                <CardDescription>View worksheets and assessments completed by your clients.</CardDescription>
              </CardHeader>
              <CardContent>
                {clientWorksheets.length === 0 && clientIntakes.length === 0 && clientAudits.length === 0 && clientReadiness.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No client documents yet. Documents will appear here when clients complete worksheets.</p>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {clientIntakes.map((intake) => (
                      <AccordionItem key={`intake-${intake.id}`} value={`intake-${intake.id}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <FileText className="h-5 w-5 text-teal-600 shrink-0" />
                            <div>
                              <p className="font-semibold">{intake.client_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Coaching Intake Assessment™ · {intake.assigned_phase && <Badge variant="secondary" className="ml-1 text-xs">{intake.assigned_phase}</Badge>} · Updated {new Date(intake.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2">
                            <CoachingIntakeAssessment readOnly assessmentData={intake} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {clientReadiness.map((item) => (
                      <AccordionItem key={`readiness-${item.id}`} value={`readiness-${item.id}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <ClipboardCheck className="h-5 w-5 text-violet-600 shrink-0" />
                            <div>
                              <p className="font-semibold">{item.client_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Family Readiness Assessment™ · {item.phase && <Badge variant="secondary" className="ml-1 text-xs">{item.phase}</Badge>} · Score: {item.total_score} · Updated {new Date(item.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2">
                            <FamilyReadinessAssessment readOnly assessmentData={item} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {clientAudits.map((audit) => (
                      <AccordionItem key={`audit-${audit.id}`} value={`audit-${audit.id}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                            <div>
                              <p className="font-semibold">{audit.client_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Enabling Behavior Audit™ · {audit.risk_level && <Badge variant="secondary" className="ml-1 text-xs">{audit.risk_level}</Badge>} · Score: {audit.total_score}/100 · Updated {new Date(audit.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2">
                            <EnablingBehaviorAudit readOnly auditData={audit} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {clientWorksheets.map((worksheet) => (
                      <AccordionItem key={`ws-${worksheet.id}`} value={`ws-${worksheet.id}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <FileText className="h-5 w-5 text-cyan-600 shrink-0" />
                            <div>
                              <p className="font-semibold">{worksheet.client_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Boundary Clarity Worksheet™ · Updated {new Date(worksheet.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2">
                            <BoundaryClarityWorksheet readOnly worksheetData={worksheet} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>PayPal payouts are automatically processed after completed sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No payouts yet.</p>
                ) : (
                  <div className="space-y-2">
                    {payouts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">${p.amount}</p>
                          <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={p.status === "completed" ? "default" : p.status === "failed" ? "destructive" : "secondary"}>
                          {p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {provider && (
                  <div className="space-y-4">
                    <div><Label className="text-xs text-muted-foreground">Name</Label><p className="font-medium">{provider.full_name}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Title</Label><p>{provider.title || "Not set"}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Bio</Label><p className="text-sm">{provider.bio}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Specialties</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(provider.specialties || []).map((s: string, i: number) => <Badge key={i} variant="secondary">{s}</Badge>)}
                      </div>
                    </div>
                    <div><Label className="text-xs text-muted-foreground">PayPal Email</Label><p className="text-sm">{provider.paypal_email}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Timezone</Label><p className="text-sm">{provider.timezone || "America/Los_Angeles"}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Session Rate</Label><p className="font-medium">${provider.session_rate} / {provider.session_duration_minutes} min</p></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsultationProviderDashboard;
