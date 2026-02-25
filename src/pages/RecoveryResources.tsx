import { Building2, Home, Users, Bed, Brain, Stethoscope, UserCheck, Pill, Phone, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const categories = [
  { name: "Inpatient Treatment", icon: Home, path: "/inpatient-treatment", description: "Residential care programs offering 24/7 support in a structured environment" },
  { name: "Outpatient Treatment", icon: Building2, path: "/outpatient-treatment", description: "Flexible treatment options that allow individuals to maintain daily responsibilities" },
  { name: "Medical Detox", icon: Pill, path: "/medical-detox", description: "Safe, medically supervised withdrawal management" },
  { name: "Interventionists", icon: Users, path: "/interventionists", description: "Professional guidance to help families initiate the recovery conversation" },
  { name: "Sober Coaches", icon: UserCheck, path: "/sober-coaches-companions", description: "Personal recovery support and accountability partners" },
  { name: "Sober Living", icon: Bed, path: "/sober-living", description: "Structured transitional living environments for sustained recovery" },
  { name: "Therapists", icon: Brain, path: "/therapists", description: "Licensed mental health professionals specializing in addiction and family therapy" },
  { name: "Psychiatrists", icon: Stethoscope, path: "/psychiatrists", description: "Medical expertise for co-occurring mental health and substance use disorders" },
];

const RecoveryResources = () => {
  return (
    <>
      <SEOHead
        title="Find Recovery Resources | Sober Helpline"
        description="Browse our directory of vetted addiction treatment providers and recovery professionals. Find inpatient treatment, outpatient programs, interventionists, therapists, and more."
      />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-logo-green/5 via-background to-primary/5 py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Find the Right Support
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Browse our directory of vetted treatment providers and recovery professionals. Every provider meets our ethical standards—no commissions, no patient brokering.
            </p>
            <a href="tel:5412415886">
              <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white">
                <Phone className="w-4 h-4" />
                Call Us: (541) 241-5886
              </Button>
            </a>
          </div>
        </section>

        {/* Provider Categories */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} to={category.path}>
                  <Card className="h-full hover:shadow-lg hover:shadow-logo-green/10 hover:border-logo-green/30 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-2xl bg-logo-green/10 flex items-center justify-center mb-4 group-hover:bg-logo-green/20 group-hover:scale-110 transition-all">
                        <Icon className="w-7 h-7 text-logo-green" />
                      </div>
                      <h2 className="font-semibold text-foreground text-base mb-2">{category.name}</h2>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <div className="mt-4 flex items-center gap-1 text-sm text-logo-green font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Browse <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-10 md:py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3">Not Sure Where to Start?</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              Take our free assessment or call us directly. We're here to help you find the right path forward.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/addiction-assessment">
                <Button size="lg" variant="outline" className="gap-2">
                  Take the Assessment
                </Button>
              </Link>
              <a href="tel:5412415886">
                <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white">
                  <Phone className="w-4 h-4" />
                  (541) 241-5886
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RecoveryResources;
