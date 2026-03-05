import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ClipboardCheck, Map, Footprints, Shield } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import providerHeadshot from "@/assets/provider-headshot.jpg";

const stages = [
  { emoji: "🔴", name: "Suspicion", desc: "Something is off but I'm not sure", active: true, path: "/roadmap/suspicion" },
  { emoji: "🟠", name: "Confirmation", desc: "I know they're using, I don't know what to do", active: true, path: "/roadmap/assessment" },
  { emoji: "🟡", name: "Crisis", desc: "Things are falling apart right now", active: true, path: "/roadmap/crisis" },
  { emoji: "🔵", name: "Pre-Intervention", desc: "I'm ready to do something but need help", active: true, path: "/roadmap/pre-intervention" },
  { emoji: "🟣", name: "Treatment", desc: "They're in treatment, now what?", active: true, path: "/roadmap/treatment" },
  { emoji: "🟢", name: "Early Recovery", desc: "They're home — how do we do this?", active: true, path: "/roadmap/early-recovery" },
  { emoji: "⚪", name: "Long-Term Recovery", desc: "It's been 6+ months, how do we rebuild?", active: true, path: "/roadmap/long-term-recovery" },
  { emoji: "🔴", name: "Relapse", desc: "It happened again", active: true, path: "/roadmap/relapse" },
];

const steps = [
  { icon: ClipboardCheck, title: "Tell Us Where You Are", desc: "Take a 5-minute assessment" },
  { icon: Map, title: "Get Your Roadmap", desc: "Personalized action plan for your stage" },
  { icon: Footprints, title: "Take the Next Step", desc: "Guided actions, check-ins, and support" },
];

const RoadmapLanding = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Recovery Roadmap — Family Recovery Guide | Sober Helpline"
        description="A stage-based family recovery navigator with real steps, not just advice. Find where you are and get your personalized roadmap."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-background to-[hsl(var(--accent)/0.1)] py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Map className="w-4 h-4" />
            Recovery Roadmap
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            You Don't Have to Figure This Out Alone
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The Recovery Roadmap guides you through every stage of your family's journey — with real steps, not just advice.
          </p>
          <Link to="/roadmap/assessment">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-7 text-lg rounded-xl shadow-lg shadow-primary/20">
              Find Where You Are
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const cardContent = (
                <Card key={i} className={`text-center border-border/50 bg-card ${i === 0 ? "hover:shadow-md transition-shadow cursor-pointer group" : ""}`}>
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-sm font-semibold text-primary mb-2">Step {i + 1}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              );
              return i === 0 ? (
                <Link key={i} to="/roadmap/assessment">{cardContent}</Link>
              ) : (
                <div key={i}>{cardContent}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stage Overview */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">Your Recovery Journey</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every family's path is different, but the stages are predictable. Find where you are.
          </p>
          <div className="space-y-3">
            {stages.map((stage, i) => (
              <div key={i} className="relative">
                {stage.active ? (
                  <Link to={stage.path || "/roadmap/assessment"}>
                    <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-card border-2 border-primary/30 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <span className="text-2xl flex-shrink-0">{stage.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{stage.name}</h3>
                        <p className="text-sm text-muted-foreground">{stage.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-muted/50 border border-border/30 opacity-60">
                    <span className="text-2xl flex-shrink-0 grayscale">{stage.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-muted-foreground">{stage.name}</h3>
                      <p className="text-sm text-muted-foreground/70">{stage.desc}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground/50 bg-muted px-2.5 py-1 rounded-full flex-shrink-0">Coming Soon</span>
                  </div>
                )}
                {i < stages.length - 1 && (
                  <div className="absolute left-[1.75rem] top-full h-3 w-0.5 bg-border/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-border/50 bg-card">
            <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
              <img
                src={providerHeadshot}
                alt="Matt Brown"
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="text-lg text-foreground leading-relaxed mb-3">
                  "Built on 20+ years of intervention experience and thousands of families helped."
                </p>
                <p className="text-sm font-semibold text-foreground">Matt Brown</p>
                <p className="text-sm text-muted-foreground">Founder, Sober Helpline</p>
              </div>
            </CardContent>
          </Card>
          <div className="text-center mt-10">
            <Link to="/roadmap/assessment">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl">
                Start Your Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoadmapLanding;
