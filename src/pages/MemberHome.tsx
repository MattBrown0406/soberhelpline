import { useEffect, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, CalendarDays, Check, Compass, CreditCard, ExternalLink, FileText,
  Loader2, MessageCircle, NotebookPen, PlayCircle, RotateCcw, Users, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeroStat, IconTile, KindPill, MemberHero, MemberPage, Panel, ProgressRing, SectionHeading, toneForKind, type Tone,
} from "@/components/member/MemberUI";
import SEOHead from "@/components/SEOHead";
import EducationProgressBar from "@/components/EducationProgressBar";
import NotificationSettings from "@/components/NotificationSettings";
import ExerciseGrid from "@/components/workbook/ExerciseGrid";
import { ASK_MONDAY_QUESTION_HREF, fetchMemberJoinUrl } from "@/components/MemberZoomBanner";
import { describeSavedKey } from "@/data/savedTools";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { MEMBER_TRACKS, useLearningPath } from "@/hooks/useLearningPath";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import {
  exercisePath, findLibraryItem, formatMeetingDay,
  formatTimeUntil, formatViewerTime, getMondayMeeting, guidedExercises,
} from "@/data/memberLibrary";

// The member front door: this week's meeting, her learning path, where she left
// off, a few short exercises, quick links and email settings.

// The workbook build owns ExerciseGrid; typed here so this page compiles before
// and after its `limit` prop lands.

const RETAKE_AFTER_DAYS = 30;

interface RecordingRow {
  id: string;
  title: string;
  recording_date: string;
}

interface WorksheetRow {
  worksheet_key: string;
  updated_at: string;
}

