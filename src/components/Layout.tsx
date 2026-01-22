import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useNativeBackButton } from "@/hooks/useNativeBackButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  
  // Handle native back button for mobile apps
  useNativeBackButton();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-safe">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
