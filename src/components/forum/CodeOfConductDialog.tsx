import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, Heart, Users, AlertTriangle, MessageCircle } from "lucide-react";

interface CodeOfConductDialogProps {
  open: boolean;
  onAgree: () => Promise<void>;
}

export function CodeOfConductDialog({ open, onAgree }: CodeOfConductDialogProps) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAgree = async () => {
    setIsSubmitting(true);
    try {
      await onAgree();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-primary" />
            Community Code of Conduct
          </DialogTitle>
          <DialogDescription>
            Please read and agree to our community guidelines before participating in discussions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 max-h-[50vh]">
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Be Compassionate & Supportive</h3>
                  <p className="text-sm text-muted-foreground">
                    Remember that everyone here is dealing with difficult situations. Approach all interactions with 
                    empathy and understanding. Offer encouragement, not judgment. We're all in this together.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Respect Privacy & Confidentiality</h3>
                  <p className="text-sm text-muted-foreground">
                    What is shared in this forum stays in this forum. Never share another member's story, identity, 
                    or personal details outside of this community. Use your username to protect your own identity.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Create a Safe Space</h3>
                  <p className="text-sm text-muted-foreground">
                    No harassment, bullying, or personal attacks. Discrimination of any kind will not be tolerated. 
                    This includes language that is racist, sexist, homophobic, transphobic, or otherwise hateful.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">No Medical Advice</h3>
                  <p className="text-sm text-muted-foreground">
                    While sharing experiences is encouraged, do not provide specific medical, legal, or professional 
                    advice. Always recommend consulting with qualified professionals for such matters.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Communicate Thoughtfully</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a moment before posting to consider how your words may be received. Avoid all caps, 
                    excessive punctuation, or inflammatory language. Focus on constructive dialogue.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">Violations & Consequences</h3>
              <p className="text-sm text-muted-foreground">
                Violations of this code of conduct may result in content removal, temporary suspension, or permanent 
                revocation of membership. If you see concerning content, please report it to our moderation team.
              </p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">Remember Why We're Here</h3>
              <p className="text-sm text-muted-foreground">
                This community exists to support families navigating the challenges of addiction. Every member deserves 
                to feel safe, heard, and supported. Together, we can make a difference in each other's lives.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-col gap-4 pt-4 border-t">
          <div className="flex items-start space-x-3 w-full">
            <Checkbox
              id="agree-coc"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <Label htmlFor="agree-coc" className="text-sm font-normal leading-relaxed cursor-pointer">
              I have read and agree to abide by the Community Code of Conduct. I understand that violations may 
              result in the revocation of my membership.
            </Label>
          </div>
          <Button 
            onClick={handleAgree} 
            disabled={!agreed || isSubmitting}
            className="w-full sm:w-auto sm:self-end"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "I Agree - Enter Forum"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}