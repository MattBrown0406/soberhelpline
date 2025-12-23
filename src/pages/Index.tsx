import { Building2, Home, Users, Bed, Brain, Stethoscope, Phone, UserCheck, LogIn, Headphones, Pill, Heart, ChevronDown, Calendar, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import logo from "@/assets/logo.png";
import iocLogo from "@/assets/ioc-logo.jpg";
import MobileNav from "@/components/MobileNav";
import addictionCycleImg from "@/assets/addiction-cycle.jpg";
import { blogPosts } from "@/pages/Blog";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import SUDAssessment from "@/components/SUDAssessment";

const categories = [
  { name: "Inpatient Treatment", icon: Home, path: "/inpatient-treatment" },
  { name: "Outpatient Treatment", icon: Building2, path: "/outpatient-treatment" },
  { name: "Medical Detox", icon: Pill, path: "/medical-detox" },
  { name: "Interventionists", icon: Users, path: "/interventionists" },
  { name: "Sober Coaches/Companions", icon: UserCheck, path: "/sober-coaches-companions" },
  { name: "Sober Living", icon: Bed, path: "/sober-living" },
  { name: "Therapists", icon: Brain, path: "/therapists" },
  { name: "Psychiatrists", icon: Stethoscope, path: "/psychiatrists" },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  // Get the 5 most recent blog posts
  const featuredArticles = useMemo(() => {
    return [...blogPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
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
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Mobile Header */}
        <div className="flex md:hidden justify-between items-center mb-4">
          <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Phone className="w-5 h-5" />
            <span className="font-medium text-sm">(541) 241-5886</span>
          </a>
          <MobileNav user={user} onLogout={handleLogout} />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="flex items-center gap-2 bg-primary hover:bg-primary/90 animate-pulse hover:animate-none">
                  <Headphones className="w-4 h-4" />
                  Addiction Education Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/recovery-podcasts" className="cursor-pointer">
                    Recovery Podcasts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/addiction-assessment" className="cursor-pointer">
                    Addiction Assessment
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/blog" className="cursor-pointer">
                    Blog
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faqs" className="cursor-pointer">
                    FAQs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/family-support" className="cursor-pointer">
                    Family Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/understanding-addiction" className="cursor-pointer">
                    Understanding Addiction as a Disease
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="#partnership">
              <Button variant="default" className="flex items-center gap-2 bg-primary hover:bg-primary/90 animate-pulse hover:animate-none">
                <Heart className="w-4 h-4" />
                Free Family Education and Support
              </Button>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors font-medium">
                  For Providers
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/provider-info" className="cursor-pointer">
                    Provider Application
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
            <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5886</span>
            </a>
          </div>
        </div>

        {/* Featured Video and Logo */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/Li2fH0doWPc"
                title="Sober Helpline Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center">
            <img src={logo} alt="Sober Helpline" className="h-48 md:h-64 w-auto border-2 border-black rounded-lg" />
          </div>
        </div>

        {/* Family Member Forum Button */}
        <div className="text-center mb-4">
          <Link to="/family-forum">
            <Button variant="default" size="lg" className="flex items-center gap-3 bg-logo-green hover:bg-logo-green/90 mx-auto text-base px-6 py-3">
              <UserIcon className="w-5 h-5" />
              Family Member Forum
            </Button>
          </Link>
        </div>

        {/* Free Assessments for Families */}
        <div className="mb-8 md:mb-12 space-y-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Try these free assessments — samples of the tools available to members
            </p>
          </div>
          <SUDAssessment />
          <FamilySelfAssessment user={user} />
        </div>

        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Empowering Your Recovery Journey</h2>
          <p className="text-base md:text-lg text-muted-foreground px-2">
            We help families find ethical, proven treatment and recovery resources nationwide and beyond.
          </p>
        </div>

        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} to={category.path}>
                  <Card
                    className="p-4 md:p-5 h-[100px] md:h-[120px] min-w-[130px] md:min-w-[140px] hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center text-center gap-2 md:gap-3 bg-card hover:bg-accent"
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-logo-green" />
                    <span className="text-xs md:text-sm font-medium text-foreground leading-tight">
                      {category.name}
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow-lg bg-card">
            {featuredArticles.map((article, index) => (
              <Link
                key={article.id}
                to={`/blog/${article.id}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
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
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded mb-2">
                      {article.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2 mb-3 hidden md:block">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-300">
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
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentArticleIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentArticleIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Go to article ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3 md:space-y-4 bg-black rounded-lg shadow-lg p-5 md:p-8 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Our Mission</h2>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base">
              At Sober Helpline, we are dedicated to providing the families of addicted loved ones with ethical and proven providers of recovery and therapeutic services that have been vetted and meet rigorous criteria in order to be included on this site.
            </p>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base">
              This site is free to use for those needing help. Sober Helpline receives a set monthly fee from listed providers to cover the cost of operations. <strong className="underline">We take no commissions or payments from treatment providers for clients that get referred by us.</strong> This is considered patient brokering and we will never promote programs or services that would do so.
            </p>
          </div>
        </div>

        <div id="partnership" className="mt-8 md:mt-12 bg-accent rounded-lg p-5 md:p-8 text-center max-w-4xl mx-auto scroll-mt-8">
          <img src={iocLogo} alt="Intervention On Call" className="mx-auto mb-4 md:mb-6 h-16 md:h-20 w-auto" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">Partnership with Intervention On Call</h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
            We have partnered with Intervention On Call to provide families with real time access to help for their addicted loved one. Intervention On Call provides hourly coaching sessions for families to get better educated on boundaries, strategies, help with choosing the right treatment center etc. Intervention On Call also provides FREE family support zoom calls 5 nights a week.
          </p>
          <a href="https://interventiononcall.com/live-family-friends-zoom/" target="_blank" rel="noopener noreferrer">
            <Button size="default" className="font-semibold md:text-base">
              Register Here!
            </Button>
          </a>
        </div>

        {/* Addiction Cycle Section */}
        <div className="mt-8 md:mt-12 text-center max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            We're Here to Help You Interrupt This Cycle
          </h2>
          <div className="rounded-lg shadow-lg overflow-hidden">
            <img src={addictionCycleImg} alt="The Cycle of Addiction" className="w-full h-auto" />
          </div>
        </div>

        {/* Blog Link */}
        <div className="mt-12 text-center">
          <Link to="/blog">
            <Button variant="outline" size="lg" className="font-semibold">
              Visit Our Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
