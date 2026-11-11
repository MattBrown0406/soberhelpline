import { useEffect, useRef, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { AlertTriangle, Trash2 } from "lucide-react";
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
import SafetyBox from "@/components/SafetyBox";
import { CheckRow, SavedTextarea, ToolNote, ToolSection, ToolShell } from "@/components/tools/ToolKit";

// A repeated check-in on relapse warning signs. She ticks what has been
// consistently present in `current`; "Save this check-in" files a dated copy
// under `history` so the pattern over time is visible, and clears the page.

// ---------------------------------------------------------------------------
// The owner's content
// ---------------------------------------------------------------------------

interface Sign {
  id: string;
  label: string;
}

interface SignGroup {
  key: string;
  title: string;
  /** Short name for the earlier check-ins list. */
  short: string;
  signs: Sign[];
}

const GROUPS: SignGroup[] = [
  {
    key: "emotional",
    title: "Emotional Warning Signs",
    short: "Emotional",
    signs: [
      { id: "emotional-1", label: "Increased irritability or defensiveness" },
      { id: "emotional-2", label: "Withdrawal or emotional distance" },
      { id: "emotional-3", label: "Increased shame, hopelessness, or self-pity" },
      { id: "emotional-4", label: "Blaming others more frequently" },
      { id: "emotional-5", label: "Overconfidence about recovery" },
      { id: "emotional-6", label: "Mood swings or emotional instability" },
      { id: "emotional-7", label: "Increased anxiety or restlessness" },
      { id: "emotional-8", label: "Isolation from family and support systems" },
    ],
  },
  {
    key: "behavioral",
    title: "Behavioral Warning Signs",
    short: "Behavioral",
    signs: [
      { id: "behavioral-1", label: "Skipping recovery activities (meetings, therapy, etc.)" },
      { id: "behavioral-2", label: "Missed appointments or commitments" },
      { id: "behavioral-3", label: "Increased secrecy about whereabouts or activities" },
      { id: "behavioral-4", label: "Changes in routine or sleep patterns" },
      { id: "behavioral-5", label: "Decline in reliability or following through" },
      { id: "behavioral-6", label: "Reconnecting with old using friends or environments" },
      { id: "behavioral-7", label: "Neglecting self-care (hygiene, nutrition, exercise)" },
      { id: "behavioral-8", label: "Increased spending or unexplained financial issues" },
      { id: "behavioral-9", label: "Changes in eating habits (too much or too little)" },
    ],
  },
  {
    key: "thinking",
    title: "Thinking & Language Shifts",
    short: "Thinking & language",
    signs: [
      { id: "thinking-1", label: "Justifying risky behavior or situations" },
      { id: "thinking-2", label: "Romanticizing past use ('the good old days')" },
      { id: "thinking-3", label: "All-or-nothing thinking patterns" },
      { id: "thinking-4", label: "Resistance to feedback or suggestions" },
      { id: "thinking-5", label: "Denial of problems when confronted" },
      { id: "thinking-6", label: "Minimizing the severity of their addiction" },
      { id: "thinking-7", label: "Planning around potential use ('just in case')" },
      { id: "thinking-8", label: "Focusing on others' problems instead of their own" },
    ],
  },
  {
    key: "boundary",
    title: "Boundary & Accountability Shifts",
    short: "Boundaries & accountability",
    signs: [
      { id: "boundary-1", label: "Testing or pushing established boundaries" },
      { id: "boundary-2", label: "Asking for exceptions to rules or agreements" },
      { id: "boundary-3", label: "Using guilt-based pressure on family members" },
      { id: "boundary-4", label: "Resistance to accountability measures" },
      { id: "boundary-5", label: "Refusing to discuss recovery progress" },
      { id: "boundary-6", label: "Avoiding sponsor or recovery mentor" },
      { id: "boundary-7", label: "Manipulative behaviors increasing" },
    ],
  },
];

const TOTAL_SIGNS = GROUPS.reduce((sum, group) => sum + group.signs.length, 0);

const consultLinkClass = "font-medium text-primary underline underline-offset-2 hover:text-primary/80";

function ConsultLink({ children }: { children: ReactNode }) {
  return (
    <Link to="/family-consultation" className={consultLinkClass}>
      {children}
    </Link>
  );
}

interface Level {
  id: "low" | "moderate" | "elevated" | "high";
  name: string;
  heading: string;
  /** Short guidance for the result card. */
  guidance: ReactNode;
  /** The fuller "What to Do Next" text. */
  next: string;
  nextLink?: string;
  /**
   * "Recommended Actions" carried over from Relapse Radar (the owner's words),
   * matched to this tracker's four levels in order, lowest to highest. Shown
   * under the level she is at. Reading only: they change no count or band.
   */
  actions: string[];
  card: string;
  text: string;
  row: string;
}

// The owner's stated bands: 0–5, 6–12, 13–20, 21 and up.
const LEVELS: Level[] = [
  {
    id: "low",
    name: "Low",
    heading: "0-5 Signs: Low Concern",
    guidance: null,
    next: "Continue monitoring. These may be normal stress responses. Focus on maintaining healthy communication and your own wellbeing.",
    actions: [
      "Continue open communication with your loved one",
      "Encourage recovery meetings and support groups",
      "Maintain healthy family boundaries",
    ],
    card: "border-green-300 bg-green-100 dark:border-green-800 dark:bg-green-950/50",
    text: "text-green-700 dark:text-green-400",
    row: "bg-green-100 ring-2 ring-green-400 dark:bg-green-950/50",
  },
  {
    id: "moderate",
    name: "Moderate",
    heading: "6-12 Signs: Moderate Concern",
    guidance: (
      <>
        <strong>Moderate concern:</strong> Increase your own self-care and support. Gently observe patterns without
        confrontation. Consider discussing observations with a professional.
      </>
    ),
    next: "Increase your own support and self-care. Document patterns. Consider consulting with an addiction professional or attending a support group for families.",
    // Two of his lines for this level ("Schedule a family conversation",
    // "Increase check-ins and accountability") are left out here: this level's
    // own guidance says to observe without confrontation.
    actions: ["Reinforce existing boundaries", "Encourage additional recovery meetings"],
    card: "border-yellow-300 bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950/50",
    text: "text-yellow-700 dark:text-yellow-400",
    row: "bg-yellow-100 ring-2 ring-yellow-400 dark:bg-yellow-950/50",
  },
  {
    id: "elevated",
    name: "Elevated",
    heading: "13-20 Signs: Elevated Concern",
    guidance: (
      <>
        <strong>Elevated concern:</strong> Consider <ConsultLink>consulting with an interventionist</ConsultLink> or
        addiction professional. Strengthen your boundaries and prepare your support system.
      </>
    ),
    next: "Consider consulting with an interventionist. Review and strengthen your boundaries. Prepare your support network for potential crisis.",
    nextLink: "We recommend speaking with a professional interventionist about next steps.",
    actions: [
      "Have a serious, compassionate conversation",
      "Reinforce boundaries firmly",
      "Encourage professional counseling",
      "Increase accountability measures",
      "Consider a family intervention meeting",
    ],
    card: "border-orange-300 bg-orange-100 dark:border-orange-800 dark:bg-orange-950/50",
    text: "text-orange-700 dark:text-orange-400",
    row: "bg-orange-100 ring-2 ring-orange-400 dark:bg-orange-950/50",
  },
  {
    id: "high",
    name: "High",
    heading: "21+ Signs: High Concern",
    guidance: (
      <>
        <strong>High concern:</strong> We strongly recommend{" "}
        <ConsultLink>consulting with an interventionist</ConsultLink> to discuss next steps. Do not attempt to handle
        this alone.
      </>
    ),
    next: "Immediate professional consultation is strongly recommended. An interventionist can help you navigate this situation safely and effectively.",
    nextLink: "Please consult with an interventionist to create a plan of action.",
    actions: [
      "Seek professional guidance immediately",
      "Contact a professional interventionist",
      "Reinforce safety boundaries",
      "Encourage immediate professional support",
      "Prepare for crisis intervention if needed",
    ],
    card: "border-red-300 bg-red-100 dark:border-red-800 dark:bg-red-950/50",
    text: "text-red-700 dark:text-red-400",
    row: "bg-red-100 ring-2 ring-red-400 dark:bg-red-950/50",
  },
];

const levelFor = (total: number): Level =>
  total <= 5 ? LEVELS[0] : total <= 12 ? LEVELS[1] : total <= 20 ? LEVELS[2] : LEVELS[3];

const DO_LIST = [
  "Use this to track patterns over time",
  "Share observations with professionals",
  "Focus on consistency, not single incidents",
  "Maintain your own self-care",
  "Strengthen your support network",
  "Review and reinforce your boundaries",
];

const AVOID_LIST = [
  "Using this as ammunition in arguments",
  "Confronting aggressively without support",
  "Diagnosing or accusing based on a few signs",
  "Ignoring your own emotional needs",
  "Trying to control or fix them alone",
  "Making threats you won't follow through on",
];

// ---------------------------------------------------------------------------
// Saved shape
// ---------------------------------------------------------------------------

interface CheckIn {
  /** YYYY-MM-DD. Empty while she is still filling it in. */
  date: string;
  /** Ids of the ticked signs, e.g. "emotional-1". */
  ticked: string[];
  notes: string;
}

interface SavedCheckIn extends CheckIn {
  total: number;
  /** How many were ticked in each group, by group key. */
  groupCounts: Record<string, number>;
}

interface TrackerData {
  current: CheckIn;
  history: SavedCheckIn[];
}

const blankCheckIn: CheckIn = { date: "", ticked: [], notes: "" };
const blankData: TrackerData = { current: blankCheckIn, history: [] };
const MAX_HISTORY = 24;

// Saved copies can be old or partial, so read every field defensively.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

function readCheckIn(raw: unknown): CheckIn {
  if (!isRecord(raw)) return blankCheckIn;
  return {
    date: typeof raw.date === "string" ? raw.date : "",
    ticked: Array.isArray(raw.ticked) ? raw.ticked.filter((v): v is string => typeof v === "string") : [],
    notes: typeof raw.notes === "string" ? raw.notes : "",
  };
}

function countGroups(ticked: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const group of GROUPS) counts[group.key] = group.signs.filter((sign) => ticked.includes(sign.id)).length;
  return counts;
}

