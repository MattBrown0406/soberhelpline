import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, ArrowLeft, X, Building2, Home, Users, Bed, Brain, Stethoscope, UserCheck, Pill } from "lucide-react";

const categories = [
  { name: "Inpatient Treatment", icon: Building2, path: "/inpatient-treatment" },
  { name: "Outpatient Treatment", icon: Home, path: "/outpatient-treatment" },
  { name: "Medical Detox", icon: Pill, path: "/medical-detox" },
  { name: "Interventionists", icon: Users, path: "/interventionists" },
  { name: "Sober Coaches/Companions", icon: UserCheck, path: "/sober-coaches-companions" },
  { name: "Sober Living", icon: Bed, path: "/sober-living" },
  { name: "Therapists", icon: Brain, path: "/therapists" },
  { name: "Psychiatrists", icon: Stethoscope, path: "/psychiatrists" },
];

const CategoryMobileNav = () => {
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
            <span className="font-semibold text-lg">Categories</span>
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Link to="/" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-2 mb-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              
              <div className="border-t my-2 pt-2">
                <p className="text-xs text-muted-foreground px-3 py-2">Browse Categories</p>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link key={category.name} to={category.path} onClick={closeMenu}>
                      <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-3">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm">{category.name}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
          
          <div className="p-4 border-t bg-muted/50">
            <a href="tel:5412415668" className="flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5668</span>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryMobileNav;
