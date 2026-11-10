import { Link, useLocation } from "react-router-dom";
import { Lock, Loader2, FileText, Headphones, Download, BookOpen, Brain, Heart, Sparkles, AlertTriangle, Scale, Compass, Lightbulb, RefreshCw, Eye, Shield, Users, CheckCircle2, Circle, ArrowRight, NotebookPen } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
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
import MemberZoomBanner from "@/components/MemberZoomBanner";
import ExerciseGridComponent from "@/components/workbook/ExerciseGrid";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { useLearningPath } from "@/hooks/useLearningPath";
import { useToast } from "@/hooks/use-toast";
import {
  embeddedWorksheetPath, embeddedWorksheets, guidedExercises, LIBRARY_TYPE_TOTALS, meditationPath,
  meditations, pillars, type PillarResource,
} from "@/data/memberLibrary";

// The workbook build owns ExerciseGrid; typed here so this page compiles before
// and after its `limit` prop lands.
const ExerciseGrid = ExerciseGridComponent as ComponentType<{ limit?: number }>;

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

/** Which tab holds an element id linked as /family-education#<id>. */
function tabForHash(hash: string): string | null {
  if (!hash) return null;
  if (hash.startsWith("meditation")) return "wellness";
  if (hash.startsWith("pillar-")) return "pillars";
  return "tools";
}

const worksheetTitle = (id: string) => embeddedWorksheets.find((w) => w.id === id)?.title ?? id;

/** "Mark as done" toggle that records education_progress for one resource. */
function DoneToggle({
  title,
  path,
  type,
  label = "Mark as done",
  doneLabel = "Done",
}: {
  title: string;
  path: string;
  type: "guide" | "worksheet" | "meditation";
  label?: string;
  doneLabel?: string;
}) {
  const { userId, isCompleted, markCompleted, markIncomplete } = useEducationProgress();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  if (!userId) return null;
  const done = isCompleted(path);

  const toggle = async () => {
    setBusy(true);
    const ok = done ? await markIncomplete(path) : await markCompleted(title, path, type);
    setBusy(false);
    if (!ok) toast({ title: "That didn't save", description: "Please try again in a moment.", variant: "destructive" });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={done ? "secondary" : "outline"}
      disabled={busy}
      aria-pressed={done}
      onClick={toggle}
      className="h-8 shrink-0 gap-1.5"
    >
      {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Circle className="h-4 w-4" />}
      {done ? doneLabel : label}
    </Button>
  );
}

