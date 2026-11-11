import { Link, useLocation } from "react-router-dom";
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, Brain, Check, CheckCircle2, ChevronRight, Circle, ClipboardList,
  Compass, Download, FileText, Flag, Handshake, Headphones, Heart, Home, Lightbulb, ListChecks, NotebookPen,
  ScanSearch, Wind, type LucideIcon,
} from "lucide-react";
import GoogleTranslate from "@/components/GoogleTranslate";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HeroStat, IconTile, KindPill, MemberHero, MemberPage, Panel, SectionHeading, TONE, toneForKind, type Tone,
} from "@/components/member/MemberUI";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import SEOHead from "@/components/SEOHead";
import EducationProgressBar from "@/components/EducationProgressBar";
import MemberZoomBanner from "@/components/MemberZoomBanner";
import ExerciseGrid from "@/components/workbook/ExerciseGrid";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { useLearningPath } from "@/hooks/useLearningPath";
import { savedTools } from "@/data/savedTools";
import { useToast } from "@/hooks/use-toast";
import {
  guidedExercises, LIBRARY_TYPE_TOTALS, meditationPath,
  meditations, pillars, type PillarResource,
} from "@/data/memberLibrary";

// The workbook build owns ExerciseGrid; typed here so this page compiles before
// and after its `limit` prop lands.

// Each pillar keeps its own colour (from the library registry), drawn with the
// member area's tones. The registry's "emerald" is the brand navy on this site.
const PILLAR_TONES: Record<string, Tone> = {
  emerald: "navy",
  rose: "rose",
  violet: "violet",
  blue: "sky",
  amber: "amber",
  teal: "teal",
};
const pillarTone = (color: string): Tone => PILLAR_TONES[color] ?? "navy";

/** A picture for each plan, check-in and checklist. */
const TOOL_ICONS: Record<string, LucideIcon> = {
  "tool:family-action-plan": ClipboardList,
  "tool:readiness-checklist": ListChecks,
  "tool:relapse-warning-signs": Activity,
  "tool:aftercare-checklist": Home,
  "tool:treatment-red-flags": Flag,
  "tool:family-advocacy-toolkit": Handshake,
  "tool:fear-inventory": ScanSearch,
  "tool:emotional-regulation": Wind,
};

// One segment of the tab bar: icon above the label on phones, side by side from sm up.
const TAB_TRIGGER =
  "flex h-full min-h-12 flex-col items-center justify-center gap-1 whitespace-normal rounded-xl px-1.5 py-1.5 text-foreground/75 transition-colors data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground data-[state=active]:bg-[#16294a] data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:bg-sky-300 dark:data-[state=active]:text-slate-900 motion-reduce:transition-none sm:flex-row sm:gap-2.5 sm:px-3";
const TAB_LABEL = "block text-xs font-semibold leading-tight sm:text-sm";
const TAB_HINT = "hidden text-xs font-normal leading-tight opacity-80 sm:block";

// A resource inside a pillar: a comfortable row, at least 44px tall.
const RESOURCE_ROW =
  "group flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm font-medium leading-snug text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";

// A link inside a sentence, with a 44px tall tap area that does not move the text.
const INLINE_LINK =
  "relative inline-block rounded font-semibold text-primary underline underline-offset-4 after:absolute after:inset-x-0 after:-inset-y-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Which tab holds an element id linked as /family-education#<id>. */
function tabForHash(hash: string): string | null {
  if (!hash) return null;
  if (hash.startsWith("meditation")) return "wellness";
  if (hash.startsWith("pillar-")) return "pillars";
  return "tools";
}

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
      className="h-auto min-h-11 shrink-0 gap-1.5 self-start rounded-xl"
    >
      {done ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Circle className="h-4 w-4" />}
      {done ? doneLabel : label}
    </Button>
  );
}

