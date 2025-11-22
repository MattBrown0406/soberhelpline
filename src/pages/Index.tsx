import { Building2, Home, Users, Bed, Brain, Stethoscope, Scale, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const categories = [
  { name: "Inpatient Treatment", icon: Building2 },
  { name: "Outpatient Treatment", icon: Home },
  { name: "Interventionists", icon: Users },
  { name: "Sober Living", icon: Bed },
  { name: "Therapists", icon: Brain },
  { name: "Psychiatrists", icon: Stethoscope },
  { name: "Attorneys", icon: Scale },
  { name: "Recovery Fellowships", icon: Heart },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <img src={logo} alt="Sober Helpline" className="mx-auto mb-6 w-64 h-auto" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Empowering Your Recovery Journey</h2>
          <p className="text-lg text-muted-foreground">
            We help families find ethical, proven treatment and recovery resources nationwide and beyond.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.name}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-card hover:bg-accent"
                >
                  <Icon className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium text-foreground leading-tight">
                    {category.name}
                  </span>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