/** A long worksheet embedded on this page, with a stable id other pages link to. */
function WorksheetCard({ id, borderClass, children }: { id: string; borderClass: string; children: ReactNode }) {
  const title = worksheetTitle(id);
  return (
    <Card id={id} className={`scroll-mt-24 border-2 ${borderClass} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <DoneToggle title={title} path={embeddedWorksheetPath(id)} type="worksheet" />
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** One slim line: the member's path and the next step, or a prompt to choose one. */
function YourPathStrip() {
  const { loading, track, currentStepNumber, totalSteps, nextStep } = useLearningPath();
  if (loading) return null;

  if (!track) {
    return (
      <Card className="mb-4 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Compass className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Choose your path</p>
              <p className="text-sm text-muted-foreground">Pick one short, ordered path so you always know what to read next.</p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0 gap-1.5">
            <Link to="/family-education/tracks">
              Choose a path
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <Compass className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">Your path: {track.title}</span>
            <span className="text-muted-foreground">
              {nextStep ? ` · Step ${currentStepNumber} of ${totalSteps}: ${nextStep.title}` : " · Finished"}
            </span>
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0 gap-1.5">
          <Link to={nextStep ? nextStep.path : "/family-education/tracks"}>
            {nextStep ? "Continue" : "Choose another path"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const linkedTools = [
  {
    path: "/relapse-warning-signs",
    title: "Relapse Warning Signs Tracker",
    description: "Return to use often begins days or weeks before. Spot the emotional, behavioral and thinking signs early.",
    icon: AlertTriangle,
    border: "border-rose-500/30",
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-600 dark:text-rose-400",
  },
  {
    path: "/fear-inventory-exercise",
    title: "Fear Inventory Exercise",
    description: "Uncover the fears beneath your reactions, so you can respond from clarity instead of anxiety.",
    icon: Eye,
    border: "border-indigo-500/30",
    iconBg: "bg-indigo-500/10",
    iconText: "text-indigo-600 dark:text-indigo-400",
  },
  {
    path: "/conversation-starters",
    title: "Conversation Starters",
    description: "Ready-to-use frameworks for talking with your loved one about treatment, boundaries and recovery.",
    icon: Users,
    border: "border-teal-500/30",
    iconBg: "bg-teal-500/10",
    iconText: "text-teal-600 dark:text-teal-400",
  },
  {
    path: "/boundary-setting-worksheet",
    title: "Boundary Setting Worksheet",
    description: "Work through one boundary step by step: what it is, why it matters, and how you'll hold it.",
    icon: Shield,
    border: "border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function FamilyEducation() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [activeTab, setActiveTab] = useState(() => tabForHash(location.hash.slice(1)) ?? "tools");
  const [openPillar, setOpenPillar] = useState<string | undefined>(undefined);
  const { isCompleted, markCompleted } = useEducationProgress();

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
        const { data: isMember, error } = await supabase.rpc('is_active_family_member', { _user_id: user.id });

        if (error) {
          console.error('Error checking membership:', error);
          setHasMembership(false);
        } else {
          setHasMembership(isMember === true);
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

  // Links like /family-education#worksheet-scenario: open the right tab, then
  // scroll once the content is on the page.
  useEffect(() => {
    if (isLoading || !hasMembership) return;
    const id = location.hash.slice(1);
    if (!id) return;
    const tab = tabForHash(id);
    if (tab) setActiveTab(tab);
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [isLoading, hasMembership, location.hash]);

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
                  Join our family support membership for just $9.99/month to access our complete library of educational resources.
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

  const pillarButton = (resource: PillarResource, key: string | number) => {
    const progressPath = resource.isAnchor ? embeddedWorksheetPath(resource.path.replace(/^#/, "")) : resource.path;
    const done = isCompleted(progressPath);
    const Icon = done ? CheckCircle2 : resource.isAnchor ? Brain : FileText;
    const button = (
      <Button
        variant="outline"
        size="sm"
        className={`gap-2 h-auto min-h-8 py-1.5 whitespace-normal text-left ${c(resource.color).border} ${c(resource.color).text} ${c(resource.color).hover} transition-colors`}
      >
        <Icon className="h-3 w-3 shrink-0" aria-label={done ? "Done" : undefined} />
        {resource.title}
      </Button>
    );
    if (resource.isAnchor) {
      return (
        <a
          key={key}
          href={resource.path}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("tools");
            setTimeout(() => {
              document.getElementById(resource.path.replace(/^#/, ""))?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          {button}
        </a>
      );
    }
    return (
      <Link key={key} to={resource.path}>
        {button}
      </Link>
    );
  };

  return (
    <>
      <SEOHead
        title="Family Education Resources | Sober Helpline"
        description="Comprehensive educational resources for families supporting loved ones through addiction and recovery. Interactive tools, guides, and meditations."
      />

      <div className="min-h-screen bg-background">
        <main className="container py-6 md:py-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-logo-blue">Family Education Center</h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
                  {LIBRARY_TYPE_TOTALS.guide} guides, {LIBRARY_TYPE_TOTALS.worksheet} worksheets and exercises,{" "}
                  {LIBRARY_TYPE_TOTALS.meditation} guided meditations and 6 AI tools. Take your time: healing happens
                  gradually, not overnight.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start bg-muted/50 rounded-lg px-3 py-1.5 border border-border/50">
                <GoogleTranslate />
              </div>
            </div>

            {/* One compact crisis line */}
            <p className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Things escalating right now?{" "}
                <Link to="/family-consultation" className="font-medium text-primary hover:underline">
                  Book a Crisis Family Consult
                </Link>{" "}
                or call{" "}
                <a href="tel:+14582988008" className="font-medium text-primary hover:underline">
                  (458) 298-8008
                </a>
                .
              </span>
            </p>

            <MemberZoomBanner />

            <YourPathStrip />

            <EducationProgressBar />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full h-auto p-1.5 sm:p-2 bg-muted/50 border-2 border-logo-green/20 rounded-xl grid grid-cols-3 gap-1.5 sm:gap-2 mb-6">
                <TabsTrigger
                  value="tools"
                  className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:py-4 sm:px-4 rounded-lg data-[state=active]:bg-logo-blue data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-logo-blue/25 transition-all duration-200 h-full"
                >
                  <div className="p-1.5 sm:p-2 rounded-full bg-amber-500/20">
                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <div className="font-semibold text-[11px] leading-tight sm:text-sm">Interactive Tools</div>
                    <div className="text-xs opacity-70 hidden sm:block">Exercises & Worksheets</div>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="pillars"
                  className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:py-4 sm:px-4 rounded-lg data-[state=active]:bg-logo-blue data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-logo-blue/25 transition-all duration-200 h-full"
                >
                  <div className="p-1.5 sm:p-2 rounded-full bg-blue-500/20">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <div className="font-semibold text-[11px] leading-tight sm:text-sm">Six Pillars</div>
                    <div className="text-xs opacity-70 hidden sm:block">{LIBRARY_TYPE_TOTALS.guide} Educational Guides</div>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="wellness"
                  className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:py-4 sm:px-4 rounded-lg data-[state=active]:bg-logo-blue data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-logo-blue/25 transition-all duration-200 h-full"
                >
                  <div className="p-1.5 sm:p-2 rounded-full bg-rose-500/20">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <div className="font-semibold text-[11px] leading-tight sm:text-sm">Wellness &amp; AI</div>
                    <div className="text-xs opacity-70 hidden sm:block">Meditations, Self-Care & AI Coaches</div>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Interactive Tools Tab */}
              <TabsContent value="tools" className="space-y-10 animate-fade-in">
                {/* Short guided exercises first */}
                <section aria-labelledby="short-exercises-heading" className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <h2 id="short-exercises-heading" className="text-xl font-semibold text-logo-blue flex items-center gap-2">
                        <NotebookPen className="h-5 w-5" />
                        Short guided exercises (5 minutes)
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {guidedExercises.length} short, private exercises. What you write is saved to your workbook.
                      </p>
                    </div>
                    <Link to="/workbook" className="text-sm text-primary hover:underline">
                      Open your workbook
                    </Link>
                  </div>
                  <ExerciseGrid />
                </section>

                {/* Full-length worksheets */}
                <section aria-labelledby="full-worksheets-heading" className="space-y-6">
                  <div>
                    <h2 id="full-worksheets-heading" className="text-xl font-semibold text-logo-blue flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Full-length worksheets
                    </h2>
                    <p className="text-sm text-muted-foreground">Longer tools for when you have time to go deeper.</p>
                  </div>

                  <Card
                    id="worksheet-enabling-decision-tree"
                    className="scroll-mt-24 overflow-hidden border-2 border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-shadow"
                  >
                    <CardHeader className="bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/10">
                            <Scale className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-logo-blue">{worksheetTitle("worksheet-enabling-decision-tree")}</CardTitle>
                            <CardDescription>Navigate difficult situations with clarity</CardDescription>
                          </div>
                        </div>
                        <DoneToggle
                          title={worksheetTitle("worksheet-enabling-decision-tree")}
                          path={embeddedWorksheetPath("worksheet-enabling-decision-tree")}
                          type="worksheet"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <EnablingDecisionTree />
                    </CardContent>
                  </Card>

                  {/* Tools with their own page (the member bar there marks them complete) */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {linkedTools.map((tool) => {
                      const Icon = tool.icon;
                      const done = isCompleted(tool.path);
                      return (
                        <Link key={tool.path} to={tool.path} className="group">
                          <Card className={`h-full overflow-hidden border-2 ${tool.border} hover:shadow-lg transition-shadow`}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${tool.iconBg}`}>
                                  <Icon className={`h-5 w-5 ${tool.iconText}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-base text-logo-blue group-hover:underline">{tool.title}</CardTitle>
                                  {done && (
                                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Done
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Trauma Assessment */}
                  <div id="trauma-assessment" className="scroll-mt-24 space-y-2">
                    <div className="flex justify-end">
                      <DoneToggle
                        title={worksheetTitle("trauma-assessment")}
                        path={embeddedWorksheetPath("trauma-assessment")}
                        type="worksheet"
                      />
                    </div>
                    <TraumaHypervigilanceAssessment user={user ?? undefined} />
                  </div>

                  {/* User-specific worksheets */}
                  {user && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-logo-blue">Your personal worksheets</h3>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <WorksheetCard id="worksheet-family-self-assessment" borderClass="border-blue-500/30">
                          <FamilySelfAssessment user={user} />
                        </WorksheetCard>
                        <WorksheetCard id="worksheet-control" borderClass="border-teal-500/30">
                          <ControlWorksheet user={user} />
                        </WorksheetCard>
                        <WorksheetCard id="worksheet-boundary" borderClass="border-emerald-500/30">
                          <BoundaryWorksheet user={user} />
                        </WorksheetCard>
                        <WorksheetCard id="worksheet-scenario" borderClass="border-orange-500/30">
                          <ScenarioWorksheet user={user} />
                        </WorksheetCard>
                        <WorksheetCard id="worksheet-guilt-responsibility" borderClass="border-rose-500/30">
                          <GuiltResponsibilityWorksheet user={user} />
                        </WorksheetCard>
                        <WorksheetCard id="worksheet-self-care" borderClass="border-pink-500/30">
                          <SelfCareWorksheet user={user} />
                        </WorksheetCard>
                      </div>
                    </div>
                  )}
                </section>
              </TabsContent>

              {/* Six Pillars Tab */}
              <TabsContent value="pillars" className="animate-fade-in">
                <div className="mb-4">
                  <p className="text-muted-foreground mb-4">
                    Our curriculum is organized into six foundational pillars, each building upon the last to create a comprehensive understanding of addiction and family recovery.
                  </p>
                  {/* Quick-jump strip */}
                  <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
                    {pillars.map((pillar) => (
                      <button
                        type="button"
                        key={pillar.id}
                        onClick={() => {
                          setOpenPillar(openPillar === pillar.id ? undefined : pillar.id);
                          setTimeout(() => {
                            document.getElementById(pillar.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 80);
                        }}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                          openPillar === pillar.id
                            ? "bg-logo-blue text-white border-logo-blue"
                            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                        }`}
                      >
                        <span className="font-bold">{pillar.number}</span>
                        <span className="hidden sm:inline">{pillar.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Accordion type="single" collapsible value={openPillar} onValueChange={setOpenPillar} className="space-y-4">
                  {pillars.map((pillar) => (
                    <AccordionItem
                      key={pillar.id}
                      id={pillar.id}
                      value={pillar.id}
                      className={`border-2 ${c(pillar.color).borderHeavy} rounded-lg overflow-hidden ${c(pillar.color).bgGradient}`}
                    >
                      <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-3 sm:gap-4 text-left min-w-0">
                          <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full ${c(pillar.color).bg} flex items-center justify-center`}>
                            <span className={`text-base sm:text-lg font-bold ${c(pillar.color).iconText}`}>{pillar.number}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <pillar.icon className={`hidden sm:block h-5 w-5 flex-shrink-0 ${c(pillar.color).iconText}`} />
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">{pillar.title}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{pillar.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 sm:px-6 pb-6">
                        <p className="text-muted-foreground mb-4">{pillar.description}</p>

                        {pillar.subcategories ? (
                          <div className="space-y-4">
                            {pillar.subcategories.map((sub) => (
                              <div key={sub.name}>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                  {sub.name}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {sub.resources.map((resource) => pillarButton(resource, resource.path))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {pillar.resources?.map((resource) => pillarButton(resource, resource.path))}
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
                <div id="meditations" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Headphones className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-logo-blue">{meditations.length} Guided Meditations</h3>
                      <p className="text-sm text-muted-foreground">Audio to help you stay grounded. Mark one as listened when you're done.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {meditations.map((meditation) => {
                      const path = meditationPath(meditation.file);
                      return (
                        <Card key={meditation.file} className={`overflow-hidden border-2 ${c(meditation.color).borderHeavy} hover:shadow-lg transition-shadow`}>
                          <CardHeader className={`${c(meditation.color).bgGradient} py-3`}>
                            <div className="flex items-center justify-between gap-2">
                              <CardTitle className={`text-sm font-medium ${c(meditation.color).text}`}>
                                {meditation.title}
                              </CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={`gap-1 shrink-0 ${c(meditation.color).iconText}`}
                                onClick={async () => {
                                  const url = path;
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
                          <CardContent className="pt-3 pb-4 space-y-3">
                            <audio
                              controls
                              preload="none"
                              className="w-full h-10"
                              onEnded={() => {
                                if (!isCompleted(path)) void markCompleted(meditation.title, path, "meditation");
                              }}
                            >
                              <source src={path} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                            <DoneToggle title={meditation.title} path={path} type="meditation" label="Mark as listened" doneLabel="Listened" />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* AI Tools Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-logo-blue">AI Tools</h3>
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
        </main>
      </div>
    </>
  );
}
