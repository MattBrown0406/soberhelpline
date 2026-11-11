import { Link } from "react-router-dom";
import { Phone, CalendarDays } from "lucide-react";
import { ProgressRing, TONE, type Tone } from "@/components/member/MemberUI";
import { cn } from "@/lib/utils";
import type { ExerciseOutput } from "@/data/exercises";

interface OutputViewProps {
  output: ExerciseOutput;
  /** Smaller type for side-by-side comparisons and history. */
  compact?: boolean;
  /** Hide the output title (when the surrounding page already shows it). */
  hideTitle?: boolean;
  /** The exercise's accent (see toneForExercise). Presentation only. */
  tone?: Tone;
}

/** Renders a saved exercise result: headings, paragraphs, lists, closing. */
export default function OutputView({ output, compact = false, hideTitle = false, tone = "navy" }: OutputViewProps) {
  const sections = output?.sections ?? [];
  // A dial for scored check-ins, drawn from the score already saved with the result.
  const score = output?.score;
  const showRing =
    !compact && !!score && typeof score.score === "number" && typeof score.max === "number" && score.max > 0;

  return (
    <div className={compact ? "space-y-4 text-sm" : "space-y-4 text-base"}>
      {!hideTitle && output?.title && (
        <h3
          className={
            compact
              ? "text-base font-semibold text-foreground"
              : "text-xl font-semibold leading-snug text-foreground sm:text-2xl"
          }
        >
          {output.title}
        </h3>
      )}
      {sections.map((section, i) => {
        const withRing = showRing && i === 0 && !!score;
        return (
          <section
            key={`${section.heading}-${i}`}
            className={
              compact
                ? "space-y-2"
                : cn("space-y-2.5 rounded-xl p-4 sm:p-5 print:bg-transparent print:px-0 print:py-1", TONE[tone].soft)
            }
          >
            {withRing && score ? (
              <div className="flex items-center gap-4">
                <ProgressRing
                  value={(score.score / score.max) * 100}
                  tone={tone}
                  label={`Score: ${score.score} of ${score.max}`}
                >
                  <span className="text-xl font-semibold text-foreground">{score.score}</span>
                  <span className="mt-1 text-xs text-foreground/75">of {score.max}</span>
                </ProgressRing>
                <h4 className="min-w-0 text-lg font-semibold leading-snug text-foreground">{section.heading}</h4>
              </div>
            ) : (
              <h4
                className={
                  compact
                    ? "text-sm font-semibold text-foreground"
                    : cn("text-sm font-semibold uppercase tracking-wide", TONE[tone].text)
                }
              >
                {section.heading}
              </h4>
            )}
            {(section.paragraphs ?? []).map((p, j) => (
              <p
                key={j}
                className={
                  section.emphasis
                    ? compact
                      ? "font-medium leading-relaxed text-foreground"
                      : "rounded-lg border-l-4 border-primary bg-card px-4 py-3 text-lg font-medium leading-relaxed text-foreground shadow-sm shadow-slate-900/[0.04] print:shadow-none"
                    : "leading-relaxed text-foreground/90"
                }
              >
                {p}
              </p>
            ))}
            {(section.items ?? []).length > 0 && (
              <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-foreground/90 marker:text-primary">
                {(section.items ?? []).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
      {(output?.closing ?? []).length > 0 && (
        <div
          className={
            compact
              ? "space-y-1 text-muted-foreground"
              : "space-y-1.5 border-t border-border/70 px-1 pt-4 text-muted-foreground"
          }
        >
          {(output.closing ?? []).map((c, i) => (
            <p key={i} className="italic leading-relaxed">
              {c}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/** Shown when a scored result is high: the crisis line and a consult. */
export function SupportBox() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 sm:p-5 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="text-base font-semibold">You don't have to carry this alone.</p>
      <p className="mt-1">
        A score like this means you've been under a lot of strain. Talking it through with someone who understands
        addiction in the family can help.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          to="/family-consultation"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-amber-900 px-4 py-2 font-medium text-white hover:bg-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:bg-amber-200 dark:text-amber-950 dark:hover:bg-amber-100"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Book a family consultation
        </Link>
        <a
          href="tel:988"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-amber-400 px-4 py-2 font-medium hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-700 dark:hover:bg-amber-900/50"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call or text 988
        </a>
      </div>
      <p className="mt-3">
        If you're thinking about harming yourself, or you feel you can't keep yourself safe, call or text 988 (the
        Suicide &amp; Crisis Lifeline) any time. If someone is in immediate danger, call 911.
      </p>
    </div>
  );
}
