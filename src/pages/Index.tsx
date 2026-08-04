import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart, ChevronDown, Calendar, User as UserIcon, Shield, MessageCircle, BookOpen, ArrowRight, Sparkles, GraduationCap, TreePine, Eye, X, Check } from "lucide-react";
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
import bannerLogo from "@/assets/logo.png";

import MobileNav from "@/components/MobileNav";
import WhatsAppLink from "@/components/WhatsAppLink";
import HomeHero from "@/components/HomeHero";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { featuredBlogPosts } from "@/data/featuredBlogPosts";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import SUDAssessment from "@/components/SUDAssessment";
import EatingDisorderScreening from "@/components/EatingDisorderScreening";
import SEOHead from "@/components/SEOHead";

import FamilyBridgeBanner from "@/components/FamilyBridgeBanner";
import FamilyFunnelDecisionMatrix from "@/components/FamilyFunnelDecisionMatrix";
import SoberHelplineAppStoreBadge from "@/components/SoberHelplineAppStoreBadge";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import CommonFamilyQuestions from "@/components/CommonFamilyQuestions";
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
    eyebrow: "Get immediate help, often same day",
    title: "Coaching and consults",
    description: "When you can't wait until Monday, get a calm plan, direct feedback, or help deciding what to do this week.",
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
    { question: "How do I know if my loved one needs treatment?", answer: "Take our free Addiction Assessment to evaluate warning signs, or call us at (458) 298-8008 to speak with someone who can help you understand your options." }
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
            <div className="flex lg:hidden h-14 items-center justify-between">
              <a href="tel:4582988008" className="flex items-center gap-2 text-logo-blue font-semibold">
                <Phone className="w-4 h-4" />
                <span className="text-sm">(458) 298-8008</span>
              </a>
              <MobileNav user={user} onLogout={handleLogout} />
            </div>

            <div className="hidden lg:flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center">
                  <img src={bannerLogo} alt="Sober Helpline" width={56} height={56} fetchPriority="high" decoding="async" className="h-14 w-auto" />
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
                        <Link to="/roadmap" className="cursor-pointer font-semibold text-logo-blue">Recovery Roadmap</Link>
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
                <a href="tel:4582988008" className="flex items-center gap-2 px-4 py-2 rounded-full bg-logo-blue/10 text-logo-blue font-semibold hover:bg-logo-blue/20 transition-colors">
                  <Phone className="w-4 h-4" />
                  (458) 298-8008
                </a>
                <WhatsAppLink source="index_header" variant="icon" />
                  <Link to="/family-squares">
                    <Button className="bg-logo-blue hover:bg-logo-blue/90 text-white font-semibold shadow-sm">
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

        <HomeHero />

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

        <FamilyFunnelDecisionMatrix source="homepage_decision_matrix" />

        <CommonFamilyQuestions
          source="homepage_common_family_questions"
          eyebrow="Questions families ask before they act"
          title="Turn the search into the right next step."
          description="Families often arrive with one urgent question. These answers guide them toward Family Squares, private coaching, or intervention readiness without disrupting the free meeting path."
        />

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-6xl mx-auto rounded-3xl border border-logo-blue/20 bg-gradient-to-r from-logo-blue/10 via-background to-logo-blue/5 p-6 md:p-8 shadow-sm">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue mb-2">Coming from No More Enabling?</p>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-logo-blue via-blue-600 to-brand-amber bg-clip-text text-transparent">This is where reading turns into live support.</h2>
                <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
                  No More Enabling helps families name the pattern. Sober Helpline gives them a place to bring that pattern into a live room, a private consult, or an intervention-readiness conversation.
                </p>
                <Button asChild variant="outline" className="mt-5 border-logo-blue/30 text-logo-blue hover:bg-logo-blue/5">
                  <Link to="/from-no-more-enabling">
                    Follow the guided bridge
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-3">
                {funnelLanes.map((lane) => (
                  <Link key={lane.title} to={lane.to} className="rounded-2xl border bg-gradient-to-br from-logo-blue/5 via-background to-logo-blue/10 p-4 transition-all hover:border-logo-blue/40 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-logo-blue/20 to-logo-blue/5 text-logo-blue">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lane.eyebrow}</span>
                        <span className="block font-semibold text-foreground">{lane.title}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">{lane.description}</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-logo-blue">
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


        <section className="bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-4">
                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                What You'll Learn to Handle
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-logo-blue via-blue-600 to-brand-amber bg-clip-text text-transparent">
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
                    <div className="w-10 h-10 rounded-full bg-logo-blue/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-logo-blue" />
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
                        <Check className="w-4 h-4 text-logo-blue mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block bg-gradient-to-r from-logo-blue/10 via-logo-blue/5 to-logo-blue/10 rounded-2xl p-6 md:p-8 border border-logo-blue/20">
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  <span className="font-semibold text-foreground">You do not have to figure this out alone.</span> Get practical tools, steady support, and a place to think more clearly again.
                </p>
                <Link to="/family-membership">
                  <Button size="lg" className="gap-2 bg-logo-blue hover:bg-logo-blue/90 text-white px-8 shadow-lg shadow-logo-blue/25">
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
                          <pillar.icon className={`w-6 h-6 ${colorMap[pillar.color as keyof typeof colorMap].includes("text-") ? colorMap[pillar.color as keyof typeof colorMap].split(" ").slice(-2).join(" ") : "text-logo-blue"}`} />
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
                    <p className="text-xs md:text-sm font-medium text-white/80">Immediate help, often same day</p>
                    <h3 className="text-base md:text-lg font-bold">Family coaching when you need one-on-one guidance</h3>
                    <p className="text-xs md:text-sm text-white/70 mt-0.5">When the group and membership are not enough—or you can't wait until Monday—private coaching provides one-on-one guidance. Sessions start at $150.</p>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-logo-blue/10 text-logo-blue text-xs md:text-sm font-medium mb-4">
              <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Ethical Provider Directory
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-logo-blue via-blue-600 to-brand-amber bg-clip-text text-transparent">
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
                    <div className="w-12 h-12 mx-auto rounded-xl bg-logo-blue/10 flex items-center justify-center mb-3 group-hover:bg-logo-blue/20 transition-colors">
                      <category.icon className="w-6 h-6 text-logo-blue" />
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-logo-blue via-blue-600 to-brand-amber bg-clip-text text-transparent">Latest from Our Blog</h2>
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
                    <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-logo-blue text-white text-[10px] md:text-xs font-medium rounded-full mb-2 md:mb-3">
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
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-logo-blue via-blue-600 to-brand-amber bg-clip-text text-transparent">You do not have to keep guessing.</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-2">
              Start with the free Monday meeting, move into a private session when you cannot wait, or check intervention readiness when refusal, relapse, or risk is escalating.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
              <Link to="/family-squares" className="w-full sm:w-auto" onClick={() => trackConversionEvent("monday_zoom_click", { source: "homepage_bottom_cta" })}>
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-logo-blue hover:bg-logo-blue/90 px-6 md:px-8 text-sm md:text-base">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  Join Free Family Squares
                </Button>
              </Link>
              <Link to="/family-consultation" className="w-full sm:w-auto" onClick={() => trackConversionEvent("coaching_click", { source: "homepage_bottom_cta" })}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 md:px-8 text-sm md:text-base border-logo-green text-logo-blue hover:bg-logo-blue hover:text-white">
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
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Prefer help in your pocket?</p>
              <SoberHelplineAppStoreBadge height={44} source="homepage_bottom_cta" />
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
