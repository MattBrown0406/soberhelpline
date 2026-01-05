import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Video, Lock, Loader2, FileText, Headphones, Users, Calendar, Download, BookOpen, Brain, Heart, Shield, Sparkles, ChevronDown, ChevronRight, GraduationCap, AlertTriangle, Scale, Compass, TreePine, Activity, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import ControlWorksheet from "@/components/ControlWorksheet";
import BoundaryWorksheet from "@/components/BoundaryWorksheet";
import ScenarioWorksheet from "@/components/ScenarioWorksheet";
import EnablingDecisionTree from "@/components/EnablingDecisionTree";
import GuiltResponsibilityWorksheet from "@/components/GuiltResponsibilityWorksheet";
import SelfCareWorksheet from "@/components/SelfCareWorksheet";
import TraumaHypervigilanceAssessment from "@/components/TraumaHypervigilanceAssessment";

// Define pillar data for cleaner rendering
const pillars = [
  {
    id: "pillar-1",
    number: 1,
    title: "Understanding Addiction",
    subtitle: "Foundational Knowledge",
    icon: Brain,
    color: "emerald",
    description: "Build a solid foundation of knowledge about addiction as a brain-based condition.",
    resources: [
      { title: "Why Multiple Treatment Episodes Don't Mean Failure", path: "/multiple-treatment-episodes", color: "blue" },
      { title: "The Disease vs. Choice Reality Map", path: "/disease-choice-reality-map", color: "teal" },
      { title: "Why Willpower Fails (and What Actually Works)", path: "/why-willpower-fails", color: "orange" },
      { title: "Addiction Progression Timeline", path: "/addiction-progression-timeline", color: "violet" },
      { title: "Addiction, the Brain & Spiritual Recovery", path: "/brain-spiritual-recovery", color: "emerald" },
      { title: "The 12 Steps Explained for Families", path: "/twelve-steps-explained", color: "cyan" },
      { title: "Addiction as a Stress-Regulation Disorder", path: "/addiction-as-stress-disorder", color: "pink" },
    ]
  },
  {
    id: "pillar-2",
    number: 2,
    title: "Mental Health & Dual Diagnosis",
    subtitle: "Understanding Co-Occurring Conditions",
    icon: Heart,
    color: "rose",
    description: "Learn how mental health conditions interact with and influence substance use disorders.",
    resources: [
      { title: "Understanding Drug-Induced Psychosis", path: "/drug-induced-psychosis", color: "fuchsia" },
      { title: "Mental Health vs. Substance-Induced Symptoms", path: "/mental-health-vs-substance-induced", color: "purple" },
      { title: "Commonly Misunderstood Diagnoses", path: "/misunderstood-diagnoses", color: "indigo" },
      { title: "Why Focusing Only on Mental Health Can Delay Recovery", path: "/mental-health-delays-recovery", color: "rose" },
      { title: "Trauma vs. Excuses: A Necessary Distinction", path: "/trauma-vs-excuses", color: "amber" },
      { title: "How Trauma Shapes Addiction", path: "/how-trauma-shapes-addiction", color: "cyan" },
    ]
  },
  {
    id: "pillar-3",
    number: 3,
    title: "Family Systems & Enabling",
    subtitle: "Patterns That Keep Families Stuck",
    icon: Users,
    color: "violet",
    description: "Recognize family dynamics and enabling patterns that unintentionally perpetuate addiction.",
    subcategories: [
      {
        name: "Family Systems",
        resources: [
          { title: "Family Roles in Addiction (Beyond the Clichés)", path: "/family-roles-addiction", color: "violet" },
          { title: "How Addiction Rewrites Family Rules", path: "/addiction-rewrites-family-rules", color: "teal" },
          { title: "The Cost of Secrecy", path: "/cost-of-secrecy", color: "rose" },
          { title: "How Addiction Shapes Attachment Styles", path: "/addiction-attachment-styles", color: "fuchsia" },
          { title: "The Hidden Cost of Being the \"Strong One\"", path: "/strong-one", color: "pink" },
          { title: "The Guilt–Relief–Resentment Cycle", path: "/guilt-relief-resentment", color: "amber" },
          { title: "The Sibling Experience in Addiction", path: "/sibling-experience", color: "cyan" },
          { title: "Growing Up in the Shadow of Addiction", path: "/growing-up-shadow", color: "indigo" },
          { title: "Sibling Guilt, Anger, and Loyalty Conflicts", path: "/sibling-guilt-anger-loyalty", color: "purple" },
          { title: "Rebuilding Sibling Relationships in Recovery", path: "/rebuilding-sibling-relationships", color: "emerald" },
          { title: "Parents: Repairing the Sibling System", path: "/parents-repairing-sibling-system", color: "blue" },
          { title: "When Family Unity Becomes a Liability", path: "/family-unity-liability", color: "orange" },
        ]
      },
      {
        name: "Understanding Enabling",
        resources: [
          { title: "Why Change Doesn't Happen When Families Try Harder", path: "/why-change-doesnt-happen", color: "violet" },
          { title: "Crisis vs. Chaos Decision Guide", path: "/crisis-chaos", color: "red" },
          { title: "What to Say / What Not to Say", path: "/communication-guide", color: "rose" },
          { title: "How Families Accidentally Interfere with Recovery", path: "/family-interference", color: "orange" },
          { title: "Enabling Language Translator", path: "/enabling-language-translator", color: "lime" },
          { title: "Breaking Intergenerational Enabling", path: "/intergenerational-enabling", color: "sky" },
          { title: "\"Who Benefits From This?\" Decision Filter", path: "/who-benefits-filter", color: "cyan" },
        ]
      }
    ]
  },
  {
    id: "pillar-4",
    number: 4,
    title: "Treatment Literacy",
    subtitle: "Navigating the Treatment System",
    icon: GraduationCap,
    color: "blue",
    description: "Become an informed advocate by understanding treatment options, red flags, and industry practices.",
    resources: [
      { title: "40 Questions to Ask a Treatment Center", path: "/treatment-questions", color: "blue" },
      { title: "How the Treatment Industry Works", path: "/treatment-industry-guide", color: "slate" },
      { title: "Treatment Industry Red Flags Guide", path: "/treatment-red-flags", color: "red" },
      { title: "How to Talk About Treatment", path: "/talking-about-treatment", color: "indigo" },
      { title: "Aftercare Readiness Checklist", path: "/aftercare-checklist", color: "cyan" },
      { title: "Family Advocacy Toolkit", path: "/family-advocacy-toolkit", color: "green" },
      { title: "Legal Issues Families Should Understand", path: "/legal-issues-guide", color: "slate" },
      { title: "Treatment Modalities Explained", path: "/treatment-modalities", color: "violet" },
      { title: "Matching the Modality to the Problem", path: "/matching-modality", color: "rose" },
      { title: "Why Some Therapies Fail at the Wrong Time", path: "/therapy-timing", color: "amber" },
      { title: "Non–12-Step Recovery Modalities", path: "/non-twelve-step-modalities", color: "teal" },
    ]
  },
  {
    id: "pillar-5",
    number: 5,
    title: "Boundaries & Consequences",
    subtitle: "Creating Conditions for Change",
    icon: Shield,
    color: "amber",
    description: "Learn to set and maintain healthy boundaries while understanding the difference between boundaries and ultimatums.",
    resources: [
      { title: "Requests, Demands, Ultimatums & Boundaries", path: "/boundaries-ultimatums", color: "emerald" },
      { title: "Insight vs. Behavior Tracker", path: "/insight-behavior-tracker", color: "violet" },
      { title: "Scenario Practice Exercise", path: "/scenario-exercise", color: "orange" },
      { title: "Readiness for Change Checklist", path: "/readiness-checklist", color: "teal" },
      { title: "We Don't Negotiate with Terrorists", path: "/no-negotiation", color: "red" },
      { title: "Boundary Drift: How Limits Slowly Erode", path: "/boundary-drift", color: "amber" },
      { title: "Anger and Boundaries Are Not the Same Thing", path: "/anger-and-boundaries", color: "pink" },
      { title: "The Difference Between Flexibility and Instability", path: "/flexibility-vs-instability", color: "cyan" },
    ]
  },
  {
    id: "pillar-6",
    number: 6,
    title: "Family Recovery",
    subtitle: "Healing for the Whole Family",
    icon: TreePine,
    color: "teal",
    description: "Focus on your own healing journey regardless of your loved one's choices.",
    resources: [
      { title: "What Changes When Families Change", path: "/what-changes-when-families-change", color: "teal" },
      { title: "What Recovery Requires From Families", path: "/recovery-requirements", color: "emerald" },
      { title: "Family Recovery Action Plan", path: "/family-action-plan", color: "purple" },
      { title: "Emotional Regulation Tools", path: "/emotional-regulation", color: "sky" },
      { title: "Values Clarification Exercise", path: "/values-exercise", color: "amber" },
      { title: "Values-Aligned Decision Making Exercise", path: "/values-aligned-decisions", color: "indigo" },
      { title: "Living Well Regardless of Outcome", path: "/living-well-regardless", color: "rose" },
      { title: "Grief for the Family You Thought You'd Have", path: "/grief-for-family", color: "violet" },
      { title: "Is It Safe to Open Up Again?", path: "/safe-to-open-up", color: "rose" },
    ]
  }
];

