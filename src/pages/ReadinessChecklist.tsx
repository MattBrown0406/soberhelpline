import SafetyBox from "@/components/SafetyBox";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Trash2, TrendingUp, type LucideIcon } from "lucide-react";
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
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useSavedTool } from "@/hooks/useSavedTool";
import RelatedResources from "@/components/RelatedResources";
import {
  CheckList,
  CheckRow,
  ChoiceGroup,
  SavedInput,
  SavedTextarea,
  ToolNote,
  ToolSection,
  ToolShell,
} from "@/components/tools/ToolKit";

// A repeated check-in on the loved one's readiness, judged by what he or she
// is actually doing. She fills in `current`; "Save this check-in" files a dated
// copy under `history` and clears the page for next time.

// ---------------------------------------------------------------------------
// The owner's content
// ---------------------------------------------------------------------------

const SECTIONS = [
  {
    key: "section1",
    title: "Accountability & Ownership",
    items: [
      "Acknowledges there is a problem without blaming others",
      "Takes responsibility for specific behaviors (not just general regret)",
      "Accepts feedback without escalating or becoming defensive",
      "Does not minimize or rationalize substance use",
      "Acknowledges consequences without arguing them away",
    ],
  },
  {
    key: "section2",
    title: "Behavioral Follow-Through",
    items: [
      "Takes initiative to seek help or evaluation",
      "Follows through on appointments without reminders",
      "Completes required steps (calls, paperwork, planning) independently",
      "Shows up on time and prepared",
      "Follows rules and expectations without repeated negotiation",
    ],
  },
  {
    key: "section3",
    title: "Tolerance for Discomfort",
    items: [
      'Accepts "no" without emotional escalation',
      "Does not demand immediate relief or reassurance",
      "Tolerates boundaries without punishment or withdrawal",
      "Does not use guilt, fear, or anger to change decisions",
      "Accepts consequences without demanding rescue",
    ],
  },
  {
    key: "section4",
    title: "Engagement With Recovery Supports",
    items: [
      "Willingly participates in treatment or professional recommendations",
      "Attends meetings, therapy, or recovery activities consistently",
      "Is open to structure and accountability",
      "Engages with recovery supports beyond family",
      "Accepts guidance from professionals without controlling the process",
    ],
  },
  {
    key: "section5",
    title: "Lifestyle & Environment Changes",
    items: [
      "Willing to change people, places, or routines connected to use",
      "Reduces contact with substance-using peers",
      "Accepts structured living if recommended",
      "Makes daily life changes that support stability",
      "Shows effort toward healthy routines (sleep, work, responsibilities)",
    ],
  },
  {
    key: "section6",
    title: "Consistency Over Time",
    items: [
      "Behaviors have remained consistent for at least 2 weeks",
      "Progress continues without a crisis driving it",
      "Effort remains even when support is not guaranteed",
      "There is follow-through even after conflict or disappointment",
      "Actions match stated intentions",
    ],
  },
] as const;

const MAX_SCORE = SECTIONS.reduce((sum, section) => sum + section.items.length, 0);
const itemId = (sectionKey: string, index: number) => `${sectionKey}-${index}`;

const REALITY_QUESTIONS: { id: string; question: string; options: { value: string; label: string }[] }[] = [
  {
    id: "behavior-hope",
    question: "Am I responding to behavior—or to hope?",
    options: [
      { value: "behavior", label: "Behavior" },
      { value: "hope", label: "Hope" },
    ],
  },
  {
    id: "boundaries",
    question: "Have I relaxed boundaries prematurely?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "afraid",
    question: "Would I make the same decision if I were less afraid?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "accountability",
    question: "Is my support increasing accountability—or reducing it?",
    options: [
      { value: "accountability", label: "Accountability" },
      { value: "comfort", label: "Comfort" },
    ],
  },
];

const ACTION_OPTIONS = [
  "Maintain boundaries",
  "Do not negotiate timelines",
  "Encourage professional evaluation",
  "Support treatment engagement",
  "Focus on my own recovery",
];

interface Band {
  id: "low" | "emerging" | "strong";
  label: string;
  range: string;
  guideLabel: string;
  message: string;
  consult: boolean;
  icon: LucideIcon;
  card: string;
  text: string;
  row: string;
}

