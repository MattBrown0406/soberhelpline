import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CheckCircle, XCircle, DollarSign, Eye, ArrowLeft, Calendar, Clock, Video } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ProviderDetailView = ({ provider, onBack }: { provider: any; onBack: () => void }) => {
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, [provider.id]);

  const loadProviderData = async () => {
    const [availRes, bookRes, payRes] = await Promise.all([
      supabase.from("provider_availability").select("*").eq("provider_id", provider.id).order("day_of_week").order("start_time"),
      supabase.from("consultation_bookings").select("*").eq("provider_id", provider.id).order("booking_date", { ascending: false }),
      supabase.from("consultation_payouts").select("*").eq("provider_id", provider.id).order("created_at", { ascending: false }),
    ]);
    setAvailability(availRes.data || []);
    setBookings(bookRes.data || []);
    setPayouts(payRes.data || []);
    setLoading(false);
  };

  const triggerPayout = async (bookingId: string) => {
    try {
      const { error } = await supabase.functions.invoke("process-consultation-booking", {
        body: { bookingId, action: "payout" },
      });
      if (error) throw error;
      toast.success("Payout processed");
      loadProviderData();
    } catch {
      toast.error("Payout failed");
    }
  };

  const now = new Date();
  const pastBookings = bookings.filter(b => new Date(b.booking_date) < now && b.status !== "confirmed");
  const currentBookings = bookings.filter(b => {
    const d = new Date(b.booking_date);
    return d.toDateString() === now.toDateString() || (b.status === "confirmed" && d <= now);
  });
  const futureBookings = bookings.filter(b => new Date(b.booking_date) > now && b.status === "confirmed");

  if (loading) return <p>Loading provider details...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Providers
        </Button>
        <div className="flex items-center gap-3">
          {provider.photo_url && (
            <img src={provider.photo_url} alt={provider.full_name} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <h3 className="font-semibold text-lg">{provider.full_name}</h3>
            <p className="text-sm text-muted-foreground">{provider.title || "No title"} • {provider.paypal_email}</p>
          </div>
          <Badge variant={provider.status === "approved" ? "default" : provider.status === "suspended" ? "destructive" : "secondary"}>
            {provider.status}
          </Badge>
        </div>
      </div>

      {/* Profile summary */}
      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Bio:</span> <p className="mt-1">{provider.bio || "—"}</p></div>
            <div>
              <span className="text-muted-foreground">Specialties:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(provider.specialties || []).map((s: string, i: number) => <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>)}
                {(!provider.specialties || provider.specialties.length === 0) && <span>—</span>}
              </div>
            </div>
            <div><span className="text-muted-foreground">Rate:</span> ${provider.session_rate} / {provider.session_duration_minutes} min</div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />Availability ({availability.length} slots)</CardTitle></CardHeader>
        <CardContent>
          {availability.length === 0 ? (
            <p className="text-muted-foreground text-sm">No availability set.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availability.map((slot) => (
                <div key={slot.id} className="flex items-center gap-2 p-2 border rounded text-sm">
                  <Badge variant={slot.is_active ? "default" : "secondary"} className="text-xs">
                    {slot.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="font-medium">{DAYS[slot.day_of_week]}</span>
                  <span className="text-muted-foreground">{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({futureBookings.length})</TabsTrigger>
          <TabsTrigger value="current">Today / In Progress ({currentBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        {[
          { key: "upcoming", data: futureBookings },
          { key: "current", data: currentBookings },
          { key: "past", data: pastBookings },
        ].map(({ key, data }) => (
          <TabsContent key={key} value={key}>
            {data.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No {key} bookings.</p>
            ) : (
              <div className="space-y-3">
                {data.map((b) => (
                  <div key={b.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{b.client_name}</p>
                        <p className="text-xs text-muted-foreground">{b.client_email}{b.client_phone ? ` • ${b.client_phone}` : ""}</p>
                      </div>
                      <Badge variant={b.status === "confirmed" ? "default" : b.status === "completed" ? "secondary" : "destructive"}>
                        {b.status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.booking_date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}</span>
                      <span>${b.amount_paid}</span>
                    </div>
                    {b.zoom_meeting_url && (
                      <a href={b.zoom_meeting_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                        <Video className="h-3 w-3" />Zoom Link
                      </a>
                    )}
                    {b.intake_responses && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-primary">View Intake Responses</summary>
                        <div className="mt-2 space-y-1 bg-muted/50 p-3 rounded text-xs">
                          {Object.entries(b.intake_responses as Record<string, string>).map(([q, a]) => (
                            <div key={q}><span className="font-medium">{q}:</span> {a}</div>
                          ))}
                        </div>
                      </details>
                    )}
                    {b.status === "completed" && (
                      <Button size="sm" variant="outline" onClick={() => triggerPayout(b.id)} className="gap-1">
                        <DollarSign className="h-3 w-3" />Process Payout
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Payouts */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4" />Payout History ({payouts.length})</CardTitle></CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payouts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>PayPal ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">${p.amount}</TableCell>
                      <TableCell className="text-xs">{p.paypal_payout_id || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "completed" ? "default" : p.status === "failed" ? "destructive" : "secondary"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const ConsultationManagement = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [provRes, bookRes, payRes] = await Promise.all([
      supabase.from("consultation_providers").select("*").order("created_at", { ascending: false }),
      supabase.from("consultation_bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("consultation_payouts").select("*").order("created_at", { ascending: false }),
    ]);
    setProviders(provRes.data || []);
    setBookings(bookRes.data || []);
    setPayouts(payRes.data || []);
    setLoading(false);
  };

  const updateProviderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("consultation_providers").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Provider ${status}`);
    loadData();
  };

  const triggerPayout = async (bookingId: string) => {
    try {
      const { error } = await supabase.functions.invoke("process-consultation-booking", {
        body: { bookingId, action: "payout" },
      });
      if (error) throw error;
      toast.success("Payout processed");
      loadData();
    } catch {
      toast.error("Payout failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (selectedProvider) {
    return <ProviderDetailView provider={selectedProvider} onBack={() => setSelectedProvider(null)} />;
  }

  return (
    <Tabs defaultValue="providers" className="space-y-4">
      <TabsList>
        <TabsTrigger value="providers">Providers ({providers.length})</TabsTrigger>
        <TabsTrigger value="bookings">All Bookings ({bookings.length})</TabsTrigger>
        <TabsTrigger value="payouts">All Payouts ({payouts.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="providers">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>PayPal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {p.photo_url && <img src={p.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />}
                      {p.full_name}
                    </div>
                  </TableCell>
                  <TableCell>{p.title || "—"}</TableCell>
                  <TableCell className="text-sm">{p.paypal_email}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "approved" ? "default" : p.status === "suspended" ? "destructive" : "secondary"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedProvider(p)} className="gap-1">
                        <Eye className="h-3 w-3" />View
                      </Button>
                      <Select value={p.status} onValueChange={(v) => updateProviderStatus(p.id, v)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="bookings">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => {
                const prov = providers.find(p => p.id === b.provider_id);
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{b.client_name}</p>
                        <p className="text-xs text-muted-foreground">{b.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{prov?.full_name || "—"}</TableCell>
                    <TableCell>{b.booking_date}</TableCell>
                    <TableCell>{b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}</TableCell>
                    <TableCell>${b.amount_paid}</TableCell>
                    <TableCell>
                      <Badge variant={b.status === "confirmed" ? "default" : b.status === "completed" ? "secondary" : "destructive"}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {b.status === "completed" && (
                        <Button size="sm" variant="outline" onClick={() => triggerPayout(b.id)} className="gap-1">
                          <DollarSign className="h-3 w-3" />Payout
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="payouts">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>PayPal ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p) => {
                const prov = providers.find(pr => pr.id === p.provider_id);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">{prov?.full_name || "—"}</TableCell>
                    <TableCell className="font-medium">${p.amount}</TableCell>
                    <TableCell className="text-xs">{p.paypal_payout_id || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "completed" ? "default" : p.status === "failed" ? "destructive" : "secondary"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
};
