import { Link } from "react-router-dom";
import { Phone, CalendarDays } from "lucide-react";
import type { ExerciseOutput } from "@/data/exercises";

interface OutputViewProps {
  output: ExerciseOutput;
  /** Smaller type for side-by-side comparisons and history. */
  compact?: boolean;
  /** Hide the output title (when the surrounding page already shows it). */
  hideTitle?: boolean;
}

/** Renders a saved exercise result: headings, paragraphs, lists, closing. */
export default function OutputView({ output, compact = false, hideTitle = false }: OutputViewProps) {
  const sections = output?.sections ?? [];
  return (
    <div className={compact ? "space-y-4 text-sm" : "space-y-6 text-base"}>
      {!hideTitle && output?.title && (
        <h3 className={compact ? "text-base font-semibold text-foreground" : "text-xl font-semibold text-foreground"}>
          {output.title}
        </h3>
      )}
      {sections.map((section, i) => (
        <section key={`${section.heading}-${i}`} className="space-y-2">
          <h4
            className={
              compact
                ? "text-sm font-semibold text-foreground"
                : "text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            }
          >
            {section.heading}
          </h4>
          {(section.paragraphs ?? []).map((p, j) => (
            <p
              key={j}
              className={
                section.emphasis
                  ? compact
                    ? "font-medium leading-relaxed text-foreground"
                    : "rounded-lg border-l-4 border-primary bg-primary/5 px-4 py-3 text-lg font-medium leading-relaxed text-foreground dark:bg-primary/10"
                  : "leading-relaxed text-foreground/90"
              }
            >
              {p}
            </p>
          ))}
          {(section.items ?? []).length > 0 && (
            <ul className="list-disc space-y-1 pl-5 leading-relaxed text-foreground/90 marker:text-primary">
              {(section.items ?? []).map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {(output?.closing ?? []).length > 0 && (
        <div className={compact ? "space-y-1 text-muted-foreground" : "space-y-1 border-t border-border pt-4 text-muted-foreground"}>
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
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="font-semibold">You don't have to carry this alone.</p>
      <p className="mt-1">
        A score like this means you've been under a lot of strain. Talking it through with someone who understands
        addiction in the family can help.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          to="/family-consultation"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-amber-900 px-4 py-2 font-medium text-white hover:bg-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:bg-amber-200 dark:text-amber-950 dark:hover:bg-amber-100"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Book a family consultation
        </Link>
        <a
          href="tel:988"
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-amber-400 px-4 py-2 font-medium hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-700 dark:hover:bg-amber-900/50"
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
