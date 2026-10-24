import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, Send, Mail, Phone, Archive, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { closeAbandonedBooking } from "@/lib/closeAbandonedBooking";

interface AbandonedBooking {
  id: string;
  client_email: string;
  client_name: string | null;
  client_phone: string | null;
  plan_type: string | null;
  provider_name: string | null;
  selected_date: string | null;
  selected_time: string | null;
  last_step: number | null;
  completed: boolean;
  followup_sent_at: string | null;
  created_at: string;
}

export function AbandonedBookingsManagement() {
  const [records, setRecords] = useState<AbandonedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [selected, setSelected] = useState<AbandonedBooking | null>(null);
  const [removing, setRemoving] = useState(false);

  const remove = async () => {
    if (!selected || removing) return;
    const id = selected.id;
    setRemoving(true);
    try {
      await closeAbandonedBooking(id, async (bookingId, changes) => {
        const { data, error } = await supabase.from("abandoned_bookings")
          .update(changes).eq("id", bookingId).select("id, completed").maybeSingle();
        if (error) throw error;
        return data;
      });
      setRecords(current => current.filter(record => record.id !== id));
      setSelected(null);
      toast.success("Removed from abandoned bookings");
    } catch {
      toast.error("Could not remove this booking. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("abandoned_bookings")
      .select("*")
      .eq("completed", false)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      toast.error("Failed to load abandoned bookings");
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const triggerFollowup = async () => {
    setTriggering(true);
    const { data, error } = await supabase.functions.invoke("send-abandoned-booking-followup");
    if (error) {
      toast.error("Failed to trigger follow-up");
    } else {
      toast.success(`Processed ${data?.processed ?? 0} abandoned bookings`);
      load();
    }
    setTriggering(false);
  };

  const stats = {
    total: records.length,
    awaitingFollowup: records.filter(r => !r.followup_sent_at).length,
    followedUp: records.filter(r => r.followup_sent_at).length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          <div><span className="font-bold text-lg">{stats.total}</span> <span className="text-muted-foreground">incomplete</span></div>
          <div><span className="font-bold text-lg">{stats.awaitingFollowup}</span> <span className="text-muted-foreground">awaiting follow-up</span></div>
          <div><span className="font-bold text-lg">{stats.followedUp}</span> <span className="text-muted-foreground">followed up</span></div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={triggerFollowup} disabled={triggering}>
            <Send className="h-4 w-4 mr-1" /> {triggering ? "Sending..." : "Send Follow-ups Now"}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Follow-up emails are ready to send for records older than 4 hours that aren't completed. Use the manual button here, or schedule the Supabase function to run hourly in production.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Started</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Selected</TableHead>
            <TableHead>Follow-up</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 && !loading && (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No abandoned bookings</TableCell></TableRow>
          )}
          {records.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="text-sm">
                {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {r.client_name && <div className="font-medium">{r.client_name}</div>}
                  <a href={`mailto:${r.client_email}`} className="text-primary hover:underline flex items-center gap-1 text-xs">
                    <Mail className="h-3 w-3" /> {r.client_email}
                  </a>
                  {r.client_phone && (
                    <a href={`tel:${r.client_phone}`} className="text-primary hover:underline flex items-center gap-1 text-xs">
                      <Phone className="h-3 w-3" /> {r.client_phone}
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">{r.plan_type || "—"}</TableCell>
              <TableCell><Badge variant="outline">Step {r.last_step ?? 0}</Badge></TableCell>
              <TableCell className="text-xs">
                {r.provider_name && <div>{r.provider_name}</div>}
                {r.selected_date && <div className="text-muted-foreground">{r.selected_date} {r.selected_time}</div>}
              </TableCell>
              <TableCell>
                {r.followup_sent_at ? (
                  <Badge variant="secondary">Sent {formatDistanceToNow(new Date(r.followup_sent_at), { addSuffix: true })}</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" disabled={removing} onClick={() => setSelected(r)} aria-label={`Remove abandoned booking for ${r.client_name || r.client_email}`}>
                  <Archive className="h-4 w-4 mr-1" /> Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog open={selected !== null} onOpenChange={open => { if (!open && !removing) setSelected(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove abandoned booking?</AlertDialogTitle>
            <AlertDialogDescription className="break-words">
              Finished following up with {selected?.client_name || selected?.client_email}? This will close their abandoned booking and remove it from this list and future abandoned-booking follow-ups. Contact history is kept, and paid bookings are unchanged. No email will be sent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <Button onClick={remove} disabled={removing}>
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {removing ? "Removing..." : "Confirm removal"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
