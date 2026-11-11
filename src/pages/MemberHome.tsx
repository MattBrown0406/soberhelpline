import { useEffect, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, CheckCircle2, Circle, Compass, CreditCard, ExternalLink, FileText,
  Loader2, Mail, MessageCircle, NotebookPen, PlayCircle, RotateCcw, Users, Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Card className={meeting.isLive ? "border-emerald-500/40 bg-emerald-500/5" : undefined}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Video className="h-4 w-4 text-primary" />
          This week
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          {meeting.isLive ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Live now</Badge>
              <span className="font-semibold text-foreground">The Family Squares is on until 8:00 PM Pacific</span>
            </div>
          ) : (
            <>
              <p className="font-semibold text-foreground">
                The Family Squares: {meeting.isToday ? "tonight" : formatMeetingDay(meeting.start)}, 7:00–8:00 PM Pacific
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Starts {formatTimeUntil(meeting.msUntilStart)}
                {meeting.viewerInOtherZone && ` (${formatViewerTime(meeting.start)} your time)`}.
              </p>
            </>
          )}
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
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
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
      </CardContent>
    </Card>
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" />
          Your path
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : !track || changing ? (
          <PathPicker onCancel={track ? () => setChanging(false) : undefined} />
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-lg font-semibold text-foreground">{track.title}</p>
                <p className="text-sm text-muted-foreground tabular-nums">
                  {isFinished ? `All ${totalSteps} steps done` : `Step ${currentStepNumber} of ${totalSteps}`}
                </p>
              </div>
              <Progress
                value={totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0}
                className="h-2 mt-2"
                aria-label={`${completedCount} of ${totalSteps} steps done`}
              />
            </div>

            {nextStep ? (
              <Button
                asChild
                size="lg"
                className="h-auto min-h-11 w-full gap-2 whitespace-normal px-4 py-2.5 text-left sm:w-auto sm:px-8"
              >
                <Link to={nextStep.path}>
                  <span>
                    {nextStep.started ? "Continue: " : "Next: "}
                    {nextStep.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-foreground">
                You've finished this path. Well done taking it step by step. When you're ready, choose another one.
              </p>
            )}

            <ol className="space-y-1">
              {steps.map((s) => (
                <li key={`${s.path}-${s.index}`}>
                  <Link
                    to={s.path}
                    className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50 ${nextStep && s.index === nextStep.index ? "bg-primary/5 font-medium" : ""}`}
                  >
                    {s.completed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Done" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-label="Not done yet" />
                    )}
                    <span className={s.completed ? "text-muted-foreground" : "text-foreground"}>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ol>

            <Button variant="ghost" size="sm" className="px-2" onClick={() => setChanging(true)}>
              Change path
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Continue where you left off
// ─────────────────────────────────────────────────────────────

interface ContinueItem {
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-primary" />
          Continue where you left off
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.slice(0, 6).map(({ key, to, title, detail, badge, icon: Icon }) => (
          <Link
            key={key}
            to={to}
            className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">{title}</span>
                <span className="block text-xs text-muted-foreground">{detail}</span>
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

const quickLinks = [
  { to: "/family-education", icon: BookOpen, label: "Education Center" },
  { to: "/workbook", icon: NotebookPen, label: "Workbook" },
  { to: "/zoom-recordings", icon: Video, label: "Recordings" },
  { to: "/member-qa", icon: MessageCircle, label: "Q&A" },
  { to: "/family-forum", icon: Users, label: "Forum" },
  { to: "/member-billing", icon: CreditCard, label: "Billing" },
];

export default function MemberHome() {
  const { userId } = useEducationProgress();
  const [firstName, setFirstName] = useState<string | null>(null);

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
          <header>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </h1>
            <p className="text-muted-foreground mt-1">One step at a time. Here's your week.</p>
          </header>

          <ThisWeekCard />
          <YourPathCard />
          <ContinueCard userId={userId} />

          <section aria-labelledby="exercises-heading" className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="exercises-heading" className="text-base font-semibold text-foreground">
                Short guided exercises
              </h2>
              <Link to="/workbook" className="text-sm text-primary hover:underline">
                See all
              </Link>
            </div>
            <ExerciseGrid limit={3} />
          </section>

          <EducationProgressBar />

          <nav aria-label="Member pages" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {quickLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                {label}
              </Link>
            ))}
          </nav>

          <section id="email-settings" aria-labelledby="email-settings-heading" className="scroll-mt-24 space-y-3">
            <h2 id="email-settings-heading" className="text-base font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email settings
            </h2>
            <NotificationSettings />
          </section>
        </div>
      </div>
    </>
  );
}
