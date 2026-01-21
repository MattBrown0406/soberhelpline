import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart, ChevronDown, Calendar, User as UserIcon, Play, Pause, Lock, BookOpen, ArrowRight, Sparkles, Shield, MessageCircle, Star, AlertTriangle, MessageSquare, Scale, Camera, Volume2, Mic, GraduationCap, TreePine, Eye } from "lucide-react";
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
import iocLogo from "@/assets/ioc-logo.jpg";
import raybanMetaWayfarer from "@/assets/rayban-meta-wayfarer-new.png";
import MobileNav from "@/components/MobileNav";
import { blogPosts } from "@/pages/Blog";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import SUDAssessment from "@/components/SUDAssessment";
import EatingDisorderScreening from "@/components/EatingDisorderScreening";
import SEOHead from "@/components/SEOHead";
import Free6PromoBanner from "@/components/Free6PromoBanner";

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
    { question: "Is Sober Helpline free to use?", answer: "Yes, searching our provider directory and accessing educational resources is completely free. We also offer premium family membership with additional support features." },
    { question: "How do I know if my loved one needs treatment?", answer: "Take our free Addiction Assessment to evaluate warning signs, or call us at (541) 241-5886 to speak with someone who can help you understand your options." }
  ];

  return (
    <>
      <SEOHead
        title="Sober Helpline - Find Addiction Recovery Help"
        description="Connect with ethical addiction treatment providers. Free family support resources, vetted rehabs, interventionists, and recovery coaches nationwide."
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
                <img src={bannerLogo} alt="Sober Helpline" className="h-10 w-auto" />
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
                      <Link to="/provider-info" className="cursor-pointer">Provider Application</Link>
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
        
        <div className="container mx-auto px-4 py-8 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-logo-green/10 text-logo-green text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Heart className="w-3 h-3 md:w-4 md:h-4" />
              Supporting Families Through Recovery
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight px-2">
              Find Hope. Find Help.
              <span className="block text-logo-green">Find Healing.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-2">
              We connect families with ethical, proven treatment providers nationwide—offering compassionate guidance and unwavering support when you need it most.
            </p>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 px-4">
              <Link to="/family-forum" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 md:gap-3 bg-logo-green hover:bg-logo-green/90 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-lg shadow-logo-green/25 hover:shadow-xl hover:shadow-logo-green/30 transition-all">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Join Family Forum
                </Button>
              </Link>
              <Link to="/family-education" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 md:gap-3 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg border-2 border-logo-green/30 text-logo-green hover:bg-logo-green/10">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                  Education Center
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-logo-green" />
                <span>Vetted Providers</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Heart className="w-3 h-3 md:w-4 md:h-4 text-logo-green" />
                <span>Family-Focused</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FREE6 Promo Banner */}
      <Free6PromoBanner />

      {/* RayBan Meta Wayfarer Giveaway Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-slate-700/50 overflow-hidden">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <Link to="/family-membership" className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8 group">
            {/* Image with animated feature indicators */}
            <div className="relative flex-shrink-0">
              <img 
                src={raybanMetaWayfarer} 
                alt="Ray-Ban Meta Wayfarer Smart Glasses" 
                className="w-40 h-24 md:w-56 md:h-32 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              {/* Animated feature indicators */}
              <div className="absolute top-1 left-4 md:left-6 animate-pulse">
                <div className="flex items-center gap-1 bg-amber-500/90 text-slate-900 px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold">
                  <Camera className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span>12MP</span>
                </div>
              </div>
              <div className="absolute top-1 right-4 md:right-6 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-1 bg-amber-500/90 text-slate-900 px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold">
                  <Volume2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span>Audio</span>
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-1 bg-amber-500/90 text-slate-900 px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold">
                  <Mic className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span>Meta AI</span>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1.5">
                <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] md:text-xs font-bold uppercase tracking-wide animate-pulse">
                  Giveaway
                </div>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <p className="font-bold text-white text-base md:text-xl leading-tight">
                Win Ray-Ban Meta Wayfarer Smart Glasses!
              </p>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-sm">
                Camera, speakers, & Meta AI built-in — All active subscribers on <span className="text-amber-400 font-semibold">March 1st</span> entered to win
              </p>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 group-hover:gap-3 transition-all text-xs md:text-sm flex-shrink-0">
              Subscribe Now
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">Find the Right Support</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Browse our directory of vetted treatment providers and recovery professionals
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} to={category.path}>
                <Card className="h-full hover:shadow-lg hover:shadow-logo-green/10 hover:border-logo-green/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-3 md:p-6 flex flex-col items-center text-center">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-logo-green/10 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-logo-green/20 group-hover:scale-110 transition-all">
                      <Icon className="w-5 h-5 md:w-7 md:h-7 text-logo-green" />
                    </div>
                    <h3 className="font-semibold text-foreground text-xs md:text-base mb-0.5 md:mb-1 leading-tight">{category.name}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Peek Inside the Curriculum - Membership Conversion Section */}
      <section className="bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-4">
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Peek Inside
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
              The Six Pillars of Family Recovery
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive curriculum designed to help families understand addiction, set boundaries, and reclaim their lives—whether or not their loved one chooses recovery.
            </p>
          </div>

          {/* Six Pillars Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Pillar 1 */}
            <div className="relative group">
              <Card className="h-full border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Members Only</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Pillar 1</div>
                      <h3 className="font-semibold text-foreground mb-2">Understanding Addiction</h3>
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
                    <span>Members Only</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">Pillar 2</div>
                      <h3 className="font-semibold text-foreground mb-2">Mental Health & Dual Diagnosis</h3>
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
                    <span>Members Only</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">Pillar 3</div>
                      <h3 className="font-semibold text-foreground mb-2">Family Systems & Enabling</h3>
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
                    <span>Members Only</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Pillar 4</div>
                      <h3 className="font-semibold text-foreground mb-2">Treatment Literacy</h3>
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
                    <span>Members Only</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Pillar 5</div>
                      <h3 className="font-semibold text-foreground mb-2">Boundaries & Consequences</h3>
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
                    <span>Members Only</span>
                  </div>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <TreePine className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-1">Pillar 6</div>
                      <h3 className="font-semibold text-foreground mb-2">Family Recovery</h3>
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
            <h3 className="text-lg md:text-xl font-semibold text-foreground text-center mb-6">Also Included in Your Membership</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <div className="font-medium text-sm text-foreground">11 Guided Meditations</div>
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

          {/* CTA */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-logo-green/10 via-primary/10 to-logo-green/10 rounded-2xl p-6 md:p-8 border border-logo-green/20">
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">Stop going it alone.</span> Join families who are learning to heal together.
              </p>
              <Link to="/family-membership">
                <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-8 shadow-lg shadow-logo-green/25">
                  <Lock className="w-4 h-4" />
                  Unlock Full Access — $14.99/month
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles & Mission */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 items-stretch">
          {/* Featured Articles Carousel */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
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
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-logo-green text-white text-[10px] md:text-xs font-medium rounded-full mb-2 md:mb-3">
                      {article.category}
                    </span>
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-1.5 md:mb-2 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2 mb-4 hidden md:block">
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

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-foreground to-foreground/90 text-background border-0 shadow-xl">
            <CardContent className="p-5 md:p-10 flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs md:text-sm font-medium mb-4 md:mb-6 w-fit">
                <Heart className="w-3 h-3 md:w-4 md:h-4" />
                Our Promise
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">Our Mission</h2>
              <div className="space-y-3 md:space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
                <p>
                  At Sober Helpline, we are dedicated to providing families of addicted loved ones with ethical, proven providers of recovery and therapeutic services that have been vetted and meet rigorous criteria.
                </p>
                <p className="hidden sm:block">
                  Our provider directory is completely free to use—search for trusted treatment centers, therapists, interventionists, and recovery resources at no cost. For families seeking deeper support, our Family Forum and Education Center offer 60+ interactive tools, guides, and videos for a small monthly fee of $14.99.
                </p>
                <p className="font-semibold text-white">
                  We take no commissions or payments from treatment providers for referred clients. This is patient brokering—and we will never do it.
                </p>
              </div>
              <Link to="/blog" className="mt-5 md:mt-8">
                <Button variant="secondary" className="gap-2 bg-white text-foreground hover:bg-white/90 text-sm md:text-base">
                  Visit Our Blog
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partnership" className="bg-gradient-to-br from-logo-green/5 to-primary/5 border-t border-border/50 scroll-mt-20">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <Card className="max-w-4xl mx-auto border-2 border-logo-green/20 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gradient-to-br from-logo-green/10 to-transparent p-5 md:p-8 flex items-center justify-center">
                  <img src={iocLogo} alt="Intervention On Call" className="h-16 md:h-24 w-auto" />
                </div>
                <div className="md:w-2/3 p-5 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">Partnership with Intervention On Call</h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                    We've partnered with Intervention On Call to provide families with real-time access to help. They offer hourly coaching sessions for education on boundaries, strategies, and choosing the right treatment center—plus FREE family support Zoom calls 5 nights a week.
                  </p>
                  <a href="https://interventiononcall.com/live-family-friends-zoom/" target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-logo-green hover:bg-logo-green/90 text-sm md:text-base">
                      Register for Free Calls
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-10 md:py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Ready to Take the Next Step?</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-2">
            Whether you're looking for treatment options, family support, or just need someone to talk to—we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
            <a href="tel:5412415886" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-logo-green hover:bg-logo-green/90 px-6 md:px-8 text-sm md:text-base">
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                Call Now: (541) 241-5886
              </Button>
            </a>
            <Link to="/family-membership" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 md:px-8 text-sm md:text-base">
                <Lock className="w-4 h-4 md:w-5 md:h-5" />
                Join Membership
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
