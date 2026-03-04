import { Link } from "react-router-dom";
import { Crown, BookOpen, Users, MessageSquare, Sparkles, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const MembershipPromoBanner = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-logo-green/5 to-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 my-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 mb-4">
          <Crown className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Get Even More From Your Sober Helpline Experience
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
          Families who join our membership gain access to tools, community, and savings that support lasting change.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-6">
        <div className="flex items-start gap-3 bg-background/60 rounded-lg p-3">
          <BookOpen className="w-5 h-5 text-logo-green mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Education Center</p>
            <p className="text-xs text-muted-foreground">Guided videos, worksheets & meditations</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-background/60 rounded-lg p-3">
          <Users className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Private Forum</p>
            <p className="text-xs text-muted-foreground">Connect with families who understand</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-background/60 rounded-lg p-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">AI-Powered Tools</p>
            <p className="text-xs text-muted-foreground">Boundary builder, relapse guide & more</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-background/60 rounded-lg p-3">
          <DollarSign className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Member Coaching Discount</p>
            <p className="text-xs text-muted-foreground">$125/hr sessions — save $25 every time</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/family-membership">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Crown className="w-4 h-4" />
            Become a Member
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">Cancel anytime. No commitment required.</p>
      </div>
    </div>
  );
};

export default MembershipPromoBanner;