interface WorkbookRow {
  exercise_id: string;
  completed_at: string;
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins < 60) return mins <= 1 ? "just now" : `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

function formatRecordingDate(date: string): string {
  // recording_date is a calendar date (YYYY-MM-DD): format it without shifting zones.
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric" });
}

// ─────────────────────────────────────────────────────────────
// This week
// ─────────────────────────────────────────────────────────────

function ThisWeekCard() {
  const [meeting, setMeeting] = useState(() => getMondayMeeting());
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState<RecordingRow | null>(null);
  const [answeredCount, setAnsweredCount] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setMeeting(getMondayMeeting()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchMemberJoinUrl().then((url) => {
      if (!cancelled) setJoinUrl(url);
    });
    (async () => {
      const { data } = await supabase
        .from("zoom_call_recordings")
        .select("id, title, recording_date")
        .eq("is_published", true)
        .order("recording_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;
      const rec = data as RecordingRow;
      setRecording(rec);
      const { count } = await supabase
        .from("meeting_qa_archive")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true)
        .eq("meeting_date", rec.recording_date.slice(0, 10));
      if (!cancelled) setAnsweredCount(count ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // The meeting day as a calendar tile (Pacific time, like the meeting itself).
  const tileParts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "short", day: "numeric", month: "short" })
    .formatToParts(meeting.start)
    .reduce<Record<string, string>>((acc, part) => ({ ...acc, [part.type]: part.value }), {});

  return (
    <Panel tone={meeting.isLive ? "emerald" : undefined} className={meeting.isLive ? "bg-emerald-50/60 dark:bg-emerald-400/[0.06]" : undefined}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="flex w-16 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#16294a]/15 bg-card text-center shadow-sm dark:border-sky-400/25"
          >
            <span className="bg-[#16294a] py-1 text-[11px] font-semibold uppercase tracking-wider text-white dark:bg-sky-400/25">
              {tileParts.weekday ?? "Mon"}
            </span>
            <span className="py-1 text-2xl font-bold leading-tight text-foreground">{tileParts.day ?? ""}</span>
            <span className="pb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{tileParts.month ?? ""}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">This week</p>
            {meeting.isLive ? (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-white motion-reduce:animate-none" aria-hidden="true" />
                  Live now
                </Badge>
                <span className="text-lg font-semibold leading-snug text-foreground">The Family Squares is on until 8:00 PM Pacific</span>
              </div>
            ) : (
              <>
                <p className="mt-0.5 text-lg font-semibold leading-snug text-foreground">
                  The Family Squares: {meeting.isToday ? "tonight" : formatMeetingDay(meeting.start)}, 7:00–8:00 PM Pacific
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center rounded-full bg-[#16294a]/[0.07] px-2.5 py-0.5 font-medium text-[#16294a] dark:bg-sky-400/15 dark:text-sky-200">
                    Starts {formatTimeUntil(meeting.msUntilStart)}
                  </span>
                  {meeting.viewerInOtherZone && <span>{formatViewerTime(meeting.start)} your time</span>}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {joinUrl ? (
            <Button asChild variant={meeting.isLive || meeting.isToday ? "default" : "outline"} className="gap-2">
              <Link to={joinUrl}>
                <ExternalLink className="h-4 w-4" />
                {meeting.isLive ? "Join now" : "Join the meeting"}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="gap-2">
              <Link to="/family-squares">
                <Video className="h-4 w-4" />
                About the meeting
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="gap-2">
            <Link to={ASK_MONDAY_QUESTION_HREF}>
              <MessageCircle className="h-4 w-4" />
              Ask a question for Monday
            </Link>
          </Button>
        </div>

        {recording && (
          <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5 text-sm">
            <p className="text-muted-foreground">Last meeting, {formatRecordingDate(recording.recording_date)}</p>
            <p className="font-medium text-foreground">{recording.title}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/zoom-recordings" className="inline-flex items-center gap-1 text-primary hover:underline">
                <PlayCircle className="h-4 w-4" />
                Watch the recording
              </Link>
              {answeredCount !== null && answeredCount > 0 && (
                <Link to="/member-qa" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <MessageCircle className="h-4 w-4" />
                  {answeredCount === 1 ? "1 question answered" : `${answeredCount} questions answered`}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────
// Your path
// ─────────────────────────────────────────────────────────────

function PathPicker({ onCancel }: { onCancel?: () => void }) {
  const { toast } = useToast();
  const { setPath, trackId } = useLearningPath();
  const [choosing, setChoosing] = useState<string | null>(null);

  const choose = async (id: string) => {
    setChoosing(id);
    const ok = await setPath(id);
    setChoosing(null);
    if (!ok) {
      toast({ title: "That didn't save", description: "Please try again in a moment.", variant: "destructive" });
      return;
    }
    onCancel?.();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pick the one closest to what your family is facing now. Each is a short set of guides and exercises, in order.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {MEMBER_TRACKS.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => choose(t.id)}
            disabled={choosing !== null}
            className={`text-left rounded-lg border p-3 transition-colors hover:border-primary/50 hover:bg-muted/40 disabled:opacity-60 ${t.id === trackId ? "border-primary/60 bg-primary/5" : "border-border"}`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground">{t.title}</span>
              {choosing === t.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-xs text-muted-foreground shrink-0">{t.steps.length} steps</span>
              )}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">{t.summary}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link to="/onboarding-quiz">
            <Compass className="h-4 w-4" />
            Help me choose
          </Link>
        </Button>
        <Link to="/family-education/tracks" className="text-sm text-primary hover:underline">
          See every path in detail
        </Link>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Keep my current path
          </Button>
        )}
      </div>
    </div>
  );
}

function YourPathCard() {
  const { loading, track, steps, completedCount, totalSteps, currentStepNumber, nextStep, isFinished } = useLearningPath();
  const [changing, setChanging] = useState(false);

  const pct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <Panel>
      <div className="mb-4 flex items-center gap-3">
        <IconTile icon={Compass} tone="amber" />
        <h2 className="text-lg font-semibold text-foreground">Your path</h2>
      </div>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !track || changing ? (
        <PathPicker onCancel={track ? () => setChanging(false) : undefined} />
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <ProgressRing value={pct} tone="amber" label={`${completedCount} of ${totalSteps} steps done`}>
              <span className="text-lg font-bold tabular-nums text-foreground">{completedCount}</span>
              <span className="text-[11px] text-muted-foreground">of {totalSteps}</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="text-xl font-semibold leading-snug text-foreground">{track.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {isFinished ? `All ${totalSteps} steps done` : `Step ${currentStepNumber} of ${totalSteps}`}
              </p>
            </div>
          </div>

          {nextStep ? (
            <Button
              asChild
              size="lg"
              className="h-auto min-h-12 w-full gap-2 whitespace-normal rounded-xl px-4 py-3 text-left shadow-md shadow-[#16294a]/15 sm:w-auto sm:px-6"
            >
              <Link to={nextStep.path}>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                    {nextStep.started ? "Continue" : "Next step"}
                  </span>
                  <span className="block text-base font-semibold leading-snug">{nextStep.title}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </Button>
          ) : (
            <p className="rounded-xl bg-green-50 p-4 text-sm text-green-900 dark:bg-green-400/10 dark:text-green-100">
              You've finished this path. Well done taking it step by step. When you're ready, choose another one.
            </p>
          )}

          {/* The steps as a line she can follow: done, here now, still ahead. */}
          <ol className="relative ml-1">
            {steps.map((s, i) => {
              const isNext = !!nextStep && s.index === nextStep.index;
              const last = i === steps.length - 1;
              return (
                <li key={`${s.path}-${s.index}`} className="relative pl-9">
                  {!last && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-0.5 ${s.completed ? "bg-green-500" : "bg-border"}`}
                    />
                  )}
                  <span
                    className={`absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      s.completed
                        ? "bg-green-600 text-white"
                        : isNext
                          ? "bg-[#16294a] text-white ring-4 ring-[#16294a]/15 dark:bg-sky-300 dark:text-slate-900 dark:ring-sky-300/20"
                          : "border-2 border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {s.completed ? <Check className="h-3.5 w-3.5" aria-label="Done" /> : <span aria-hidden="true">{i + 1}</span>}
                    {!s.completed && <span className="sr-only">{isNext ? "You are here" : "Not done yet"}</span>}
                  </span>
                  <Link
                    to={s.path}
                    className={`block min-h-10 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isNext ? "font-semibold text-foreground" : s.completed ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ol>

          <Button variant="ghost" size="sm" className="min-h-10 px-2 text-muted-foreground" onClick={() => setChanging(true)}>
            Change path
          </Button>
        </div>
      )}
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────
// Continue where you left off
// ─────────────────────────────────────────────────────────────

