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
import { toast } from "sonner";
import { Loader2, UserX, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface FamilyMember {
  id: string;
  username: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
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
}

export function FamilyMemberManagement() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<FamilyMember | null>(null);

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
        .select('*')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Combine data - for each profile, find their active/latest subscription
      const membersData: FamilyMember[] = (profiles || []).map(profile => {
        const userSubs = subscriptions.filter(s => s.user_id === profile.id);
        const activeSub = userSubs.find(s => s.status === 'active') || userSubs[0];
        
        return {
          ...profile,
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
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone_number}</TableCell>
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
    </div>
  );
}