import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Home, ArrowLeft, Phone, Heart } from "lucide-react";
import Footer from "./Footer";
import SiteSearch from "./SiteSearch";
import Breadcrumbs from "./Breadcrumbs";
import { getBreadcrumbs } from "@/data/breadcrumbMap";
import { useNativeBackButton } from "@/hooks/useNativeBackButton";
import DefaultSEO from "./DefaultSEO";
import { SEOOverrideProvider } from "@/contexts/SEOOverrideContext";
import logo from "@/assets/logo.png";
import StickyContactForm from "./StickyContactForm";
import WhatsAppLink from "./WhatsAppLink";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import GuideMemberBar from "./GuideMemberBar";
import MobileNav from "./MobileNav";
import GuideMembershipPrompt from "./GuideMembershipPrompt";
import { arrivedFromApp } from "@/lib/webSession";
import { memberBarItem, findLibraryItem } from "@/data/memberLibrary";

interface LayoutProps {
  children: React.ReactNode;
}

// Library pages that are members-only: they show the lock card to visitors.
const GATED_LIBRARY_PATHS = new Set(["/ai-prompts", "/communication-guide"]);

// The app wraps every route in <Layout> (App.tsx), and many older pages also
// wrap themselves in one. A nested Layout renders only its children, so those
// pages don't get a second header, footer and contact button.
const InsideLayout = createContext(false);

const Layout = ({ children }: LayoutProps) => {
  const nested = useContext(InsideLayout);
  if (nested) return <>{children}</>;
  return (
    <InsideLayout.Provider value={true}>
      <SiteLayout>{children}</SiteLayout>
    </InsideLayout.Provider>
  );
};

const SiteLayout = ({ children }: LayoutProps) => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { isMember, loading: membershipLoading } = useMembershipStatus();
  // The member bar is dismissed for one page view at a time.
  const [barDismissedOn, setBarDismissedOn] = useState<string | null>(null);

  // Handle native back button for mobile apps
  useNativeBackButton();

  useEffect(() => {
    // A link to an anchor (e.g. /workbook/hard-moment-practice) is
    // scrolled by the page itself once its content has loaded.
    if (hash) return;
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setBarDismissedOn(null);
  }, [pathname]);

  const barItem = isMember ? memberBarItem(pathname) : undefined;
  // Library reading guides get the larger, higher-contrast reading styles (index.css).
  const isLibraryGuide = findLibraryItem(pathname)?.type === "guide";
  const showMemberBar = !!barItem && barDismissedOn !== pathname;
  // Library guides that anyone can read end with a note about the membership
  // they come from. Not on pages that already show the members-only card, and
  // not for visitors who came from the app (App Store guideline 3.1.1).
  const openGuide = !isMember && !membershipLoading ? memberBarItem(pathname) : undefined;
  const showGuidePrompt =
    !!openGuide && !GATED_LIBRARY_PATHS.has(openGuide.path) && !arrivedFromApp();

  const isHome = pathname === "/";
  const isReferralFit = pathname === "/referralfit" || pathname === "/referralfit-support";
  const isSharedKiosk = pathname === "/family-squares-kiosk";
  const breadcrumbs = getBreadcrumbs(pathname);

  if (isSharedKiosk) {
    return (
      <SEOOverrideProvider>
        <div className="min-h-screen">
          <DefaultSEO />
          <main id="main-content">{children}</main>
        </div>
      </SEOOverrideProvider>
    );
  }

  return (
    <SEOOverrideProvider>
    <div className="min-h-screen flex flex-col">
      <DefaultSEO />
      {/* Skip to main content - visually hidden until focused */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {!isHome && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40 print:hidden">
          <div className="container mx-auto px-4 flex items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-4 shrink-0">
              <img src={logo} alt="Sober Helpline" className="h-14 w-auto" />
            </Link>

            {/* Back / Home navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
                aria-label="Go home"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>

            {/* Search */}
            <div className="ml-auto flex items-center gap-2">
              <nav className="hidden xl:flex items-center gap-1" aria-label="Family support paths">
                <Link
                  to="/start-here"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-primary/80"
                >
                  Start Here
                </Link>
                <Link
                  to="/family-consultation"
                  onClick={() => trackConversionEvent("coaching_click", { source: "desktop_header" })}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Coaching
                </Link>
                <Link
                  to="/family-squares"
                  onClick={() => trackConversionEvent("monday_zoom_click", { source: "desktop_header" })}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Monday Zoom
                </Link>
                <Link
                  to="/intervention-help"
                  onClick={() => trackConversionEvent("intervention_readiness_click", { source: "desktop_header" })}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Intervention?
                </Link>
                {!isMember && !arrivedFromApp() && (
                  <Link
                    to="/family-membership"
                    onClick={() => trackConversionEvent("membership_click", { source: "desktop_header" })}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    Membership
                  </Link>
                )}
              </nav>
              <SiteSearch />
              {isMember && pathname !== "/member-home" && (
                <Link
                  to="/member-home"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 px-2 sm:px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors shrink-0"
                  aria-label="Go to My Family Hub"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">My Family Hub</span>
                </Link>
              )}
              {/* Phone number */}
              <a
                href="tel:+14582988008"
                onClick={() => trackPhoneClick("layout_header")}
                className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-2 text-primary hover:text-primary/80 font-semibold text-sm shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Call Sober Helpline"
              >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="sm:hidden">Call</span>
              <span className="hidden sm:inline">(458) 298-8008</span>
              </a>
              <WhatsAppLink source="layout_header" variant="icon" />
              {/* The path links above only fit on wide screens; everyone else gets the menu. */}
              <MobileNav triggerClassName="xl:hidden shrink-0" />
            </div>
          </div>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        </div>
      )}
      <main id="main-content" className={isLibraryGuide ? "flex-1 pb-safe guide-reading" : "flex-1 pb-safe"}>
        {children}
        {showGuidePrompt && openGuide && <GuideMembershipPrompt path={openGuide.path} />}
      </main>
      {/* Room below the footer so the member bar never covers the end of the page. */}
      <div className={showMemberBar ? "pb-16 print:pb-0" : undefined}>
        <Footer />
      </div>
      {/* Members on library pages get the member bar in place of the contact button. */}
      {!isReferralFit && !showMemberBar && <StickyContactForm />}
      {showMemberBar && barItem && (
        <GuideMemberBar item={barItem} onDismiss={() => setBarDismissedOn(pathname)} />
      )}
    </div>
    </SEOOverrideProvider>
  );
};

export default Layout;
