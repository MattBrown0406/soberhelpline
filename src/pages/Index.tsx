import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart, ChevronDown, Calendar, User as UserIcon, Play, Pause, Lock, BookOpen, ArrowRight, Sparkles, Shield, MessageCircle, Star, AlertTriangle, MessageSquare, Scale } from "lucide-react";
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
import MobileNav from "@/components/MobileNav";
import { blogPosts } from "@/pages/Blog";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import SUDAssessment from "@/components/SUDAssessment";

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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-logo-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-logo-green/10 text-logo-green text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Supporting Families Through Recovery
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Find Hope. Find Help.
              <span className="block text-logo-green">Find Healing.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              We connect families with ethical, proven treatment providers nationwide—offering compassionate guidance and unwavering support when you need it most.
            </p>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/family-forum">
                <Button size="lg" className="gap-3 bg-logo-green hover:bg-logo-green/90 text-white px-8 py-6 text-lg shadow-lg shadow-logo-green/25 hover:shadow-xl hover:shadow-logo-green/30 transition-all">
                  <MessageCircle className="w-5 h-5" />
                  Join Family Forum
                </Button>
              </Link>
              <Link to="/family-education">
                <Button size="lg" variant="outline" className="gap-3 px-8 py-6 text-lg border-2 border-logo-green/30 text-logo-green hover:bg-logo-green/10">
                  <BookOpen className="w-5 h-5" />
                  Education Center
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-logo-green" />
                <span>Vetted Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-logo-green" />
                <span>Family-Focused</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Premium Membership Banner */}
      <section className="bg-gradient-to-r from-primary/5 via-logo-green/5 to-primary/5 border-y border-border/50">
        <div className="container mx-auto px-4 py-6">
          <Link to="/family-membership" className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-logo-green/10">
                <Lock className="w-5 h-5 text-logo-green" />
              </div>
              <div className="text-center md:text-left">
                <p className="font-semibold text-foreground">Premium Member Services</p>
                <p className="text-sm text-muted-foreground">60+ exercises, videos & guides — $14.99/month</p>
              </div>
            </div>
            <Button variant="default" className="gap-2 bg-logo-green hover:bg-logo-green/90 group-hover:gap-3 transition-all">
              Unlock Access
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">Find the Right Support</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our directory of vetted treatment providers and recovery professionals
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} to={category.path}>
                <Card className="h-full hover:shadow-lg hover:shadow-logo-green/10 hover:border-logo-green/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-logo-green/10 flex items-center justify-center mb-4 group-hover:bg-logo-green/20 group-hover:scale-110 transition-all">
                      <Icon className="w-7 h-7 text-logo-green" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Free Tools Section */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Free Resources
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Try Our Free Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sample the interactive assessments available to our members
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <SUDAssessment />
            <FamilySelfAssessment user={user} />
            
            {/* Fear Inventory Exercise Link */}
            <Link to="/fear-inventory-exercise" className="block">
              <Card className="overflow-hidden border-2 border-red-500/40 bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/20 hover:border-red-500/60 hover:shadow-lg transition-all cursor-pointer group mt-8">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-foreground mb-1">What Are We Afraid Will Happen?</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        A Fear Inventory Exercise for Families
                      </p>
                      <p className="text-xs text-muted-foreground">
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
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Conversation Starters for Families</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Questions to reduce defensiveness and speak from a calmer place
                      </p>
                      <p className="text-xs text-muted-foreground">
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
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Scale className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-foreground mb-1">AI Helping vs. Enabling Decision Coach</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Transform any AI chatbot into a decision coach for families
                      </p>
                      <p className="text-xs text-muted-foreground">
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
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                      <Headphones className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Guided Meditation for Families</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Regaining Calm When Addiction Triggers Fear and Urgency
                    </p>
                    <audio controls className="w-full max-w-md" preload="metadata">
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
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Featured Articles Carousel */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] rounded-2xl overflow-hidden shadow-xl">
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
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="inline-block px-3 py-1 bg-logo-green text-white text-xs font-medium rounded-full mb-3">
                      {article.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2 mb-4 hidden md:block">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-300">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {/* Carousel indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentArticleIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentArticleIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                  }`}
                  aria-label={`Go to article ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-foreground to-foreground/90 text-background border-0 shadow-xl">
            <CardContent className="p-8 md:p-10 flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 w-fit">
                <Heart className="w-4 h-4" />
                Our Promise
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  At Sober Helpline, we are dedicated to providing families of addicted loved ones with ethical, proven providers of recovery and therapeutic services that have been vetted and meet rigorous criteria.
                </p>
                <p>
                  Our provider directory is completely free to use—search for trusted treatment centers, therapists, interventionists, and recovery resources at no cost. For families seeking deeper support, our Family Forum and Education Center offer 60+ interactive tools, guides, and videos for a small monthly fee of $14.99.
                </p>
                <p className="font-semibold text-white">
                  We take no commissions or payments from treatment providers for referred clients. This is patient brokering—and we will never do it.
                </p>
              </div>
              <Link to="/blog" className="mt-8">
                <Button variant="secondary" className="gap-2 bg-white text-foreground hover:bg-white/90">
                  Visit Our Blog
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partnership" className="bg-gradient-to-br from-logo-green/5 to-primary/5 border-t border-border/50 scroll-mt-20">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto border-2 border-logo-green/20 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gradient-to-br from-logo-green/10 to-transparent p-8 flex items-center justify-center">
                  <img src={iocLogo} alt="Intervention On Call" className="h-24 w-auto" />
                </div>
                <div className="md:w-2/3 p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Partnership with Intervention On Call</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    We've partnered with Intervention On Call to provide families with real-time access to help. They offer hourly coaching sessions for education on boundaries, strategies, and choosing the right treatment center—plus FREE family support Zoom calls 5 nights a week.
                  </p>
                  <a href="https://interventiononcall.com/live-family-friends-zoom/" target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-logo-green hover:bg-logo-green/90">
                      Register for Free Calls
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Take the Next Step?</h2>
          <p className="text-muted-foreground mb-8">
            Whether you're looking for treatment options, family support, or just need someone to talk to—we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:5412415886">
              <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 px-8">
                <Phone className="w-5 h-5" />
                Call Now: (541) 241-5886
              </Button>
            </a>
            <Link to="/family-membership">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <Lock className="w-5 h-5" />
                Join Membership
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
