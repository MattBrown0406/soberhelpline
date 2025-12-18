import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, Heart, Users, Shield, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

export default function FamilySupport() {
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

        {/* Main Content */}
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Free Family Support Resources
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Supporting a loved one through addiction is challenging. You don't have to do it alone. 
                Find resources, guidance, and community support to help you and your family navigate this journey.
              </p>
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
