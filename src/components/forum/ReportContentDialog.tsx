import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportContentDialog({ open, onOpenChange }: ReportContentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [postContent, setPostContent] = useState("");
  const [concernDetails, setConcernDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !postContent.trim() || !concernDetails.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-content-report', {
        body: {
          reportedUsername: username.trim(),
          postContent: postContent.trim(),
          concernDetails: concernDetails.trim(),
        },
      });

      if (error) {
        console.error('Report error:', error);
        toast.error("Failed to send report. Please try again.");
      } else {
        toast.success("Report submitted successfully. Thank you for helping keep our community safe.");
        setUsername("");
        setPostContent("");
        setConcernDetails("");
        onOpenChange(false);
      }
    } catch (err) {
      console.error('Report submission error:', err);
      toast.error("Failed to send report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Concerning Content
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe and supportive community. Your report will be submitted anonymously.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-2">
            <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your identity will remain anonymous. We only use this information to review the reported content.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username of the person who posted *</Label>
            <Input
              id="username"
              placeholder="Enter the username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postContent">Copy the post content that caused concern *</Label>
            <Textarea
              id="postContent"
              placeholder="Paste or type the content here..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
              rows={4}
              maxLength={2000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concernDetails">Why is this content concerning? *</Label>
            <Textarea
              id="concernDetails"
              placeholder="Please describe why you find this content concerning..."
              value={concernDetails}
              onChange={(e) => setConcernDetails(e.target.value)}
              required
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
