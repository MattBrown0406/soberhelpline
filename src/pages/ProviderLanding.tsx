import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Users, TrendingUp, Shield, Star, ArrowRight, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import SEOHead from "@/components/SEOHead";

const ProviderLanding = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "High-Quality Referrals",
      description: "Connect with families actively seeking recovery solutions for their loved ones."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: "Grow Your Practice", 
      description: "Increase visibility and reach families who need your specialized services."
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Ethical Standards",
      description: "Be part of a directory that prioritizes ethical practices and transparency."
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      title: "Trusted Platform",
      description: "Join a vetted network trusted by families navigating addiction recovery."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Monthly Visitors" },
    { number: "500+", label: "Families Helped" },
    { number: "50+", label: "Vetted Providers" },
    { number: "95%", label: "Family Satisfaction" }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Submit Application",
      description: "Complete our comprehensive provider application with your services, credentials, and pricing."
    },
    {
      step: "2", 
      title: "Verification Process",
      description: "Our team thoroughly vets all applications to ensure ethical standards and quality care."
    },
    {
      step: "3",
      title: "Get Listed",
      description: "Once approved, your profile goes live and families can find and contact you directly."
    },
    {
      step: "4",
      title: "Receive Referrals",
      description: "Start receiving inquiries from families seeking your specific recovery services."
    }
  ];

  const included = [
    "Professional provider profile",
    "Direct contact from families",
    "Logo and service descriptions", 
    "Insurance and pricing information",
    "Social media links",
    "Category-specific filtering",
    "Geographic location listing",
    "No referral fees ever"
  ];

  return (
    <>
      <SEOHead
        title="List Your Recovery Services | Sober Helpline Provider Directory"
        description="Join our vetted provider directory and connect with families seeking quality addiction recovery services. No referral fees, ethical standards, high-quality leads."
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <a href="tel:4582027900" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(458) 202-7900</span>
            </a>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <img src={logo} alt="Sober Helpline" className="mx-auto mb-6 w-32 h-32 object-contain" />
            <Badge variant="secondary" className="mb-4">
              Provider Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Connect with Families Seeking Recovery
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join our carefully vetted directory of addiction recovery providers. No referral fees. 
              Ethical standards. Direct access to families who need your services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-3"
                onClick={() => navigate('/provider-application')}
              >
                Start Your Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why List with Sober Helpline?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">What's Included in Your Listing</h2>
                <p className="text-muted-foreground mb-6">
                  Your provider profile includes everything families need to make informed decisions
                  about recovery services, with no hidden fees or commissions.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {included.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:text-right">
                <Card className="p-8 text-center">
                  <CardHeader>
                    <CardTitle className="text-2xl">No Hidden Fees</CardTitle>
                    <CardDescription className="text-base">
                      Unlike other directories, we never charge referral fees or commissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">$0</div>
                    <div className="text-muted-foreground mb-6">Per Referral</div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Ethical Promise</span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        We maintain independence by never taking commissions from referrals
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Provider Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Provider Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Inpatient Treatment",
                "Outpatient Treatment", 
                "Medical Detox",
                "Interventionists",
                "Sober Coaches",
                "Sober Living",
                "Therapists",
                "Psychiatrists"
              ].map((category) => (
                <div 
                  key={category} 
                  className="bg-muted rounded-lg p-4 text-center hover:bg-muted/80 transition-colors"
                >
                  <div className="font-medium">{category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-primary/5 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our trusted directory and start connecting with families who need your recovery services.
              The application takes about 10-15 minutes to complete.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => navigate('/provider-application')}
            >
              Start Your Application
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Questions? Call us at <a href="tel:4582027900" className="text-primary hover:underline">(458) 202-7900</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderLanding;