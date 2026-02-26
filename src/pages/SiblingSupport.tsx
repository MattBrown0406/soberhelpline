import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen, Users, MessageCircle, ClipboardList, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const siblingResources = [
  { title: "The Sibling Experience", href: "/sibling-experience", description: "Understanding the unique pain siblings carry when addiction enters the family." },
  { title: "Growing Up in the Shadow of Addiction", href: "/growing-up-shadow", description: "How childhood gets reshaped when a sibling's addiction consumes the family's attention." },
  { title: "Sibling Guilt, Anger, and Loyalty Conflicts", href: "/sibling-guilt-anger-loyalty", description: "Navigating the impossible emotions that come with loving someone in active addiction." },
  { title: "Rebuilding Sibling Relationships in Recovery", href: "/rebuilding-sibling-relationships", description: "What reconnection looks like — and when it's possible." },
  { title: "Parents: Repairing the Sibling System", href: "/parents-repairing-sibling-system", description: "A guide for parents working to heal the sibling dynamic after addiction." },
];

const recommendedResources = [
  { title: 'The Hidden Cost of Being the "Strong One"', href: "/strong-one", description: "When the family relies on you to hold it together, the cost is invisible — until it isn't." },
  { title: "The Guilt-Relief-Resentment Cycle", href: "/guilt-relief-resentment", description: "Understanding the emotional loop that keeps family members stuck." },
  { title: "Grief for the Family You Thought You'd Have", href: "/grief-for-family", description: "Mourning what addiction took — even when your loved one is still alive." },
  { title: "Living Well Regardless of Outcome", href: "/living-well-regardless", description: "Building a meaningful life that doesn't depend on someone else's recovery." },
];

export default function SiblingSupport() {
  return (
    <>
      <SEOHead
        title="Sibling Support — Resources for Siblings of Addicts"
        description="Support and resources for siblings of someone struggling with addiction. You are not invisible. Explore guides on sibling guilt, anger, loyalty, and rebuilding relationships."
      />

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Navigation */}
          <div className="mb-6">
            <Link to="/family-education">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Resources
              </Button>
            </Link>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-teal-500/10 mb-4">
              <Heart className="h-10 w-10 text-teal-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
              The Sibling Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              When addiction takes over a family, siblings often become invisible. This space is for you.
            </p>
          </div>

          {/* Your Experience is Valid */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Your Experience is Valid</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Siblings of people struggling with addiction are among the most underserved members of the family system. The attention, resources, and emotional energy of the household often get funneled toward the person in crisis — leaving brothers and sisters to figure things out on their own.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you feel forgotten, angry, guilty, or some impossible combination of all three — you're not alone, and what you're feeling makes sense. These resources were created for you.
            </p>
          </section>

          {/* Sibling-Specific Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-logo-green mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6" /> Sibling-Specific Resources
            </h2>
            <div className="grid gap-4">
              {siblingResources.map((r) => (
                <Link key={r.href} to={r.href}>
                  <Card className="hover:border-teal-500/50 transition-colors">
                    <CardContent className="py-5">
                      <h3 className="font-semibold text-lg mb-1">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Recommended for You */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-logo-green mb-6 flex items-center gap-2">
              <Compass className="h-6 w-6" /> Recommended for You
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedResources.map((r) => (
                <Link key={r.href} to={r.href}>
                  <Card className="hover:border-emerald-500/50 transition-colors h-full">
                    <CardContent className="py-5">
                      <h3 className="font-semibold mb-1">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* CTAs */}
          <section className="mb-12 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/onboarding-quiz" className="block">
                <Card className="h-full hover:border-teal-500/50 transition-colors text-center">
                  <CardContent className="py-8">
                    <ClipboardList className="h-8 w-8 text-teal-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Take the Personalized Quiz</h3>
                    <p className="text-sm text-muted-foreground">Get resources matched to your situation.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/family-forum" className="block">
                <Card className="h-full hover:border-teal-500/50 transition-colors text-center">
                  <CardContent className="py-8">
                    <MessageCircle className="h-8 w-8 text-teal-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Join the Family Forum</h3>
                    <p className="text-sm text-muted-foreground">Connect with others who understand.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/family-coaching" className="block">
                <Card className="h-full hover:border-teal-500/50 transition-colors text-center">
                  <CardContent className="py-8">
                    <Users className="h-8 w-8 text-teal-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Talk to a Coach</h3>
                    <p className="text-sm text-muted-foreground">Get personalized support from someone who gets it.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
