import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Home, ArrowLeft, Phone } from "lucide-react";
import Footer from "./Footer";
import SiteSearch from "./SiteSearch";
import Breadcrumbs from "./Breadcrumbs";
import { getBreadcrumbs } from "@/data/breadcrumbMap";
import { useNativeBackButton } from "@/hooks/useNativeBackButton";
import DefaultSEO from "./DefaultSEO";
import logo from "@/assets/logo.png";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  // Handle native back button for mobile apps
  useNativeBackButton();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isHome = pathname === "/";
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
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
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40">
          <div className="container mx-auto px-4 flex items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-4 shrink-0">
              <img src={logo} alt="Sober Helpline" className="h-10 w-auto" />
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
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
                aria-label="Go home"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>

            {/* Search */}
            <div className="ml-auto flex items-center gap-2">
              <SiteSearch />
              {/* Phone number */}
              <a
                href="tel:541-241-9151"
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm shrink-0"
              >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(541) 241-9151</span>
              </a>
            </div>
          </div>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        </div>
      )}
      <main id="main-content" className="flex-1 pb-safe">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
