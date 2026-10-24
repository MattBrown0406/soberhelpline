import { useState } from "react";
import { Loader2, RefreshCw, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { autoRegistrationIds, autoRegistrationSubscribers, disableAutoRegistration, type AutoRegistrationRecord } from "@/lib/zoomAutoRegistration";

interface Props {
  registrations: AutoRegistrationRecord[];
  loading: boolean;
  loadError: boolean;
  onRefresh: () => Promise<void>;
}

export function ZoomAutoRegistrationManagement({ registrations, loading, loadError, onRefresh }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AutoRegistrationRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const subscribers = autoRegistrationSubscribers(registrations);
  const query = search.trim().toLowerCase();
  const matches = subscribers.filter(r => `${r.name} ${r.email}`.toLowerCase().includes(query));

  const remove = async () => {
    if (!selected || saving) return;
    setSaving(true);
    try {
      await disableAutoRegistration(autoRegistrationIds(registrations, selected.email), async (ids, changes) => {
        const { data, error } = await supabase.from("zoom_meeting_registrations")
          .update(changes).in("id", ids).select("id,auto_register");
        if (error) throw error;
        return (data || []).filter(r => r.auto_register === false).map(r => r.id);
      });
      setSelected(null);
      await onRefresh();
      toast.success("Auto-registration stopped. Existing meeting registrations are unchanged.");
    } catch {
      toast.error("Could not stop all auto-registrations. Refresh the list and try again.");
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  return <section className="space-y-4" aria-labelledby="auto-registration-heading">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 id="auto-registration-heading" className="text-lg font-semibold">Auto-registration <span className="text-muted-foreground">({subscribers.length})</span></h3>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading || saving}>
        <RefreshCw className="mr-2 h-4 w-4" />Refresh auto-registration
      </Button>
    </div>
    <div className="space-y-2">
      <Label htmlFor="auto-registration-search">Find someone by name or email</Label>
      <Input id="auto-registration-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search auto-registration" />
    </div>
    {loadError ? <p role="alert" className="text-destructive">Auto-registration list could not be loaded.</p>
      : loading ? <Loader2 aria-label="Loading auto-registration" className="h-5 w-5 animate-spin" />
      : matches.length === 0 ? <p className="text-sm text-muted-foreground">{query ? "No matching auto-registrations." : "No one is signed up for auto-registration."}</p>
      : <div className="max-h-96 overflow-y-auto space-y-2">
        {matches.map(r => <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border rounded-md p-3">
          <div className="min-w-0"><p className="font-medium break-words">{r.name}</p><p className="text-sm text-muted-foreground break-all">{r.email}</p></div>
          <Button variant="outline" size="sm" className="shrink-0 self-start sm:self-center" disabled={saving} onClick={() => setSelected(r)} aria-label={`Stop auto-registration for ${r.name}`}>
            <UserMinus className="mr-2 h-4 w-4" />Stop auto-registration
          </Button>
        </div>)}
      </div>}
    <AlertDialog open={selected !== null} onOpenChange={open => { if (!open && !saving) setSelected(null); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Stop auto-registration?</AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            Stop automatically registering {selected?.name} ({selected?.email}) for future Monday meetings of “The Family Squares”? Existing registrations, questions, attendance, and mailing-list preferences will remain unchanged. They can still register manually or opt in again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={remove} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirm stop auto-registration</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>;
}