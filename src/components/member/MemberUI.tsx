import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// The look of the member area, in one place: a warm page background, a hero
// band, tinted icon tiles, a progress ring and section headings. Member pages
// build from these so the area reads as one calm, recognisable space.
//
// Class strings are written out in full (Tailwind only keeps classes it can
// see), so every tone below is a literal.

export type Tone = "navy" | "sky" | "teal" | "emerald" | "amber" | "rose" | "violet";

export const TONE: Record<Tone, { tile: string; text: string; soft: string; border: string; bar: string; ring: string }> = {
  navy: {
    tile: "bg-[#16294a]/10 text-[#16294a] dark:bg-sky-400/15 dark:text-sky-200",
    text: "text-[#16294a] dark:text-sky-200",
    soft: "bg-[#16294a]/[0.04] dark:bg-sky-400/[0.06]",
    border: "border-[#16294a]/20 dark:border-sky-400/25",
    bar: "bg-[#16294a] dark:bg-sky-300",
    ring: "stroke-[#16294a] dark:stroke-sky-300",
  },
  sky: {
    tile: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
    text: "text-sky-700 dark:text-sky-300",
    soft: "bg-sky-50 dark:bg-sky-400/[0.06]",
    border: "border-sky-200 dark:border-sky-400/25",
    bar: "bg-sky-500",
    ring: "stroke-sky-500",
  },
  teal: {
    tile: "bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
    text: "text-teal-700 dark:text-teal-300",
    soft: "bg-teal-50 dark:bg-teal-400/[0.06]",
    border: "border-teal-200 dark:border-teal-400/25",
    bar: "bg-teal-500",
    ring: "stroke-teal-500",
  },
  // Named "emerald" for callers, but written with green-*: this site's theme
  // remaps emerald-* to the brand navy, and "done" should read as green.
  emerald: {
    tile: "bg-green-100 text-green-700 dark:bg-green-400/15 dark:text-green-300",
    text: "text-green-700 dark:text-green-300",
    soft: "bg-green-50 dark:bg-green-400/[0.06]",
    border: "border-green-200 dark:border-green-400/25",
    bar: "bg-green-500",
    ring: "stroke-green-500",
  },
  // The brand amber (#e8a73a) for the bar and ring; readable amber for text.
  amber: {
    tile: "bg-[#e8a73a]/20 text-amber-800 dark:bg-[#e8a73a]/15 dark:text-amber-300",
    text: "text-amber-800 dark:text-amber-300",
    soft: "bg-[#e8a73a]/[0.08] dark:bg-[#e8a73a]/[0.06]",
    border: "border-[#e8a73a]/40 dark:border-[#e8a73a]/30",
    bar: "bg-[#e8a73a]",
    ring: "stroke-[#e8a73a]",
  },
  rose: {
    tile: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    soft: "bg-rose-50 dark:bg-rose-400/[0.06]",
    border: "border-rose-200 dark:border-rose-400/25",
    bar: "bg-rose-500",
    ring: "stroke-rose-500",
  },
  violet: {
    tile: "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
    text: "text-violet-700 dark:text-violet-300",
    soft: "bg-violet-50 dark:bg-violet-400/[0.06]",
    border: "border-violet-200 dark:border-violet-400/25",
    bar: "bg-violet-500",
    ring: "stroke-violet-500",
  },
};

/** One colour per kind of thing, the same everywhere in the member area. */
export function toneForKind(kind: string | undefined): Tone {
  switch (kind) {
    case "Living plan":
      return "violet";
    case "Check-in":
      return "teal";
    case "Checklist":
      return "amber";
    case "Worksheet":
    case "Exercise":
      return "emerald";
    case "Reference":
    case "Guide":
      return "sky";
    case "Notes":
    case "Saved":
      return "rose";
    case "Meditation":
      return "violet";
    default:
      return "navy";
  }
}

