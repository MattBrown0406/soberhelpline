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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Loader2,
  UserX,
  CheckCircle,
  XCircle,
  RefreshCw,
  Pencil,
  RotateCw,
  UserPlus,
  Archive,
  Users,
} from "lucide-react";

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
    next_billing_date: string | null;
  } | null;
  contact?: {
    email: string;
    phone_number: string | null;
  };
  last_sign_in_at?: string | null;
  account_created_at?: string | null;
}

export function FamilyMemberManagement() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<FamilyMember | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [editForm, setEditForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [saving, setSaving] = useState(false);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [grantEmail, setGrantEmail] = useState("");
  const [granting, setGranting] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    setLoading(true);
    try {
      const { data: subscriptions, error: subError } = await supabase
        .from('provider_subscriptions')
        .select('*')
        .is('provider_submission_id', null)
        .order('created_at', { ascending: true });

      if (subError) throw subError;

      if (!subscriptions || subscriptions.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(subscriptions.map(s => s.user_id))];

      // Fetch profiles, contacts, and last sign-in in parallel
      const [profilesRes, contactsRes, signInRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, first_name, last_name, created_at, agreed_to_code_of_conduct, code_of_conduct_agreed_at')
          .in('id', userIds),
        supabase
          .from('profile_private')
          .select('user_id, email, phone_number')
          .in('user_id', userIds),
        supabase.rpc('get_user_last_sign_in', { _user_ids: userIds }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (contactsRes.error) throw contactsRes.error;

      const signInMap = new Map<string, { last_sign_in_at: string | null; created_at: string | null }>();
      if (signInRes.data) {
        for (const row of signInRes.data as any[]) {
          signInMap.set(row.user_id, {
            last_sign_in_at: row.last_sign_in_at,
            created_at: row.created_at,
          });
        }
      }

      const membersData: FamilyMember[] = (profilesRes.data || []).map(profile => {
        const userSubs = subscriptions.filter(s => s.user_id === profile.id);
        const activeSub = userSubs.find(s => s.status === 'active') || userSubs[0];
        const contact = contactsRes.data?.find(c => c.user_id === profile.id);
        const signIn = signInMap.get(profile.id);

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
          } : null,
          last_sign_in_at: signIn?.last_sign_in_at || null,
          account_created_at: signIn?.created_at || null,
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

  const activeMembers = members.filter(m => m.subscription?.status === 'active');
  const archivedMembers = members.filter(m => m.subscription?.status === 'cancelled' || m.subscription?.status === 'expired');
  const otherMembers = members.filter(m => m.subscription?.status !== 'active' && m.subscription?.status !== 'cancelled' && m.subscription?.status !== 'expired');

  const handleSyncSubscription = async (member: FamilyMember) => {
    const subscriptionId = member.subscription?.paypal_subscription_id;
    if (!subscriptionId) return;

    setSyncing(member.id);
    try {
      const { data, error } = await supabase.functions.invoke("paypal-admin-sync", {
        body: { action: "sync-subscription", subscriptionId },
      });

      if (error) throw error;

      if (data?.updated) {
        toast.success("Subscription updated to active");
      } else {
        toast.message("No change", {
          description: `PayPal status: ${data?.paypalStatus || "unknown"}`,
        });
      }

      await fetchFamilyMembers();
    } catch (e) {
      console.error("Error syncing subscription:", e);
      toast.error("Failed to sync subscription status");
    } finally {
      setSyncing(null);
    }
  };

  const handleRevokeMembership = async (member: FamilyMember) => {
    if (!member.subscription) return;

    setRevoking(member.id);
    try {
      const { error } = await supabase
        .from("provider_subscriptions")
        .update({ status: "cancelled" })
        .eq("id", member.subscription.id);

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

  const handleGrantFreeMembership = async () => {
    if (!grantEmail.trim()) return;
    setGranting(true);
    const email = grantEmail.trim().toLowerCase();
    try {
      const { data: privateProfile, error: lookupError } = await supabase
        .from('profile_private')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (privateProfile) {
        const { data: existing } = await supabase
          .from('provider_subscriptions')
          .select('id')
          .eq('user_id', privateProfile.user_id)
          .is('provider_submission_id', null)
          .eq('status', 'active')
          .maybeSingle();

        if (existing) {
          toast.error("This user already has an active family membership");
          setGranting(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', privateProfile.user_id)
          .maybeSingle();

        const { error: insertError } = await supabase
          .from('provider_subscriptions')
          .insert({
            user_id: privateProfile.user_id,
            provider_submission_id: null,
            plan_type: 'free',
            status: 'active',
            amount: 0,
            start_date: new Date().toISOString(),
            paypal_subscription_id: null,
          });

        if (insertError) throw insertError;

        await supabase.functions.invoke("send-free-membership-email", {
          body: { email, type: "existing_user", firstName: profile?.first_name || "" },
        });

        toast.success("Free membership granted and welcome email sent!");
      } else {
        const { error: pendingError } = await supabase
          .from('pending_free_memberships')
          .insert({ email, status: 'pending' });

        if (pendingError) {
          if (pendingError.code === '23505') {
            toast.error("An invitation has already been sent to this email address");
            setGranting(false);
            return;
          }
          throw pendingError;
        }

        await supabase.functions.invoke("send-free-membership-email", {
          body: { email, type: "new_user" },
        });

        toast.success("Invitation email sent! Membership will activate automatically when they create an account.");
      }

      setShowGrantDialog(false);
      setGrantEmail("");
      fetchFamilyMembers();
    } catch (error) {
      console.error("Error granting membership:", error);
      toast.error("Failed to grant membership");
    } finally {
      setGranting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      pending: "secondary",
      cancelled: "destructive",
      expired: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };

  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderActiveTable = (memberList: FamilyMember[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Member Since</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberList.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.username || <span className="text-muted-foreground italic">Not set</span>}
              </TableCell>
              <TableCell>
                {member.first_name} {member.last_name}
              </TableCell>
              <TableCell>{member.contact?.email || '-'}</TableCell>
              <TableCell className="text-sm">{formatDateTime(member.last_sign_in_at)}</TableCell>
              <TableCell className="text-sm">
                {member.subscription?.created_at 
                  ? formatDate(member.subscription.created_at) 
                  : '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditMember(member)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {member.subscription?.status === "pending" && member.subscription?.paypal_subscription_id && (
                    <Button variant="outline" size="sm" onClick={() => handleSyncSubscription(member)} disabled={syncing === member.id}>
                      {syncing === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RotateCw className="h-4 w-4 mr-1" />Sync</>}
                    </Button>
                  )}
                  {member.subscription?.status === "active" && (
                    <Button variant="destructive" size="sm" onClick={() => setConfirmRevoke(member)} disabled={revoking === member.id}>
                      {revoking === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserX className="h-4 w-4 mr-1" />Revoke</>}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {memberList.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No members found</div>
      )}
    </div>
  );

  const renderArchivedTable = (memberList: FamilyMember[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Member Since</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberList.map((member) => (
            <TableRow key={member.id} className="opacity-70">
              <TableCell className="font-medium">
                {member.username || <span className="text-muted-foreground italic">Not set</span>}
              </TableCell>
              <TableCell>{member.first_name} {member.last_name}</TableCell>
              <TableCell>{member.contact?.email || '-'}</TableCell>
              <TableCell>{member.subscription ? getStatusBadge(member.subscription.status) : '-'}</TableCell>
              <TableCell className="text-sm">{member.subscription?.plan_type || '-'}</TableCell>
              <TableCell className="text-sm">{formatDate(member.subscription?.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {memberList.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No archived members</div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {activeMembers.length} active, {archivedMembers.length} archived
        </p>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={() => setShowGrantDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Grant Free Membership
          </Button>
          <Button variant="outline" size="sm" onClick={fetchFamilyMembers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Users className="h-4 w-4" />
            Active ({activeMembers.length})
          </TabsTrigger>
          {otherMembers.length > 0 && (
            <TabsTrigger value="pending" className="gap-2">
              Pending ({otherMembers.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="archived" className="gap-2">
            <Archive className="h-4 w-4" />
            Archived ({archivedMembers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {renderActiveTable(activeMembers)}
        </TabsContent>

        {otherMembers.length > 0 && (
          <TabsContent value="pending">
            {renderActiveTable(otherMembers)}
          </TabsContent>
        )}

        <TabsContent value="archived">
          {renderArchivedTable(archivedMembers)}
        </TabsContent>
      </Tabs>

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
              <Input id="edit-username" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} placeholder="Username" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-first-name">First Name</Label>
                <Input id="edit-first-name" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} placeholder="First name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last-name">Last Name</Label>
                <Input id="edit-last-name" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} placeholder="Last name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input id="edit-phone" value={editForm.phone_number} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} placeholder="Phone number" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grant Free Membership Dialog */}
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grant Free Family Membership</DialogTitle>
            <DialogDescription>
              Enter an email address to grant a free membership. If the user already has an account, they'll receive a welcome email. If not, they'll receive an invitation to create an account and their membership will activate automatically upon signup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="grant-email">User Email</Label>
              <Input id="grant-email" type="email" value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} placeholder="user@example.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowGrantDialog(false); setGrantEmail(""); }}>Cancel</Button>
            <Button onClick={handleGrantFreeMembership} disabled={granting || !grantEmail.trim()}>
              {granting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Granting...</> : <><UserPlus className="h-4 w-4 mr-2" />Grant Membership</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
