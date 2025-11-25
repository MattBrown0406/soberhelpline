import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Building2, Home, Users, Bed, Brain, Stethoscope, UserCheck, Pill } from "lucide-react";

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

const CategoryNav = () => {
  const location = useLocation();
  const currentCategory = categories.find(cat => cat.path === location.pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Switch Category
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-popover z-50">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = location.pathname === category.path;
          return (
            <DropdownMenuItem key={category.path} asChild disabled={isActive}>
              <Link 
                to={category.path} 
                className={`flex items-center gap-2 w-full ${isActive ? 'bg-accent' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryNav;
