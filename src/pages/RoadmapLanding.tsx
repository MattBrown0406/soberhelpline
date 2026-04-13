import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ClipboardCheck, Map, Footprints, Shield } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import providerHeadshot from "@/assets/provider-headshot.jpg";

const stages = [
  { emoji: "🔴", name: "Suspicion", desc: "Something feels off, but you do not have clarity yet", active: true, path: "/roadmap/suspicion" },
  { emoji: "🟠", name: "Confirmation", desc: "You know there is a problem, and you need a next step", active: true, path: "/roadmap/assessment" },
  { emoji: "🟡", name: "Crisis", desc: "Things feel unstable and you need clear direction now", active: true, path: "/roadmap/crisis" },
  { emoji: "🔵", name: "Pre-Intervention", desc: "You are ready to act, but you want to do it wisely", active: true, path: "/roadmap/pre-intervention" },
  { emoji: "🟣", name: "Treatment", desc: "They are in treatment, and the family still needs a plan", active: true, path: "/roadmap/treatment" },
  { emoji: "🟢", name: "Early Recovery", desc: "They are home, and everyone is learning what support should look like now", active: true, path: "/roadmap/early-recovery" },
  { emoji: "⚪", name: "Long-Term Recovery", desc: "Recovery is underway, and it is time to rebuild with steadiness", active: true, path: "/roadmap/long-term-recovery" },
  { emoji: "🔴", name: "Relapse", desc: "Use has returned, and you need a grounded response", active: true, path: "/roadmap/relapse" },
];

const steps = [
  { icon: ClipboardCheck, title: "Tell Us What Is Happening", desc: "Start with a short assessment" },
  { icon: Map, title: "See Your Roadmap", desc: "Get guidance that fits the stage you are in" },
  { icon: Footprints, title: "Take One Clear Next Step", desc: "Move forward with practical support, not guesswork" },
];

const RoadmapLanding = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Recovery Roadmap, A Family Guide for What Comes Next | Sober Helpline"
        description="Find the stage your family is in and get clear, steady guidance for what to do next, from first suspicion to relapse and long-term recovery."
        howToName="Recovery Roadmap, An 8-Stage Family Guide"
        howToDescription="Understand where your family is in the recovery process and what the next wise step looks like."
        howToSteps={[
          { name: "Suspicion", text: "You sense something is wrong but aren't sure. Learn the signs and what to look for." },
          { name: "Confirmation", text: "You know there's a problem. Learn what to do next — and what NOT to do." },
          { name: "Crisis", text: "Emergency situations require immediate action. Know what to do right now." },
          { name: "Pre-Intervention", text: "You're ready to take action. Prepare yourself and your family for the conversation." },
          { name: "Treatment", text: "Your loved one is in treatment. What families should do during this critical time." },
          { name: "Early Recovery", text: "The first year of recovery. How families can support without enabling." },
          { name: "Long-Term Recovery", text: "Building a sustainable new normal for the whole family." },
          { name: "Relapse", text: "When relapse happens, respond with boundaries, compassion, and a clear plan forward." },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-background to-[hsl(var(--accent)/0.1)] py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Map className="w-4 h-4" />
            Recovery Roadmap
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Clear Guidance for Families in the Middle of Addiction
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            If things feel confusing, urgent, or exhausting, this roadmap helps you see where you are and what to do next, one step at a time.
          </p>
          <Link to="/roadmap/assessment">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-7 text-lg rounded-xl shadow-lg shadow-primary/20">
Find Your Starting Point
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
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">The Stages Families Move Through</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every story has its own details, but there are patterns. When you can name the stage, it becomes easier to make a calmer decision.
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
                  "Families do better when they stop guessing and start responding with clarity. That is what this roadmap is built to support."
                </p>
                <p className="text-sm font-semibold text-foreground">Matt Brown</p>
                <p className="text-sm text-muted-foreground">Founder, Sober Helpline</p>
              </div>
            </CardContent>
          </Card>
          <div className="text-center mt-10">
            <Link to="/roadmap/assessment">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl">
Start the Assessment
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