// The owner's stated bands: 0–10, 11–20, 21–30.
const BANDS: Band[] = [
  {
    id: "low",
    label: "Low Readiness",
    range: "0–10 boxes checked",
    guideLabel: "Low readiness",
    message: "Focus on boundaries, consequences, and your own recovery.",
    consult: true,
    icon: AlertCircle,
    card: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    row: "bg-red-100 ring-2 ring-red-400 dark:bg-red-950/50",
  },
  {
    id: "emerging",
    label: "Emerging Readiness",
    range: "11–20 boxes checked",
    guideLabel: "Emerging readiness",
    message: "Encourage professional assessment. Maintain boundaries. Avoid rescuing.",
    consult: true,
    icon: TrendingUp,
    card: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
    text: "text-yellow-700 dark:text-yellow-400",
    row: "bg-yellow-100 ring-2 ring-yellow-400 dark:bg-yellow-950/50",
  },
  {
    id: "strong",
    label: "Strong Readiness",
    range: "21–30 boxes checked",
    guideLabel: "Strong readiness indicators",
    message: "Support treatment engagement while maintaining accountability.",
    consult: false,
    icon: CheckCircle2,
    card: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    row: "bg-green-100 ring-2 ring-green-400 dark:bg-green-950/50",
  },
];

const bandFor = (score: number): Band => (score <= 10 ? BANDS[0] : score <= 20 ? BANDS[1] : BANDS[2]);

const COMPANION_TOOLS = [
  { to: "/family-action-plan", label: "Family Recovery Action Plan" },
  { to: "/crisis-chaos", label: "Crisis vs. Chaos Decision Guide" },
  { to: "/workbook/boundary-script", label: "Boundary Setting Worksheet" },
  { to: "/talking-about-treatment", label: '"How to Talk to Your Loved One About Treatment" Guide' },
  { to: "/workbook/hard-moment-practice", label: "Scenario-Based Exercises" },
];

// Reading carried over from the Insight vs. Behavior Tracker (the owner's
// words). It helps her read the result; none of it is ticked, scored or saved.
const INSIGHT_BEHAVIOR_STAGES: { title: string; points: string[]; card: string; heading: string }[] = [
  {
    title: "High Insight + Low Behavior",
    points: [
      "Common in early recovery or active addiction",
      "Indicates awareness without capacity",
      "Structure and boundaries still needed",
    ],
    card: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30",
    heading: "text-orange-700 dark:text-orange-400",
  },
  {
    title: "Moderate Insight + Moderate Behavior",
    points: ["Indicates early stabilization", "Progress is fragile", "Avoid increasing freedom too quickly"],
    card: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
    heading: "text-blue-700 dark:text-blue-400",
  },
  {
    title: "Consistent Insight + Consistent Behavior",
    points: ["Indicates readiness for increased responsibility", "Trust can be rebuilt gradually"],
    card: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
    heading: "text-emerald-700 dark:text-emerald-400",
  },
  {
    title: "Low Insight + Low Behavior",
    points: ["Indicates resistance or instability", "Focus on safety, structure, and boundaries"],
    card: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
    heading: "text-red-700 dark:text-red-400",
  },
];

const FAMILY_RESPONSE_SIGNS = [
  "We relax boundaries after emotional conversations",
  "We increase trust based on insight alone",
  "We feel guilty holding limits when insight is present",
  "We hope insight means 'this time is different'",
  "We ignore behavior because insight feels sincere",
];

// ---------------------------------------------------------------------------
// Saved shape
// ---------------------------------------------------------------------------

interface CheckIn {
  /** YYYY-MM-DD. Empty while she is still filling it in. */
  date: string;
  /** Ids of the ticked items, e.g. "section1-0". */
  ticked: string[];
  /** Notes / examples, by section key. */
  notes: Record<string, string>;
  /** Family Reality Check answers, by question id. */
  reality: Record<string, string>;
  actions: string[];
  revisitWeeks: string;
}

interface SavedCheckIn extends CheckIn {
  score: number;
  /** How many were ticked in each section, by section key. */
  sectionCounts: Record<string, number>;
}

interface ReadinessData {
  current: CheckIn;
  history: SavedCheckIn[];
}

const blankCheckIn: CheckIn = { date: "", ticked: [], notes: {}, reality: {}, actions: [], revisitWeeks: "" };
const blankData: ReadinessData = { current: blankCheckIn, history: [] };
const MAX_HISTORY = 24;

