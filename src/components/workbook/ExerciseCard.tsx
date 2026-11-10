import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { exercisePath, isDueForRetake, retakeDate, shortDate, type Exercise } from "@/data/exercises";
import type { WorkbookEntry } from "@/hooks/useWorkbook";

interface ExerciseCardProps {
  exercise: Exercise;
  latest?: WorkbookEntry;
  inProgress?: boolean;
}

/** A guided exercise as a card linking to /workbook/<id>, with its status. */
export default function ExerciseCard({ exercise, latest, inProgress = false }: ExerciseCardProps) {
  const due = latest ? isDueForRetake(latest.completed_at) : false;
  const action = inProgress ? "Continue" : latest ? (due ? "Retake" : "Open") : "Start";
  const status = latest
    ? due
      ? `Done ${shortDate(latest.completed_at)} · ready to retake`
      : `Done ${shortDate(latest.completed_at)} · retake from ${shortDate(retakeDate(latest.completed_at))}`
    : null;

  return (
    <Link
      to={exercisePath(exercise.id)}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>About {exercise.minutes} minutes</span>
        {exercise.scored && <span aria-hidden="true">·</span>}
        {exercise.scored && <span>Check-in</span>}
      </div>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">{exercise.title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{exercise.summary}</p>
      {status && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-foreground/80">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{status}</span>
        </p>
      )}
      {!status && inProgress && <p className="mt-3 text-sm text-foreground/80">In progress</p>}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {action}
        <span className="sr-only">: {exercise.title}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
