import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Ban, Loader2 } from "lucide-react";

interface BlockedRow {
  id: string;
  email: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
}

export const MeetingBlocklistManagement = () => {
  const [rows, setRows] = useState<BlockedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("meeting_blocklist")
      .select("id, email, reason, notes, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load blocklist");
    } else {
      setRows((data || []) as BlockedRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const addEntry = async () => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("meeting_blocklist")
      .insert({ email: clean, reason: reason.trim() || null, notes: notes.trim() || null });
    setSaving(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Already blocked" : error.message);
      return;
    }
    toast.success(`${clean} blocked`);
    setEmail("");
    setReason("");
    setNotes("");
    void load();
  };

  const removeEntry = async (id: string, addr: string) => {
    if (!confirm(`Remove ${addr} from the blocklist?`)) return;
    const { error } = await supabase.from("meeting_blocklist").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${addr} removed`);
    void load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-900">
        <p className="font-semibold mb-1">What this does</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Blocks the email from registering for "The Family Squares" via the website</li>
          <li>Suppresses all automated Zoom emails (reminders, follow-ups, re-engagement) to that address</li>
          <li>Blocks the in-browser Zoom join page for signed-in users with this email</li>
          <li><strong>Does not</strong> stop someone who already has the raw Zoom link from opening it in the Zoom app — enable the Zoom Waiting Room and don't admit them.</li>
        </ul>
      </div>

      <div className="rounded-lg border p-4 space-y-3 bg-card">
        <h3 className="font-semibold flex items-center gap-2"><Ban className="h-4 w-4" /> Add to blocklist</h3>
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Reason (optional, e.g. Disruptive)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Textarea
          placeholder="Internal notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
        <Button onClick={addEntry} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Ban className="h-4 w-4 mr-2" />}
          Block email
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Added</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No blocked emails</TableCell></TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.email}</TableCell>
                  <TableCell>{r.reason || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="max-w-xs">{r.notes || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => removeEntry(r.id, r.email)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MeetingBlocklistManagement;