// Saved copies can be old or partial, so read every field defensively.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const asStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

function asStringMap(value: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!isRecord(value)) return out;
  for (const [key, v] of Object.entries(value)) if (typeof v === "string") out[key] = v;
  return out;
}

function readCheckIn(raw: unknown): CheckIn {
  if (!isRecord(raw)) return blankCheckIn;
  return {
    date: typeof raw.date === "string" ? raw.date : "",
    ticked: asStrings(raw.ticked),
    notes: asStringMap(raw.notes),
    reality: asStringMap(raw.reality),
    actions: asStrings(raw.actions),
    revisitWeeks: typeof raw.revisitWeeks === "string" ? raw.revisitWeeks : "",
  };
}

function countSections(ticked: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const section of SECTIONS) {
    counts[section.key] = section.items.filter((_, index) => ticked.includes(itemId(section.key, index))).length;
  }
  return counts;
}

const totalOf = (counts: Record<string, number>) => SECTIONS.reduce((sum, section) => sum + (counts[section.key] ?? 0), 0);

function readHistory(raw: unknown): SavedCheckIn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isRecord)
    .map((item) => {
      const checkIn = readCheckIn(item);
      const sectionCounts = countSections(checkIn.ticked);
      return { ...checkIn, sectionCounts, score: totalOf(sectionCounts) };
    })
    .filter((item) => item.date !== "");
}

function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
}

function changeText(score: number, previous: number | null): string {
  if (previous === null) return "Your first check-in";
  const diff = score - previous;
  if (diff === 0) return "Same as the time before";
  return diff > 0 ? `${diff} more than the time before` : `${-diff} fewer than the time before`;
}

/** How today's count compares with the last saved check-in. */
const sinceLast = (diff: number): string =>
  diff === 0 ? "The same today." : diff > 0 ? `${diff} more today.` : `${-diff} fewer today.`;

const hasAnything = (checkIn: CheckIn) =>
  checkIn.ticked.length > 0 ||
  checkIn.actions.length > 0 ||
  checkIn.revisitWeeks.trim() !== "" ||
  Object.values(checkIn.notes).some((note) => note.trim() !== "") ||
  Object.values(checkIn.reality).some((answer) => answer !== "");

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

const consultLinkClass = "font-medium text-primary underline underline-offset-2 hover:text-primary/80";

