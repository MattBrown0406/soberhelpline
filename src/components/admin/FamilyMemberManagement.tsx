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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UserX, CheckCircle, XCircle, RefreshCw, Pencil } from "lucide-react";

interface FamilyMember {
  id: string;
  username: string | null;
  first_name: string;
  last_name: string;
  created_at: string | null;
  agreed_to_code_of_conduct: boolean | null;
  code_of_conduct_agreed_at: string | null;
  subscription?: {
    id: string;
    status: string;
    plan_type: string;
    amount: number;
    created_at: string;
    paypal_subscription_id: string | null;
  } | null;
  contact?: {
    email: string;
    phone_number: string | null;
  };
}

export function FamilyMemberManagement() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<FamilyMember | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [editForm, setEditForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    setLoading(true);
    try {
      // First get all family memberships (subscriptions without provider_submission_id)
      const { data: subscriptions, error: subError } = await supabase
        .from('provider_subscriptions')
        .select('*')
        .is('provider_submission_id', null)
        .order('created_at', { ascending: false });

      if (subError) throw subError;

      if (!subscriptions || subscriptions.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(subscriptions.map(s => s.user_id))];

      // Fetch profiles for these users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name, created_at, agreed_to_code_of_conduct, code_of_conduct_agreed_at')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Fetch contact info for these users
      const { data: contacts, error: contactError } = await supabase
        .from('profile_private')
        .select('user_id, email, phone_number')
        .in('user_id', userIds);

      if (contactError) throw contactError;

      // Combine data - for each profile, find their active/latest subscription
      const membersData: FamilyMember[] = (profiles || []).map(profile => {
        const userSubs = subscriptions.filter(s => s.user_id === profile.id);
        const activeSub = userSubs.find(s => s.status === 'active') || userSubs[0];
        const contact = contacts?.find(c => c.user_id === profile.id);

        return {
          ...profile,
          contact: contact ? { email: contact.email, phone_number: contact.phone_number } : undefined,
          subscription: activeSub ? {
            id: activeSub.id,
            status: activeSub.status,
            plan_type: activeSub.plan_type,
            amount: activeSub.amount,
            created_at: activeSub.created_at,
            paypal_subscription_id: activeSub.paypal_subscription_id,
          } : null
        };
      });

      setMembers(membersData);
    } catch (error) {
      console.error("Error fetching family members:", error);
      toast.error("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeMembership = async (member: FamilyMember) => {
    if (!member.subscription) return;
    
    setRevoking(member.id);
    try {
      // Update the subscription status to cancelled
      const { error } = await supabase
        .from('provider_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', member.subscription.id);

      if (error) throw error;

      toast.success(`Membership revoked for ${member.username || member.first_name}`);
      setConfirmRevoke(null);
      fetchFamilyMembers();
    } catch (error) {
      console.error("Error revoking membership:", error);
      toast.error("Failed to revoke membership");
    } finally {
      setRevoking(null);
    }
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditForm({
      username: member.username || '',
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      email: member.contact?.email || '',
      phone_number: member.contact?.phone_number || '',
    });
    setEditingMember(member);
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;
    
    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: editForm.username || null,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
        })
        .eq('id', editingMember.id);

      if (profileError) {
        if (profileError.code === '23505') {
          toast.error("Username is already taken. Please choose a different one.");
          setSaving(false);
          return;
        }
        throw profileError;
      }

      // Update private profile
      const { error: privateError } = await supabase
        .from('profile_private')
        .update({
          email: editForm.email,
          phone_number: editForm.phone_number || null,
        })
        .eq('user_id', editingMember.id);

      if (privateError) throw privateError;

      toast.success("Member details updated successfully");
      setEditingMember(null);
      fetchFamilyMembers();
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member details");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      pending: "secondary",
      cancelled: "destructive",
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
          {members.length} family member{members.length !== 1 ? 's' : ''} found
        </p>
        <Button variant="outline" size="sm" onClick={fetchFamilyMembers}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Code of Conduct</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.username || <span className="text-muted-foreground italic">Not set</span>}
                </TableCell>
                <TableCell>
                  {member.first_name} {member.last_name}
                </TableCell>
                <TableCell>{member.contact?.email || '-'}</TableCell>
                <TableCell>{member.contact?.phone_number || '-'}</TableCell>
                <TableCell>
                  {member.agreed_to_code_of_conduct ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Agreed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xs">Not yet</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {member.subscription ? getStatusBadge(member.subscription.status) : (
                    <Badge variant="secondary">No subscription</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {member.subscription?.created_at 
                    ? new Date(member.subscription.created_at).toLocaleDateString() 
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {member.subscription?.status === 'active' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmRevoke(member)}
                        disabled={revoking === member.id}
                      >
                        {revoking === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Revoke
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No family members found
        </div>
      )}

      <AlertDialog open={!!confirmRevoke} onOpenChange={() => setConfirmRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Membership</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the membership for{" "}
              <strong>{confirmRevoke?.username || confirmRevoke?.first_name}</strong>?
              They will lose access to the family forum and all member benefits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmRevoke && handleRevokeMembership(confirmRevoke)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Member Details</DialogTitle>
            <DialogDescription>
              Update the account information for {editingMember?.first_name} {editingMember?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-first-name">First Name</Label>
                <Input
                  id="edit-first-name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last-name">Last Name</Label>
                <Input
                  id="edit-last-name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editForm.phone_number}
                onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                placeholder="Phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}