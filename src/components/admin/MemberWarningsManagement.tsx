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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, AlertTriangle, UserX, Check, X, RefreshCw, Eye } from "lucide-react";

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

export function MemberWarningsManagement() {
  const [warnings, setWarnings] = useState<MemberWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedWarning, setSelectedWarning] = useState<MemberWarning | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

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

  const handleActionMember = async (warning: MemberWarning) => {
    setProcessing(warning.id);
    try {
      // First, update the warning status
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase
        .from('member_warnings')
        .update({
          status: 'actioned',
          admin_notes: adminNotes || 'Membership revoked based on this recommendation',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', warning.id);

      // Then, revoke the member's subscription
      const { error: subError } = await supabase
        .from('provider_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', warning.member_id)
        .is('provider_submission_id', null)
        .eq('status', 'active');

      if (subError) throw subError;

      toast.success("Member's access has been revoked");
      setSelectedWarning(null);
      setAdminNotes("");
      fetchWarnings();
    } catch (error) {
      console.error("Error actioning member:", error);
      toast.error("Failed to action member");
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
                  {warning.member_profile?.username || `${warning.member_profile?.first_name} ${warning.member_profile?.last_name}`}
                </TableCell>
                <TableCell className="max-w-xs truncate">{warning.reason}</TableCell>
                <TableCell>
                  {warning.moderator_profile?.username || `${warning.moderator_profile?.first_name} ${warning.moderator_profile?.last_name}`}
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
                  {selectedWarning.member_profile?.username || 
                   `${selectedWarning.member_profile?.first_name} ${selectedWarning.member_profile?.last_name}`}
                  <span className="text-muted-foreground ml-2">({selectedWarning.member_contact?.email || '-'})</span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Submitted By (Moderator)</label>
                <p className="mt-1">
                  {selectedWarning.moderator_profile?.username || 
                   `${selectedWarning.moderator_profile?.first_name} ${selectedWarning.moderator_profile?.last_name}`}
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
                    onClick={() => handleActionMember(selectedWarning)}
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
    </div>
  );
}
