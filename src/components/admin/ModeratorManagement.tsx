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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Shield, ShieldOff, UserPlus, RefreshCw } from "lucide-react";

interface Moderator {
  id: string;
  user_id: string;
  role: string;
  created_at: string | null;
  profile: {
    username: string | null;
    first_name: string;
    last_name: string;
    email?: string;
  } | null;
  contact?: {
    email: string;
  } | null;
}

interface FamilyMember {
  id: string;
  username: string | null;
  first_name: string;
  last_name: string;
  email: string;
}

export function ModeratorManagement() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Moderator | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [addingModerator, setAddingModerator] = useState(false);

  useEffect(() => {
    fetchModerators();
    fetchFamilyMembers();
  }, []);

  const fetchModerators = async () => {
    setLoading(true);
    try {
      // Get all moderator roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'moderator');

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) {
        setModerators([]);
        setLoading(false);
        return;
      }

      // Fetch profiles for these users
      const userIds = roles.map(r => r.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name')
        .in('id', userIds);

      if (profileError) throw profileError;

      const { data: contacts, error: contactError } = await supabase
        .from('profile_private')
        .select('user_id, email')
        .in('user_id', userIds);

      if (contactError) throw contactError;

      // Combine data
      const moderatorData: Moderator[] = roles.map(role => {
        const profile = profiles?.find(p => p.id === role.user_id);
        const contact = contacts?.find(c => c.user_id === role.user_id);
        return {
          ...role,
          profile: profile || null,
          contact: contact ? { email: contact.email } : null,
        };
      });

      setModerators(moderatorData);
    } catch (error) {
      console.error("Error fetching moderators:", error);
      toast.error("Failed to load moderators");
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      // Get all active family members
      const { data: subscriptions, error: subError } = await supabase
        .from('provider_subscriptions')
        .select('user_id')
        .is('provider_submission_id', null)
        .eq('status', 'active');

      if (subError) throw subError;

      if (!subscriptions || subscriptions.length === 0) {
        setFamilyMembers([]);
        return;
      }

      const userIds = [...new Set(subscriptions.map(s => s.user_id))];

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name')
        .in('id', userIds);

      if (profileError) throw profileError;

      const { data: contacts, error: contactError } = await supabase
        .from('profile_private')
        .select('user_id, email')
        .in('user_id', userIds);

      if (contactError) throw contactError;

      const merged: FamilyMember[] = (profiles || []).map(p => {
        const contact = contacts?.find(c => c.user_id === p.id);
        return { ...p, email: contact?.email || '' };
      });

      setFamilyMembers(merged);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  const handleAddModerator = async () => {
    if (!selectedMember) return;

    setAddingModerator(true);
    try {
      // Check if already a moderator
      const existing = moderators.find(m => m.user_id === selectedMember);
      if (existing) {
        toast.error("This member is already a moderator");
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedMember,
          role: 'moderator'
        });

      if (error) throw error;

      toast.success("Moderator added successfully");
      setShowAddDialog(false);
      setSelectedMember("");
      fetchModerators();
    } catch (error) {
      console.error("Error adding moderator:", error);
      toast.error("Failed to add moderator");
    } finally {
      setAddingModerator(false);
    }
  };

  const handleRemoveModerator = async (moderator: Moderator) => {
    setRemoving(moderator.id);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', moderator.id);

      if (error) throw error;

      toast.success(`Moderator role removed for ${moderator.profile?.username || moderator.profile?.first_name}`);
      setConfirmRemove(null);
      fetchModerators();
    } catch (error) {
      console.error("Error removing moderator:", error);
      toast.error("Failed to remove moderator");
    } finally {
      setRemoving(null);
    }
  };

  // Filter out users who are already moderators
  const availableMembers = familyMembers.filter(
    member => !moderators.some(mod => mod.user_id === member.id)
  );

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
          {moderators.length} moderator{moderators.length !== 1 ? 's' : ''} assigned
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchModerators}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Moderator
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moderators.map((moderator) => (
              <TableRow key={moderator.id}>
                <TableCell className="font-medium">
                  {moderator.profile?.username || <span className="text-muted-foreground italic">Not set</span>}
                </TableCell>
                <TableCell>
                  {moderator.profile?.first_name} {moderator.profile?.last_name}
                </TableCell>
                <TableCell>{moderator.contact?.email || '-'}</TableCell>
                <TableCell>
                  <Badge className="gap-1">
                    <Shield className="h-3 w-3" />
                    Moderator
                  </Badge>
                </TableCell>
                <TableCell>
                  {moderator.created_at 
                    ? new Date(moderator.created_at).toLocaleDateString() 
                    : '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmRemove(moderator)}
                    disabled={removing === moderator.id}
                  >
                    {removing === moderator.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldOff className="h-4 w-4 mr-1" />
                        Remove
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {moderators.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No moderators assigned yet
        </div>
      )}

      {/* Add Moderator Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Moderator</DialogTitle>
            <DialogDescription>
              Select a family member to give moderator permissions. Moderators can warn members and recommend account removals.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member..." />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.length === 0 ? (
                  <SelectItem value="none" disabled>No eligible members</SelectItem>
                ) : (
                  availableMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.username || `${member.first_name} ${member.last_name}`} ({member.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddModerator} 
              disabled={!selectedMember || addingModerator}
            >
              {addingModerator ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Add Moderator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Dialog */}
      <AlertDialog open={!!confirmRemove} onOpenChange={() => setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Moderator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove moderator permissions from{" "}
              <strong>{confirmRemove?.profile?.username || confirmRemove?.profile?.first_name}</strong>?
              They will no longer be able to warn members or recommend removals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmRemove && handleRemoveModerator(confirmRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Moderator
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
