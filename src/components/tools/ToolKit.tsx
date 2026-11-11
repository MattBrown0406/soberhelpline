import { useEffect, useId, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Cloud, CloudOff, Clock, Loader2, Lock, Printer, RotateCcw } from "lucide-react";
import logoImg from "@/assets/logo.png";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { SavedTool, SavedToolStatus } from "@/hooks/useSavedTool";

// The common frame for every fillable tool, worksheet, plan and tracker:
// the same header, the same "saved" signal, the same Print and Start over, and
// fields that print what was typed (a browser prints a textarea cut off at its
// visible height, so each field also renders a print-only copy of its text).
//
// Usage:
//   const saved = useSavedTool("tool:family-action-plan", blank);
//   <ToolShell title="…" summary="…" minutes={15} kind="Living plan" saved={saved}>
//     <ToolSection step={1} title="…"> <SavedTextarea … /> </ToolSection>
//   </ToolShell>

export type ToolKind = "Worksheet" | "Living plan" | "Tracker" | "Checklist" | "Assessment" | "Practice" | "Reference";

// ---------------------------------------------------------------------------
// Save status
// ---------------------------------------------------------------------------

function savedTimeLabel(at: Date | null): string {
  if (!at) return "";
  const today = new Date();
  const sameDay = at.toDateString() === today.toDateString();
  const time = at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return sameDay ? `at ${time}` : `on ${at.toLocaleDateString([], { month: "short", day: "numeric" })}`;
}

