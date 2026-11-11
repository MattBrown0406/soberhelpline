import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, ChevronUp, Copy, Loader2, Trash2 } from "lucide-react";
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
import ExerciseCard from "@/components/workbook/ExerciseCard";
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
      <div className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:pt-12">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-semibold text-foreground">My Workbook</h1>
            </div>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Short guided exercises, about five minutes each, one question at a time. Each one ends with something you
              keep: a script, a plan, a check-in. Retake any of them after 30 days to see what has changed.
            </p>
          </header>

          {!loading && !error && entries.length === 0 && first && (
            <section className="mb-10 rounded-xl border border-primary/30 bg-primary/5 p-5 dark:bg-primary/10 sm:p-6">
              <h2 className="text-lg font-semibold text-foreground">Your workbook is empty for now</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                A good place to start is “{first.title}.” It takes about {first.minutes} minutes, and you'll leave with a
                boundary in your own words and a calm line for when they push back. You can stop anytime.
              </p>
              <Button asChild size="lg" className="mt-4 h-auto min-h-12 whitespace-normal py-2.5 text-left">
                <Link to={exercisePath(first.id)}>Start “{first.title}”</Link>
              </Button>
            </section>
          )}

          <section aria-labelledby="wb-exercises" className="mb-12">
            <h2 id="wb-exercises" className="mb-4 text-xl font-semibold text-foreground">
              Exercises
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
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

          <section aria-labelledby="wb-saved">
            <h2 id="wb-saved" className="mb-4 text-xl font-semibold text-foreground">
              Saved results
            </h2>

            {loading && (
              <div className="flex items-center gap-2 py-6 text-muted-foreground" role="status">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Loading your saved results…
              </div>
            )}

            {!loading && error && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                <p className="text-foreground">{error}</p>
                <Button variant="outline" size="sm" className="mt-3 h-10" onClick={() => void reload()}>
                  Try again
                </Button>
              </div>
            )}

            {!loading && !error && entries.length === 0 && (
              <p className="text-sm text-muted-foreground">
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
                  return (
                    <li key={entry.id} className="rounded-xl border border-border bg-card">
                      <button
                        type="button"
                        className="flex min-h-14 w-full items-start justify-between gap-4 rounded-xl p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => {
                          setOpenId(open ? null : entry.id);
                          if (open) setCompareId(null);
                        }}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-foreground">{title}</span>
                          <span className="mt-0.5 block text-sm text-muted-foreground">
                            {shortDate(entry.completed_at)}
                            {typeof entry.score === "number" && scoreInfo
                              ? ` · ${entry.score} of ${scoreInfo.max} · ${scoreInfo.band}`
                              : ""}
                          </span>
                        </span>
                        {open ? (
                          <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        )}
                      </button>
                      {open && (
                        <div id={panelId} className="space-y-5 border-t border-border px-4 pb-5 pt-4">
                          {comparing && prev ? (
                            <CompareView
                              previous={{ output: prev.output, score: prev.score, completedAt: prev.completed_at }}
                              current={{ output: entry.output, score: entry.score, completedAt: entry.completed_at }}
                            />
                          ) : (
                            <OutputView output={entry.output} hideTitle />
                          )}
                          <div className="flex flex-wrap gap-2">
                            {prev && (
                              <Button
                                type="button"
                                size="sm"
                                className="h-10"
                                aria-pressed={comparing}
                                onClick={() => setCompareId(comparing ? null : entry.id)}
                              >
                                {comparing ? "Show this result only" : `Compare with ${shortDate(prev.completed_at)}`}
                              </Button>
                            )}
                            <Button type="button" variant="outline" size="sm" className="h-10" onClick={() => void copy(entry)}>
                              <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" />
                              Copy
                            </Button>
                            {ex && (
                              <Button asChild variant="outline" size="sm" className="h-10">
                                <Link to={exercisePath(ex.id)}>Do it again</Link>
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
      </div>

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
