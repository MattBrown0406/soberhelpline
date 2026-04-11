import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart, ChevronDown, Calendar, User as UserIcon, Play, Pause, Lock, BookOpen, ArrowRight, Sparkles, Shield, MessageCircle, AlertTriangle, MessageSquare, Scale, GraduationCap, TreePine, Eye, X, Check, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import bannerLogo from "@/assets/banner-logo.png";


import MobileNav from "@/components/MobileNav";
import { blogPosts } from "@/pages/Blog";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import SUDAssessment from "@/components/SUDAssessment";
import EatingDisorderScreening from "@/components/EatingDisorderScreening";
import SEOHead from "@/components/SEOHead";

import FamilyBridgeBanner from "@/components/FamilyBridgeBanner";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import FreeConsultationCTA from "@/components/FreeConsultationCTA";

const categories = [
  { name: "Inpatient Treatment", icon: Home, path: "/inpatient-treatment", description: "Residential care programs" },
  { name: "Outpatient Treatment", icon: Building2, path: "/outpatient-treatment", description: "Flexible treatment options" },
  { name: "Medical Detox", icon: Pill, path: "/medical-detox", description: "Safe withdrawal support" },
  { name: "Interventionists", icon: Users, path: "/interventionists", description: "Professional guidance" },
  { name: "Sober Coaches", icon: UserCheck, path: "/sober-coaches-companions", description: "Personal recovery support" },
  { name: "Sober Living", icon: Bed, path: "/sober-living", description: "Structured environments" },
  { name: "Therapists", icon: Brain, path: "/therapists", description: "Mental health support" },
  { name: "Psychiatrists", icon: Stethoscope, path: "/psychiatrists", description: "Medical expertise" },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  const featuredArticles = useMemo(() => {
    return [...blogPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArticleIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredArticles.length]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // AEO-optimized homepage schema
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sober Helpline",
    "url": "https://soberhelpline.com",
    "description": "Connect with ethical addiction treatment providers. Free family support resources, vetted rehabs, interventionists, and recovery coaches nationwide.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://soberhelpline.com/inpatient-treatment?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".hero-description", ".mission-statement"]
    }
  };

  // Service offerings for AEO
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Addiction Recovery Services",
    "description": "Find ethical addiction treatment providers across the United States",
    "itemListElement": categories.map((cat, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": cat.name,
        "description": cat.description,
        "url": `https://soberhelpline.com${cat.path}`,
        "provider": {
          "@type": "Organization",
          "name": "Sober Helpline"
        }
      }
    }))
  };

  // Quick FAQ for homepage AEO
  const homepageFaqItems = [
    { question: "What is Sober Helpline?", answer: "Sober Helpline connects families with ethical, vetted addiction treatment providers nationwide, offering free resources, education, and support for those affected by addiction." },
    { question: "How do I find a treatment center near me?", answer: "Use our interactive maps to search by state, or enter your zip code to find inpatient treatment, outpatient programs, medical detox, and sober living homes in your area." },
    { question: "Is Sober Helpline free to use?", answer: "Yes, searching our provider directory and accessing educational resources is completely free. We also offer a 7-day free trial of our premium family membership, followed by optional paid membership with advanced support features." },
    { question: "How do I know if my loved one needs treatment?", answer: "Take our free Addiction Assessment to evaluate warning signs, or call us at (541) 241-5886 to speak with someone who can help you understand your options." }
  ];

  return (
    <>
      <LeadMagnetPopup />
      <SEOHead
        title="Family Addiction Support & Education | Sober Helpline"
        description="Free education, support, and ethical resources for families affected by addiction. Recovery Roadmap, AI tools, coaching, and a community that understands."
        jsonLd={homepageSchema}
        faqItems={homepageFaqItems}
        speakableSelectors={["h1", ".hero-description", ".mission-statement"]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="flex md:hidden h-14 items-center justify-between">
            <a href="tel:5412415886" className="flex items-center gap-2 text-logo-green font-semibold">
              <Phone className="w-4 h-4" />
              <span className="text-sm">(541) 241-5886</span>
            </a>
            <MobileNav user={user} onLogout={handleLogout} />
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center">
                <img src={bannerLogo} alt="Sober Helpline" className="h-14 w-auto" />
              </Link>
              <nav className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1 text-foreground/80 hover:text-foreground">
                      For Families
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/roadmap" className="cursor-pointer font-semibold text-logo-green">🗺️ Recovery Roadmap</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/family-support" className="cursor-pointer">Family Education</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/recovery-podcasts" className="cursor-pointer">Recovery Podcasts</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/addiction-assessment" className="cursor-pointer">Addiction Assessment</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/blog" className="cursor-pointer">Blog</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/faqs" className="cursor-pointer">FAQs</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/understanding-addiction" className="cursor-pointer">Understanding Addiction</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/boundary-setting-worksheet" className="cursor-pointer">Boundary Setting Worksheet</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/recovery-resources" className="cursor-pointer">Find Recovery Resources</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/family-coaching" className="cursor-pointer">Family Coaching</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/monday-zoom-registration" className="cursor-pointer">Free Monday Zoom Meeting</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/relapse-radar" className="cursor-pointer">Relapse Radar</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1 text-foreground/80 hover:text-foreground">
                      For Providers
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <Link to="/for-providers" className="cursor-pointer">List Your Practice</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/consultation-provider-dashboard" className="cursor-pointer">Provider Login</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:5412415886" className="flex items-center gap-2 px-4 py-2 rounded-full bg-logo-green/10 text-logo-green font-semibold hover:bg-logo-green/20 transition-colors">
                <Phone className="w-4 h-4" />
                (541) 241-5886
              </a>
              {user ? (
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-logo-green/5 via-background to-primary/5" />
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-logo-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="container mx-auto px-4 py-10 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-logo-green/10 text-logo-green text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Heart className="w-3 h-3 md:w-4 md:h-4" />
              For Families Affected by Addiction
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight px-2">
               Your loved one is struggling with addiction.
               <span className="block text-logo-green mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl">You don't have to face this alone.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10 px-2 hero-description">
              You're exhausted from walking on eggshells, wondering if you're helping or making it worse. We'll show you exactly what to do — whether they're ready for help or not.
            </p>
            
            {/* Primary CTA — Family Situation Assessment */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3 px-4">
              <Link to="/family-situation-assessment">
                <Button size="lg" className="gap-2 md:gap-3 bg-logo-green hover:bg-logo-green/90 text-white px-8 md:px-10 py-5 md:py-6 text-base md:text-lg shadow-lg shadow-logo-green/25 hover:shadow-xl hover:shadow-logo-green/30 transition-all flex flex-col items-center h-auto">
                  <span className="flex items-center gap-2 md:gap-3">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    Take the Free Family Assessment
                  </span>
                  <span className="text-xs md:text-sm font-normal opacity-90 mt-1">2 minutes · Free · No account required</span>
                </Button>
              </Link>
            </div>

            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 px-4">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 px-6 py-4 text-sm md:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
                  <Calendar className="w-4 h-4" />
                  Register for the Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:5418386009">
                <Button size="lg" variant="ghost" className="gap-2 px-6 py-4 text-sm md:text-base text-muted-foreground hover:text-foreground">
                  <Phone className="w-4 h-4" />
                  Talk to Someone · (541) 838-6009
                </Button>
              </a>
            </div>
            <p className="text-xs text-muted-foreground">2 minutes · Free · No account required</p>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-muted-foreground">
            <span>22+ Years Experience</span>
            <span className="text-border">•</span>
            <span>Worldwide in English & Spanish</span>
            <span className="text-border">•</span>
            <span>24/7 Crisis Support Tools</span>
            <span className="text-border">•</span>
            <span>Active Family Forum</span>
          </div>
        </div>
      </section>

      {/* Recovery Roadmap — Full Section */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-logo-green/10 text-logo-green text-xs md:text-sm font-medium mb-4">
            <Compass className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Free · No Account Required
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Where Are You in the Recovery Journey?
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            The Recovery Roadmap meets you exactly where you are — with a personalized action plan, resources, and next steps for your stage.
          </p>
        </div>
        {/* Stage Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { emoji: "🔴", name: "Suspicion", desc: "Something feels off", path: "/roadmap/suspicion", color: "border-red-300/50 hover:border-red-400/70 hover:bg-red-50/50 dark:hover:bg-red-950/20" },
            { emoji: "🟠", name: "Confirmation", desc: "I know there's a problem", path: "/roadmap/assessment", color: "border-orange-300/50 hover:border-orange-400/70 hover:bg-orange-50/50 dark:hover:bg-orange-950/20" },
            { emoji: "🟡", name: "Crisis", desc: "Things are falling apart", path: "/roadmap/crisis", color: "border-yellow-300/50 hover:border-yellow-400/70 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20" },
            { emoji: "🔵", name: "Pre-Intervention", desc: "I'm ready to act", path: "/roadmap/pre-intervention", color: "border-blue-300/50 hover:border-blue-400/70 hover:bg-blue-50/50 dark:hover:bg-blue-950/20" },
            { emoji: "🟣", name: "Treatment", desc: "They're in treatment", path: "/roadmap/treatment", color: "border-purple-300/50 hover:border-purple-400/70 hover:bg-purple-50/50 dark:hover:bg-purple-950/20" },
            { emoji: "🟢", name: "Early Recovery", desc: "They're home — now what?", path: "/roadmap/early-recovery", color: "border-green-300/50 hover:border-green-400/70 hover:bg-green-50/50 dark:hover:bg-green-950/20" },
            { emoji: "⚪", name: "Long-Term Recovery", desc: "6+ months in, rebuilding", path: "/roadmap/long-term-recovery", color: "border-slate-300/50 hover:border-slate-400/70 hover:bg-slate-50/50 dark:hover:bg-slate-950/20" },
            { emoji: "🔴", name: "Relapse", desc: "It happened again", path: "/roadmap/relapse", color: "border-rose-300/50 hover:border-rose-400/70 hover:bg-rose-50/50 dark:hover:bg-rose-950/20" },
          ].map((stage) => (
            <Link key={stage.path} to={stage.path}>
              <div className={`rounded-xl border-2 bg-card p-4 md:p-5 text-center cursor-pointer transition-all hover:shadow-md group ${stage.color}`}>
                <div className="text-2xl md:text-3xl mb-2">{stage.emoji}</div>
                <div className="font-semibold text-sm md:text-base text-foreground mb-1">{stage.name}</div>
                <div className="text-xs text-muted-foreground leading-snug">{stage.desc}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-logo-green font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Start here <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Single CTA */}
        <div className="text-center">
          <Link to="/roadmap/assessment">
            <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-10 py-6 text-base md:text-lg shadow-lg shadow-logo-green/20">
              <Compass className="w-5 h-5" />
              Take the 5-Minute Assessment →
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">Tells you your stage and gives you a personalized plan</p>
        </div>
      </section>

      {/* Peek Inside the Curriculum - Membership Conversion Section */}
      <section className="bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-4">
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
              What You'll Learn to Handle
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
              The Situations We Help You Navigate
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Real answers for the hardest moments — from someone who's helped over 1,000 families through this.
            </p>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Going It Alone */}
            <Card className="border-2 border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground">Going It Alone</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>No live support when a crisis hits at night or on weekends</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Waiting weeks for a therapist who may not understand addiction</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Wondering if you're overreacting—or not doing enough</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Googling at 2am with no one to talk to</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Walking on eggshells, afraid to make it worse</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Feeling judged by friends who don't understand</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Enabling without realizing it—then feeling guilty</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Exhausted from carrying the weight alone</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* With Our Community */}
            <Card className="border-2 border-logo-green/40 bg-gradient-to-br from-logo-green/5 to-transparent">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-logo-green/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-logo-green" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground">With Our Community</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>Free “The Family Squares” calls with other families who get it</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>On-demand hourly coaching sessions when you need guidance now</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>Clear education that explains what you're seeing</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>A private forum of families who truly get it</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>Practical tools for boundaries that actually work</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>Guided meditations for when the stress overwhelms</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>AI coaching tools for real-time decision support</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                    <span>The confidence to respond instead of react</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block bg-gradient-to-r from-logo-green/10 via-primary/10 to-logo-green/10 rounded-2xl p-6 md:p-8 border border-logo-green/20">
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">You don't have to figure this out alone.</span> Join families who are learning to heal together.
              </p>
              <Link to="/family-membership">
                <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-8 shadow-lg shadow-logo-green/25">
                  <Sparkles className="w-4 h-4" />
                  Try Free for 7 Days
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-2">
                No payment required • Then just $14.99/month • Cancel anytime
              </p>
            </div>
          </div>

          {/* Six Pillars Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Pillar 1 */}
            <div className="relative group">
              <Card className="h-full border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Start Free</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Pillar 1</div>
                      <h3 className="font-semibold text-foreground mb-2">Making Sense of Their Behavior</h3>
                      <p className="text-xs text-muted-foreground">Why willpower fails, how the brain changes, and what families need to know about the disease.</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>7 resources</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pillar 2 */}
            <div className="relative group">
              <Card className="h-full border-2 border-rose-500/30 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Start Free</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">Pillar 2</div>
                      <h3 className="font-semibold text-foreground mb-2">When Mental Health Makes It Harder</h3>
                      <p className="text-xs text-muted-foreground">How mental health conditions interact with substance use and what families should understand.</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>8 resources</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pillar 3 */}
            <div className="relative group">
              <Card className="h-full border-2 border-violet-500/30 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Start Free</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">Pillar 3</div>
                      <h3 className="font-semibold text-foreground mb-2">Am I Helping or Making It Worse?</h3>
                      <p className="text-xs text-muted-foreground">Recognize patterns that keep families stuck and learn to break the cycle of enabling.</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>19 resources</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pillar 4 */}
            <div className="relative group">
              <Card className="h-full border-2 border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Start Free</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Pillar 4</div>
                      <h3 className="font-semibold text-foreground mb-2">Finding Treatment That Actually Works</h3>
                      <p className="text-xs text-muted-foreground">Navigate the treatment system, ask the right questions, and avoid industry red flags.</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>11 resources</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pillar 5 */}
            <div className="relative group">
              <Card className="h-full border-2 border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Start Free</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Pillar 5</div>
                      <h3 className="font-semibold text-foreground mb-2">Setting Boundaries That Stick</h3>
                      <p className="text-xs text-muted-foreground">Set and maintain healthy boundaries while understanding the difference between boundaries and ultimatums.</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>8 resources</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pillar 6 */}
            <div className="relative group">
              <Card className="h-full border-2 border-teal-500/30 bg-gradient-to-br from-teal-50/50 to-transparent dark:from-teal-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Start Free</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <TreePine className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-1">Pillar 6</div>
                      <h3 className="font-semibold text-foreground mb-2">Reclaiming Your Own Life</h3>
                      <p className="text-xs text-muted-foreground">Focus on your own healing journey regardless of your loved one's choices.</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>9 resources</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Also Includes */}
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 md:mb-10 border border-border/50">
            <h3 className="text-lg md:text-xl font-semibold text-foreground text-center mb-6">Tools That Work When You Need Them Most</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <div className="font-medium text-sm text-foreground">Guided Meditations</div>
                <div className="text-xs text-muted-foreground">For stress & healing</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="font-medium text-sm text-foreground">Private Forum</div>
                <div className="text-xs text-muted-foreground">24/7 peer support</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="font-medium text-sm text-foreground">Interactive Worksheets</div>
                <div className="text-xs text-muted-foreground">Track your progress</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="font-medium text-sm text-foreground">AI Coaching Tools</div>
                <div className="text-xs text-muted-foreground">Personalized guidance</div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* “The Family Squares” Announcement */}
      <section className="container mx-auto px-4 pt-6 md:pt-10">
        <Link to="/monday-zoom-registration" className="block">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm font-medium text-white/80">📅 Every Monday</p>
                  <h3 className="text-base md:text-lg font-bold">“The Family Squares” — Free Weekly Support</h3>
                  <p className="text-xs md:text-sm text-white/70 mt-0.5">Live group sessions every Monday at 7 PM PST. Open to everyone — no membership required.</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold transition-colors group-hover:scale-105 duration-200">
                  Register Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Family Coaching CTA Banner */}
      <section className="container mx-auto px-4 pt-4 md:pt-6">
        <Link to="/family-coaching" className="block">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm font-medium text-white/80">1-on-1 Support for Families</p>
                  <h3 className="text-base md:text-lg font-bold">Family Coaching — From Crisis to Clarity</h3>
                  <p className="text-xs md:text-sm text-white/70 mt-0.5">Boundaries, enabling patterns, and a real plan — with a coach who's been there. Sessions start at $150 — <span className="text-yellow-300 font-semibold">members save $25 per session</span>.</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold transition-colors group-hover:scale-105 duration-200">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Free Consultation CTA */}
      <section className="container mx-auto px-4 pt-4 md:pt-6">
        <FreeConsultationCTA compact />
      </section>

      {/* Provider Directory */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-logo-green/10 text-logo-green text-xs md:text-sm font-medium mb-4">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Ethical Provider Directory
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Find Vetted Treatment Providers
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            No referral fees. No kickbacks. Just honest, vetted providers.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category) => (
            <Link key={category.path} to={category.path}>
              <Card className="h-full hover:shadow-lg hover:border-logo-green/40 transition-all group cursor-pointer">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-logo-green/10 flex items-center justify-center mb-3 group-hover:bg-logo-green/20 transition-colors">
                    <category.icon className="w-6 h-6 text-logo-green" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground hidden md:block">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials — removed placeholder reviews, will add real ones later */}

      {/* Family Bridge Banner */}
      <section className="container mx-auto px-4 pt-10 md:pt-16">
        <FamilyBridgeBanner />
      </section>


      {/* Featured Articles */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">Latest from Our Blog</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">Expert insights on addiction, recovery, and family support</p>
        </div>
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
          {featuredArticles.map((article, index) => (
            <Link
              key={article.id}
              to={`/blog/${article.id}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentArticleIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="relative w-full h-full">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    fetchPriority={index === 0 ? "high" : "low"}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
                  <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-logo-green text-white text-[10px] md:text-xs font-medium rounded-full mb-2 md:mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-lg md:text-3xl font-bold text-white mb-1.5 md:mb-2 line-clamp-2 leading-tight max-w-3xl">
                    {article.title}
                  </h3>
                  <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4 hidden md:block max-w-2xl">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {/* Carousel indicators */}
          <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentArticleIndex(index);
                }}
                className={`h-1.5 md:h-2 rounded-full transition-all ${
                  index === currentArticleIndex ? 'bg-white w-4 md:w-6' : 'bg-white/50 w-1.5 md:w-2'
                }`}
                aria-label={`Go to article ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-10 md:py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">You've Been Carrying This Alone Long Enough.</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-2">
            Let us help you figure out the next right move — for you and your family.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
            <a href="tel:5412415886" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-logo-green hover:bg-logo-green/90 px-6 md:px-8 text-sm md:text-base">
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                Call Now: (541) 241-5886
              </Button>
            </a>
            <Link to="/family-membership" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 md:px-8 text-sm md:text-base border-logo-green text-logo-green hover:bg-logo-green hover:text-white">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                Try Free for 7 Days
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Index;
