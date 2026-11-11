import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookHeart, CheckCircle2, ChevronDown, ChevronUp, Copy, Loader2, NotebookPen, PenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HeroStat, IconTile, MemberHero, MemberPage, Panel, SectionHeading, TONE, toneForExercise } from "@/components/member/MemberUI";
import ExerciseCard from "@/components/workbook/ExerciseCard";
import { iconForExercise } from "@/components/workbook/exerciseIcons";
import OutputView from "@/components/workbook/OutputView";
import CompareView from "@/components/workbook/CompareView";
import SavedToolsList from "@/components/workbook/SavedToolsList";
import { useWorkbook, type WorkbookEntry } from "@/hooks/useWorkbook";
import { EXERCISES, exercisePath, getExercise, hasDraft, outputToText, shortDate } from "@/data/exercises";

const FIRST_EXERCISE_ID = "boundary-script";

export default function Workbook() {
  const { entries, latestByExercise, loading, error, userId, remove, reload } = useWorkbook();
  const [openId, setOpenId] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WorkbookEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const drafts = useMemo(
    () => (loading ? new Set<string>() : new Set(EXERCISES.filter((e) => hasDraft(userId, e.id)).map((e) => e.id))),
    [loading, userId],
  );

  /** For each entry, the next older entry of the same exercise (for compare). */
  const previousOf = useMemo(() => {
    const map: Record<string, WorkbookEntry | undefined> = {};
    const seen: Record<string, WorkbookEntry> = {};
    // entries are newest first: walk oldest first so "seen" is the older one.
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      map[e.id] = seen[e.exercise_id];
      seen[e.exercise_id] = e;
    }
    return map;
  }, [entries]);

  const first = getExercise(FIRST_EXERCISE_ID);
  // Hero chips: plain counts of what this page has already loaded.
  const doneCount = EXERCISES.filter((e) => latestByExercise[e.id]).length;

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const ok = await remove(pendingDelete.id);
    setDeleting(false);
    if (ok) {
      toast.success("Deleted from My Workbook.");
      if (openId === pendingDelete.id) setOpenId(null);
    } else {
      toast.error("We couldn't delete that just now. Please try again.");
    }
    setPendingDelete(null);
  };

  const copy = async (entry: WorkbookEntry) => {
    try {
      await navigator.clipboard.writeText(outputToText(entry.output, shortDate(entry.completed_at)));
      toast.success("Copied.");
    } catch {
      toast.error("Copying didn't work on this device. You can select the text and copy it instead.");
    }
  };

  return (
    <>
      <SEOHead
        title="My Workbook | Sober Helpline Members"
        description="Short guided exercises for families, and everything you've saved from them."
        noIndex
      />
      <MemberPage>
        <div className="mx-auto w-full max-w-4xl space-y-10 px-4 pb-16 pt-6 sm:pt-10">
          <MemberHero
            eyebrow="Exercises and saved plans"
            title="My Workbook"
            subtitle="Short guided exercises, about five minutes each, one question at a time. Each one ends with something you keep: a script, a plan, a check-in. Retake any of them after 30 days to see what has changed."
          >
            {!error && (loading || entries.length > 0) && (
              <div className="grid gap-2.5 sm:grid-cols-3">
                <HeroStat icon={CheckCircle2} label="Exercises done" value={loading ? "…" : `${doneCount} of ${EXERCISES.length}`} />
                <HeroStat icon={BookHeart} label="Saved results" value={loading ? "…" : entries.length} />
                {drafts.size > 0 && <HeroStat icon={PenLine} label="In progress" value={drafts.size} />}
              </div>
            )}
          </MemberHero>

          {!loading && !error && entries.length === 0 && first && (
            <Panel tone="emerald" className={TONE.emerald.soft}>
              <h2 className="text-lg font-semibold text-foreground">Your workbook is empty for now</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                A good place to start is “{first.title}.” It takes about {first.minutes} minutes, and you'll leave with a
                boundary in your own words and a calm line for when they push back. You can stop anytime.
              </p>
              <Button asChild size="lg" className="mt-4 h-auto min-h-12 whitespace-normal rounded-xl py-2.5 text-left">
                <Link to={exercisePath(first.id)}>Start “{first.title}”</Link>
              </Button>
            </Panel>
          )}

          <section aria-labelledby="wb-exercises" className="space-y-4">
            <SectionHeading id="wb-exercises" icon={NotebookPen} tone="emerald" title="Exercises" />
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {EXERCISES.map((e) => (
                <ExerciseCard
                  key={e.id}
                  exercise={e}
                  latest={loading ? undefined : latestByExercise[e.id]}
                  inProgress={drafts.has(e.id)}
                />
              ))}
            </div>
          </section>

          <SavedToolsList />

          <section aria-labelledby="wb-saved" className="space-y-4">
            <SectionHeading id="wb-saved" icon={BookHeart} tone="navy" title="Saved results" />

            {loading && (
              <div className="flex items-center gap-2 py-6 text-foreground/80" role="status">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Loading your saved results…
              </div>
            )}

            {!loading && error && (
              <Panel className="p-4 text-sm sm:p-5">
                <p className="text-foreground">{error}</p>
                <Button variant="outline" size="sm" className="mt-3 h-11 rounded-xl" onClick={() => void reload()}>
                  Try again
                </Button>
              </Panel>
            )}

            {!loading && !error && entries.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border bg-card/60 px-4 py-5 text-sm leading-relaxed text-foreground/80">
                When you finish an exercise, your result is saved here, newest first.
              </p>
            )}

            {!loading && entries.length > 0 && (
              <ul className="space-y-3">
                {entries.map((entry) => {
                  const ex = getExercise(entry.exercise_id);
                  const title = ex?.title ?? entry.output?.title ?? "Exercise";
                  const open = openId === entry.id;
                  const prev = previousOf[entry.id];
                  const comparing = compareId === entry.id && !!prev;
                  const scoreInfo = entry.output?.score;
                  const panelId = `wb-entry-${entry.id}`;
                  const tone = toneForExercise(entry.exercise_id);
                  return (
                    <li
                      key={entry.id}
                      className={`rounded-2xl border bg-card shadow-sm shadow-slate-900/[0.04] transition-shadow motion-reduce:transition-none ${open ? `shadow-md ${TONE[tone].border}` : "border-border/70 hover:shadow-md"}`}
                    >
                      <button
                        type="button"
                        className="flex min-h-16 w-full items-center gap-3 rounded-2xl p-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => {
                          setOpenId(open ? null : entry.id);
                          if (open) setCompareId(null);
                        }}
                      >
                        <IconTile icon={iconForExercise(entry.exercise_id)} tone={tone} />
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-snug text-foreground">{title}</span>
                          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground/80">
                              {shortDate(entry.completed_at)}
                            </span>
                            {typeof entry.score === "number" && scoreInfo
                              ? <span>{`${entry.score} of ${scoreInfo.max} · ${scoreInfo.band}`}</span>
                              : null}
                          </span>
                        </span>
                        {open ? (
                          <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        )}
                      </button>
                      {open && (
                        <div id={panelId} className="space-y-5 border-t border-border/70 px-3.5 pb-5 pt-4 sm:px-4">
                          {comparing && prev ? (
                            <CompareView
                              tone={tone}
                              previous={{ output: prev.output, score: prev.score, completedAt: prev.completed_at }}
                              current={{ output: entry.output, score: entry.score, completedAt: entry.completed_at }}
                            />
                          ) : (
                            <OutputView output={entry.output} hideTitle tone={tone} />
                          )}
                          <div className="flex flex-wrap gap-2">
                            {prev && (
                              <Button
                                type="button"
                                size="sm"
                                className="h-11 rounded-xl"
                                aria-pressed={comparing}
                                onClick={() => setCompareId(comparing ? null : entry.id)}
                              >
                                {comparing ? "Show this result only" : `Compare with ${shortDate(prev.completed_at)}`}
                              </Button>
                            )}
                            <Button type="button" variant="outline" size="sm" className="h-11 rounded-xl" onClick={() => void copy(entry)}>
                              <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" />
                              Copy
                            </Button>
                            {ex && (
                              <Button asChild variant="outline" size="sm" className="h-11 rounded-xl">
                                <Link to={exercisePath(ex.id)}>Do it again</Link>
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-11 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setPendingDelete(entry)}
                            >
                              <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </MemberPage>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && !deleting && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this result?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `“${getExercise(pendingDelete.exercise_id)?.title ?? "This exercise"}” from ${shortDate(pendingDelete.completed_at)} will be removed from My Workbook. This can't be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
