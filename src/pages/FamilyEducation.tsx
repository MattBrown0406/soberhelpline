import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Video, Lock, Loader2, FileText, Headphones, Users, Calendar, Download, BookOpen, Brain, Heart, Shield, Sparkles, ChevronDown, ChevronRight, GraduationCap, AlertTriangle, Scale, Compass, TreePine, Activity, Target, Lightbulb, RefreshCw, Eye, Globe } from "lucide-react";
import GoogleTranslate from "@/components/GoogleTranslate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import SEOHead from "@/components/SEOHead";
import EducationProgressBar from "@/components/EducationProgressBar";
import StartHereGuide from "@/components/StartHereGuide";
import MemberZoomBanner from "@/components/MemberZoomBanner";

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
      { title: "Understanding Eating Disorders", path: "/eating-disorders-guide", color: "pink" },
      { title: "Trauma & Hypervigilance Self-Assessment", path: "#trauma-assessment", color: "violet", isAnchor: true },
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
  { title: "Staying Grounded When They Won't Accept Help", file: "staying-grounded-when-they-wont-accept-help-meditation.mp3", color: "slate" },
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

// Static color map — Tailwind JIT needs full class strings at build time
const colorMap: Record<string, { border: string; text: string; hover: string; bg: string; bgGradient: string; borderLight: string; borderHeavy: string; iconText: string; hoverBorder: string }> = {
  emerald: { border: "border-emerald-500/50", text: "text-emerald-700 dark:text-emerald-400", hover: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30", bg: "bg-emerald-50 dark:bg-emerald-950/20", bgGradient: "bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10", borderLight: "border-emerald-500/20", borderHeavy: "border-emerald-500/30", iconText: "text-emerald-600 dark:text-emerald-400", hoverBorder: "hover:border-emerald-500/40" },
  rose: { border: "border-rose-500/50", text: "text-rose-700 dark:text-rose-400", hover: "hover:bg-rose-50 dark:hover:bg-rose-950/30", bg: "bg-rose-50 dark:bg-rose-950/20", bgGradient: "bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/10", borderLight: "border-rose-500/20", borderHeavy: "border-rose-500/30", iconText: "text-rose-600 dark:text-rose-400", hoverBorder: "hover:border-rose-500/40" },
  violet: { border: "border-violet-500/50", text: "text-violet-700 dark:text-violet-400", hover: "hover:bg-violet-50 dark:hover:bg-violet-950/30", bg: "bg-violet-50 dark:bg-violet-950/20", bgGradient: "bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/10", borderLight: "border-violet-500/20", borderHeavy: "border-violet-500/30", iconText: "text-violet-600 dark:text-violet-400", hoverBorder: "hover:border-violet-500/40" },
  blue: { border: "border-blue-500/50", text: "text-blue-700 dark:text-blue-400", hover: "hover:bg-blue-50 dark:hover:bg-blue-950/30", bg: "bg-blue-50 dark:bg-blue-950/20", bgGradient: "bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10", borderLight: "border-blue-500/20", borderHeavy: "border-blue-500/30", iconText: "text-blue-600 dark:text-blue-400", hoverBorder: "hover:border-blue-500/40" },
  amber: { border: "border-amber-500/50", text: "text-amber-700 dark:text-amber-400", hover: "hover:bg-amber-50 dark:hover:bg-amber-950/30", bg: "bg-amber-50 dark:bg-amber-950/20", bgGradient: "bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10", borderLight: "border-amber-500/20", borderHeavy: "border-amber-500/30", iconText: "text-amber-600 dark:text-amber-400", hoverBorder: "hover:border-amber-500/40" },
  teal: { border: "border-teal-500/50", text: "text-teal-700 dark:text-teal-400", hover: "hover:bg-teal-50 dark:hover:bg-teal-950/30", bg: "bg-teal-50 dark:bg-teal-950/20", bgGradient: "bg-gradient-to-br from-teal-50/50 to-transparent dark:from-teal-950/10", borderLight: "border-teal-500/20", borderHeavy: "border-teal-500/30", iconText: "text-teal-600 dark:text-teal-400", hoverBorder: "hover:border-teal-500/40" },
  slate: { border: "border-slate-500/50", text: "text-slate-700 dark:text-slate-400", hover: "hover:bg-slate-50 dark:hover:bg-slate-950/30", bg: "bg-slate-50 dark:bg-slate-950/20", bgGradient: "bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-950/10", borderLight: "border-slate-500/20", borderHeavy: "border-slate-500/30", iconText: "text-slate-600 dark:text-slate-400", hoverBorder: "hover:border-slate-500/40" },
  red: { border: "border-red-500/50", text: "text-red-700 dark:text-red-400", hover: "hover:bg-red-50 dark:hover:bg-red-950/30", bg: "bg-red-50 dark:bg-red-950/20", bgGradient: "bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/10", borderLight: "border-red-500/20", borderHeavy: "border-red-500/30", iconText: "text-red-600 dark:text-red-400", hoverBorder: "hover:border-red-500/40" },
  fuchsia: { border: "border-fuchsia-500/50", text: "text-fuchsia-700 dark:text-fuchsia-400", hover: "hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30", bg: "bg-fuchsia-50 dark:bg-fuchsia-950/20", bgGradient: "bg-gradient-to-br from-fuchsia-50/50 to-transparent dark:from-fuchsia-950/10", borderLight: "border-fuchsia-500/20", borderHeavy: "border-fuchsia-500/30", iconText: "text-fuchsia-600 dark:text-fuchsia-400", hoverBorder: "hover:border-fuchsia-500/40" },
  purple: { border: "border-purple-500/50", text: "text-purple-700 dark:text-purple-400", hover: "hover:bg-purple-50 dark:hover:bg-purple-950/30", bg: "bg-purple-50 dark:bg-purple-950/20", bgGradient: "bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/10", borderLight: "border-purple-500/20", borderHeavy: "border-purple-500/30", iconText: "text-purple-600 dark:text-purple-400", hoverBorder: "hover:border-purple-500/40" },
  indigo: { border: "border-indigo-500/50", text: "text-indigo-700 dark:text-indigo-400", hover: "hover:bg-indigo-50 dark:hover:bg-indigo-950/30", bg: "bg-indigo-50 dark:bg-indigo-950/20", bgGradient: "bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/10", borderLight: "border-indigo-500/20", borderHeavy: "border-indigo-500/30", iconText: "text-indigo-600 dark:text-indigo-400", hoverBorder: "hover:border-indigo-500/40" },
  cyan: { border: "border-cyan-500/50", text: "text-cyan-700 dark:text-cyan-400", hover: "hover:bg-cyan-50 dark:hover:bg-cyan-950/30", bg: "bg-cyan-50 dark:bg-cyan-950/20", bgGradient: "bg-gradient-to-br from-cyan-50/50 to-transparent dark:from-cyan-950/10", borderLight: "border-cyan-500/20", borderHeavy: "border-cyan-500/30", iconText: "text-cyan-600 dark:text-cyan-400", hoverBorder: "hover:border-cyan-500/40" },
  orange: { border: "border-orange-500/50", text: "text-orange-700 dark:text-orange-400", hover: "hover:bg-orange-50 dark:hover:bg-orange-950/30", bg: "bg-orange-50 dark:bg-orange-950/20", bgGradient: "bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/10", borderLight: "border-orange-500/20", borderHeavy: "border-orange-500/30", iconText: "text-orange-600 dark:text-orange-400", hoverBorder: "hover:border-orange-500/40" },
  pink: { border: "border-pink-500/50", text: "text-pink-700 dark:text-pink-400", hover: "hover:bg-pink-50 dark:hover:bg-pink-950/30", bg: "bg-pink-50 dark:bg-pink-950/20", bgGradient: "bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/10", borderLight: "border-pink-500/20", borderHeavy: "border-pink-500/30", iconText: "text-pink-600 dark:text-pink-400", hoverBorder: "hover:border-pink-500/40" },
  lime: { border: "border-lime-500/50", text: "text-lime-700 dark:text-lime-400", hover: "hover:bg-lime-50 dark:hover:bg-lime-950/30", bg: "bg-lime-50 dark:bg-lime-950/20", bgGradient: "bg-gradient-to-br from-lime-50/50 to-transparent dark:from-lime-950/10", borderLight: "border-lime-500/20", borderHeavy: "border-lime-500/30", iconText: "text-lime-600 dark:text-lime-400", hoverBorder: "hover:border-lime-500/40" },
  sky: { border: "border-sky-500/50", text: "text-sky-700 dark:text-sky-400", hover: "hover:bg-sky-50 dark:hover:bg-sky-950/30", bg: "bg-sky-50 dark:bg-sky-950/20", bgGradient: "bg-gradient-to-br from-sky-50/50 to-transparent dark:from-sky-950/10", borderLight: "border-sky-500/20", borderHeavy: "border-sky-500/30", iconText: "text-sky-600 dark:text-sky-400", hoverBorder: "hover:border-sky-500/40" },
  green: { border: "border-green-500/50", text: "text-green-700 dark:text-green-400", hover: "hover:bg-green-50 dark:hover:bg-green-950/30", bg: "bg-green-50 dark:bg-green-950/20", bgGradient: "bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/10", borderLight: "border-green-500/20", borderHeavy: "border-green-500/30", iconText: "text-green-600 dark:text-green-400", hoverBorder: "hover:border-green-500/40" },
};

const c = (color: string) => colorMap[color] || colorMap.slate;

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
        <SEOHead
          title="Family Education Resources | Sober Helpline"
          description="Comprehensive educational resources for families supporting loved ones through addiction and recovery. Interactive tools, guides, and meditations."
        />
        <div className="min-h-screen bg-background">
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
                  Join our family support membership for just $10/month to access our complete library of educational resources.
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
      <SEOHead
        title="Family Education Resources | Sober Helpline"
        description="Comprehensive educational resources for families supporting loved ones through addiction and recovery. Interactive tools, guides, and meditations."
      />

      <div className="min-h-screen bg-background">

        <main className="container py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex flex-wrap items-center gap-3">
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
                  <Link to="/family-coaching">
                    <Button variant="outline" size="sm" className="gap-2 border-amber-500/50 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30">
                      <Compass className="h-4 w-4" />
                      Coaching
                    </Button>
                  </Link>
                  <Link to="/monday-zoom-registration">
                    <Button variant="outline" size="sm" className="gap-2 border-blue-500/50 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30">
                      <Video className="h-4 w-4" />
                      “The Family Squares”
                    </Button>
                  </Link>
                  <Link to="/zoom-recordings">
                    <Button variant="outline" size="sm" className="gap-2 border-rose-500/50 text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30">
                      <Video className="h-4 w-4" />
                      Past Recordings
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 border border-border/50">
                <GoogleTranslate />
              </div>
            </div>

            <MemberZoomBanner />

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
                    <span className="text-sm font-medium">62 Resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-logo-green" />
                    <span className="text-sm font-medium">8 Interactive Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-logo-green" />
                    <span className="text-sm font-medium">12 Guided Meditations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-logo-green" />
                    <span className="text-sm font-medium">6 AI Tools</span>
                  </div>
                </div>
              </div>
            </div>

            <Card className="mb-6 border-amber-500/30 bg-gradient-to-r from-amber-50/80 via-background to-orange-50/80 dark:from-amber-950/20 dark:via-background dark:to-orange-950/20">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-3">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Need help right now?
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      Start with a private consult if things are actively escalating
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      The education library is here to help you think clearly, but if your family needs a calmer direct plan first, start with a Crisis Family Consult. If you want a free first step, join the Monday night Zoom and come back to the resources after that.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-4">
                      <span className="font-semibold text-foreground">Private consults from $150</span>
                      <span className="text-border">•</span>
                      <span>$125 for members</span>
                      <span className="text-border">•</span>
                      <span>Free Monday Zoom available every week</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row lg:min-w-[260px]">
                    <Link to="/family-consultation">
                      <Button className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                        <Compass className="h-4 w-4" />
                        Book Crisis Family Consult
                      </Button>
                    </Link>
                    <Link to="/monday-zoom-registration">
                      <Button variant="outline" className="w-full gap-2 border-blue-500/40 text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/30">
                        <Calendar className="h-4 w-4" />
                        Join Free Monday Zoom
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Quiz Prompt */}
            {!localStorage.getItem("onboarding_quiz_completed") && (
              <Link to="/onboarding-quiz">
                <Card className="mb-6 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border-emerald-800/40 hover:border-emerald-600/60 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="font-semibold text-sm text-foreground">Not sure where to start?</p>
                        <p className="text-xs text-muted-foreground">Take our 2-minute quiz for a personalized resource path.</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium whitespace-nowrap ml-3">Take Quiz →</span>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Progress Tracking */}
            <EducationProgressBar />

            {/* Guided Starting Path for New Members */}
            <StartHereGuide />

            <Card className="mb-6 border-2 border-logo-green/20 bg-gradient-to-r from-logo-green/10 via-background to-primary/5">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-logo-green/10 px-3 py-1 text-xs font-semibold text-logo-green mb-3">
                      <Compass className="h-3.5 w-3.5" />
                      Need a clearer starting point?
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      Start with a curated track instead of wandering the whole library
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      We grouped the best family education pages into guided tracks for crisis, boundaries, treatment decisions, relapse, family systems, spouses, parents, and siblings. Each track also points you to the right forum discussion so you can ask better questions faster.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row lg:min-w-[280px]">
                    <Link to="/family-education/tracks">
                      <Button className="w-full gap-2 bg-logo-green hover:bg-logo-green/90 text-white">
                        <BookOpen className="h-4 w-4" />
                        Explore Guided Tracks
                      </Button>
                    </Link>
                    <Link to="/family-support-forum">
                      <Button variant="outline" className="w-full gap-2 border-purple-500/40 text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-950/30">
                        <Users className="h-4 w-4" />
                        Visit Family Forum
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs - Prominent Section Navigation */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">Explore Our Resources</h2>
                <p className="text-muted-foreground text-sm">Choose a section below to access different types of support materials</p>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full h-auto p-2 bg-muted/50 border-2 border-logo-green/20 rounded-xl grid grid-cols-3 gap-2">
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
                      <div className="font-semibold text-sm">Wellness & AI Tools</div>
                      <div className="text-xs opacity-70 hidden sm:block">Meditations, Self-Care & AI Coaches</div>
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

                {/* Standalone Tool Links */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Link to="/fear-inventory-exercise">
                    <Card className="h-full overflow-hidden border-2 border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer group">
                      <CardHeader className="bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-950/20 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Eye className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-logo-green group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">Fear Inventory Exercise</CardTitle>
                            <CardDescription>Identify and examine the fears driving your decisions</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          A structured exercise to uncover the fears beneath your reactions—so you can respond from clarity instead of anxiety.
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/conversation-starters">
                    <Card className="h-full overflow-hidden border-2 border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer group">
                      <CardHeader className="bg-gradient-to-br from-teal-50 to-transparent dark:from-teal-950/20 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-teal-500/10">
                            <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-logo-green group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">Conversation Starters</CardTitle>
                            <CardDescription>Scripts and frameworks for difficult conversations</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Ready-to-use conversation frameworks for talking to your loved one about treatment, boundaries, and recovery.
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                {/* Trauma Assessment */}
                <div id="trauma-assessment" className="scroll-mt-24">
                  <TraumaHypervigilanceAssessment />
                </div>

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
                      className={`border-2 ${c(pillar.color).borderHeavy} rounded-lg overflow-hidden ${c(pillar.color).bgGradient}`}
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-4 text-left">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${c(pillar.color).bg} flex items-center justify-center`}>
                            <span className={`text-lg font-bold ${c(pillar.color).iconText}`}>{pillar.number}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <pillar.icon className={`h-5 w-5 ${c(pillar.color).iconText}`} />
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
                                        className={`gap-2 ${c(resource.color).border} ${c(resource.color).text} ${c(resource.color).hover} transition-all`}
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
                            {pillar.resources?.map((resource, idx) => {
                              const isAnchor = (resource as any).isAnchor;
                              if (isAnchor) {
                                return (
                                  <a 
                                    key={idx} 
                                    href={resource.path}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setActiveTab("tools");
                                      setTimeout(() => {
                                        document.getElementById("trauma-assessment")?.scrollIntoView({ behavior: "smooth" });
                                      }, 100);
                                    }}
                                  >
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className={`gap-2 ${c(resource.color).border} ${c(resource.color).text} ${c(resource.color).hover} transition-all`}
                                    >
                                      <Brain className="h-3 w-3" />
                                      {resource.title}
                                    </Button>
                                  </a>
                                );
                              }
                              return (
                                <Link key={idx} to={resource.path}>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={`gap-2 ${c(resource.color).border} ${c(resource.color).text} ${c(resource.color).hover} transition-all`}
                                  >
                                    <FileText className="h-3 w-3" />
                                    {resource.title}
                                  </Button>
                                </Link>
                              );
                            })}
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
                      <Card key={idx} className={`overflow-hidden border-2 ${c(meditation.color).borderHeavy} hover:shadow-lg transition-all`}>
                        <CardHeader className={`${c(meditation.color).bgGradient} py-3`}>
                          <div className="flex items-center justify-between">
                            <CardTitle className={`text-sm font-medium ${c(meditation.color).text}`}>
                              {meditation.title}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={`gap-1 shrink-0 ${c(meditation.color).iconText}`}
                              onClick={async () => {
                                const url = `/audio/${meditation.file}`;
                                try {
                                  const response = await fetch(url);
                                  if (!response.ok) throw new Error("Download failed");
                                  const blob = await response.blob();
                                  const blobUrl = URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = blobUrl;
                                  a.download = meditation.file;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(blobUrl);
                                } catch {
                                  window.open(url, "_blank");
                                }
                              }}
                              aria-label={`Download ${meditation.title}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
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
                    
                    <Link to="/ai-enabling-decision-coach">
                      <Card className="h-full border-2 border-amber-500/20 hover:border-amber-500/40 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10">
                        <CardContent className="py-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                              <Scale className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-1">Helping vs. Enabling Decision Coach</h4>
                              <p className="text-sm text-muted-foreground">
                                Turn AI into a decision coach that helps you distinguish between helping and enabling behaviors.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link to="/ai-boundary-builder-coach">
                      <Card className="h-full border-2 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
                        <CardContent className="py-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mb-1">Boundary Builder Coach</h4>
                              <p className="text-sm text-muted-foreground">
                                Transform AI into a boundary coach that helps you set clear, calm, enforceable boundaries.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link to="/ai-treatment-navigator">
                      <Card className="h-full border-2 border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10">
                        <CardContent className="py-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                              <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-1">Treatment Reality Navigator</h4>
                              <p className="text-sm text-muted-foreground">
                                Understand what treatment can and cannot do—without the marketing spin.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link to="/ai-relapse-response-guide">
                      <Card className="h-full border-2 border-orange-500/20 hover:border-orange-500/40 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/10">
                        <CardContent className="py-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                              <RefreshCw className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors mb-1">Relapse Response Guide</h4>
                              <p className="text-sm text-muted-foreground">
                                Respond to relapse without panic, punishment, or enabling—stay consistent when it matters most.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link to="/ai-addiction-reality-translator">
                      <Card className="h-full border-2 border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/10">
                        <CardContent className="py-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                              <Eye className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors mb-1">Addiction Reality Translator</h4>
                              <p className="text-sm text-muted-foreground">
                                Cut through denial, rationalization, and emotional fog—see behavior clearly without moralizing.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </TabsContent>


            </Tabs>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