/** One slim line: the member's path and the next step, or a prompt to choose one. */
function YourPathStrip() {
  const { loading, track, currentStepNumber, totalSteps, nextStep } = useLearningPath();
  if (loading) return null;

  if (!track) {
    return (
      <Panel tone="amber" className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <IconTile icon={Compass} tone="amber" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Choose your path</p>
              <p className="text-sm leading-relaxed text-muted-foreground">Pick one short, ordered path so you always know what to read next.</p>
            </div>
          </div>
          <Button asChild className="min-h-11 shrink-0 gap-1.5 rounded-xl">
            <Link to="/family-education/tracks">
              Choose a path
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel tone="amber" className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <IconTile icon={Compass} tone="amber" />
          <p className="min-w-0 text-sm leading-relaxed text-foreground">
            <span className="font-semibold">Your path: {track.title}</span>
            <span className="text-muted-foreground">
              {nextStep ? ` · Step ${currentStepNumber} of ${totalSteps}: ${nextStep.title}` : " · Finished"}
            </span>
          </p>
        </div>
        <Button asChild className="min-h-11 shrink-0 gap-1.5 rounded-xl">
          <Link to={nextStep ? nextStep.path : "/family-education/tracks"}>
            {nextStep ? "Continue" : "Choose another path"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}

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

  // Links like /workbook/hard-moment-practice: open the right tab, then
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

  // No membership wall here: this page only renders inside SubscriberRoute,
  // which has already let the visitor in (a member, or staff). A second check
  // here used to flash a "Members Only" card at members while it loaded, and
  // lock out admins and moderators.


  const pillarButton = (resource: PillarResource, key: string | number, tone: Tone) => {
    const progressPath = resource.path;
    const done = isCompleted(progressPath);
    const Icon = done ? CheckCircle2 : resource.isAnchor ? Brain : FileText;
    const rowClass = `${RESOURCE_ROW} ${
      done ? "border-green-200 bg-green-50/60 dark:border-green-400/25 dark:bg-green-400/[0.06]" : "border-border/70 bg-card"
    }`;
    const inner = (
      <>
        <Icon
          className={`h-4 w-4 shrink-0 ${done ? "text-green-600 dark:text-green-400" : TONE[tone].text}`}
          aria-label={done ? "Done" : undefined}
          aria-hidden={done ? undefined : true}
        />
        <span className="min-w-0 flex-1">{resource.title}</span>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
          aria-hidden="true"
        />
      </>
    );
    if (resource.isAnchor) {
      return (
        <a
          key={key}
          href={resource.path}
          className={rowClass}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("tools");
            setTimeout(() => {
              document.getElementById(resource.path.replace(/^#/, ""))?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link key={key} to={resource.path} className={rowClass}>
        {inner}
      </Link>
    );
  };

  return (
    <>
      <SEOHead
        title="Family Education Resources | Sober Helpline"
        description="Comprehensive educational resources for families supporting loved ones through addiction and recovery. Interactive tools, guides, and meditations."
      />

      <MemberPage>
        <main className="container mx-auto max-w-5xl space-y-5 px-4 py-6 sm:py-10">
          {/* Header */}
          <MemberHero
            eyebrow="Education Center"
            title="Family Education Center"
            subtitle={
              <>
                {LIBRARY_TYPE_TOTALS.guide} guides, {LIBRARY_TYPE_TOTALS.worksheet} worksheets and exercises,{" "}
                {LIBRARY_TYPE_TOTALS.meditation} guided meditations. Take your time: healing happens
                gradually, not overnight.
              </>
            }
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              <HeroStat icon={BookOpen} label="Guides" value={LIBRARY_TYPE_TOTALS.guide} />
              <HeroStat icon={NotebookPen} label="Tools and exercises" value={LIBRARY_TYPE_TOTALS.worksheet} />
              <HeroStat icon={Headphones} label="Meditations" value={LIBRARY_TYPE_TOTALS.meditation} />
            </div>
          </MemberHero>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {/* One compact crisis line */}
            <p
              className={`flex flex-1 items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm leading-relaxed text-foreground/80 print:border-0 print:bg-transparent print:px-0 ${TONE.amber.border} ${TONE.amber.soft}`}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
              <span>
                Things escalating right now?{" "}
                <Link to="/family-consultation" className={INLINE_LINK}>
                  Book a Crisis Family Consult
                </Link>{" "}
                or call{" "}
                <a href="tel:+14582988008" className={INLINE_LINK}>
                  (458) 298-8008
                </a>
                .
              </span>
            </p>
            <div className="flex min-h-11 shrink-0 items-center gap-2 self-end rounded-full border border-border/70 bg-card px-3.5 py-1.5 shadow-sm shadow-slate-900/[0.04] sm:self-start">
              <GoogleTranslate />
            </div>
          </div>

          <MemberZoomBanner />

          <YourPathStrip />

          <EducationProgressBar />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid h-auto w-full grid-cols-3 items-stretch gap-1 rounded-2xl border border-border/70 bg-card p-1.5 shadow-sm shadow-slate-900/[0.04]">
              <TabsTrigger value="tools" className={TAB_TRIGGER}>
                <Lightbulb className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="min-w-0 max-w-full break-words text-center sm:text-left">
                  <span className={TAB_LABEL}>Interactive Tools</span>
                  <span className={TAB_HINT}>Exercises & Worksheets</span>
                </span>
              </TabsTrigger>

              <TabsTrigger value="pillars" className={TAB_TRIGGER}>
                <BookOpen className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="min-w-0 max-w-full break-words text-center sm:text-left">
                  <span className={TAB_LABEL}>Six Pillars</span>
                  <span className={TAB_HINT}>{LIBRARY_TYPE_TOTALS.guide} Educational Guides</span>
                </span>
              </TabsTrigger>

              <TabsTrigger value="wellness" className={TAB_TRIGGER}>
                <Heart className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="min-w-0 max-w-full break-words text-center sm:text-left">
                  <span className={TAB_LABEL}>Wellness</span>
                  <span className={TAB_HINT}>Meditations &amp; Self-Care</span>
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Interactive Tools Tab */}
            <TabsContent value="tools" className="mt-6 space-y-10 animate-fade-in motion-reduce:animate-none">
              {/* Short guided exercises first */}
              <section aria-labelledby="short-exercises-heading" className="space-y-4">
                <SectionHeading
                  id="short-exercises-heading"
                  icon={NotebookPen}
                  tone="emerald"
                  title="Short guided exercises (5 minutes)"
                  description={`${guidedExercises.length} short, private exercises. What you write is saved to your workbook.`}
                  action={{ to: "/workbook", label: "Open your workbook" }}
                />
                <ExerciseGrid />
              </section>

              {/* Plans, check-ins and checklists (each has its own page and saves as she fills it in) */}
              <section aria-labelledby="saved-tools-heading" className="space-y-4">
                <SectionHeading
                  id="saved-tools-heading"
                  icon={FileText}
                  tone="violet"
                  title="Plans, check-ins and checklists"
                  description="Fill these in at your own pace. They save automatically, and you can print them."
                />
                <div className="grid gap-3 md:grid-cols-2">
                  {savedTools.map((tool) => {
                    const done = isCompleted(tool.path);
                    const tone = toneForKind(tool.kind);
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="group flex h-full items-start gap-3.5 rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-slate-900/[0.04] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none sm:p-5"
                      >
                        <IconTile icon={TOOL_ICONS[tool.key] ?? FileText} tone={tone} size="lg" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <KindPill tone={tone}>{tool.kind}</KindPill>
                            {done && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-300">
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Done
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground group-hover:underline">{tool.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tool.summary}</p>
                        </div>
                        <ArrowRight
                          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>
            </TabsContent>

            {/* Six Pillars Tab */}
            <TabsContent value="pillars" className="mt-6 space-y-5 animate-fade-in motion-reduce:animate-none">
              <SectionHeading
                icon={BookOpen}
                tone="sky"
                title="Six Pillars"
                description="Our curriculum is organized into six foundational pillars, each building upon the last to create a comprehensive understanding of addiction and family recovery."
              />
              {/* Quick-jump strip */}
              <div className="flex flex-wrap gap-2">
                {pillars.map((pillar) => (
                  <button
                    type="button"
                    key={pillar.id}
                    aria-pressed={openPillar === pillar.id}
                    onClick={() => {
                      setOpenPillar(openPillar === pillar.id ? undefined : pillar.id);
                      setTimeout(() => {
                        document.getElementById(pillar.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 80);
                    }}
                    className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none ${
                      openPillar === pillar.id
                        ? "border-[#16294a] bg-[#16294a] text-white shadow-sm dark:border-sky-300 dark:bg-sky-300 dark:text-slate-900"
                        : "border-border bg-card text-foreground/80 hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <span className="font-bold">{pillar.number}</span>
                    <span className="sr-only sm:not-sr-only">{pillar.title}</span>
                  </button>
                ))}
              </div>

              <Accordion type="single" collapsible value={openPillar} onValueChange={setOpenPillar} className="space-y-4">
                {pillars.map((pillar) => {
                  const tone = pillarTone(pillar.color);
                  const all = pillar.resources ?? pillar.subcategories?.flatMap((sub) => sub.resources) ?? [];
                  const doneCount = all.filter((resource) => isCompleted(resource.path)).length;
                  const allDone = all.length > 0 && doneCount === all.length;
                  return (
                    <AccordionItem key={pillar.id} id={pillar.id} value={pillar.id} className="scroll-mt-24 border-b-0">
                      <Panel tone={openPillar === pillar.id ? tone : undefined} className="overflow-hidden p-0 sm:p-0">
                        <AccordionTrigger className="gap-3 rounded-2xl px-4 py-4 text-left hover:bg-muted/40 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6">
                          <span className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                            <IconTile icon={pillar.icon} tone={tone} size="lg" />
                            <span className="min-w-0">
                              <span className={`block text-xs font-semibold uppercase tracking-[0.12em] ${TONE[tone].text}`}>
                                Pillar {pillar.number}
                              </span>
                              <span className="block text-base font-semibold leading-snug text-foreground sm:text-lg">{pillar.title}</span>
                              <span className="block text-sm font-normal leading-snug text-muted-foreground">{pillar.subtitle}</span>
                              <span
                                className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
                                  allDone
                                    ? "bg-green-100 text-green-700 dark:bg-green-400/15 dark:text-green-300"
                                    : "bg-muted text-foreground/75"
                                }`}
                              >
                                {allDone && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                                {doneCount} of {all.length} done
                              </span>
                            </span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-5 sm:px-6 sm:pb-6">
                          <p className="mb-4 leading-relaxed text-muted-foreground">{pillar.description}</p>

                          {pillar.subcategories ? (
                            <div className="space-y-5">
                              {pillar.subcategories.map((sub) => (
                                <div key={sub.name}>
                                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    {sub.name}
                                  </h4>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {sub.resources.map((resource) => pillarButton(resource, resource.path, tone))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {pillar.resources?.map((resource) => pillarButton(resource, resource.path, tone))}
                            </div>
                          )}
                        </AccordionContent>
                      </Panel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabsContent>

            {/* Wellness Tab */}
            <TabsContent value="wellness" className="mt-6 space-y-8 animate-fade-in motion-reduce:animate-none">
              {/* Guided Meditations */}
              <div id="meditations" className="scroll-mt-24 space-y-4">
                <SectionHeading
                  icon={Headphones}
                  tone="violet"
                  title={`${meditations.length} Guided Meditations`}
                  description="Audio to help you stay grounded. Mark one as listened when you're done."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {meditations.map((meditation) => {
                    const path = meditationPath(meditation.file);
                    return (
                      <div
                        key={meditation.file}
                        className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-slate-900/[0.04] sm:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <IconTile icon={Headphones} tone="violet" />
                          <h3 className="min-w-0 flex-1 self-center text-base font-semibold leading-snug text-foreground">
                            {meditation.title}
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-11 w-11 shrink-0 rounded-xl p-0 text-muted-foreground hover:text-foreground"
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
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </MemberPage>
    </>
  );
}
