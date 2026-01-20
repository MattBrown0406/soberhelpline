import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart, ChevronDown, Calendar, User as UserIcon, Play, Pause, Lock, BookOpen, ArrowRight, Sparkles, Shield, MessageCircle, Star, AlertTriangle, MessageSquare, Scale, Camera, Volume2, Mic } from "lucide-react";
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

  return (
    <>
      <SEOHead
        title="Sober Helpline - Find Addiction Recovery Help"
        description="Connect with ethical addiction treatment providers. Free family support resources, vetted rehabs, interventionists, and recovery coaches nationwide."
      />
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

      {/* Free Tools Section */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs md:text-sm font-medium mb-3 md:mb-4">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              Free Resources
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">Try Our Free Tools</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              Sample the interactive assessments available to our members
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
            <SUDAssessment />
            <EatingDisorderScreening />
            <FamilySelfAssessment user={user} />
            
            {/* Fear Inventory Exercise Link */}
            <Link to="/fear-inventory-exercise" className="block">
              <Card className="overflow-hidden border-2 border-red-500/40 bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/20 hover:border-red-500/60 hover:shadow-lg transition-all cursor-pointer group mt-4 md:mt-8">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start md:items-center gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-0.5 md:mb-1 leading-tight">What Are We Afraid Will Happen?</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                        A Fear Inventory Exercise for Families
                      </p>
                      <p className="text-[11px] md:text-xs text-muted-foreground hidden sm:block">
                        Discover how fear holds you back from setting boundaries, talking openly, offering treatment, or considering intervention—and learn to act from love instead of fear.
                      </p>
                    </div>
                    <div className="flex-shrink-0 hidden md:block">
                      <ArrowRight className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Conversation Starters Guide */}
            <Link to="/conversation-starters" className="block">
              <Card className="overflow-hidden border-2 border-blue-500/40 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 hover:border-blue-500/60 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start md:items-center gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-0.5 md:mb-1 leading-tight">Conversation Starters for Families</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                        Questions to reduce defensiveness and speak from a calmer place
                      </p>
                      <p className="text-[11px] md:text-xs text-muted-foreground hidden sm:block">
                        These conversation starters help families slow things down and speak from a steadier place—whether addressing impact, boundaries, or looking forward together.
                      </p>
                    </div>
                    <div className="flex-shrink-0 hidden md:block">
                      <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* AI Helping vs Enabling Decision Coach */}
            <Link to="/ai-enabling-decision-coach" className="block">
              <Card className="overflow-hidden border-2 border-amber-500/40 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 hover:border-amber-500/60 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start md:items-center gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Scale className="w-6 h-6 md:w-8 md:h-8 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-0.5 md:mb-1 leading-tight">AI Helping vs. Enabling Decision Coach</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                        Transform any AI chatbot into a decision coach for families
                      </p>
                      <p className="text-[11px] md:text-xs text-muted-foreground hidden sm:block">
                        Use this specialized prompt to turn ChatGPT, Claude, or other AI tools into a coach that helps you distinguish between helping and enabling behaviors.
                      </p>
                    </div>
                    <div className="flex-shrink-0 hidden md:block">
                      <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Guided Meditation */}
            <Card className="overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                  <div className="flex-shrink-0 flex items-center gap-4 sm:block">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-amber-500/20 flex items-center justify-center">
                      <Headphones className="w-6 h-6 md:w-8 md:h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="sm:hidden">
                      <h3 className="text-base font-semibold text-foreground leading-tight">Guided Meditation for Families</h3>
                      <p className="text-xs text-muted-foreground">Regaining Calm When Addiction Triggers Fear</p>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-0.5 md:mb-1 hidden sm:block">Guided Meditation for Families</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 hidden sm:block">
                      Regaining Calm When Addiction Triggers Fear and Urgency
                    </p>
                    <audio controls className="w-full" preload="metadata">
                      <source src="/audio/regaining-calm-meditation.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              </CardContent>
            </Card>
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
