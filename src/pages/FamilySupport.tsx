import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, Heart, Users, Shield, BookOpen, MessageCircle, Video, Calendar, MessagesSquare, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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

  return (
    <>
      <Helmet>
        <title>Free Family Support Resources | Sober Helpline</title>
        <meta
          name="description"
          content="Resources and support for families of individuals struggling with addiction. Find guidance, education, and community support to help your loved one on their recovery journey."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a
              href="tel:541-241-5886"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
            >
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

        {/* Premium Header Banner */}
        <div className="bg-primary text-primary-foreground py-4 text-center">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Premium Family Support Resources</h2>
          <p className="text-primary-foreground/90 text-sm md:text-base max-w-2xl mx-auto px-4 mb-3">
            Supporting a loved one through addiction is challenging. You don't have to do it alone. 
            Find resources, guidance, and community support to help you and your family navigate this journey.
          </p>
          {!hasMembership && (
            <Link to="/family-membership">
              <Button variant="secondary" size="sm" className="font-semibold">
                Create a Member Account
              </Button>
            </Link>
          )}
        </div>

        {/* Main Content */}
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Premium Member Content Section */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hasMembership ? (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-2">
                    Welcome, Member!
                  </h2>
                  <p className="text-muted-foreground">
                    Access your exclusive premium resources below.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  {/* Family Education Videos */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-logo-green">
                        <Video className="h-5 w-5 text-primary" />
                        Education Videos
                      </CardTitle>
                      <CardDescription>
                        Expert-led video courses on addiction and recovery
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Understanding Addiction: The Science →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Setting Healthy Boundaries →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Self-Care for Family Members →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Communication Strategies →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Preparing for an Intervention →
                        </a>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View All Videos
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Discussion Forum */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-logo-green">
                        <MessagesSquare className="h-5 w-5 text-primary" />
                        Discussion Forum
                      </CardTitle>
                      <CardDescription>
                        Connect with other families for support
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Introductions & Welcome →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Share Your Story →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Ask the Community →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Recovery Wins & Celebrations →
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline">
                          Resources & Recommendations →
                        </a>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Join the Forum
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Schedule Zoom Call */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-logo-green">
                        <Calendar className="h-5 w-5 text-primary" />
                        1-on-1 Consultation
                      </CardTitle>
                      <CardDescription>
                        Schedule a private call with an interventionist
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Get personalized guidance from a certified interventionist. Discuss your 
                        situation, get advice on next steps, and create a plan for your family.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 30-minute private Zoom call</li>
                        <li>• Confidential consultation</li>
                        <li>• Personalized action plan</li>
                      </ul>
                      <a 
                        href="https://calendly.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full mt-4">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule a Call
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>

                <div className="border-t border-border pt-8" />
              </div>
            ) : (
              /* Non-member Premium Teaser */
              <div className="mb-12">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-logo-green mb-2">
                          Unlock Premium Member Resources
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Join our family support membership for just $10/month to access:
                        </p>
                        <div className="grid gap-3 md:grid-cols-3 mb-6">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-primary" />
                            <span className="text-sm">Education Videos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessagesSquare className="h-4 w-4 text-primary" />
                            <span className="text-sm">Discussion Forum</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm">1-on-1 Consultations</span>
                          </div>
                        </div>
                        <Link to="/family-membership">
                          <Button>
                            Become a Member - $10/month
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Free Resources Section */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Free Family Support Resources
              </h1>
            </div>

            {/* Resource Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <Users className="h-5 w-5 text-logo-green" />
                    Family Support Groups
                  </CardTitle>
                  <CardDescription>
                    Connect with others who understand what you're going through
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://interventiononcall.com/live-family-friends-zoom/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline"
                  >
                    Intervention On Call (FREE Zoom Calls) →
                  </a>
                  <a
                    href="https://al-anon.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline"
                  >
                    Al-Anon Family Groups →
                  </a>
                  <a
                    href="https://www.nar-anon.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline"
                  >
                    Nar-Anon Family Groups →
                  </a>
                  <a
                    href="https://www.familiesanonymous.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline"
                  >
                    Families Anonymous →
                  </a>
                  <a
                    href="https://coda.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline"
                  >
                    Co-Dependents Anonymous (CoDA) →
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <BookOpen className="h-5 w-5 text-logo-green" />
                    Educational Resources
                  </CardTitle>
                  <CardDescription>
                    Learn about addiction and how to best support your loved one
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
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <Shield className="h-5 w-5 text-logo-green" />
                    Setting Boundaries
                  </CardTitle>
                  <CardDescription>
                    Learn healthy ways to support without enabling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3">
                    Setting boundaries is one of the most loving things you can do for your addicted loved one. 
                    Boundaries protect your well-being while encouraging them to seek help.
                  </p>
                  <Link to="/blog/14" className="text-primary hover:underline text-sm">
                    Read: Defending Your Castle from Addiction →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <MessageCircle className="h-5 w-5 text-logo-green" />
                    Professional Intervention Help
                  </CardTitle>
                  <CardDescription>
                    When you need expert guidance for your family
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/interventionists" className="block text-primary hover:underline">
                    Find an Interventionist →
                  </Link>
                  <a
                    href="https://interventiononcall.com/live-family-friends-zoom/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline"
                  >
                    FREE Family Support Zoom Calls →
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 md:p-8 text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="text-xl md:text-2xl font-semibold text-logo-green mb-3">
                  Need Help Right Now?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Our team is here to help you find the right resources for your family. 
                  Call us for compassionate, judgment-free guidance.
                </p>
                <a href="tel:541-241-5886">
                  <Button size="lg" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call (541) 241-5886
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