/** A stable accent for each guided exercise, so its card is recognisable at a glance. */
const EXERCISE_TONES: Record<string, Tone> = {
  "boundary-script": "emerald",
  "helping-or-enabling": "amber",
  "guilt-check": "rose",
  "control-sort": "teal",
  "weekly-self-care": "violet",
  "stress-check": "sky",
  "hard-moment-practice": "navy",
  "family-pulse": "teal",
};
export const toneForExercise = (id: string): Tone => EXERCISE_TONES[id] ?? "emerald";

type Icon = ComponentType<{ className?: string }>;

/** The soft page background every member page sits on. */
export function MemberPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-[#ede4cf]/50 via-[#ede4cf]/15 to-background dark:from-slate-900/50 dark:via-background print:bg-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** The band at the top of a member page: who it is for, in one warm glance. */
export function MemberHero({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Stat chips or an action, shown under the text. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16294a] via-[#1b3560] to-[#2a4f85] px-5 py-7 text-white shadow-lg shadow-[#16294a]/20 sm:px-8 sm:py-9 print:rounded-none print:bg-none print:px-0 print:py-0 print:text-foreground print:shadow-none",
        className,
      )}
    >
      {/* Soft light, top right and bottom left: decoration only. */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full bg-[#e8a73a]/25 blur-3xl print:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-sky-300/15 blur-3xl print:hidden" />
      <div className="relative">
        {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#f2c675] print:text-muted-foreground">{eyebrow}</p>}
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/85 print:text-muted-foreground">{subtitle}</p>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </header>
  );
}

/** A small glass chip inside the hero: one number or fact, with a label. */
export function HeroStat({ icon: IconComp, label, value, to }: { icon: Icon; label: string; value: ReactNode; to?: string }) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <IconComp className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-wide text-white/65">{label}</span>
        <span className="block truncate text-sm font-semibold leading-snug text-white">{value}</span>
      </span>
    </>
  );
  const cls =
    "flex min-h-14 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-sm print:hidden";
  return to ? (
    <Link to={to} className={cn(cls, "transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70")}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** A tinted, rounded square holding an icon. */
export function IconTile({ icon: IconComp, tone = "navy", size = "md", className }: { icon: Icon; tone?: Tone; size?: "sm" | "md" | "lg"; className?: string }) {
  const box = size === "lg" ? "h-12 w-12 rounded-2xl" : size === "sm" ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-xl";
  const glyph = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span aria-hidden="true" className={cn("flex shrink-0 items-center justify-center", box, TONE[tone].tile, className)}>
      <IconComp className={glyph} />
    </span>
  );
}

/** A section title with an optional "see all" style link on the right. */
export function SectionHeading({
  id,
  icon,
  tone = "navy",
  title,
  description,
  action,
}: {
  id?: string;
  icon?: Icon;
  tone?: Tone;
  title: string;
  description?: ReactNode;
  action?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div className="flex items-start gap-3">
        {icon && <IconTile icon={icon} tone={tone} />}
        <div>
          <h2 id={id} className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action && (
        <Link
          to={action.to}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/** The white, softly shadowed panel member content sits in. */
export function Panel({ children, className, tone }: { children: ReactNode; className?: string; tone?: Tone }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6 print:border-0 print:p-0 print:shadow-none",
        tone ? TONE[tone].border : "border-border/70",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A round progress dial: how far along, with the number in the middle. */
export function ProgressRing({
  value,
  size = 72,
  stroke = 7,
  tone = "emerald",
  label,
  children,
}: {
  /** 0 to 100. */
  value: number;
  size?: number;
  stroke?: number;
  tone?: Tone;
  /** Read by screen readers, e.g. "2 of 5 steps done". */
  label: string;
  children?: ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none", TONE[tone].ring)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">{children}</div>
    </div>
  );
}

/** A small coloured label ("Check-in", "Saved", "Living plan"). */
export function KindPill({ children, tone = "navy", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", TONE[tone].tile, className)}>
      {children}
    </span>
  );
}
