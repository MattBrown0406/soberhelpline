import { Building2, Home, Users, Bed, Brain, Stethoscope, Scale, Heart, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import familyHero from "@/assets/family-hero.png";

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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-6">
            <Link to="/recovery-podcasts" className="text-foreground hover:text-primary transition-colors font-medium">
              Recovery Podcasts
            </Link>
            <Link to="/provider-info" className="text-foreground hover:text-primary transition-colors font-medium">
              Provider Information
            </Link>
          </div>
          <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Phone className="w-5 h-5" />
            <span className="font-medium">(541) 241-5886</span>
          </a>
        </div>
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

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <img src={familyHero} alt="Family together in recovery" className="w-full rounded-lg shadow-lg" />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground text-center">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Sober Helpline, we are dedicated to providing the families of addicted loved ones with ethical and proven providers of recovery and therapeutic services that have been vetted and meet rigorous criteria in order to be included on this site.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This site is free to use for those needing help. Sober Helpline receives a set monthly fee from listed providers to cover the cost of operations. <strong className="underline">We take no commissions or payments from treatment providers for clients that get referred by us.</strong> This is considered patient brokering and we will never promote programs or services that would do so.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
