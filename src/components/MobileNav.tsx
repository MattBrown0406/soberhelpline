import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, LogIn, Headphones, Heart, X } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface MobileNavProps {
  user: User | null;
  onLogout: () => void;
}

const MobileNav = ({ user, onLogout }: MobileNavProps) => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Link to="/recovery-podcasts" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Headphones className="w-4 h-4" />
                  Recovery Podcasts
                </Button>
              </Link>
              
              <a href="#partnership" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Heart className="w-4 h-4" />
                  Family Education & Support
                </Button>
              </a>
              
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  For Providers
                </div>
                <Link to="/provider-info" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start pl-4">
                    Provider Application
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
              
              <Link to="/blog" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  Blog
                </Button>
              </Link>
            </div>
            
            <div className="border-t my-4" />
            
            <div className="space-y-2">
              {user ? (
                <Button variant="outline" className="w-full" onClick={() => { onLogout(); closeMenu(); }}>
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
            <a href="tel:5412415886" className="flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5886</span>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
