import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart, ChevronDown, Calendar, User as UserIcon, Shield, MessageCircle, AlertTriangle, BookOpen, ArrowRight, Sparkles, GraduationCap, TreePine, Eye, X, Check, Compass, BadgeDollarSign, Clock3 } from "lucide-react";
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
import mattBrownTrust from "@/assets/matt-brown-trust.jpg";

import MobileNav from "@/components/MobileNav";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { featuredBlogPosts } from "@/data/featuredBlogPosts";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import SUDAssessment from "@/components/SUDAssessment";
import EatingDisorderScreening from "@/components/EatingDisorderScreening";
import SEOHead from "@/components/SEOHead";

import FamilyBridgeBanner from "@/components/FamilyBridgeBanner";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import { trackConversionEvent } from "@/lib/conversionTracking";

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

const startHereOptions = [
  {
    title: "Free Family Squares",
    description: "Join the free Monday support meeting for perspective, clarity, and a place to start without pressure.",
    icon: Calendar,
    to: "/family-squares",
    cta: "Join the free meeting",
    accent: "border-blue-200 bg-blue-50/70 hover:bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20",
  },
  {
    title: "Can't wait until Monday?",
    description: "Book a private session and get answers now when the family needs a calmer plan today.",
    icon: AlertTriangle,
    to: "/family-consultation",
    cta: "Book a session now",
    accent: "border-amber-200 bg-amber-50/70 hover:bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20",
  },
  {
    title: "Intervention readiness",
    description: "Use this path when refusal, relapse, risk, or family division may require a formal intervention.",
    icon: Shield,
    to: "/intervention-help",
    cta: "Check readiness",
    accent: "border-violet-200 bg-violet-50/70 hover:bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/20",
  },
  {
    title: "Treatment options",
    description: "Search vetted treatment resources and levels of care without referral pressure or industry games.",
    icon: Building2,
    to: "/recovery-resources",
    cta: "See treatment options",
    accent: "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
  },
];