const meditations = [
  { title: "Loving Enough to Let Go, Trusting Enough to Hope", file: "loving-enough-to-let-go-meditation.mp3", color: "rose" },
  { title: "Regaining Calm When Addiction Triggers Fear and Urgency", file: "regaining-calm-meditation.mp3", color: "sky" },
  { title: "Releasing Sadness and Guilt with Compassion", file: "releasing-sadness-guilt-meditation.mp3", color: "purple" },
  { title: "Allowing Hope and Happiness to Return", file: "allowing-hope-happiness-meditation.mp3", color: "amber" },
  { title: "Letting Go of What Was Never About You", file: "letting-go-not-about-you-meditation.mp3", color: "emerald" },
  { title: "What I Can Control Today", file: "what-i-can-control-today-meditation.mp3", color: "indigo" },
  { title: "You Are Allowed to Say No", file: "you-are-allowed-to-say-no-meditation.mp3", color: "teal" },
  { title: "Guided Inner Dialogue: Talking to the Part of You That's Hurting", file: "guided-inner-dialogue-meditation.mp3", color: "pink" },
  { title: "Talking to the Part That Wants to Rescue", file: "talking-to-the-part-that-wants-to-rescue-meditation.mp3", color: "cyan" },
  { title: "Connecting With Your Inner Child", file: "connecting-with-your-inner-child-meditation.mp3", color: "fuchsia" },
];

