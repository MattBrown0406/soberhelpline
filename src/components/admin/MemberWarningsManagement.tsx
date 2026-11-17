import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, AlertTriangle, UserX, Check, X, RefreshCw, Eye } from "lucide-react";

const NOTHING_SAVED = "Nothing was saved. Your session may have expired: reload the page, log in, and try again.";

/** A write that came back with no error and no rows: nothing was changed. */
class NothingSavedError extends Error {}

// Revoking must END access, not just flip the status: membership checks count a
// cancelled row until its access_ends_at, and the app sync / app sign-in skip any
// user whose row has a cancellation_source starting with "admin". Returns how many
// live PayPal agreements were revoked (PayPal keeps billing until cancelled there).
async function revokeFamilyAccess(
  userId: string,
  source: "admin" | "admin_moderation",
  reason: string,
): Promise<{ revoked: number; livePayPal: number }> {
  const nowIso = new Date().toISOString();
  const now = Date.now();
  const { data: rows, error } = await supabase
    .from("provider_subscriptions")
    .select("id, status, access_ends_at, paypal_subscription_id")
    .eq("user_id", userId)
    .is("provider_submission_id", null);
  if (error) throw error;

  const live = (rows ?? []).filter((r) => ["active", "pending", "suspended"].includes(r.status));
  const paidThrough = (rows ?? []).filter(
    (r) => r.status === "cancelled" && r.access_ends_at && new Date(r.access_ends_at).getTime() > now,
  );

  // Each update asks for its rows back: no error with no rows means nothing changed.
  let saved = 0;
  if (live.length > 0) {
    const { data: liveSaved, error: liveError } = await supabase
      .from("provider_subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: nowIso,
        cancellation_source: source,
        cancellation_reason: reason,
        access_ends_at: nowIso,
      })
      .in("id", live.map((r) => r.id))
      .select("id");
    if (liveError) throw liveError;
    saved += liveSaved?.length ?? 0;
  }
  if (paidThrough.length > 0) {
    const { data: paidSaved, error: paidError } = await supabase
      .from("provider_subscriptions")
      .update({ cancellation_source: source, cancellation_reason: reason, access_ends_at: nowIso })
      .in("id", paidThrough.map((r) => r.id))
      .select("id");
    if (paidError) throw paidError;
    saved += paidSaved?.length ?? 0;
  }
  const expected = live.length + paidThrough.length;
  if (expected > 0 && saved === 0) throw new NothingSavedError();
  if (saved < expected) throw new Error(`Only ${saved} of ${expected} membership rows were revoked`);

  return {
    revoked: live.length + paidThrough.length,
    livePayPal: live.filter((r) => r.paypal_subscription_id?.startsWith("I-")).length,
  };
}

interface MemberWarning {
  id: string;
  member_id: string;
  moderator_id: string;
  warning_type: string;
  reason: string;
  post_content: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  member_profile: {
    username: string | null;
    first_name: string;
    last_name: string;
    email?: string;
  } | null;
  moderator_profile: {
    username: string | null;
    first_name: string;
    last_name: string;
  } | null;
  member_contact?: {
    email: string;
  } | null;
}