const funnelLanes = [
  {
    eyebrow: "Soft landing",
    title: "Family Squares",
    description: "The free Monday room for families who need live support before they are ready to buy anything.",
    to: "/family-squares",
    cta: "Join free Monday support",
    icon: Calendar,
  },
  {
    eyebrow: "Private guidance",
    title: "Coaching and consults",
    description: "A paid next step when the family needs a calm plan, direct feedback, or help deciding what to do this week.",
    to: "/family-consultation",
    cta: "See private help",
    icon: Phone,
  },
  {
    eyebrow: "High-risk path",
    title: "Intervention readiness",
    description: "A bridge toward Freedom Interventions when refusal, safety, relapse, or family conflict has crossed the line.",
    to: "/intervention-help",
    cta: "Assess intervention fit",
    icon: Shield,
  },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const { isMember } = useMembershipStatus();

  const featuredArticles = useMemo(() => featuredBlogPosts, []);

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

  const homepageFaqItems = [
    { question: "What is Sober Helpline?", answer: "Sober Helpline connects families with ethical, vetted addiction treatment providers nationwide, offering free resources, education, and support for those affected by addiction." },
    { question: "How do I find a treatment center near me?", answer: "Use our interactive maps to search by state, or enter your zip code to find inpatient treatment, outpatient programs, medical detox, and sober living homes in your area." },
    { question: "Is Sober Helpline free to use?", answer: "Yes, searching our provider directory and accessing educational resources is completely free. We also offer free support resources and optional paid private consultation and coaching options." },
    { question: "How do I know if my loved one needs treatment?", answer: "Take our free Addiction Assessment to evaluate warning signs, or call us at (541) 241-5668 to speak with someone who can help you understand your options." }
  ];

  return (
    <>
      <LeadMagnetPopup />
      <SEOHead
        title="Crisis Family Addiction Help | Sober Helpline"
        description="Urgent help for families dealing with addiction. Book a crisis family consult, get free support, and find ethical treatment options with clear, family-first guidance."
        jsonLd={homepageSchema}
        faqItems={homepageFaqItems}
        speakableSelectors={["h1", ".hero-description", ".mission-statement"]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex md:hidden h-14 items-center justify-between">
              <a href="tel:5412415668" className="flex items-center gap-2 text-logo-green font-semibold">
                <Phone className="w-4 h-4" />
                <span className="text-sm">(541) 241-5668</span>
              </a>
              <MobileNav user={user} onLogout={handleLogout} />
            </div>

            <div className="hidden md:flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center">
                  <img src={bannerLogo} alt="Sober Helpline" className="h-14 w-auto" />
                </Link>
                <nav className="flex items-center gap-2">
                  <Link to="/family-consultation">
                    <Button variant="ghost" className="text-foreground/80 hover:text-foreground font-medium">
                      Crisis Consult
                    </Button>
                  </Link>
                  <Link to="/family-squares">
                    <Button variant="ghost" className="text-foreground/80 hover:text-foreground font-medium">
                      Family Squares
                    </Button>
                  </Link>
                  <Link to="/intervention-help">
                    <Button variant="ghost" className="text-foreground/80 hover:text-foreground font-medium">
                      Intervention
                    </Button>
                  </Link>
                  <Link to="/recovery-resources">
                    <Button variant="ghost" className="text-foreground/80 hover:text-foreground font-medium">
                      Treatment Options
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-1 text-foreground/80 hover:text-foreground">
                        Learn
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link to="/roadmap" className="cursor-pointer font-semibold text-logo-green">Recovery Roadmap</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/family-support" className="cursor-pointer">Family Education</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/blog" className="cursor-pointer">Blog</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/faqs" className="cursor-pointer">FAQs</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/addiction-assessment" className="cursor-pointer">Addiction Assessment</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/understanding-addiction" className="cursor-pointer">Understanding Addiction</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/recovery-podcasts" className="cursor-pointer">Recovery Podcasts</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <a href="tel:5412415668" className="flex items-center gap-2 px-4 py-2 rounded-full bg-logo-green/10 text-logo-green font-semibold hover:bg-logo-green/20 transition-colors">
                  <Phone className="w-4 h-4" />
                  (541) 241-5668
                </a>
                  <Link to="/family-squares">
                    <Button className="bg-logo-green hover:bg-logo-green/90 text-white font-semibold shadow-sm">
                      Join Free Monday
                    </Button>
                  </Link>
                {user ? (
                  <>
                    {isMember && (
                      <Link to="/family-education">
                        <Button variant="default" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                          <Heart className="w-4 h-4" />
                          My Family Hub
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                  </>
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

        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-background to-logo-green/5 dark:from-red-950/20 dark:via-background dark:to-logo-green/10" />
          <div className="absolute top-0 right-0 w-[340px] md:w-[560px] h-[340px] md:h-[560px] bg-logo-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[220px] md:w-[420px] h-[220px] md:h-[420px] bg-red-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="container mx-auto px-4 py-10 md:py-16 relative">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-10 items-center max-w-6xl mx-auto">
              <div>
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
                  <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                  Free live support and next-step guidance for families
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
                  Stop guessing what to do next.
                  <span className="block text-logo-green mt-2">Get the right level of family addiction help.</span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground max-w-3xl mb-6 md:mb-8 hero-description">
                  Sober Helpline helps families move from worry into action. Join the free Family Squares support meeting, book a private session if you cannot wait until Monday, or check whether the situation is moving toward intervention readiness.
                </p>

                <div className="grid gap-3 mb-3 max-w-4xl md:grid-cols-3">
                  <Link to="/family-squares" className="w-full" onClick={() => trackConversionEvent("monday_zoom_click", { source: "homepage_hero_primary" })}>
                    <Button size="lg" className="h-full min-h-[64px] w-full gap-2 md:gap-3 whitespace-normal bg-logo-green px-5 py-4 text-sm leading-snug text-white shadow-lg shadow-logo-green/25 transition-all hover:bg-logo-green/90 hover:shadow-xl hover:shadow-logo-green/30 md:text-base">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                      Join the Free Family Squares Support Meeting
                    </Button>
                  </Link>
                  <Link to="/family-consultation" className="w-full" onClick={() => trackConversionEvent("coaching_click", { source: "homepage_hero_secondary" })}>
                    <Button size="lg" variant="outline" className="h-full min-h-[64px] w-full gap-2 whitespace-normal border-amber-400/50 px-5 py-4 text-sm leading-snug text-amber-800 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/20 md:text-base">
                      <Clock3 className="w-4 h-4" />
                      Can't wait until Monday? Book a session and get answers now.
                    </Button>
                  </Link>
                  <Link to="/intervention-help" className="w-full" onClick={() => trackConversionEvent("intervention_readiness_click", { source: "homepage_hero_tertiary" })}>
                    <Button size="lg" variant="outline" className="h-full min-h-[64px] w-full gap-2 whitespace-normal border-violet-400/40 px-5 py-4 text-sm leading-snug text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/20 md:text-base">
                      <Shield className="w-4 h-4" />
                      Check Intervention Readiness
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 text-sm text-muted-foreground mb-6 md:mb-8">
                  <span className="font-semibold text-foreground">Free Monday support at 7 PM Pacific</span>
                  <span className="hidden sm:inline text-border">•</span>
                  <span>Private sessions available from $150 when Monday is too far away</span>
                  <span className="hidden sm:inline text-border">•</span>
                  <a href="tel:5412415668" className="inline-flex items-center gap-2 text-logo-green hover:underline">
                    <Phone className="w-4 h-4" />
                    Call 541-241-5668
                  </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl">
                  {startHereOptions.map((option) => (
                    <Link
                      key={option.title}
                      to={option.to}
                      onClick={() => {
                        if (option.to === "/family-squares") trackConversionEvent("monday_zoom_click", { source: "homepage_start_here_card", label: option.title });
                        if (option.to === "/family-consultation") trackConversionEvent("coaching_click", { source: "homepage_start_here_card", label: option.title });
                        if (option.to === "/intervention-help") trackConversionEvent("intervention_readiness_click", { source: "homepage_start_here_card", label: option.title });
                      }}
                    >
                      <Card className={`h-full border transition-all hover:shadow-md ${option.accent}`}>
                        <CardContent className="p-4 md:p-5">
                          <div className="w-10 h-10 rounded-xl bg-background/80 flex items-center justify-center mb-3 border border-border/40">
                            <option.icon className="w-5 h-5 text-logo-green" />
                          </div>
                          <h2 className="font-semibold text-foreground mb-2">{option.title}</h2>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{option.description}</p>
                          <div className="inline-flex items-center gap-1 text-sm font-medium text-logo-green">
                            {option.cta}
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              <Card className="border-logo-green/20 shadow-xl bg-background/90 backdrop-blur">
                <CardContent className="p-5 md:p-6">
                  <div className="grid sm:grid-cols-[140px_1fr] gap-5 items-center">
                    <div className="mx-auto sm:mx-0 w-32 h-40 md:w-36 md:h-44 rounded-2xl overflow-hidden border border-border/50 shadow-md bg-muted">
                      <img src={mattBrownTrust} alt="Matt Brown" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-logo-green/10 text-logo-green text-xs font-semibold mb-3">
                        <Shield className="w-3.5 h-3.5" />
                        Trusted, private, family-first guidance
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">Work with Matt Brown</h2>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Matt has 22+ years of experience helping families respond to addiction with more clarity and less panic. He helps families think straight in hard moments, evaluate treatment options ethically, and stop getting pushed around by the industry.
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Check className="w-4 h-4 text-logo-green" />Private consults and family coaching</div>
                        <div className="flex items-center gap-2"><Check className="w-4 h-4 text-logo-green" />Ethical treatment navigation for families</div>
                        <div className="flex items-center gap-2"><Check className="w-4 h-4 text-logo-green" />Support in English and Spanish</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
                    <div className="flex items-start gap-3">
                      <BadgeDollarSign className="w-5 h-5 text-amber-700 dark:text-amber-300 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Start free. Move faster when the situation calls for it.</p>
                        <p className="text-sm text-muted-foreground mt-1">If Monday support is enough, begin with Family Squares. If your family needs answers now, book a private session or check intervention readiness.</p>
                        <Link to="/family-squares" className="inline-flex items-center gap-1 text-sm font-medium text-logo-green mt-2 hover:underline">
                          Register for Family Squares
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-4 md:py-5">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-muted-foreground">
              <span>22+ Years Experience</span>
              <span className="text-border">•</span>
              <span>Private consults for families in active chaos</span>
              <span className="text-border">•</span>
              <span>Clear guidance from a real person</span>
              <span className="text-border">•</span>
              <span>Ethical treatment guidance nationwide</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-6xl mx-auto rounded-3xl border border-logo-green/20 bg-gradient-to-r from-logo-green/10 via-background to-primary/5 p-6 md:p-8 shadow-sm">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-logo-green mb-2">Coming from No More Enabling?</p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">This is where reading turns into live support.</h2>
                <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
                  No More Enabling helps families name the pattern. Sober Helpline gives them a place to bring that pattern into a live room, a private consult, or an intervention-readiness conversation.
                </p>
                <Button asChild variant="outline" className="mt-5 border-logo-green/30 text-logo-green hover:bg-logo-green/5">
                  <Link to="/from-no-more-enabling">
                    Follow the guided bridge
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-3">
                {funnelLanes.map((lane) => (
                  <Link key={lane.title} to={lane.to} className="rounded-2xl border bg-background/80 p-4 transition-all hover:border-logo-green/40 hover:shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-logo-green/10 text-logo-green">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lane.eyebrow}</span>
                        <span className="block font-semibold text-foreground">{lane.title}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">{lane.description}</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-logo-green">
                          {lane.cta}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-16">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-logo-green/10 text-logo-green text-xs md:text-sm font-medium mb-4">
              <Compass className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Free roadmap, lower-pressure next step
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
              Not sure how urgent this is?
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              The Recovery Roadmap is still here if you need to get oriented. We moved it below the crisis help so you can choose urgency first, then education.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            {[
              { emoji: "🔴", name: "Suspicion", desc: "Something feels off", path: "/roadmap/suspicion", color: "border-red-300/50 hover:border-red-400/70 hover:bg-red-50/50 dark:hover:bg-red-950/20" },
              { emoji: "🟠", name: "Confirmation", desc: "I know there's a problem", path: "/roadmap/assessment", color: "border-orange-300/50 hover:border-orange-400/70 hover:bg-orange-50/50 dark:hover:bg-orange-950/20" },
              { emoji: "🟡", name: "Crisis", desc: "Things are falling apart", path: "/roadmap/crisis", color: "border-yellow-300/50 hover:border-yellow-400/70 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20" },
              { emoji: "🔵", name: "Pre-Intervention", desc: "I'm ready to act", path: "/roadmap/pre-intervention", color: "border-blue-300/50 hover:border-blue-400/70 hover:bg-blue-50/50 dark:hover:bg-blue-950/20" },
              { emoji: "🟣", name: "Treatment", desc: "They're in treatment", path: "/roadmap/treatment", color: "border-purple-300/50 hover:border-purple-400/70 hover:bg-purple-50/50 dark:hover:bg-purple-950/20" },
              { emoji: "🟢", name: "Early Recovery", desc: "They're home, now what?", path: "/roadmap/early-recovery", color: "border-green-300/50 hover:border-green-400/70 hover:bg-green-50/50 dark:hover:bg-green-950/20" },
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
          <div className="text-center">
            <Link to="/roadmap/assessment">
              <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-10 py-6 text-base md:text-lg shadow-lg shadow-logo-green/20">
                <Compass className="w-5 h-5" />
                Take the 5-Minute Assessment
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">Tells you your stage and gives you a more grounded plan</p>
          </div>
        </section>

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
                Clear help for the moments that leave families stuck, scared, or worn down.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
              <Card className="border-2 border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <X className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">Trying to Handle It Alone</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "No real support when things blow up at night or over the weekend",
                      "Waiting weeks for help from someone who may not really understand addiction",
                      "Wondering if you are overreacting or not doing enough",
                      "Searching online at 2 a.m. with no one to talk it through with",
                      "Walking on eggshells because you are afraid of making it worse",
                      "Feeling judged by people who have never lived through this",
                      "Helping in ways that may actually keep the cycle going, then feeling guilty",
                      "Getting worn down from carrying too much by yourself",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-logo-green/40 bg-gradient-to-br from-logo-green/5 to-transparent">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-logo-green/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-logo-green" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">With Steady Support</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Free “The Family Squares” calls with other families who get it",
                      "Hourly coaching when you need one-on-one guidance",
                      "Clear education that explains what you're seeing",
                      "A private forum of families who truly get it",
                      "Practical tools for boundaries you can actually hold",
                      "Guided meditations for the moments when stress takes over",
                      "AI coaching tools for real-time decision support",
                      "More clarity, so you can respond instead of react",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-logo-green mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block bg-gradient-to-r from-logo-green/10 via-primary/10 to-logo-green/10 rounded-2xl p-6 md:p-8 border border-logo-green/20">
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  <span className="font-semibold text-foreground">You do not have to figure this out alone.</span> Get practical tools, steady support, and a place to think more clearly again.
                </p>
                <Link to="/family-membership">
                  <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-8 shadow-lg shadow-logo-green/25">
                    <Sparkles className="w-4 h-4" />
                    Explore Membership
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">
                  Start with a 7-day free trial, then $14.99/month. Cancel anytime.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              {[
                { color: "emerald", icon: Brain, title: "Making Sense of Their Behavior", desc: "Why willpower fails, how the brain changes, and what families need to know about the disease.", count: "7 resources" },
                { color: "rose", icon: Heart, title: "When Mental Health Makes It Harder", desc: "How mental health conditions interact with substance use and what families should understand.", count: "8 resources" },
                { color: "violet", icon: Users, title: "Am I Helping or Making It Worse?", desc: "Recognize patterns that keep families stuck and learn to break the cycle of enabling.", count: "19 resources" },
                { color: "blue", icon: GraduationCap, title: "Finding Treatment That Actually Works", desc: "Navigate the treatment system, ask the right questions, and avoid industry red flags.", count: "11 resources" },
                { color: "amber", icon: Shield, title: "Setting Boundaries That Stick", desc: "Set and maintain healthy boundaries while understanding the difference between boundaries and ultimatums.", count: "8 resources" },
                { color: "teal", icon: TreePine, title: "Reclaiming Your Own Life", desc: "Focus on your own healing journey regardless of your loved one's choices.", count: "9 resources" },
              ].map((pillar) => {
                const colorMap = {
                  emerald: "border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 text-emerald-600 dark:text-emerald-400",
                  rose: "border-rose-500/30 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20 text-rose-600 dark:text-rose-400",
                  violet: "border-violet-500/30 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/20 text-violet-600 dark:text-violet-400",
                  blue: "border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 text-blue-600 dark:text-blue-400",
                  amber: "border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 text-amber-600 dark:text-amber-400",
                  teal: "border-teal-500/30 bg-gradient-to-br from-teal-50/50 to-transparent dark:from-teal-950/20 text-teal-600 dark:text-teal-400",
                } as const;

                return (
                  <Card key={pillar.title} className={`h-full border-2 ${colorMap[pillar.color as keyof typeof colorMap].split(" text-")[0]}`}>
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-background/70 flex items-center justify-center flex-shrink-0 border border-border/40">
                          <pillar.icon className={`w-6 h-6 ${colorMap[pillar.color as keyof typeof colorMap].includes("text-") ? colorMap[pillar.color as keyof typeof colorMap].split(" ").slice(-2).join(" ") : "text-logo-green"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{pillar.title}</h3>
                          <p className="text-xs text-muted-foreground">{pillar.desc}</p>
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{pillar.count}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 md:mb-10 border border-border/50">
              <h3 className="text-lg md:text-xl font-semibold text-foreground text-center mb-6">Support You Can Actually Use</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { icon: Headphones, title: "Guided Meditations", desc: "For stress & healing" },
                  { icon: MessageCircle, title: "Private Forum", desc: "24/7 peer support" },
                  { icon: BookOpen, title: "Interactive Worksheets", desc: "Track your progress" },
                  { icon: Sparkles, title: "AI Coaching Tools", desc: "Personalized guidance" },
                ].map((item) => (
                  <div key={item.title} className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-medium text-sm text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-6 md:pt-10">
          <Link to="/family-squares" className="block">
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm font-medium text-white/80">Free weekly support</p>
                    <h3 className="text-base md:text-lg font-bold">“The Family Squares” every Monday at 7 PM PST</h3>
                    <p className="text-xs md:text-sm text-white/70 mt-0.5">Live group support every Monday for any family member. No membership required.</p>
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

        <section className="container mx-auto px-4 pt-4 md:pt-6">
          <Link to="/family-membership" className="block">
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm font-medium text-white/80">Ongoing support</p>
                    <h3 className="text-base md:text-lg font-bold">Family Membership for steady support between crises</h3>
                    <p className="text-xs md:text-sm text-white/70 mt-0.5">Get the forum, education library, recordings, and member pricing on coaching.</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold transition-colors group-hover:scale-105 duration-200">
                    Explore Membership <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section className="container mx-auto px-4 pt-4 md:pt-6 space-y-4">
          <Link to="/family-coaching" className="block">
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm font-medium text-white/80">Private help</p>
                    <h3 className="text-base md:text-lg font-bold">Family coaching when you need one-on-one guidance</h3>
                    <p className="text-xs md:text-sm text-white/70 mt-0.5">Private coaching is there when the group and membership are not enough. Emergency sessions start at $150.</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold transition-colors group-hover:scale-105 duration-200">
                    See Coaching Options <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/family-readiness-intensive" className="block">
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-700 p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm font-medium text-white/80">High-stakes planning</p>
                    <h3 className="text-base md:text-lg font-bold">Family Readiness Intensive for major family decisions</h3>
                    <p className="text-xs md:text-sm text-white/70 mt-0.5">A 90-minute strategy session plus 7 days of follow-up support for families who need clarity fast.</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold transition-colors group-hover:scale-105 duration-200">
                    Explore the Intensive <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

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
              Vetted providers, honest guidance, and practical next steps for families who need clarity.
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

        <section className="container mx-auto px-4 pt-10 md:pt-16">
          <FamilyBridgeBanner />
        </section>

        <section className="container mx-auto px-4 py-10 md:py-16">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">Latest from Our Blog</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">Practical articles on addiction, recovery, and what families can do next</p>
          </div>
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
            {featuredArticles.map((article, index) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentArticleIndex ? "opacity-100 z-10" : "opacity-0 z-0"
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
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentArticleIndex(index);
                  }}
                  className={`h-1.5 md:h-2 rounded-full transition-all ${
                    index === currentArticleIndex ? "bg-white w-4 md:w-6" : "bg-white/50 w-1.5 md:w-2"
                  }`}
                  aria-label={`Go to article ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">You do not have to keep guessing.</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-2">
              Start with the free Monday meeting, move into a private session when you cannot wait, or check intervention readiness when refusal, relapse, or risk is escalating.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
              <Link to="/family-squares" className="w-full sm:w-auto" onClick={() => trackConversionEvent("monday_zoom_click", { source: "homepage_bottom_cta" })}>
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-logo-green hover:bg-logo-green/90 px-6 md:px-8 text-sm md:text-base">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  Join Free Family Squares
                </Button>
              </Link>
              <Link to="/family-consultation" className="w-full sm:w-auto" onClick={() => trackConversionEvent("coaching_click", { source: "homepage_bottom_cta" })}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 md:px-8 text-sm md:text-base border-logo-green text-logo-green hover:bg-logo-green hover:text-white">
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  Book a Session Now
                </Button>
              </Link>
              <Link to="/intervention-help" className="w-full sm:w-auto" onClick={() => trackConversionEvent("intervention_readiness_click", { source: "homepage_bottom_cta" })}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 md:px-8 text-sm md:text-base">
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                  Check Intervention Readiness
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="hidden">
          <FamilySelfAssessment />
          <SUDAssessment />
          <EatingDisorderScreening />
        </div>
      </div>
    </>
  );
};

export default Index;