function ConfirmButton({
  label,
  title,
  description,
  confirmLabel,
  onConfirm,
  icon,
  ariaLabel,
}: {
  label: string;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  icon?: boolean;
  ariaLabel?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="min-h-11 gap-1.5 text-muted-foreground print:hidden" aria-label={ariaLabel}>
          {icon && <Trash2 className="h-4 w-4" aria-hidden="true" />}
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ReadinessResult({
  score,
  sectionCounts,
  previous,
}: {
  score: number;
  sectionCounts: Record<string, number>;
  previous: SavedCheckIn | null;
}) {
  const band = score > 0 ? bandFor(score) : null;
  const BandIcon = band?.icon;

  return (
    <ToolSection
      title="What your loved one's actions are showing"
      description="This is a count of the boxes you ticked above. It describes your loved one's readiness, as shown by their behavior. It is not a score for you."
    >
      {band && BandIcon ? (
        <div className={cn("rounded-lg border-2 p-4 print:border print:border-foreground/40", band.card)}>
          <div className="flex items-start gap-3">
            <BandIcon className={cn("mt-1 h-7 w-7 shrink-0 print:hidden", band.text)} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm text-foreground/80">Their readiness, shown by behavior</p>
              <p className={cn("text-2xl font-bold", band.text)}>
                {score} of {MAX_SCORE} — {band.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{band.message}</p>
              {previous && (
                <p className="mt-2 text-sm text-foreground/80">
                  Your last check-in, {formatDate(previous.date)}: {previous.score} of {MAX_SCORE}. {sinceLast(score - previous.score)}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground print:hidden">
          Nothing is ticked yet, so there is no result to show. Go through the six sections above and tick what has been
          consistently true. If you have been through them all and none are true right now, that is the 0–10 range in the
          scoring guide below.
        </div>
      )}

      <div className="print:break-inside-avoid">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Section by section</h3>
        <ul className="divide-y divide-border rounded-lg border border-border text-sm print:border-0">
          {SECTIONS.map((section, index) => (
            <li key={section.key} className="flex items-center justify-between gap-3 px-3.5 py-2.5 print:px-0 print:py-1">
              <span className="text-foreground">
                {index + 1}. {section.title}
              </span>
              <span className="shrink-0 font-medium text-foreground">
                {sectionCounts[section.key] ?? 0} of {section.items.length}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="print:break-inside-avoid">
        <h3 className="text-sm font-semibold text-foreground">Scoring Guide</h3>
        <p className="mb-3 text-xs text-muted-foreground">(Use as a Reference, Not a Rule)</p>
        <ul className="space-y-2">
          {BANDS.map((item) => {
            const active = band?.id === item.id;
            const ItemIcon = item.icon;
            return (
              <li
                key={item.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3 print:p-0 print:py-1 print:ring-0",
                  active ? item.row : "bg-muted/40 print:bg-transparent",
                )}
              >
                <ItemIcon
                  className={cn("mt-0.5 h-5 w-5 shrink-0 print:hidden", active ? item.text : "text-muted-foreground")}
                  aria-hidden="true"
                />
                <div className="min-w-0 text-sm">
                  <p className={cn("font-semibold", active ? item.text : "text-foreground")}>
                    {item.range} — {item.guideLabel}
                    {active && <span className="font-normal"> (where they are now)</span>}
                  </p>
                  <p className="text-foreground/80">{item.message}</p>
                  {item.consult && (
                    <p className="mt-1">
                      Consider{" "}
                      <Link to="/family-consultation" className={consultLinkClass}>
                        consulting with an interventionist
                      </Link>{" "}
                      to help create willingness.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm font-medium text-primary">Important: Readiness is not permanent. Reassess regularly.</p>
      </div>
    </ToolSection>
  );
}

function EarlierCheckIns({ history, onRemove }: { history: SavedCheckIn[]; onRemove: (index: number) => void }) {
  return (
    <ToolSection
      title="Earlier check-ins"
      description="Newest first. Look at the direction over several check-ins, not at any single one. The 24 most recent are kept."
    >
      <ul className="space-y-3">
        {history.map((checkIn, index) => {
          const previous = history[index + 1] ?? null;
          const notes = SECTIONS.filter((section) => (checkIn.notes[section.key] ?? "").trim() !== "");
          return (
            <li
              key={`${checkIn.date}-${index}`}
              className="rounded-lg border border-border p-4 print:break-inside-avoid print:border-0 print:p-0 print:py-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{formatDate(checkIn.date)}</p>
                  <p className="text-base text-foreground">
                    {checkIn.score} of {MAX_SCORE} — {checkIn.score > 0 ? bandFor(checkIn.score).label : "no boxes ticked"}
                  </p>
                  <p className="text-sm text-muted-foreground">{changeText(checkIn.score, previous ? previous.score : null)}</p>
                </div>
                <ConfirmButton
                  label="Remove"
                  icon
                  ariaLabel={`Remove the check-in from ${formatDate(checkIn.date)}`}
                  title="Remove this check-in?"
                  description={`This removes your check-in from ${formatDate(checkIn.date)} for good.`}
                  confirmLabel="Remove it"
                  onConfirm={() => onRemove(index)}
                />
              </div>
              <details className="mt-2 text-sm">
                <summary className="inline-flex min-h-11 cursor-pointer items-center font-medium text-primary print:hidden">
                  Sections, notes and answers
                </summary>
                <ul className="mt-1 space-y-1 text-foreground/90">
                  {SECTIONS.map((section) => (
                    <li key={section.key}>
                      {section.title}: {checkIn.sectionCounts[section.key] ?? 0} of {section.items.length}
                    </li>
                  ))}
                </ul>
                {notes.map((section) => (
                  <p key={section.key} className="mt-2 whitespace-pre-wrap text-foreground/90">
                    <span className="font-medium">{section.title} notes:</span> {checkIn.notes[section.key]}
                  </p>
                ))}
                {REALITY_QUESTIONS.filter((question) => checkIn.reality[question.id]).map((question) => (
                  <p key={question.id} className="mt-2 text-foreground/90">
                    <span className="font-medium">{question.question}</span>{" "}
                    {question.options.find((option) => option.value === checkIn.reality[question.id])?.label ?? ""}
                  </p>
                ))}
                {checkIn.actions.length > 0 && (
                  <p className="mt-2 text-foreground/90">
                    <span className="font-medium">Actions chosen:</span> {checkIn.actions.join("; ")}
                  </p>
                )}
                {checkIn.revisitWeeks.trim() !== "" && (
                  <p className="mt-2 text-foreground/90">
                    <span className="font-medium">Revisit in:</span>{" "}
                    {/^\d+$/.test(checkIn.revisitWeeks.trim()) ? `${checkIn.revisitWeeks.trim()} weeks` : checkIn.revisitWeeks}
                  </p>
                )}
              </details>
            </li>
          );
        })}
      </ul>
    </ToolSection>
  );
}

function InsightVsBehavior() {
  return (
    <ToolSection title="Insight vs. Behavior" description="Use this guide—not as a verdict, but as context.">
      <div className="text-sm leading-relaxed text-foreground/90">
        <p>
          <strong>Insight</strong> is awareness. <strong>Behavior</strong> is change. Both matter—but they are not the
          same.
        </p>
        <p className="mt-2">
          Insight is what is being said. Behavior is what is actually happening, and it is what the count above measures.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 print:block print:space-y-2">
        {INSIGHT_BEHAVIOR_STAGES.map((stage) => (
          <div
            key={stage.title}
            className={cn("rounded-lg border p-4 print:break-inside-avoid print:border-0 print:p-0", stage.card)}
          >
            <h3 className={cn("mb-2 text-sm font-semibold", stage.heading)}>{stage.title}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
              {stage.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ToolNote title="A Necessary Reframe for Families">
        <p>Insight is encouraging—but it is not proof.</p>
        <p className="mt-2 font-medium">Waiting for behavior is not punishment. It is self-protection.</p>
      </ToolNote>
    </ToolSection>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReadinessChecklist() {
  useGuideTracking("/readiness-checklist", "Readiness for Change Checklist");
  const saved = useSavedTool<ReadinessData>("tool:readiness-checklist", blankData);
  const current = readCheckIn(saved.data.current);
  const history = readHistory(saved.data.history);

  const [justSaved, setJustSaved] = useState<string | null>(null);
  const savedMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (justSaved) savedMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [justSaved]);

  const sectionCounts = countSections(current.ticked);
  const score = totalOf(sectionCounts);
  const canSave = hasAnything(current);

  const updateCurrent = (partial: Partial<CheckIn>) => {
    if (justSaved) setJustSaved(null);
    saved.patch({ current: { ...current, ...partial } });
  };

  const toggleItem = (id: string, on: boolean) =>
    updateCurrent({ ticked: on ? [...current.ticked.filter((t) => t !== id), id] : current.ticked.filter((t) => t !== id) });

  const saveCheckIn = () => {
    if (!canSave) return;
    const date = todayISO();
    const entry: SavedCheckIn = { ...current, date, score, sectionCounts };
    saved.setData({ current: blankCheckIn, history: [entry, ...history].slice(0, MAX_HISTORY) });
    setJustSaved(date);
  };

  const clearCurrent = () => {
    setJustSaved(null);
    saved.patch({ current: blankCheckIn });
  };

  const removeCheckIn = (index: number) => saved.patch({ history: history.filter((_, i) => i !== index) });

  return (
    <>
      <Helmet>
        <title>Readiness for Change Checklist | Sober Helpline</title>
        <meta
          name="description"
          content="Assess your loved one's readiness for recovery based on actions, not promises. A practical checklist for families."
        />
      </Helmet>

      <ToolShell
        title="Readiness for Change Checklist"
        summary="Assess your loved one's readiness for recovery based on actions, not promises. A practical tool to measure observable behavior change. Come back every few weeks and save a check-in each time, so you can see which way things are moving."
        note="Based on the Transtheoretical Model of Change (Prochaska & DiClemente) and behavioral indicators of treatment readiness from ASAM criteria."
        kind="Checklist"
        minutes={10}
        saved={saved}
        hideReset
      >
        <ToolNote title="Instructions">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Complete this checklist based on what you have observed over the past 2–4 weeks, not what was said during
              emotional moments or crises.
            </li>
            <li>Check items that are consistently true, not occasional.</li>
            <li>If you are unsure, leave it unchecked.</li>
          </ul>
          <p className="mt-3">
            Every box is about your loved one and what they are doing. Nothing here is a judgment of you.
          </p>
        </ToolNote>

        <SafetyBox
          topics={["emergency", "suicide", "overdose"]}
          title="Low readiness is never a reason to wait in an emergency"
        />

        {SECTIONS.map((section, sectionIndex) => (
          <ToolSection
            key={section.key}
            step={sectionIndex + 1}
            title={section.title}
            description={`Ticked: ${sectionCounts[section.key] ?? 0} of ${section.items.length}`}
          >
            <div className="grid gap-2">
              {section.items.map((item, index) => {
                const id = itemId(section.key, index);
                return (
                  <CheckRow key={id} checked={current.ticked.includes(id)} onChange={(on) => toggleItem(id, on)}>
                    {item}
                  </CheckRow>
                );
              })}
            </div>
            <SavedTextarea
              label="Notes / examples:"
              placeholder="Add your observations here..."
              rows={2}
              value={current.notes[section.key] ?? ""}
              onChange={(value) => updateCurrent({ notes: { ...current.notes, [section.key]: value } })}
            />
          </ToolSection>
        ))}

        <ReadinessResult score={score} sectionCounts={sectionCounts} previous={history[0] ?? null} />

        <InsightVsBehavior />

        <ToolSection
          step={SECTIONS.length + 1}
          title="Family Reality Check"
          description="Answer honestly. These questions are for you to think about. They are saved with your check-in, and they do not change the count above."
        >
          <ToolNote title="Family Response Check">
            <p>Before you answer, notice any of these that apply:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {FAMILY_RESPONSE_SIGNS.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
            <p className="mt-3">
              <span className="font-medium">Reflection:</span> What boundary or structure might need to stay in place
              longer—regardless of insight?
            </p>
          </ToolNote>
          {REALITY_QUESTIONS.map((question) => (
            <ChoiceGroup
              key={question.id}
              label={question.question}
              options={question.options}
              value={current.reality[question.id] ?? ""}
              onChange={(value) => updateCurrent({ reality: { ...current.reality, [question.id]: value } })}
              columns={2}
            />
          ))}
        </ToolSection>

        <ToolSection step={SECTIONS.length + 2} title="Action Based on Current Readiness" description="Tick what you will do next.">
          <CheckList options={ACTION_OPTIONS} selected={current.actions} onChange={(actions) => updateCurrent({ actions })} />
          <SavedInput
            label="Revisit this checklist in ___ weeks"
            hint="Type a number of weeks, for example 2."
            maxLength={20}
            value={current.revisitWeeks}
            onChange={(revisitWeeks) => updateCurrent({ revisitWeeks })}
          />
        </ToolSection>

        <ToolSection
          title="Save this check-in"
          description="Saving files today's answers under today's date and clears the page, ready for next time."
          tone="highlight"
          className="print:hidden"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="min-h-12" onClick={saveCheckIn} disabled={!canSave}>
              Save this check-in
            </Button>
            {canSave && (
              <ConfirmButton
                label="Clear this check-in"
                title="Clear this check-in?"
                description="This clears what you have ticked and written on this page. Your earlier check-ins stay."
                confirmLabel="Clear it"
                onConfirm={clearCurrent}
              />
            )}
          </div>
          {!canSave && !justSaved && (
            <p className="text-sm text-muted-foreground">Tick or write something above first, then save it here.</p>
          )}
          {justSaved && (
            <div ref={savedMessageRef} role="status" className="rounded-lg border border-primary/30 bg-background p-3 text-sm text-foreground">
              Saved. Your check-in for {formatDate(justSaved)} is listed below. Come back in a few weeks and fill in a new
              one.
            </div>
          )}
        </ToolSection>

        {history.length > 0 && <EarlierCheckIns history={history} onRemove={removeCheckIn} />}

        <ToolNote title="Key Reminder">
          <p className="font-medium">Readiness is proven through effort, not emotion.</p>
          <p className="mt-1 font-medium">Consistency matters more than intensity.</p>
          <p className="mt-1">Families help most when they allow actions—not promises—to guide decisions.</p>
        </ToolNote>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-6 print:hidden">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Suggested Companion Tools</h2>
          <ul className="space-y-1">
            {COMPANION_TOOLS.map((tool) => (
              <li key={tool.to}>
                <Link to={tool.to} className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline">
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="print:hidden">
          <RelatedResources currentPath="/readiness-checklist" />
        </div>
      </ToolShell>
    </>
  );
}