const totalOf = (counts: Record<string, number>) => GROUPS.reduce((sum, group) => sum + (counts[group.key] ?? 0), 0);

function readHistory(raw: unknown): SavedCheckIn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isRecord)
    .map((item) => {
      const checkIn = readCheckIn(item);
      const groupCounts = countGroups(checkIn.ticked);
      return { ...checkIn, groupCounts, total: totalOf(groupCounts) };
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

function changeText(total: number, previous: number | null): string {
  if (previous === null) return "Your first check-in";
  const diff = total - previous;
  if (diff === 0) return "Same number of signs as the time before";
  const signs = Math.abs(diff) === 1 ? "sign" : "signs";
  return diff > 0 ? `${diff} more ${signs} than the time before` : `${-diff} fewer ${signs} than the time before`;
}

/** How today's count compares with the last saved check-in. */
const sinceLast = (diff: number): string =>
  diff === 0 ? "The same today." : diff > 0 ? `${diff} more today.` : `${-diff} fewer today.`;

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

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

function SignGroupSection({
  step,
  group,
  ticked,
  onToggle,
}: {
  step: number;
  group: SignGroup;
  ticked: string[];
  onToggle: (id: string, on: boolean) => void;
}) {
  const count = group.signs.filter((sign) => ticked.includes(sign.id)).length;
  return (
    <ToolSection step={step} title={group.title} description={`Ticked: ${count} of ${group.signs.length}`}>
      <div className="grid gap-2">
        {group.signs.map((sign) => (
          <CheckRow key={sign.id} checked={ticked.includes(sign.id)} onChange={(on) => onToggle(sign.id, on)}>
            {sign.label}
          </CheckRow>
        ))}
      </div>
    </ToolSection>
  );
}

function GroupCounts({ counts }: { counts: Record<string, number> }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border text-sm print:border-0">
      {GROUPS.map((group) => (
        <li key={group.key} className="flex items-center justify-between gap-3 px-3.5 py-2.5 print:px-0 print:py-1">
          <span className="text-foreground">{group.title}</span>
          <span className="shrink-0 font-medium text-foreground">
            {counts[group.key] ?? 0} of {group.signs.length}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ConcernResult({
  total,
  groupCounts,
  previous,
}: {
  total: number;
  groupCounts: Record<string, number>;
  previous: SavedCheckIn | null;
}) {
  const level = total > 0 ? levelFor(total) : null;

  return (
    <ToolSection
      title="What you are seeing right now"
      description="This is a count of the signs you ticked above. It is a guide to how concerned to be, not a diagnosis."
    >
      {level ? (
        <div className={cn("rounded-lg border-2 p-4 print:border print:border-foreground/40", level.card)}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={cn("mt-1 h-6 w-6 shrink-0 print:hidden", level.text)} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm text-foreground/80">Warning Signs Observed</p>
              <p className={cn("text-2xl font-bold", level.text)}>
                {total} of {TOTAL_SIGNS}
              </p>
              <p className="mt-1 text-base text-foreground">
                Concern Level: <span className={cn("font-bold", level.text)}>{level.name}</span>
              </p>
              {level.guidance && <p className="mt-2 text-sm leading-relaxed text-foreground/90">{level.guidance}</p>}
              {previous && (
                <p className="mt-2 text-sm text-foreground/80">
                  Your last check-in, {formatDate(previous.date)}: {previous.total} of {TOTAL_SIGNS}. {sinceLast(total - previous.total)}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground print:hidden">
          Nothing is ticked yet, so there is no concern level to show. Go through the four groups above and tick what has
          been consistently present over the last 1–2 weeks.
        </div>
      )}

      <div className="print:break-inside-avoid">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Group by group</h3>
        <GroupCounts counts={groupCounts} />
      </div>

      <div className="print:break-inside-avoid">
        <h3 className="mb-2 text-sm font-semibold text-foreground">What to Do Next</h3>
        <ul className="space-y-2">
          {LEVELS.map((item) => {
            const active = level?.id === item.id;
            return (
              <li
                key={item.id}
                className={cn(
                  "rounded-lg p-3 text-sm print:p-0 print:py-1 print:ring-0",
                  active ? item.row : "bg-muted/50 print:bg-transparent",
                )}
              >
                <p className="font-semibold text-foreground">
                  {item.heading}
                  {active && <span className="font-normal"> (where things are now)</span>}
                </p>
                <p className="text-foreground/80">{item.next}</p>
                {item.nextLink && (
                  <p className="mt-1">
                    <ConsultLink>{item.nextLink}</ConsultLink>
                  </p>
                )}
                {active && (
                  <div className="mt-3 border-t border-foreground/15 pt-3">
                    <p className="font-semibold text-foreground">Recommended Actions</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-foreground/80">
                      {item.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                    {(item.id === "high" || item.id === "elevated") && (
                      <p className="mt-2 font-medium text-foreground">
                        If you think they have overdosed, they can't be woken, or there is any talk of suicide, call 911
                        (or call or text 988) first. Then call a professional.
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </ToolSection>
  );
}

function EarlierCheckIns({ history, onRemove }: { history: SavedCheckIn[]; onRemove: (index: number) => void }) {
  return (
    <ToolSection
      title="Earlier check-ins"
      description="Newest first. The pattern over several check-ins tells you more than any single one. The 24 most recent are kept."
    >
      <ul className="space-y-3">
        {history.map((checkIn, index) => {
          const previous = history[index + 1] ?? null;
          return (
            <li
              key={`${checkIn.date}-${index}`}
              className="rounded-lg border border-border p-4 print:break-inside-avoid print:border-0 print:p-0 print:py-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{formatDate(checkIn.date)}</p>
                  <p className="text-base text-foreground">
                    {checkIn.total} of {TOTAL_SIGNS} signs
                    {checkIn.total > 0 ? ` — ${levelFor(checkIn.total).name} concern` : " — none ticked"}
                  </p>
                  <p className="text-sm text-muted-foreground">{changeText(checkIn.total, previous ? previous.total : null)}</p>
                  <p className="mt-1 text-sm text-foreground/80">
                    {GROUPS.map((group) => `${group.short} ${checkIn.groupCounts[group.key] ?? 0}`).join(" · ")}
                  </p>
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
              {checkIn.notes.trim() !== "" && (
                <p className="mt-2 whitespace-pre-wrap border-l-2 border-border pl-3 text-sm text-foreground/90">{checkIn.notes}</p>
              )}
            </li>
          );
        })}
      </ul>
    </ToolSection>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RelapseWarningSignsTracker() {
  useGuideTracking("/relapse-warning-signs", "Relapse Warning Signs Tracker");
  const saved = useSavedTool<TrackerData>("tool:relapse-warning-signs", blankData);
  const current = readCheckIn(saved.data.current);
  const history = readHistory(saved.data.history);

  const [justSaved, setJustSaved] = useState<string | null>(null);
  const savedMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (justSaved) savedMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [justSaved]);

  const groupCounts = countGroups(current.ticked);
  const total = totalOf(groupCounts);
  const canSave = current.ticked.length > 0 || current.notes.trim() !== "";

  const updateCurrent = (partial: Partial<CheckIn>) => {
    if (justSaved) setJustSaved(null);
    saved.patch({ current: { ...current, ...partial } });
  };

  const toggleSign = (id: string, on: boolean) =>
    updateCurrent({ ticked: on ? [...current.ticked.filter((t) => t !== id), id] : current.ticked.filter((t) => t !== id) });

  const saveCheckIn = () => {
    if (!canSave) return;
    const date = todayISO();
    const entry: SavedCheckIn = { ...current, date, total, groupCounts };
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
        <title>Relapse Warning Signs Tracker | Sober Helpline</title>
        <meta
          name="description"
          content="Track and identify early warning signs that may indicate your loved one is at risk of returning to substance use."
        />
      </Helmet>

      <ToolShell
        title="Relapse Warning Signs Tracker"
        summary="Use this tracker to notice patterns over time. Check items that have been consistently present over the last 1–2 weeks. Return to substance use is the end of a process — not the beginning."
        note="Based on Gorski's relapse prevention model and Terence Gorski's clinical framework for identifying emotional, mental, and physical relapse stages."
        kind="Tracker"
        saved={saved}
        hideReset
      >
        <SafetyBox
          topics={["overdose", "emergency", "suicide"]}
          title="If you think they have relapsed or are about to"
          className="mb-0"
        />

        <ToolNote title="Understanding the Relapse Process">
          <p className="mb-2">
            Families often sense that something is wrong before a relapse happens, but they don't always know what the
            warning signs mean.
          </p>
          <p>
            <strong>Return to substance use is the END of a process—not the beginning.</strong> By the time someone picks
            up their substance of choice, they have likely been struggling internally for days, weeks, or even months.
          </p>
          <p className="mt-2">
            Relapse typically begins with <strong>emotional and mental changes</strong> long before any substance use
            occurs. Recognizing these early warning signs gives families the opportunity to intervene and provide support
            before a full return to use.
          </p>
        </ToolNote>

        <ToolSection
          title="The Three Stages of Relapse"
          description="Understanding these stages helps families recognize warning signs earlier"
        >
          <div className="grid gap-3 md:grid-cols-3 print:block print:space-y-2">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/30 print:border-0 print:p-0">
              <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-300">1. Emotional Relapse</h3>
              <p className="text-sm leading-relaxed text-foreground/80">
                The person isn't thinking about using, but their emotions and behaviors are setting them up. They may be
                isolating, not attending to emotional needs, or experiencing anxiety and mood swings.
              </p>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30 print:border-0 print:p-0">
              <h3 className="mb-2 font-semibold text-orange-800 dark:text-orange-300">2. Mental Relapse</h3>
              <p className="text-sm leading-relaxed text-foreground/80">
                A war begins in the mind. Part of them wants to use, part doesn't. They may romanticize past use, think
                about people/places associated with use, or plan how they could use "safely."
              </p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30 print:border-0 print:p-0">
              <h3 className="mb-2 font-semibold text-red-800 dark:text-red-300">3. Physical Relapse</h3>
              <p className="text-sm leading-relaxed text-foreground/80">
                The actual use of the substance. This is often the most visible sign, but by this point, the internal
                relapse process has been underway for some time.
              </p>
            </div>
          </div>
        </ToolSection>

        {GROUPS.map((group, index) => (
          <SignGroupSection key={group.key} step={index + 1} group={group} ticked={current.ticked} onToggle={toggleSign} />
        ))}

        <ToolSection
          step={GROUPS.length + 1}
          title="Notes & Observations"
          description="Record specific examples, dates, or patterns you've noticed. This can be helpful when consulting with professionals."
        >
          <SavedTextarea
            label="What you've noticed"
            placeholder="Document specific behaviors, conversations, or concerns you've observed..."
            rows={4}
            value={current.notes}
            onChange={(notes) => updateCurrent({ notes })}
          />
        </ToolSection>

        <ConcernResult total={total} groupCounts={groupCounts} previous={history[0] ?? null} />

        <ToolSection
          title="Save this check-in"
          description="Saving files today's answers under today's date and clears the page, ready for next time. Doing this every week or two is how you see the pattern over time."
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
              Saved. Your check-in for {formatDate(justSaved)} is listed below. Come back in a week or two and fill in a
              new one.
            </div>
          )}
        </ToolSection>

        {history.length > 0 && <EarlierCheckIns history={history} onRemove={removeCheckIn} />}

        <ToolSection title="How to Use This Information">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-green-700 dark:text-green-400">✓ Do</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                {DO_LIST.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-red-700 dark:text-red-400">✗ Avoid</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                {AVOID_LIST.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="border-t border-border pt-4 text-sm font-medium text-foreground">
            <strong>Remember:</strong> Awareness does not require confrontation. Consistency matters more than intensity.
            Your role is to observe, protect yourself, and seek appropriate support—not to control outcomes.
          </p>
        </ToolSection>

        <div className="print:hidden">
          <RelatedResources currentPath="/relapse-warning-signs" />
        </div>
      </ToolShell>
    </>
  );
}
