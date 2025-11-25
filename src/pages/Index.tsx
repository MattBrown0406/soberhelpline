import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";
import familyHero from "@/assets/family-hero.png";
import iocLogo from "@/assets/ioc-logo.jpg";

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

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Link to="/recovery-podcasts">
              <Button variant="default" className="flex items-center gap-2 bg-primary hover:bg-primary/90 animate-pulse hover:animate-none">
                <Headphones className="w-4 h-4" />
                Recovery Podcasts
              </Button>
            </Link>
            <a href="#partnership">
              <Button variant="default" className="flex items-center gap-2 bg-primary hover:bg-primary/90 animate-pulse hover:animate-none">
                <Heart className="w-4 h-4" />
                Free Family Education and Support
              </Button>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/provider-info" className="text-foreground hover:text-primary transition-colors font-medium">
              Provider Application
            </Link>
            {user ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
            <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5886</span>
            </a>
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} to={category.path}>
                  <Card
                    className="p-4 h-[120px] w-full hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-card hover:bg-accent"
                  >
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-foreground leading-tight">
                      {category.name}
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <img src={familyHero} alt="Family together in recovery" className="w-full rounded-lg shadow-lg object-cover" />
          <div className="space-y-4 bg-black rounded-lg shadow-lg p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white text-center">Our Mission</h2>
            <p className="text-gray-200 leading-relaxed">
              At Sober Helpline, we are dedicated to providing the families of addicted loved ones with ethical and proven providers of recovery and therapeutic services that have been vetted and meet rigorous criteria in order to be included on this site.
            </p>
            <p className="text-gray-200 leading-relaxed">
              This site is free to use for those needing help. Sober Helpline receives a set monthly fee from listed providers to cover the cost of operations. <strong className="underline">We take no commissions or payments from treatment providers for clients that get referred by us.</strong> This is considered patient brokering and we will never promote programs or services that would do so.
            </p>
          </div>
        </div>

        <div id="partnership" className="mt-12 bg-accent rounded-lg p-8 text-center max-w-4xl mx-auto scroll-mt-8">
          <img src={iocLogo} alt="Intervention On Call" className="mx-auto mb-6 h-20 w-auto" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Partnership with Intervention On Call</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We have partnered with Intervention On Call to provide families with real time access to help for their addicted loved one. Intervention On Call provides hourly coaching sessions for families to get better educated on boundaries, strategies, help with choosing the right treatment center etc. Intervention On Call also provides FREE family support zoom calls 5 nights a week.
          </p>
          <a href="https://interventiononcall.com/live-family-friends-zoom/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="font-semibold">
              Register Here!
            </Button>
          </a>
        </div>

        {/* Blog Link */}
        <div className="mt-12 text-center">
          <Link to="/blog">
            <Button variant="outline" size="lg" className="font-semibold">
              Visit Our Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
