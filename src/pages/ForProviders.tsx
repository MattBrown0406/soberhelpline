import { Building2, Users, TrendingUp, Shield, CheckCircle, ArrowRight, Phone, Star, BarChart3, Globe, Clock, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import FamilyBridgeBanner from "@/components/FamilyBridgeBanner";
import logo from "@/assets/logo.png";

const benefits = [
  {
    icon: Users,
    title: "Reach Families Actively Seeking Help",
    description: "Families visiting Sober Helpline are in the decision-making stage — looking for providers they can trust. Your listing puts you in front of the right audience at the right moment."
  },
  {
    icon: TrendingUp,
    title: "Grow Your Referral Pipeline",
    description: "Our platform connects you directly with families searching by location, specialty, and treatment type. No more waiting for referrals — families find you."
  },
  {
    icon: Shield,
    title: "Build Trust Through Transparency",
    description: "Every provider on Sober Helpline goes through our verification process. Families trust our directory because we vet who's listed."
  },
  {
    icon: Globe,
    title: "Nationwide Visibility",
    description: "Whether you're a local therapist or a multi-location treatment center, our directory gives you visibility across the country with families who need your specific services."
  },
  {
    icon: Star,
    title: "Showcase Your Expertise",
    description: "Your provider profile highlights your specialties, credentials, treatment approach, and what makes your program unique. Stand out from the crowd."
  },
  {
    icon: BarChart3,
    title: "Track Your Impact",
    description: "See how many families are viewing your listing, clicking to learn more, and reaching out. Data-driven insights to help you grow."
  }
];

const providerTypes = [
  "Inpatient Treatment Centers",
  "Outpatient Programs (IOP/PHP)",
  "Medical Detox Facilities",
  "Interventionists",
  "Sober Coaches & Companions",
  "Sober Living Homes",
  "Therapists & Counselors",
  "Psychiatrists",
];

const steps = [
  {
    number: "1",
    title: "Create Your Account",
    description: "Sign up for a free provider account in under 2 minutes."
  },
  {
    number: "2",
    title: "Complete Your Profile",
    description: "Add your facility details, specialties, photos, insurance accepted, and what makes your program unique."
  },
  {
    number: "3",
    title: "Get Verified",
    description: "Our team reviews your application to ensure quality and accuracy. Most providers are approved within 24-48 hours."
  },
  {
    number: "4",
    title: "Start Getting Found",
    description: "Your listing goes live and families can immediately find you through our search and directory."
  }
];

const faqItems = [
  {
    question: "How much does it cost to list my practice or facility?",
    answer: "Creating a provider profile on Sober Helpline is completely free and always will be. We believe every ethical provider should be accessible to families in need. For providers who want enhanced visibility, we offer Featured Listings starting at $99/month with priority placement, enhanced profiles, and analytics."
  },
  {
    question: "What types of providers can list on Sober Helpline?",
    answer: "We welcome inpatient treatment centers, outpatient programs, medical detox facilities, interventionists, sober coaches, sober living homes, therapists, counselors, and psychiatrists who specialize in addiction and recovery."
  },
  {
    question: "How long does the verification process take?",
    answer: "Most provider applications are reviewed and approved within 24-48 hours. We verify credentials, licensing, and facility information to maintain trust with the families who use our platform."
  },
  {
    question: "Can I update my listing after it's published?",
    answer: "Absolutely. You can update your profile, photos, specialties, and availability at any time through your provider dashboard."
  },
  {
    question: "How do families find my listing?",
    answer: "Families search our directory by location, treatment type, specialty, and insurance accepted. Your listing also appears in our category pages (e.g., Inpatient Treatment, Therapists) and may be featured in our educational content."
  }
];

const ForProviders = () => {
  const providerSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "List Your Practice on Sober Helpline",
    "description": "Join our network of verified addiction treatment providers. Reach families actively searching for help. Free to list.",
    "url": "https://soberhelpline.com/for-providers",
  };

  return (
    <>
      <SEOHead
        title="List Your Practice | Sober Helpline Provider Directory"
        description="Join our network of verified addiction treatment providers. Reach families actively seeking help. Free to list your practice, facility, or coaching services."
        jsonLd={providerSchema}
        faqItems={faqItems}
        speakableSelectors={["h1", ".hero-description"]}
      />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Sober Helpline" className="h-10 w-10 rounded-lg" />
              <span className="font-semibold text-lg hidden sm:inline">Sober Helpline</span>
            </Link>
            <div className="flex items-center gap-4">
              <a href="tel:5412419151" className="flex items-center gap-2 px-4 py-2 rounded-full bg-logo-green/10 text-logo-green font-semibold hover:bg-logo-green/20 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">(541) 241-9151</span>
              </a>
              <Link to="/auth">
                <Button variant="outline">Provider Login</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-logo-green/5 via-white to-emerald-50 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-logo-green/10 text-logo-green text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                For Treatment Providers
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Get Found by Families{" "}
                <span className="text-logo-green">Who Need You Most</span>
              </h1>
              <p className="hero-description text-xl text-gray-600 mb-8 leading-relaxed">
                Over 2,500 families search our platform every month for ethical, vetted treatment providers.
                Join our growing network and connect with families who are ready, qualified, and actively seeking your expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="bg-logo-green hover:bg-logo-green/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-logo-green/25">
                    List Your Practice — Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="tel:5412419151">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl">
                    <Phone className="mr-2 w-5 h-5" />
                    Call Us to Learn More
                  </Button>
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">No credit card required • Free to list • Live in 24-48 hours</p>
            </div>
          </div>
        </section>

        {/* Provider Types */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Should List on Sober Helpline?</h2>
              <p className="text-lg text-gray-600">We welcome all ethical addiction and recovery service providers</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {providerTypes.map((type) => (
                <div key={type} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-logo-green/5 transition-colors">
                  <CheckCircle className="w-5 h-5 text-logo-green flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Providers Choose Sober Helpline</h2>
              <p className="text-lg text-gray-600">Everything you need to connect with families who need your services</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-logo-green/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-logo-green" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Listed in 4 Simple Steps</h2>
              <p className="text-lg text-gray-600">From signup to live listing in as little as 24 hours</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-logo-green text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-logo-green/25">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-logo-green/20" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-16 bg-gradient-to-br from-logo-green/10 to-emerald-50 rounded-2xl p-10 border-2 border-logo-green/20">
              <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Get Listed?</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Complete our provider application to get your practice verified and in front of families who need your help.
              </p>
              <Link to="/provider-application">
                <Button size="lg" className="bg-logo-green hover:bg-logo-green/90 text-white px-10 py-7 text-xl rounded-xl shadow-lg shadow-logo-green/25">
                  Start Your Provider Application
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-16 bg-gradient-to-br from-logo-green/5 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-logo-green mb-2">2,500+</div>
                <p className="text-gray-600">Families Searching Monthly</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-logo-green mb-2">48hrs</div>
                <p className="text-gray-600">Average Approval Time</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-logo-green mb-2">50</div>
                <p className="text-gray-600">States Covered</p>
              </div>
            </div>
          </div>
        </section>


        {/* Pricing Tiers */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-lg text-gray-600">Start free, upgrade when you're ready to stand out</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Basic */}
              <Card className="p-8 border-2 border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Listing</h3>
                  <div className="text-4xl font-bold text-logo-green mb-2">FREE</div>
                  <p className="text-gray-600">Perfect for getting started</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>Complete provider profile</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>Show in category searches</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>Contact information displayed</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>Basic photo gallery</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>Verification badge</span>
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="w-full" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </Card>

              {/* Premium Featured */}
              <Card className="p-8 border-2 border-logo-green bg-gradient-to-br from-logo-green/5 to-emerald-50">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-logo-green/10 text-logo-green text-sm font-medium mb-4">
                    <Award className="w-4 h-4" />
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured Listing</h3>
                  <div className="text-4xl font-bold text-logo-green mb-2">$99<span className="text-lg font-normal text-gray-600">/month</span></div>
                  <p className="text-gray-600">Maximum visibility and features</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>⭐ Priority placement in search results</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>⭐ Featured on category pages</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>⭐ Enhanced profile with video</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>⭐ Analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-logo-green" />
                    <span>⭐ Priority customer support</span>
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="w-full bg-logo-green hover:bg-logo-green/90">
                    Start Featured Listing
                  </Button>
                </Link>
              </Card>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              All plans include our verification process and customer support
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Award className="w-12 h-12 text-logo-green mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Families Are Searching for Help Right Now
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Don't let them pass you by. List your practice on Sober Helpline and start connecting with families who need your expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-logo-green hover:bg-logo-green/90 text-white px-8 py-6 text-lg rounded-xl">
                  List Your Practice — Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:5412419151">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl border-gray-600 text-white hover:bg-gray-700">
                  <Phone className="mr-2 w-5 h-5" />
                  (541) 241-9151
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* FamilyBridge Banner */}
        <FamilyBridgeBanner />

        {/* Footer */}
        <footer className="py-8 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Sober Helpline. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default ForProviders;
