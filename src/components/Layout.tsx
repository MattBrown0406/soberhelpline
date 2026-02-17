import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Footer from "./Footer";
import { useNativeBackButton } from "@/hooks/useNativeBackButton";

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

  return (
    <div className="min-h-screen flex flex-col">
      {!isHome && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40">
          <div className="container mx-auto px-4 flex items-center gap-2 h-12">
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
        </div>
      )}
      <main className="flex-1 pb-safe">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
