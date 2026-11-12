import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, LogIn, Headphones, Heart, Map as MapIcon, AlertTriangle, Calendar, Users } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { trackConversionEvent } from "@/lib/conversionTracking";
import SoberHelplineAppStoreBadge from "@/components/SoberHelplineAppStoreBadge";
import WhatsAppLink from "@/components/WhatsAppLink";
import { supabase } from "@/integrations/supabase/client";
import { arrivedFromApp } from "@/lib/webSession";

interface MobileNavProps {
  /** The signed-in user, when the page already tracks it. Left out, the menu looks it up itself. */
  user?: User | null;
  onLogout?: () => void;
  /** Screen sizes where the menu button shows. The home header hides it from lg up. */
  triggerClassName?: string;
}

const MobileNav = ({ user: userProp, onLogout, triggerClassName = "lg:hidden" }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const { isMember } = useMembershipStatus();
  const [ownUser, setOwnUser] = useState<User | null>(null);
  const tracksOwnUser = userProp === undefined;

  useEffect(() => {
    if (!tracksOwnUser) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setOwnUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setOwnUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, [tracksOwnUser]);

  const user = tracksOwnUser ? ownUser : userProp;
  const handleLogout = onLogout ?? (() => { void supabase.auth.signOut(); });
  // Opened from the Sober Helpline app: no link to website membership sales
  // (App Store guideline 3.1.1), the same rule the footer follows.
  const showMembershipLink = !isMember && !arrivedFromApp();

  const closeMenu = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
        <div className="flex flex-col h-full">
          {/* The panel has its own close button in the top corner. */}
          <div className="p-4 border-b">
            <SheetTitle className="font-semibold text-lg">Menu</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {user && isMember && (
                <Link to="/member-home" onClick={closeMenu}>
                  <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm">
                    <Heart className="w-4 h-4" />
                    My Family Hub
                  </Button>
                </Link>
              )}
              <Link to="/book-consultation?plan=emergency" onClick={() => { trackConversionEvent("coaching_click", { source: "mobile_nav_get_help" }); closeMenu(); }}>
                <Button className="w-full justify-start gap-2 bg-logo-blue hover:bg-logo-blue/90 text-white font-semibold shadow-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Get Help Now
                </Button>
              </Link>
              <Link to="/family-consultation" onClick={closeMenu}>
                <Button variant="outline" className="w-full justify-start gap-2 border-logo-green/30 text-logo-blue">
                  <Phone className="w-4 h-4" />
                  Crisis Family Consult
                </Button>
              </Link>
              <Link to="/family-squares" onClick={() => { trackConversionEvent("monday_zoom_click", { source: "mobile_nav" }); closeMenu(); }}>
                <Button variant="ghost" className="w-full justify-start gap-2 font-semibold text-primary">
                  <Calendar className="w-4 h-4" />
                  Family Squares
                </Button>
              </Link>
              <Link to="/intervention-help" onClick={() => { trackConversionEvent("intervention_readiness_click", { source: "mobile_nav" }); closeMenu(); }}>
                <Button variant="ghost" className="w-full justify-start gap-2 font-semibold text-primary">
                  <AlertTriangle className="w-4 h-4" />
                  Intervention Help
                </Button>
              </Link>
              <Link to="/roadmap/crisis" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-2 font-semibold text-primary">
                  <MapIcon className="w-4 h-4" />
                  Crisis Roadmap
                </Button>
              </Link>

              <div className="rounded-xl border border-logo-blue/20 bg-logo-blue/5 p-3">
                <p className="mb-2 text-sm font-semibold text-foreground">Sober Helpline App</p>
                <SoberHelplineAppStoreBadge height={38} source="mobile_nav" />
              </div>

              <div className="border-t my-2" />

              <div className="space-y-1">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Family Options
                </div>
                <Link to="/family-support" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    Free Family Support
                  </Button>
                </Link>
                <Link to="/family-coaching" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    Private Coaching Options
                  </Button>
                </Link>
                <Link to="/recovery-resources" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    Treatment Options Directory
                  </Button>
                </Link>
                <Link to="/blog" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    Blog
                  </Button>
                </Link>
                <Link to="/faqs" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    FAQs
                  </Button>
                </Link>
                <Link to="/addiction-assessment" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    Addiction Assessment
                  </Button>
                </Link>
                <Link to="/understanding-addiction" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    Understanding Addiction
                  </Button>
                </Link>
                <Link to="/recovery-podcasts" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-6">
                    Recovery Podcasts
                  </Button>
                </Link>
              </div>

              {showMembershipLink && (
                <Link to="/family-membership" onClick={() => { trackConversionEvent("membership_click", { source: "mobile_nav" }); closeMenu(); }}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Users className="w-4 h-4" />
                    Family Membership
                  </Button>
                </Link>
              )}

              <div className="space-y-1">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  For Providers
                </div>
                <Link to="/for-providers" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-4">
                    List Your Practice
                  </Button>
                </Link>
                <Link to="/consultation-provider-dashboard" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-4">
                    Provider Login
                  </Button>
                </Link>
                <a
                  href="https://gratis-class-d1c.notion.site/2bb286dad2cf8169863de855ab9a22c4?pvs=105"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  <Button variant="ghost" className="w-full justify-start pl-4">
                    Provider Inquiry
                  </Button>
                </a>
              </div>
            </div>

            <div className="border-t my-4" />

            <div className="space-y-2">
              {user ? (
                <Button variant="outline" className="w-full" onClick={() => { handleLogout(); closeMenu(); }}>
                  Logout
                </Button>
              ) : (
                <Link to="/auth" onClick={closeMenu}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>

          <div className="p-4 border-t bg-muted/50">
            <a href="tel:+14582988008" className="flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(458) 298-8008</span>
            </a>
            <WhatsAppLink source="mobile_nav" variant="inline" className="mt-2 justify-center" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
