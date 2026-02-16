import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CheckCircle, XCircle, DollarSign } from "lucide-react";

export const ConsultationManagement = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Tabs defaultValue="providers" className="space-y-4">
      <TabsList>
        <TabsTrigger value="providers">Providers ({providers.length})</TabsTrigger>
        <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
        <TabsTrigger value="payouts">Payouts ({payouts.length})</TabsTrigger>
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
                  <TableCell className="font-medium">{p.full_name}</TableCell>
                  <TableCell>{p.title || "—"}</TableCell>
                  <TableCell className="text-sm">{p.paypal_email}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "approved" ? "default" : p.status === "suspended" ? "destructive" : "secondary"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={p.status} onValueChange={(v) => updateProviderStatus(p.id, v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
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
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{b.client_name}</p>
                      <p className="text-xs text-muted-foreground">{b.client_email}</p>
                    </div>
                  </TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="payouts">
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
      </TabsContent>
    </Tabs>
  );
};
