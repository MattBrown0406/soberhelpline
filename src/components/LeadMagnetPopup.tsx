import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Gift, Download, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "leadMagnetDismissed";
const SHOW_DELAY = 8000; // 8 seconds

const LeadMagnetPopup = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !firstName) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("lead-magnet-signup", {
        body: { email, firstName, source: "homepage-popup" },
      });

      if (error) throw error;

      setIsSuccess(true);
      localStorage.setItem(STORAGE_KEY, "true");
      
      // Auto-close after showing success
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    } catch (err: any) {
      console.error("Lead magnet signup error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary/20 via-logo-green/20 to-primary/10 px-6 pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Gift className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-center text-foreground">
            Free Guide for Families
          </h2>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            5 Things Every Family Wishes They Knew Sooner About Addiction
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {isSuccess ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-logo-green mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">You're In!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your free guide is ready! Click below to read it now.
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => {
                    setIsVisible(false);
                    navigate("/free-guide?access=granted");
                  }} 
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Read My Free Guide
                </Button>
                <Button onClick={handleDismiss} variant="ghost" size="sm">
                  I'll read it later
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <Download className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Instant PDF download</span>
                </li>
                <li className="flex items-start gap-2">
                  <Download className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Weekly tips to support your journey</span>
                </li>
                <li className="flex items-start gap-2">
                  <Download className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>No spam, unsubscribe anytime</span>
                </li>
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11"
                  disabled={isSubmitting}
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Get My Free Guide"
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Join 2,000+ families getting weekly support
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadMagnetPopup;
