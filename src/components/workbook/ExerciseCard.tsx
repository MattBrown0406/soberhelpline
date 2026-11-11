import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { IconTile, TONE, toneForExercise } from "@/components/member/MemberUI";
import { iconForExercise } from "@/components/workbook/exerciseIcons";
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

  const tone = toneForExercise(exercise.id);
  const Icon = iconForExercise(exercise.id);

  return (
    <Link
      to={exercisePath(exercise.id)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 text-left shadow-sm shadow-slate-900/[0.04] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${TONE[tone].bar}`} />
      <div className="flex items-start justify-between gap-3">
        <IconTile icon={Icon} tone={tone} size="lg" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          About {exercise.minutes} min{exercise.scored ? " · Check-in" : ""}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">{exercise.title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{exercise.summary}</p>
      {status && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-foreground/80">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{status}</span>
        </p>
      )}
      {!status && inProgress && (
        <p className="mt-3 inline-flex w-fit items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
          In progress
        </p>
      )}
      <span className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${TONE[tone].text}`}>
        {action}
        <span className="sr-only">: {exercise.title}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
      </span>
    </Link>
  );
}