export function SaveStatusChip({
  status,
  signedIn,
  lastSavedAt,
  className,
}: {
  status: SavedToolStatus;
  signedIn: boolean;
  lastSavedAt: Date | null;
  className?: string;
}) {
  let icon: ReactNode = <Cloud className="h-3.5 w-3.5" aria-hidden="true" />;
  let text = "Saves automatically";
  let tone = "text-muted-foreground";

  if (status === "loading") {
    icon = <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />;
    text = "Loading your saved answers…";
  } else if (!signedIn) {
    icon = <Lock className="h-3.5 w-3.5" aria-hidden="true" />;
    text = status === "local" ? "Kept on this device only" : "Sign in to save to your account";
  } else if (status === "saving") {
    icon = <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />;
    text = "Saving…";
  } else if (status === "error") {
    icon = <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />;
    text = "Couldn't save just now. We'll keep trying while this page is open.";
    tone = "text-destructive";
  } else if (lastSavedAt) {
    icon = <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />;
    text = `Saved ${savedTimeLabel(lastSavedAt)}`;
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", tone, className)} role="status" aria-live="polite">
      {icon}
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

interface ToolShellProps {
  title: string;
  /** One or two sentences: what this is for and what she walks away with. */
  summary: string;
  kind?: ToolKind;
  /** Roughly how long it takes. Omit for trackers and living plans. */
  minutes?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saved: SavedTool<any>;
  /** Where "Back" goes. Defaults to the Education Center. */
  backTo?: { to: string; label: string };
  /** Shown under the summary, e.g. the clinical basis. */
  note?: string;
  /** Hide "Start over" (e.g. for a log where entries are removed one by one). */
  hideReset?: boolean;
  children: ReactNode;
  className?: string;
}

export function ToolShell({
  title,
  summary,
  kind = "Worksheet",
  minutes,
  saved,
  backTo = { to: "/family-education", label: "Education Center" },
  note,
  hideReset = false,
  children,
  className,
}: ToolShellProps) {
  const printedOn = new Date().toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
  const shellRef = useRef<HTMLDivElement>(null);

  // Collapsed "show more" blocks (earlier check-ins and the like) print open.
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = Array.from(shellRef.current?.querySelectorAll<HTMLDetailsElement>("details:not([open])") ?? []);
      opened.forEach((d) => (d.open = true));
    };
    const after = () => {
      opened.forEach((d) => (d.open = false));
      opened = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return (
    // The warm page background of the member area (see components/member/MemberUI).
    <div className="bg-gradient-to-b from-[#ede4cf]/50 via-[#ede4cf]/15 to-background dark:from-slate-900/50 dark:via-background print:bg-none">
    <div
      ref={shellRef}
      className={cn("container mx-auto max-w-3xl px-4 py-6 sm:py-10 print:max-w-none print:px-0 print:py-0", className)}
    >
      {/* Screen: back + actions */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to={backTo.to}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backTo.label}
        </Link>
        <div className="flex items-center gap-2">
          {!hideReset && saved.hasContent && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="min-h-11 gap-1.5 text-muted-foreground">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Start over
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start over with a blank page?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears everything you've written here, including the saved copy. If you'd like to keep it,
                    print it first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my answers</AlertDialogCancel>
                  <AlertDialogAction onClick={saved.reset}>Clear and start over</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant="outline" size="sm" className="min-h-11 gap-1.5" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </Button>
        </div>
      </div>

      {/* Print: letterhead */}
      <div className="mb-6 hidden items-center justify-between border-b border-border pb-3 print:flex">
        <img src={logoImg} alt="Sober Helpline" className="h-10 w-auto" />
        <p className="text-xs">soberhelpline.com · (458) 298-8008 · {printedOn}</p>
      </div>

      {/* Header */}
      {/* A div, not <header>: the site print stylesheet hides header elements. */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#16294a] via-[#1b3560] to-[#2a4f85] p-5 text-white shadow-lg shadow-[#16294a]/20 sm:p-8 print:mb-5 print:rounded-none print:bg-none print:p-0 print:text-foreground print:shadow-none">
        <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full bg-[#e8a73a]/25 blur-3xl print:hidden" />
        <div className="relative">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f2c675] print:hidden">{kind}</p>
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 print:text-foreground">{summary}</p>
          {note && (
            <p className="mt-3 border-t border-white/15 pt-3 text-xs italic leading-relaxed text-white/70 print:border-border print:text-muted-foreground">
              {note}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2 print:hidden">
            {typeof minutes === "number" && (
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-xs font-medium text-white">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                About {minutes} minutes
              </span>
            )}
            <span className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/10 px-3">
              <SaveStatusChip status={saved.status} signedIn={saved.signedIn} lastSavedAt={saved.lastSavedAt} className="text-white" />
            </span>
            {!saved.signedIn && saved.loaded && (
              <Link
                to={`/auth?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
                className="inline-flex min-h-11 items-center rounded-full px-2 text-sm font-semibold text-white underline underline-offset-4 hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Nothing can be typed until her saved answers have loaded, so a slow
          load can never be overwritten by a few early keystrokes. */}
      <fieldset disabled={!saved.loaded} aria-busy={!saved.loaded} className="m-0 min-w-0 space-y-6 border-0 p-0 print:space-y-4">
        {children}
      </fieldset>

      <p className="mt-10 text-center text-xs text-muted-foreground print:hidden">
        What you write here is private to your account. You can come back and change it any time.
      </p>
    </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sections and fields
// ---------------------------------------------------------------------------

export function ToolSection({
  step,
  title,
  description,
  children,
  tone = "default",
  className,
}: {
  step?: number;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  tone?: "default" | "highlight";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "print-flow rounded-2xl border bg-card p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6 print:rounded-none print:border-0 print:border-t print:p-0 print:pt-4 print:shadow-none",
        tone === "highlight" ? "border-[#e8a73a]/50 bg-[#e8a73a]/[0.07] dark:bg-[#e8a73a]/[0.06]" : "border-border/70",
        className,
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        {typeof step === "number" && (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground print:border print:border-foreground"
            aria-hidden="true"
          >
            {step}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-snug text-foreground">{title}</h2>
          {description && <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</div>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/** A labelled question. Wrap any control; pass the same id via `htmlFor`. */
export function ToolField({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5 print:break-inside-avoid", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium leading-snug text-foreground">
        {label}
      </label>
      {hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

/** Blank ruled lines for a printed sheet she wants to fill in by hand. */
function PrintLines({ lines }: { lines: number }) {
  return (
    <div className="hidden print:block" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="print-rule h-7 border-b border-foreground/40" />
      ))}
    </div>
  );
}

interface SavedTextareaProps {
  label: ReactNode;
  hint?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Visible rows on screen, and blank lines on paper when empty. */
  rows?: number;
  maxLength?: number;
  className?: string;
}

/** A long answer. Grows as she types; prints the full text (or blank lines). */
export function SavedTextarea({ label, hint, value, onChange, placeholder, rows = 3, maxLength = 4000, className }: SavedTextareaProps) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight + 2}px`;
    };
    fit();
    // The text wraps differently when the width changes (rotating a phone).
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);

  return (
    <ToolField label={label} hint={hint} htmlFor={id} className={className}>
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full resize-none overflow-hidden rounded-lg border border-input bg-card px-3.5 py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden"
      />
      {value.trim() ? (
        <p className="print-rule hidden whitespace-pre-wrap border-l-2 border-foreground/40 pl-3 text-sm leading-relaxed print:block">{value}</p>
      ) : (
        <PrintLines lines={rows} />
      )}
    </ToolField>
  );
}

interface SavedInputProps {
  label: ReactNode;
  hint?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "tel" | "date" | "email";
  maxLength?: number;
  className?: string;
}

/** "2026-11-10" from a date field prints as "November 10, 2026". */
function printableDate(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
}

/** A short one-line answer. */
export function SavedInput({ label, hint, value, onChange, placeholder, type = "text", maxLength = 300, className }: SavedInputProps) {
  const id = useId();
  return (
    <ToolField label={label} hint={hint} htmlFor={id} className={className}>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="block h-12 w-full rounded-lg border border-input bg-card px-3.5 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden"
      />
      {value.trim() ? (
        <p className="print-rule hidden border-b border-foreground/40 pb-1 text-sm print:block">{type === "date" ? printableDate(value) : value}</p>
      ) : (
        <PrintLines lines={1} />
      )}
    </ToolField>
  );
}

/** One tick-box row with a large tap target. Prints as a ticked or empty box. */
export function CheckRow({
  checked,
  onChange,
  children,
  description,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors print:min-h-0 print:break-inside-avoid print:border-0 print:px-0 print:py-1",
        checked ? "border-primary/50 bg-primary/[0.06]" : "border-border hover:border-primary/30",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-input accent-[hsl(var(--primary))] print:hidden"
      />
      <span className="hidden text-base leading-none print:inline" aria-hidden="true">
        {checked ? "☑" : "☐"}
      </span>
      <span className="min-w-0">
        <span className="block text-sm leading-snug text-foreground">{children}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}

/** Tick any that apply, from a list of strings. */
export function CheckList({
  options,
  selected,
  onChange,
  columns = 1,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: 1 | 2;
}) {
  const toggle = (option: string, on: boolean) =>
    onChange(on ? [...selected.filter((o) => o !== option), option] : selected.filter((o) => o !== option));
  return (
    <div className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2")}>
      {options.map((option) => (
        <CheckRow key={option} checked={selected.includes(option)} onChange={(on) => toggle(option, on)}>
          {option}
        </CheckRow>
      ))}
    </div>
  );
}

/** Pick one, as large buttons. Prints the chosen answer. */
export function ChoiceGroup<V extends string>({
  label,
  hint,
  options,
  value,
  onChange,
  columns = 1,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  options: readonly { value: V; label: string; description?: string }[];
  value: V | "";
  onChange: (value: V) => void;
  columns?: 1 | 2 | 3;
}) {
  const name = useId();
  const chosen = options.find((o) => o.value === value);
  return (
    <fieldset className="space-y-1.5 print:break-inside-avoid">
      {label && <legend className="text-sm font-medium leading-snug text-foreground">{label}</legend>}
      {hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      <div className={cn("grid gap-2 print:hidden", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-3")}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                active ? "border-primary bg-primary/[0.08]" : "border-border hover:border-primary/30",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug text-foreground">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      <p className="hidden text-sm print:block">{chosen ? `☑ ${chosen.label}` : options.map((o) => `☐ ${o.label}`).join("   ")}</p>
    </fieldset>
  );
}

/** A 1–5 (or any range) rating as a row of large buttons. */
export function ScaleRow({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  lowLabel,
  highLabel,
}: {
  label: ReactNode;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
}) {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const labelId = useId();
  return (
    <div className="space-y-2 print:break-inside-avoid">
      <p id={labelId} className="text-sm font-medium leading-snug text-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-2 print:hidden" role="radiogroup" aria-labelledby={labelId}>
        {points.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={cn(
              "h-11 w-11 rounded-full border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === n ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary/40",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {(lowLabel || highLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground print:hidden">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
      <p className="hidden text-sm print:block">
        {value == null ? points.map((n) => `○ ${n}`).join("  ") : `${value} of ${max}`}
        {lowLabel && highLabel ? `  (${min} = ${lowLabel}, ${max} = ${highLabel})` : ""}
      </p>
    </div>
  );
}

/** A reading block inside a tool: the teaching that goes with the questions. */
export function ToolNote({ title, children, tone = "info" }: { title?: string; children: ReactNode; tone?: "info" | "caution" }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm leading-relaxed print:break-inside-avoid print:border-foreground/30",
        tone === "caution"
          ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
          : "border-primary/20 bg-primary/[0.04] text-foreground/90",
      )}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {children}
    </div>
  );
}

/** Always-visible safety line for tools that touch crisis territory. */
export function CrisisLine() {
  return (
    <ToolNote tone="caution" title="If someone is in danger right now">
      Call 911. For thoughts of suicide or an emotional crisis, call or text 988. This page is for planning, not for
      emergencies.
    </ToolNote>
  );
}