// Admin-only screen: real names are fine here.
function personLabel(p: { username: string | null; first_name: string | null; last_name: string | null } | null): string {
  if (!p) return "Unknown member";
  const name = [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
  return p.username?.trim() ? (name ? `${p.username} (${name})` : p.username) : name || "No name";
}

/** Admin → review moderator warnings and removal recommendations. No props. */
export function MemberWarningsManagement() {
  const [warnings, setWarnings] = useState<MemberWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedWarning, setSelectedWarning] = useState<MemberWarning | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  // The report whose "Revoke Access" was clicked, waiting for the owner to confirm.
  // payPal: true = a live PayPal subscription, false = none, null = could not be checked.
  const [confirmRevoke, setConfirmRevoke] = useState<{ warning: MemberWarning; payPal: boolean | null } | null>(null);

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    setLoading(true);
    try {
      const { data: warningsData, error: warningsError } = await supabase
        .from('member_warnings')
        .select('*')
        .order('created_at', { ascending: false });

      if (warningsError) throw warningsError;

      if (!warningsData || warningsData.length === 0) {
        setWarnings([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs (members and moderators)
      const memberIds = [...new Set(warningsData.map(w => w.member_id))];
      const moderatorIds = [...new Set(warningsData.map(w => w.moderator_id))];
      const allUserIds = [...new Set([...memberIds, ...moderatorIds])];

      // Fetch basic profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name')
        .in('id', allUserIds);

      if (profileError) throw profileError;

      // Fetch member emails (private contact table)
      const { data: contacts, error: contactError } = await supabase
        .from('profile_private')
        .select('user_id, email')
        .in('user_id', memberIds);

      if (contactError) throw contactError;

      // Combine data
      const enrichedWarnings: MemberWarning[] = warningsData.map(warning => {
        const memberProfile = profiles?.find(p => p.id === warning.member_id);
        const moderatorProfile = profiles?.find(p => p.id === warning.moderator_id);
        const memberContact = contacts?.find(c => c.user_id === warning.member_id);

        return {
          ...warning,
          member_profile: memberProfile ? {
            username: memberProfile.username,
            first_name: memberProfile.first_name,
            last_name: memberProfile.last_name,
          } : null,
          moderator_profile: moderatorProfile ? {
            username: moderatorProfile.username,
            first_name: moderatorProfile.first_name,
            last_name: moderatorProfile.last_name
          } : null,
          member_contact: memberContact ? { email: memberContact.email } : null,
        };
      });

      setWarnings(enrichedWarnings);
    } catch (error) {
      console.error("Error fetching warnings:", error);
      toast.error("Failed to load warnings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (warningId: string, newStatus: string) => {
    setProcessing(warningId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('member_warnings')
        .update({
          status: newStatus,
          admin_notes: adminNotes || null,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', warningId);

      if (error) throw error;

      toast.success(`Warning ${newStatus}`);
      setSelectedWarning(null);
      setAdminNotes("");
      fetchWarnings();
    } catch (error) {
      console.error("Error updating warning:", error);
      toast.error("Failed to update warning");
    } finally {
      setProcessing(null);
    }
  };

  // "Revoke Access" was clicked: find out whether PayPal is still billing this
  // member (a read only), then ask the owner to confirm.
  const askToRevoke = async (warning: MemberWarning) => {
    setProcessing(warning.id);
    let payPal: boolean | null = null;
    try {
      const { data, error } = await supabase
        .from("provider_subscriptions")
        .select("paypal_subscription_id")
        .eq("user_id", warning.member_id)
        .is("provider_submission_id", null)
        .in("status", ["active", "pending", "suspended"]);
      if (error) throw error;
      payPal = (data ?? []).some((r) => r.paypal_subscription_id?.startsWith("I-"));
    } catch (error) {
      console.error("PayPal status could not be checked before revoking:", error);
    } finally {
      setProcessing(null);
    }
    setConfirmRevoke({ warning, payPal });
  };

  const handleActionMember = async (warning: MemberWarning) => {
    setProcessing(warning.id);
    try {
      // First, revoke the member's access (all family memberships, including
      // paid-through and app-sourced ones). The report is marked only after this worked.
      const { revoked, livePayPal } = await revokeFamilyAccess(
        warning.member_id,
        "admin_moderation",
        "Membership revoked after a member warning",
      );
      if (revoked === 0) {
        toast.error("Nothing was revoked: no active membership was found for this member. If that looks wrong, reload the page, log in, and try again.");
        return;
      }

      toast.success("Member's access has been revoked");
      if (livePayPal > 0) {
        toast.warning("PayPal billing is still active", {
          description: "Cancel this member's subscription in PayPal too, or they will keep being charged.",
        });
      }

      // Then record it on the report.
      const { data: { user } } = await supabase.auth.getUser();
      const { data: marked, error: warningError } = await supabase
        .from('member_warnings')
        .update({
          status: 'actioned',
          admin_notes: adminNotes || 'Membership revoked based on this recommendation',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', warning.id)
        .select('id');
      if (warningError || !marked || marked.length === 0) {
        if (warningError) console.error("Error marking warning as actioned:", warningError);
        toast.error("The member's access was revoked, but this report could not be updated. Use Mark Reviewed to close it.");
        return;
      }

      setSelectedWarning(null);
      setAdminNotes("");
      fetchWarnings();
    } catch (error) {
      console.error("Error actioning member:", error);
      toast.error(error instanceof NothingSavedError ? NOTHING_SAVED : "Failed to revoke access. The member still has access.");
    } finally {
      setProcessing(null);
    }
  };

  const getTypeBadge = (type: string) => {
    if (type === 'removal_recommendation') {
      return <Badge variant="destructive" className="gap-1"><UserX className="h-3 w-3" />Removal Request</Badge>;
    }
    return <Badge variant="secondary" className="gap-1"><AlertTriangle className="h-3 w-3" />Warning</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      reviewed: "outline",
      dismissed: "outline",
      actioned: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {warnings.length} warning{warnings.length !== 1 ? 's' : ''} / recommendation{warnings.length !== 1 ? 's' : ''}
        </p>
        <Button variant="outline" size="sm" onClick={fetchWarnings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warnings.map((warning) => (
              <TableRow key={warning.id}>
                <TableCell>{getTypeBadge(warning.warning_type)}</TableCell>
                <TableCell className="font-medium">
                  {personLabel(warning.member_profile)}
                </TableCell>
                <TableCell className="max-w-xs truncate">{warning.reason}</TableCell>
                <TableCell>
                  {personLabel(warning.moderator_profile)}
                </TableCell>
                <TableCell>{getStatusBadge(warning.status)}</TableCell>
                <TableCell>
                  {new Date(warning.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedWarning(warning);
                      setAdminNotes(warning.admin_notes || "");
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {warnings.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No warnings or recommendations yet
        </div>
      )}

      {/* Review Warning Dialog */}
      <Dialog open={!!selectedWarning} onOpenChange={() => setSelectedWarning(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Warning / Recommendation</DialogTitle>
            <DialogDescription>
              Review the details and take appropriate action.
            </DialogDescription>
          </DialogHeader>
          
          {selectedWarning && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">{getTypeBadge(selectedWarning.warning_type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedWarning.status)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Reported Member</label>
                <p className="mt-1">
                  {personLabel(selectedWarning.member_profile)}
                  <span className="text-muted-foreground ml-2">({selectedWarning.member_contact?.email || '-'})</span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Submitted By (Moderator)</label>
                <p className="mt-1">
                  {personLabel(selectedWarning.moderator_profile)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Reason</label>
                <p className="mt-1 p-3 bg-muted rounded-lg">{selectedWarning.reason}</p>
              </div>

              {selectedWarning.post_content && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reported Post Content</label>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedWarning.post_content}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedWarning?.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateStatus(selectedWarning.id, 'dismissed')}
                  disabled={!!processing}
                >
                  {processing === selectedWarning.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                  Dismiss
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedWarning.id, 'reviewed')}
                  disabled={!!processing}
                >
                  {processing === selectedWarning.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Mark Reviewed
                </Button>
                {selectedWarning.warning_type === 'removal_recommendation' && (
                  <Button 
                    variant="destructive"
                    onClick={() => askToRevoke(selectedWarning)}
                    disabled={!!processing}
                  >
                    {processing === selectedWarning.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserX className="h-4 w-4 mr-2" />}
                    Revoke Access
                  </Button>
                )}
              </>
            )}
            <Button variant="ghost" onClick={() => setSelectedWarning(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmRevoke} onOpenChange={(open) => !open && setConfirmRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Membership</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the membership for{" "}
              <strong>{personLabel(confirmRevoke?.warning.member_profile ?? null)}</strong>?
              They will lose access to the family forum and all member benefits.
              {confirmRevoke?.payPal === true && (
                <>
                  {" "}
                  <strong>
                    This ends access here but does not cancel the PayPal subscription. Cancel it in PayPal too,
                    or the member keeps being charged.
                  </strong>
                </>
              )}
              {confirmRevoke?.payPal === null && (
                <>
                  {" "}
                  <strong>
                    If this member pays through PayPal, this does not cancel the PayPal subscription. Cancel it
                    in PayPal too, or the member keeps being charged.
                  </strong>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmRevoke && handleActionMember(confirmRevoke.warning)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