const getColorClasses = (color: string) => ({
  border: `border-${color}-500/50`,
  text: `text-${color}-700 dark:text-${color}-400`,
  hover: `hover:bg-${color}-50 dark:hover:bg-${color}-950/30`,
  bg: `bg-${color}-50 dark:bg-${color}-950/20`,
  ring: `ring-${color}-500/30`,
});

export default function FamilyEducation() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [activeTab, setActiveTab] = useState("tools");

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
    const checkMembership = async () => {
      if (!user) {
        setHasMembership(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('provider_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null)
          .limit(1);

        if (error) {
          console.error('Error checking membership:', error);
          setHasMembership(false);
        } else {
          setHasMembership(data && data.length > 0);
        }
      } catch (err) {
        console.error('Membership check failed:', err);
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasMembership) {
    return (
      <>
        <Helmet>
          <title>Family Education Resources | Sober Helpline</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <header className="border-b border-border/40 bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
              </Link>
              <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
                <Phone className="h-4 w-4" />
                (541) 241-5886
              </a>
            </div>
          </header>
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-2xl">Members Only Content</CardTitle>
                <CardDescription>
                  This content is exclusive to family support members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join our family support membership for just $14.99/month to access our complete library of educational resources.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/family-membership">
                    <Button className="w-full">Become a Member</Button>
                  </Link>
                  <Link to="/family-support">
                    <Button variant="outline" className="w-full">Back to Family Support</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Family Education Resources | Sober Helpline</title>
        <meta name="description" content="Comprehensive educational resources for families supporting loved ones through addiction and recovery. Interactive tools, guides, and meditations." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link
                to="/family-support"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <div className="flex flex-wrap gap-2">
                <Link to="/family-forum">
                  <Button variant="outline" size="sm" className="gap-2 border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                    <Users className="h-4 w-4" />
                    Forum
                  </Button>
                </Link>
                <Link to="/family-webinars">
                  <Button variant="outline" size="sm" className="gap-2 border-purple-500/50 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30">
                    <Calendar className="h-4 w-4" />
                    Webinars
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-logo-green/10 via-background to-primary/5 border border-logo-green/20 p-8 md:p-12 mb-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-logo-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative text-center">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-logo-green/10 border border-logo-green/20">
                    <BookOpen className="h-8 w-8 text-logo-green" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-logo-green">
                      Family Education Center
                    </h1>
                    <p className="text-muted-foreground">Expert-created resources for your journey</p>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto mt-4">
                  A comprehensive library of interactive tools, educational guides, and healing resources designed to help you understand addiction, set healthy boundaries, and reclaim your own wellbeing.
                </p>
                
                {/* Healing Journey Note */}
                <div className="mt-6 p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl max-w-4xl mx-auto">
                  <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                    <span className="font-semibold">A note on your journey:</span> These exercises and guides are designed to help your family system become educated and heal over time—not overnight. Please take your time with each resource and allow yourself space to process what you're learning. Healing happens gradually, and there's no need to rush through everything at once. Be gentle with yourself.
                  </p>
                </div>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-logo-green" />
                    <span className="text-sm font-medium">60+ Resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-logo-green" />
                    <span className="text-sm font-medium">8 Interactive Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-logo-green" />
                    <span className="text-sm font-medium">6 Guided Meditations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Tabs - Prominent Section Navigation */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">Explore Our Resources</h2>
                <p className="text-muted-foreground text-sm">Choose a section below to access different types of support materials</p>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full h-auto p-2 bg-muted/50 border-2 border-logo-green/20 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <TabsTrigger 
                    value="tools" 
                    className="flex flex-col sm:flex-row items-center gap-2 py-4 px-4 rounded-lg data-[state=active]:bg-logo-green data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-logo-green/25 transition-all duration-200"
                  >
                    <div className="p-2 rounded-full bg-amber-500/20">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-sm">Interactive Tools</div>
                      <div className="text-xs opacity-70 hidden sm:block">Worksheets & Assessments</div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="pillars" 
                    className="flex flex-col sm:flex-row items-center gap-2 py-4 px-4 rounded-lg data-[state=active]:bg-logo-green data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-logo-green/25 transition-all duration-200"
                  >
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-sm">Six Pillars</div>
                      <div className="text-xs opacity-70 hidden sm:block">60+ Educational Guides</div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="wellness" 
                    className="flex flex-col sm:flex-row items-center gap-2 py-4 px-4 rounded-lg data-[state=active]:bg-logo-green data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-logo-green/25 transition-all duration-200"
                  >
                    <div className="p-2 rounded-full bg-rose-500/20">
                      <Heart className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-sm">Wellness</div>
                      <div className="text-xs opacity-70 hidden sm:block">Meditations & Self-Care</div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="videos" 
                    className="flex flex-col sm:flex-row items-center gap-2 py-4 px-4 rounded-lg data-[state=active]:bg-logo-green data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-logo-green/25 transition-all duration-200"
                  >
                    <div className="p-2 rounded-full bg-indigo-500/20">
                      <Video className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-sm">Video Library</div>
                      <div className="text-xs opacity-70 hidden sm:block">Expert-Led Content</div>
                    </div>
                  </TabsTrigger>
                </TabsList>

              {/* Interactive Tools Tab */}
              <TabsContent value="tools" className="space-y-6 animate-fade-in">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Enabling Decision Tree */}
                  <Card className="overflow-hidden border-2 border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                    <CardHeader className="bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <Scale className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-logo-green">Enabling vs. Helping Decision Tree</CardTitle>
                          <CardDescription>Navigate difficult situations with clarity</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <EnablingDecisionTree />
                    </CardContent>
                  </Card>

                  {/* Relapse Warning Signs Tracker */}
                  <Card className="overflow-hidden border-2 border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300">
                    <CardHeader className="bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/20 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-rose-500/10">
                          <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-logo-green">Relapse Warning Signs Tracker</CardTitle>
                          <CardDescription>Identify early warning signs before crisis</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Return to active use is the end of a process that often begins days or weeks before. This tracker helps you identify emotional, behavioral, and cognitive warning signs early.
                      </p>
                      <Link to="/relapse-warning-signs">
                        <Button className="w-full gap-2">
                          <FileText className="h-4 w-4" />
                          Open Tracker
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                {/* Trauma Assessment */}
                <Card className="overflow-hidden border-2 border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-logo-green">Trauma & Hypervigilance Self-Assessment</CardTitle>
                        <CardDescription>Understand how chronic stress affects you</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TraumaHypervigilanceAssessment />
                  </CardContent>
                </Card>

                {/* User-specific worksheets */}
                {user && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-logo-green flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Your Personal Worksheets
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <Card className="border-2 border-blue-500/30 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Family Self-Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <FamilySelfAssessment user={user} />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-teal-500/30 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Control Worksheet</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ControlWorksheet user={user} />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-emerald-500/30 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Boundary Worksheet</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <BoundaryWorksheet user={user} />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-orange-500/30 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Scenario Practice</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScenarioWorksheet user={user} />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-rose-500/30 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Guilt vs. Responsibility</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <GuiltResponsibilityWorksheet user={user} />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-pink-500/30 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Self-Care Worksheet</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <SelfCareWorksheet user={user} />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Six Pillars Tab */}
              <TabsContent value="pillars" className="animate-fade-in">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Our curriculum is organized into six foundational pillars, each building upon the last to create a comprehensive understanding of addiction and family recovery.
                  </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {pillars.map((pillar) => (
                    <AccordionItem 
                      key={pillar.id} 
                      value={pillar.id}
                      className={`border-2 border-${pillar.color}-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-${pillar.color}-50/50 to-transparent dark:from-${pillar.color}-950/10`}
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-4 text-left">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${pillar.color}-500/20 flex items-center justify-center`}>
                            <span className={`text-lg font-bold text-${pillar.color}-600 dark:text-${pillar.color}-400`}>{pillar.number}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <pillar.icon className={`h-5 w-5 text-${pillar.color}-600 dark:text-${pillar.color}-400`} />
                            <div>
                              <h3 className="font-semibold text-foreground">{pillar.title}</h3>
                              <p className="text-sm text-muted-foreground">{pillar.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <p className="text-muted-foreground mb-4">{pillar.description}</p>
                        
                        {pillar.subcategories ? (
                          <div className="space-y-4">
                            {pillar.subcategories.map((sub, idx) => (
                              <div key={idx}>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                  {sub.name}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {sub.resources.map((resource, ridx) => (
                                    <Link key={ridx} to={resource.path}>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className={`gap-2 border-${resource.color}-500/50 text-${resource.color}-700 hover:bg-${resource.color}-50 dark:text-${resource.color}-400 dark:hover:bg-${resource.color}-950/30 transition-all`}
                                      >
                                        <FileText className="h-3 w-3" />
                                        {resource.title}
                                      </Button>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {pillar.resources?.map((resource, idx) => (
                              <Link key={idx} to={resource.path}>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={`gap-2 border-${resource.color}-500/50 text-${resource.color}-700 hover:bg-${resource.color}-50 dark:text-${resource.color}-400 dark:hover:bg-${resource.color}-950/30 transition-all`}
                                >
                                  <FileText className="h-3 w-3" />
                                  {resource.title}
                                </Button>
                              </Link>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              {/* Wellness Tab */}
              <TabsContent value="wellness" className="space-y-8 animate-fade-in">
                {/* Guided Meditations */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Headphones className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-logo-green">Guided Meditations</h3>
                      <p className="text-sm text-muted-foreground">Audio resources to help you stay grounded</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {meditations.map((meditation, idx) => (
                      <Card key={idx} className={`overflow-hidden border-2 border-${meditation.color}-500/30 hover:shadow-lg transition-all`}>
                        <CardHeader className={`bg-gradient-to-br from-${meditation.color}-50 to-transparent dark:from-${meditation.color}-950/20 py-3`}>
                          <div className="flex items-center justify-between">
                            <CardTitle className={`text-sm font-medium text-${meditation.color}-700 dark:text-${meditation.color}-400`}>
                              {meditation.title}
                            </CardTitle>
                            <a href={`/audio/${meditation.file}`} download className="shrink-0">
                              <Button variant="ghost" size="sm" className={`gap-1 text-${meditation.color}-600 hover:text-${meditation.color}-700 dark:text-${meditation.color}-400`}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-3 pb-4">
                          <audio controls className="w-full h-10">
                            <source src={`/audio/${meditation.file}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* AI Tools Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-logo-green">AI Tools</h3>
                      <p className="text-sm text-muted-foreground">Intelligent support for your journey</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <Link to="/ai-life-coach">
                      <Card className="h-full border-2 border-violet-500/20 hover:border-violet-500/40 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/10">
                        <CardContent className="py-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                              <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors mb-1">AI Life Coach</h4>
                              <p className="text-sm text-muted-foreground">
                                Transform any AI chatbot into a master life coach and recovery guide with our specialized prompt.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </TabsContent>

              {/* Video Library Tab */}
              <TabsContent value="videos" className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <Video className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-semibold text-logo-green">Video Library</h3>
                      <p className="text-sm text-muted-foreground">Expert-led educational content</p>
                    </div>
                  </div>
                </div>

                <Card className="border-2 border-indigo-500/20 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/10">
                  <CardContent className="py-16 text-center">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                      <Video className="relative h-20 w-20 text-indigo-500/60 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                      We're developing a comprehensive library of expert-led video content covering understanding addiction, setting boundaries, effective communication, treatment navigation, and family recovery.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                      <span className="px-3 py-1 rounded-full bg-muted">Understanding Addiction</span>
                      <span className="px-3 py-1 rounded-full bg-muted">Setting Boundaries</span>
                      <span className="px-3 py-1 rounded-full bg-muted">Communication Strategies</span>
                      <span className="px-3 py-1 rounded-full bg-muted">Treatment Navigation</span>
                      <span className="px-3 py-1 rounded-full bg-muted">Family Recovery</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
