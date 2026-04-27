import { ExternalLink, MessageSquareMore, Shield, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import familyBridgeLogo from "@/assets/family-bridge-logo.png";
import { trackConversionEvent } from "@/lib/conversionTracking";

interface FamilyBridgeCTAProps {
  variant?: "banner" | "card" | "inline" | "post-completion" | "forum" | "coaching";
  className?: string;
}

const FamilyBridgeCTA = ({ variant = "card", className = "" }: FamilyBridgeCTAProps) => {
  const handleClick = () => {
    trackConversionEvent("coaching_click", { source: "familybridge_cta", label: variant });
    window.open('https://familybridgeapp.com', '_blank', 'noopener,noreferrer');
  };

  // Banner variant (used on homepage)
  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-[#1a8a8a] via-[#1f9e9e] to-[#1a8a8a] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2bb3b3]/30 cursor-pointer group ${className}`} onClick={handleClick}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="bg-white rounded-lg p-3 shadow-md">
              <img src={familyBridgeLogo} alt="FamilyBridge" className="h-12 w-12 object-contain" />
            </div>
            <div className="text-white text-center md:text-left">
              <h3 className="font-bold text-xl mb-1">Take the Next Step</h3>
              <p className="text-white/90 text-sm">Ready to put this into practice?</p>
            </div>
          </div>
          <div className="flex-1 text-white/95 text-center md:text-left">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">FamilyBridge</span> helps your family communicate with structure and accountability. 
              Our AI-powered FIIS technology provides real-time conversation coaching and recovery tracking.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-5 py-2.5 transition-colors group-hover:scale-105 duration-200 flex-shrink-0">
            <span className="text-white font-semibold text-sm whitespace-nowrap">Try FamilyBridge</span>
            <ExternalLink className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // Card variant (standalone card)
  if (variant === "card") {
    return (
      <Card className={`hover:shadow-lg transition-shadow border-teal-200 dark:border-teal-800 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-teal-100 dark:bg-teal-900/30 rounded-lg p-2 flex-shrink-0">
              <img src={familyBridgeLogo} alt="FamilyBridge" className="h-10 w-10 object-contain" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">Ready to Take Action?</h3>
                <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full text-xs font-medium">
                  Companion App
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-medium">FamilyBridge</span> turns education into action with AI-powered communication coaching 
                and family accountability tools designed specifically for addiction recovery.
              </p>
              <Button onClick={handleClick} size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                Explore FamilyBridge
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Post-completion variant (after educational content)
  if (variant === "post-completion") {
    return (
      <div className={`bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 ${className}`}>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm flex-shrink-0">
            <img src={familyBridgeLogo} alt="FamilyBridge" className="h-12 w-12 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-teal-600" />
              <h3 className="font-semibold text-foreground">Ready to put this into practice?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              You've learned the concepts—now <span className="font-medium">FamilyBridge</span> helps your family 
              communicate with structure and accountability. FIIS technology provides real-time coaching 
              for difficult conversations.
            </p>
            <Button onClick={handleClick} className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              Start Your Family's Journey
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Forum variant (private family space)
  if (variant === "forum") {
    return (
      <Card className={`border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 ${className}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-2 shadow-sm">
              <img src={familyBridgeLogo} alt="FamilyBridge" className="h-8 w-8 object-contain" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-foreground text-sm">Need a private space for your family?</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                While this forum connects you with other families, <span className="font-medium">FamilyBridge</span> creates 
                a secure, private space for your family's recovery conversations.
              </p>
              <Button onClick={handleClick} size="sm" variant="outline" className="text-purple-700 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 gap-2 text-xs h-8">
                Try FamilyBridge
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Coaching variant (AI tools section)
  if (variant === "coaching") {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-full p-3 shadow-sm">
            <img src={familyBridgeLogo} alt="FamilyBridge" className="h-10 w-10 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquareMore className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-foreground">Want real-time conversation coaching?</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              <span className="font-medium">FamilyBridge's FIIS technology</span> provides intelligent coaching 
              during actual conversations with your loved one—not just practice scenarios.
            </p>
            <Button onClick={handleClick} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              Learn About FIIS Technology
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant (minimal)
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg px-4 py-3 ${className}`}>
        <img src={familyBridgeLogo} alt="FamilyBridge" className="h-6 w-6 object-contain" />
        <span className="text-sm text-foreground">
          Ready to take action? <button onClick={handleClick} className="font-medium text-teal-600 hover:text-teal-700 underline inline-flex items-center gap-1">
            Try FamilyBridge <ExternalLink className="h-3 w-3" />
          </button>
        </span>
      </div>
    );
  }

  // Default to card variant
  return (
    <Card className={`hover:shadow-lg transition-shadow border-teal-200 dark:border-teal-800 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-teal-100 dark:bg-teal-900/30 rounded-lg p-2 flex-shrink-0">
            <img src={familyBridgeLogo} alt="FamilyBridge" className="h-10 w-10 object-contain" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Take the Next Step</h3>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-medium">FamilyBridge</span> helps your family communicate with structure and accountability.
            </p>
            <Button onClick={handleClick} size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              Learn More
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyBridgeCTA;