interface ContinueItem {
  /** Colour of the icon tile (by kind of thing). */
  tone?: Tone;
  key: string;
  to: string;
  title: string;
  detail: string;
  badge?: string;
  icon: ComponentType<{ className?: string }>;
}

function ContinueCard({ userId }: { userId: string | null }) {
  const { getLastInProgress, isCompleted, loading: progressLoading } = useEducationProgress();
  const { nextStep } = useLearningPath();
  const [worksheets, setWorksheets] = useState<WorksheetRow[]>([]);
  const [workbook, setWorkbook] = useState<WorkbookRow[]>([]);
  const [bookmarks, setBookmarks] = useState<{ resource_path: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const [ws, wb, bm] = await Promise.all([
        supabase
          .from("worksheet_responses")
          .select("worksheet_key, updated_at")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false }),
        untypedSupabase
          .from("workbook_entries")
          .select("exercise_id, completed_at")
          .eq("user_id", userId)
          .order("completed_at", { ascending: false })
          .limit(200),
        supabase
          .from("education_bookmarks")
          .select("resource_path, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      if (cancelled) return;
      setWorksheets(!ws.error && ws.data ? (ws.data as WorksheetRow[]) : []);
      setWorkbook(!wb.error && wb.data ? (wb.data as WorkbookRow[]) : []);
      setBookmarks(!bm.error && bm.data ? bm.data : []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading || progressLoading) return null;

  const items: ContinueItem[] = [];

  const last = getLastInProgress();
  if (last && last.resource_path !== nextStep?.path && !last.resource_path.startsWith("/workbook/")) {
    const lib = findLibraryItem(last.resource_path);
    if (lib && !lib.path.includes("#") && !lib.path.startsWith("/audio/")) {
      items.push({
        key: `progress-${lib.path}`,
        to: lib.path,
        title: lib.title,
        detail: last.updated_at ? `Opened ${relativeDate(last.updated_at)}` : "Started",
        icon: BookOpen,
      });
    }
  }

  // Guides she saved for later (the "Save" button on a guide), until she finishes them.
  let savedShown = 0;
  for (const row of bookmarks) {
    const lib = findLibraryItem(row.resource_path);
    if (!lib || isCompleted(lib.path) || lib.path === nextStep?.path) continue;
    if (items.some((item) => item.to === lib.path)) continue;
    if (++savedShown > 3) break;
    items.push({
      key: `bookmark-${lib.path}`,
      to: lib.path,
      title: lib.title,
      detail: `Saved for later ${relativeDate(row.created_at)}`,
      badge: "Saved",
      icon: BookOpen,
    });
  }

  // Saved plans, check-ins and guide notes (most recent first; a few notes at most).
  let notesShown = 0;
  for (const row of worksheets) {
    const info = describeSavedKey(row.worksheet_key);
    if (!info) continue;
    if (info.kind === "Notes" && ++notesShown > 2) continue;
    items.push({
      key: `saved-${row.worksheet_key}`,
      to: info.path,
      title: info.title,
      detail: `Saved ${relativeDate(row.updated_at)}`,
      badge: info.kind,
      icon: FileText,
    });
  }

  const latestByExercise = new Map<string, WorkbookRow>();
  for (const row of workbook) {
    if (!latestByExercise.has(row.exercise_id)) latestByExercise.set(row.exercise_id, row);
  }
  for (const row of latestByExercise.values()) {
    const ex = guidedExercises.find((e) => e.id === row.exercise_id);
    if (!ex) continue;
    const ageDays = (Date.now() - new Date(row.completed_at).getTime()) / 86_400_000;
    items.push({
      key: `wb-${ex.id}`,
      to: exercisePath(ex.id),
      title: ex.title,
      detail: `Done ${relativeDate(row.completed_at)}`,
      badge: ageDays > RETAKE_AFTER_DAYS ? "Retake available" : undefined,
      icon: ageDays > RETAKE_AFTER_DAYS ? RotateCcw : NotebookPen,
    });
  }

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="continue-heading" className="space-y-3">
      <SectionHeading id="continue-heading" icon={RotateCcw} tone="sky" title="Continue where you left off" />
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {items.slice(0, 6).map(({ key, to, title, detail, badge, icon }) => {
          const tone = toneForKind(badge === "Retake available" ? "Exercise" : badge ?? (to.startsWith("/workbook/") ? "Exercise" : "Guide"));
          return (
            <li key={key}>
              <Link
                to={to}
                className="group flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm shadow-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
              >
                <IconTile icon={icon} tone={tone} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-snug text-foreground">{title}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {detail}
                    {badge && <KindPill tone={tone}>{badge}</KindPill>}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

const quickLinks: { to: string; icon: ComponentType<{ className?: string }>; label: string; hint: string; tone: Tone }[] = [
  { to: "/family-education", icon: BookOpen, label: "Education Center", hint: "Guides, tools, meditations", tone: "sky" },
  { to: "/workbook", icon: NotebookPen, label: "My Workbook", hint: "Exercises and saved plans", tone: "emerald" },
  { to: "/family-forum", icon: Users, label: "Forum", hint: "Families who get it", tone: "violet" },
  { to: "/zoom-recordings", icon: Video, label: "Recordings", hint: "Past Monday meetings", tone: "navy" },
  { to: "/member-qa", icon: MessageCircle, label: "Q&A", hint: "Questions Matt answered", tone: "teal" },
  { to: "/member-billing", icon: CreditCard, label: "Billing", hint: "Your membership", tone: "amber" },
];

export default function MemberHome() {
  const { userId, loading: progressLoading, getStats } = useEducationProgress();
  const { track, currentStepNumber, totalSteps, isFinished } = useLearningPath();
  const [firstName, setFirstName] = useState<string | null>(null);
  const meeting = getMondayMeeting();
  const stats = progressLoading ? null : getStats();

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        const name = (data?.first_name ?? "").trim();
        if (!cancelled) setFirstName(name || null);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Links like /member-home#email-settings: scroll once the section exists.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <SEOHead
        title="Member Home | Sober Helpline"
        description="Your member home: this week's meeting, your learning path, and where you left off."
      />
      <MemberPage>
        <div className="container mx-auto max-w-3xl space-y-8 px-4 py-6 sm:py-10">
          <MemberHero
            eyebrow="Your family hub"
            title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            subtitle="One step at a time. Here's your week."
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              <HeroStat
                icon={CalendarDays}
                label="Next meeting"
                value={
                  meeting.isLive
                    ? "Live now"
                    : meeting.isToday
                      ? "Tonight, 7 PM PT"
                      : `${new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric" }).format(meeting.start)} · 7 PM PT`
                }
              />
              <HeroStat
                icon={Compass}
                label="Your path"
                value={!track ? "Choose a path" : isFinished ? "Path finished" : `Step ${currentStepNumber} of ${totalSteps}`}
              />
              <HeroStat
                icon={BookOpen}
                label="Library"
                value={stats ? `${stats.totalCompleted} of ${stats.totalResources} done` : "Guides and tools"}
                to="/family-education"
              />
            </div>
          </MemberHero>

          <ThisWeekCard />
          <YourPathCard />
          <ContinueCard userId={userId} />

          <section aria-labelledby="exercises-heading" className="space-y-3">
            <SectionHeading
              id="exercises-heading"
              icon={NotebookPen}
              tone="emerald"
              title="Short guided exercises"
              description="About five minutes each. What you write is saved to your workbook."
              action={{ to: "/workbook", label: "See all" }}
            />
            <ExerciseGrid limit={3} />
          </section>

          <section aria-labelledby="member-pages-heading" className="space-y-3">
            <h2 id="member-pages-heading" className="text-lg font-semibold text-foreground sm:text-xl">
              Everything in your membership
            </h2>
            <nav aria-label="Member pages" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {quickLinks.map(({ to, icon, label, hint, tone }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex min-h-16 items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm shadow-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
                >
                  <IconTile icon={icon} tone={tone} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug text-foreground">{label}</span>
                    <span className="hidden text-xs leading-snug text-muted-foreground sm:block">{hint}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </section>

          <EducationProgressBar />

          {/* The panel carries its own "Email settings" title. */}
          <section id="email-settings" aria-label="Email settings" className="scroll-mt-24">
            <NotificationSettings />
          </section>
        </div>
      </MemberPage>
    </>
  );
}
