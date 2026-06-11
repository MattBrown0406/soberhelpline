import { Link } from "react-router-dom";
import { Phone, Heart, Users, Shield, BookOpen, MessageCircle, Video, Calendar, MessagesSquare, Lock, Loader2, Presentation, FileText, Headphones, ClipboardCheck, Scale, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import SEOHead from "@/components/SEOHead";
import FreeConsultationCTA from "@/components/FreeConsultationCTA";

export default function FamilySupport() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check for active family membership
  useEffect(() => {
    const checkMembership = async () => {
      if (!user) {
        setHasMembership(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('provider_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null)
          .limit(1);

        if (error) {
          console.error('Error checking membership:', error);
          setHasMembership(false);
        } else {
          setHasMembership(data && data.length > 0);
        }
      } catch (err) {
        console.error('Membership check failed:', err);
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [user]);

  // AEO-optimized FAQ items for family support
  const faqItems = [
    { question: "How can I help a family member with addiction?", answer: "Start by educating yourself about addiction as a disease, set healthy boundaries, avoid enabling behaviors, connect with support groups like Al-Anon, and consider consulting a professional interventionist if they're resistant to treatment." },
    { question: "What is enabling vs helping with addiction?", answer: "Enabling means protecting someone from the natural consequences of their addiction (paying bills, making excuses), which allows the addiction to continue. Helping means supporting their recovery while maintaining boundaries that don't shield them from consequences." },
    { question: "Should I do an intervention for my loved one?", answer: "An intervention may be appropriate when your loved one is in denial, has refused treatment, or when the situation is becoming dangerous. Professional interventionists can guide the process and significantly improve outcomes." },
    { question: "Where can families of addicts find support?", answer: "Families can find support through Al-Anon and Nar-Anon meetings, family therapy, educational resources about addiction, online support communities, and professional family consultations. Sober Helpline offers both free and premium family resources." }
  ];

  return (
    <>
      <SEOHead
        title="Free Family Support Resources | Sober Helpline"
        description="Resources and support for families of individuals struggling with addiction. Find guidance, education, and community support to help your loved one on their recovery journey."
        faqItems={faqItems}
        speakableSelectors={["h1", "h2", ".hero-description"]}
      />

      <div className="min-h-screen bg-background">

        {/* Premium Header Banner */}
        <div className="bg-primary text-primary-foreground py-4 text-center">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Family support, without the noise</h2>
          <p className="text-primary-foreground/90 text-sm md:text-base max-w-2xl mx-auto px-4 mb-3">
            If addiction has taken over the emotional weather in your home, start here. Find clear guidance, practical tools, and support that helps you think straight again.
          </p>
          {!hasMembership && (
            <Link to="/monday-zoom-registration">
              <Button variant="secondary" size="sm" className="font-semibold">
                Join the Free Monday Zoom
              </Button>
            </Link>
          )}
        </div>

        {/* Main Content */}
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Start Here CTA */}
            <div className="mb-8">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 md:p-8 text-center">
                  <h2 className="text-2xl font-bold text-logo-blue mb-3">Start Here, in This Order</h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    If things feel confusing, keep it simple. Start with the free Monday Zoom, use membership for ongoing support, and reach for private coaching when you need more direct help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
                    <Link to="/monday-zoom-registration">
                      <Button size="lg" className="gap-2 w-full sm:w-auto">
                        <Calendar className="h-4 w-4" />
                        Join the Free Monday Zoom
                      </Button>
                    </Link>
                    <Link to="/family-membership">
                      <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                        <Users className="h-4 w-4" />
                        Explore Membership
                      </Button>
                    </Link>
                    <Link to="/family-coaching">
                      <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                        <Phone className="h-4 w-4" />
                        Explore Coaching
                      </Button>
                    </Link>
                    <Link to="/family-readiness-intensive">
                      <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-violet-500/40 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/30">
                        Family Readiness Intensive
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Premium Member Content Section */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hasMembership ? (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-logo-blue mb-2">
                    Welcome, Member!
                  </h2>
                  <p className="text-muted-foreground">
                    Your resources are below, ready when you need them.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  {/* Family Education Videos */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-logo-blue">
                        <Video className="h-5 w-5 text-primary" />
                        Education Videos and Resources
                      </CardTitle>
                      <CardDescription>
                        Expert-led video courses on addiction and recovery
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Access our library of educational videos covering topics like understanding addiction, setting boundaries, and self-care.
                        </p>
                      </div>
                      <Link to="/family-education">
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          View Resources
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Monthly Webinars */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-logo-blue">
                        <Presentation className="h-5 w-5 text-primary" />
                        Monthly Webinars
                      </CardTitle>
                      <CardDescription>
                        Live sessions with addiction specialists
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Join monthly live sessions with specialists and revisit past recordings when you need a refresher.
                        </p>
                      </div>
                      <Link to="/family-webinars">
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          View Webinars
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Discussion Forum */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-logo-blue">
                        <MessagesSquare className="h-5 w-5 text-primary" />
                        Discussion Forum
                      </CardTitle>
                      <CardDescription>
                        Connect with other families for support
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Talk with other families, ask honest questions, and be around people who actually understand this terrain.
                        </p>
                      </div>
                      <Link to="/family-forum">
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          Join the Forum
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                </div>

                <div className="border-t border-border pt-8" />
              </div>
            ) : (
              /* Non-member Premium Teaser */
              <div className="mb-12">
                <Card className="border-l-4 border-l-amber-400 border-t border-r border-b border-border bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-logo-blue mb-2">
                          Get the full family support library
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          If you want more structure and support, membership gives you practical tools, education, and community designed for real family life under stress.
                        </p>
                        
                        {/* Premium offerings grid */}
                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Education Videos & Resources</span>
                              <p className="text-sm text-muted-foreground">Clear video lessons on addiction, recovery, and what families can do differently</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Monthly Live Webinars</span>
                              <p className="text-sm text-muted-foreground">Live sessions with addiction specialists you can actually learn from</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Private Discussion Forum</span>
                              <p className="text-sm text-muted-foreground">A place to talk with families who understand what this does to a home</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Member Coaching Savings</span>
                              <p className="text-sm text-muted-foreground">Membership comes before coaching, and members save when private support is needed</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Interactive Worksheets</span>
                              <p className="text-sm text-muted-foreground">Worksheets for boundaries, self-trust, and next-step planning</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Guided Meditations</span>
                              <p className="text-sm text-muted-foreground">Simple audio support for the moments when your nervous system is shot</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Decision-Making Tools</span>
                              <p className="text-sm text-muted-foreground">Decision tools that help you tell the difference between helping and rescuing</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-logo-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Treatment Navigation Guides</span>
                              <p className="text-sm text-muted-foreground">Straight guidance for sorting through treatment options without getting spun around</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <Link to="/family-membership">
                            <Button size="lg">
                              Start membership, $14.99/month
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Free Resources Section */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-4">
                Free Family Support Resources
              </h1>
            </div>

            {/* Resource Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue">
                    <Video className="h-5 w-5 text-logo-blue" />
                    “The Family Squares” Zoom
                  </CardTitle>
                  <CardDescription>
                    Free weekly meeting every Monday at 7:00 PM PST
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Join our free weekly Zoom meeting led by a certified interventionist. Bring your questions, hear what helps, and connect with other families. No membership required.
                  </p>
                  <Link to="/monday-zoom-registration" className="block text-primary hover:underline">
                    Register for This Monday's Meeting →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue">
                    <BookOpen className="h-5 w-5 text-logo-blue" />
                    Educational Resources
                  </CardTitle>
                  <CardDescription>
                    Learn what addiction does to families and what support can look like now
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/addiction-assessment" className="block text-primary hover:underline">
                    Take the Addiction Assessment →
                  </Link>
                  <Link to="/blog" className="block text-primary hover:underline">
                    Read Our Recovery Blog →
                  </Link>
                  <Link to="/faqs" className="block text-primary hover:underline">
                    Frequently Asked Questions →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue">
                    <Shield className="h-5 w-5 text-logo-blue" />
                    Setting Boundaries
                  </CardTitle>
                  <CardDescription>
                    Learn healthy ways to support without enabling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3">
                    Boundaries are not punishment. They protect your well-being, reduce confusion, and make it easier to stop rescuing in the name of love.
                  </p>
                  <Link to="/blog/14" className="text-primary hover:underline text-sm">
                    Read: Defending Your Castle from Addiction →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue">
                    <Users className="h-5 w-5 text-logo-blue" />
                    Family Support Groups
                  </CardTitle>
                  <CardDescription>
                    Connect with others who understand what you're going through
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Al-Anon Family Groups →
                  </a>
                  <a href="https://www.nar-anon.org" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Nar-Anon Family Groups →
                  </a>
                  <a href="https://www.familiesanonymous.org" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Families Anonymous →
                  </a>
                  <a href="https://coda.org" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Co-Dependents Anonymous (CoDA) →
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <FreeConsultationCTA />
            </div>

            {/* Call to Action */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 md:p-8 text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="text-xl md:text-2xl font-semibold text-logo-blue mb-3">
                  Need a Private Next Step?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Start with the Monday Zoom if you can. If you need more support after that, membership is the next layer. If the situation is urgent or too specific for a group setting, private coaching is available.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/monday-zoom-registration">
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      <Calendar className="h-4 w-4" />
                      Join Monday Zoom
                    </Button>
                  </Link>
                  <Link to="/family-membership">
                    <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                      <Users className="h-4 w-4" />
                      Start Membership
                    </Button>
                  </Link>
                  <a href="tel:458-202-7900">
                    <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                      <Phone className="h-4 w-4" />
                      Call (458) 202-7900
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
