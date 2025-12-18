import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, AlertTriangle, UserX } from "lucide-react";

interface ModeratorActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Array<{
    id: string;
    username: string | null;
    first_name: string;
    last_name: string;
  }>;
}

export function ModeratorActionsDialog({ 
  open, 
  onOpenChange, 
  members 
}: ModeratorActionsDialogProps) {
  const [selectedMember, setSelectedMember] = useState("");
  const [actionType, setActionType] = useState<"warning" | "removal_recommendation">("warning");
  const [reason, setReason] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMember || !reason.trim()) {
      toast.error("Please select a member and provide a reason");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { error } = await supabase
        .from('member_warnings')
        .insert({
          member_id: selectedMember,
          moderator_id: user.id,
          warning_type: actionType,
          reason: reason.trim(),
          post_content: postContent.trim() || null
        });

      if (error) throw error;

      toast.success(
        actionType === 'warning' 
          ? "Warning submitted for admin review" 
          : "Removal recommendation submitted for admin review"
      );
      
      // Reset form
      setSelectedMember("");
      setActionType("warning");
      setReason("");
      setPostContent("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting action:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedMember("");
    setActionType("warning");
    setReason("");
    setPostContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {actionType === 'warning' ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <UserX className="h-5 w-5 text-destructive" />
            )}
            Moderator Action
          </DialogTitle>
          <DialogDescription>
            Submit a warning or removal recommendation for admin review. 
            Your identity will be recorded but kept confidential from the member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Action Type</Label>
            <Select value={actionType} onValueChange={(v: "warning" | "removal_recommendation") => setActionType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warning">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Issue Warning
                  </div>
                </SelectItem>
                <SelectItem value="removal_recommendation">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-destructive" />
                    Recommend Removal
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Member</Label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member..." />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.username || `${member.first_name} ${member.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reason *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the concerning behavior or policy violation..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Related Post Content (Optional)</Label>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Copy any relevant post content here..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedMember || !reason.trim()}
            variant={actionType === 'removal_recommendation' ? 'destructive' : 'default'}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : actionType === 'warning' ? (
              <AlertTriangle className="h-4 w-4 mr-2" />
            ) : (
              <UserX className="h-4 w-4 mr-2" />
            )}
            Submit for Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
