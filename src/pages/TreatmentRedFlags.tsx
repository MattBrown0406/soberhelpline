import SafetyBox from "@/components/SafetyBox";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
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
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useSavedTool } from "@/hooks/useSavedTool";
import RelatedResources from "@/components/RelatedResources";
import { CheckList, SavedInput, SavedTextarea, ToolNote, ToolSection, ToolShell } from "@/components/tools/ToolKit";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// The red flags, questions and gut check (the owner's words)
// ---------------------------------------------------------------------------

type GroupId = "marketing" | "referral" | "sales" | "operations" | "financial";

interface FlagGroup {
  id: GroupId;
  title: string;
  description: string;
  items: string[];
}

const FLAG_GROUPS: FlagGroup[] = [
  {
    id: "marketing",
    title: "Marketing Language Red Flags",
    description: "Be cautious of messaging that overpromises, exploits emotions, or uses vague buzzwords.",
    items: [
      "Claims guaranteed success or 100% cure rates",
      'Uses fear-based messaging ("This could be their last chance")',
      "Shames families for hesitation or asking questions",
      "Emphasizes luxury amenities over clinical care",
      "Uses vague buzzwords without specific explanations",
      "Makes relapse sound impossible at their program",
    ],
  },
  {
    id: "referral",
    title: "Referral & Placement Red Flags",
    description: "Ethical referrals are needs-based, not profit-based. Placement should follow clinical evaluation.",
    items: [
      "Referrer receives fees or incentives for recommendations",
      "Only one program option is presented",
      "Questions about alternatives are deflected or discouraged",
      "Placement recommended before clinical assessment",
      "Insurance checked before clinical needs discussed",
      "Referrer has undisclosed financial connection to program",
    ],
  },
  {
    id: "sales",
    title: "Sales Tactics Disguised as Care",
    description: "Quality treatment does not disappear overnight. Clinical care should come before financial logistics.",
    items: [
      'High-pressure timelines ("We need a decision today")',
      "Claims beds won't be available if you wait",
      "Offers expiring discounts or limited-time deals",
      "Focuses heavily on insurance verification first",
      "Payment discussed before clinical appropriateness",
      "Avoids providing written information or policies",
    ],
  },
  {
    id: "operations",
    title: "Program Operations Red Flags",
    description: "Addiction affects families—ethical programs acknowledge this and plan for transitions.",
    items: [
      "Staff credentials are unclear or unexplained",
      "Families are discouraged from involvement",
      "Updates are vague, infrequent, or dismissive",
      "Family education is optional or nonexistent",
      "No clear aftercare or discharge planning discussed",
      "Length of stay driven by insurance, not clinical need",
    ],
  },
  {
    id: "financial",
    title: "Financial & Insurance Red Flags",
    description: "Length of stay should be clinically driven, not financially driven.",
    items: [
      "Costs are not clearly explained upfront",
      "Out-of-pocket expenses are minimized or hidden",
      "Refund or cancellation policies are unclear",
      'Pressure to "use up all insurance benefits"',
      "Financial discussions prioritized over clinical care",
      "No written cost breakdown provided",
    ],
  },
];

const INTEGRITY_QUESTIONS: { id: string; question: string }[] = [
  { id: "not-appropriate", question: '"What would make this program NOT appropriate for our situation?"' },
  { id: "not-enough", question: '"What happens if this level of care isn\'t enough?"' },
  { id: "relapse", question: '"How do you handle relapse or early discharge?"' },
  { id: "family", question: '"How do families stay involved in the process?"' },
  { id: "outcomes", question: '"What outcomes do you actually track and measure?"' },
];

const GUT_CHECK_ITEMS = [
  "I feel informed rather than pressured",
  "My questions are welcomed, not dismissed",
  "I am NOT being rushed emotionally",
  "This approach aligns with our family values",
  "I would recommend this approach to another family",
];

const ETHICAL_BEHAVIORS = [
  "Encourage second opinions",
  "Welcome informed families",
  "Explain limitations honestly",
  "Involve families appropriately",
  "Coordinate across levels of care",
  "Discuss relapse risk realistically",
  "Respect boundaries and autonomy",
];

const COMPANION_LINKS = [
  { to: "/treatment-questions", label: "40 Questions to Ask a Treatment Center" },
  { to: "/aftercare-checklist", label: "Aftercare Readiness Checklist" },
  { to: "/family-action-plan", label: "Family Recovery Action Plan" },
  { to: "/crisis-chaos", label: "Crisis vs. Chaos Decision Guide" },
  { to: "/readiness-checklist", label: "Readiness for Change Checklist" },
];

// ---------------------------------------------------------------------------
// What is saved: one sheet per program she is vetting
// ---------------------------------------------------------------------------

interface Program {
  id: string;
  name: string;
  /** Date of the call or visit, YYYY-MM-DD. */
  callDate: string;
  spokeTo: string;
  /** Red flags ticked (the item's text). */
  flags: string[];
  /** "Specific examples or concerns" for each group of flags. */
  flagNotes: Record<GroupId, string>;
  /** What they said to each integrity question, by question id. */
  answers: Record<string, string>;
  /** Gut-check statements that feel true. */
  gutCheck: string[];
  notes: string;
}

interface RedFlagsSheet {
  programs: Program[];
  activeId: string;
}

const MAX_PROGRAMS = 12;
const FIRST_PROGRAM_ID = "program-1";

const blankProgram = (id: string): Program => ({
  id,
  name: "",
  callDate: "",
  spokeTo: "",
  flags: [],
  flagNotes: { marketing: "", referral: "", sales: "", operations: "", financial: "" },
  answers: {},
  gutCheck: [],
  notes: "",
});

const blankSheet: RedFlagsSheet = { programs: [blankProgram(FIRST_PROGRAM_ID)], activeId: FIRST_PROGRAM_ID };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const asText = (value: unknown): string => (typeof value === "string" ? value : "");
const asList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

/** Fill in anything missing from an older or partial saved copy. */
function tidyProgram(raw: unknown, fallbackId: string): Program {
  const blank = blankProgram(fallbackId);
  if (!isRecord(raw)) return blank;
  const answers: Record<string, string> = {};
  if (isRecord(raw.answers)) {
    for (const q of INTEGRITY_QUESTIONS) answers[q.id] = asText(raw.answers[q.id]);
  }
  const flagNotes = { ...blank.flagNotes };
  if (isRecord(raw.flagNotes)) {
    for (const group of FLAG_GROUPS) flagNotes[group.id] = asText(raw.flagNotes[group.id]);
  }
  return {
    id: asText(raw.id) || fallbackId,
    name: asText(raw.name),
    callDate: asText(raw.callDate),
    spokeTo: asText(raw.spokeTo),
    flags: asList(raw.flags),
    flagNotes,
    answers,
    gutCheck: asList(raw.gutCheck),
    notes: asText(raw.notes),
  };
}

function tidyPrograms(raw: unknown): Program[] {
  const list = Array.isArray(raw) ? raw.map((p, i) => tidyProgram(p, `program-${i + 1}`)) : [];
  // Ids must be unique for switching and removing to work.
  const seen = new Set<string>();
  const unique = list.map((p, i) => {
    const id = seen.has(p.id) ? `${p.id}-${i + 1}` : p.id;
    seen.add(id);
    return id === p.id ? p : { ...p, id };
  });
  return unique.length > 0 ? unique : [blankProgram(FIRST_PROGRAM_ID)];
}

const programLabel = (program: Program, index: number) => program.name.trim() || `Program ${index + 1}`;

const flagsInGroup = (program: Program, group: FlagGroup) => group.items.filter((item) => program.flags.includes(item));
const totalFlags = (program: Program) => FLAG_GROUPS.reduce((sum, group) => sum + flagsInGroup(program, group).length, 0);
const answersWritten = (program: Program) => INTEGRITY_QUESTIONS.filter((q) => (program.answers[q.id] ?? "").trim()).length;
const gutCheckTrue = (program: Program) => GUT_CHECK_ITEMS.filter((item) => program.gutCheck.includes(item)).length;

const hasAnything = (program: Program) =>
  !!(program.name.trim() || program.callDate || program.spokeTo.trim() || program.notes.trim()) ||
  program.flags.length > 0 ||
  program.gutCheck.length > 0 ||
  Object.values(program.answers).some((a) => a.trim()) ||
  Object.values(program.flagNotes).some((n) => n.trim());

const newProgramId = () => `program-${Date.now().toString(36)}`;

const PICKER_ID = "your-programs";

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function ProgramPicker({
  programs,
  activeId,
  onSelect,
  onAdd,
}: {
  programs: Program[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <section
      id={PICKER_ID}
      className="scroll-mt-24 rounded-xl border border-border bg-card p-5 sm:p-6 print:hidden"
      aria-label="Your programs"
    >
      <h2 className="text-lg font-semibold leading-snug text-foreground">Which program are you checking?</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Keep a separate sheet for each program you call (up to {MAX_PROGRAMS}). Everything below belongs to the one you
        pick here, and Print prints that one.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {programs.map((program, index) => {
          const active = program.id === activeId;
          const flags = totalFlags(program);
          return (
            <button
              key={program.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(program.id)}
              className={cn(
                "flex min-h-14 flex-col items-start justify-center rounded-lg border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "border-primary bg-primary/[0.08]" : "border-border hover:border-primary/40",
              )}
            >
              <span className="text-sm font-semibold leading-snug text-foreground">{programLabel(program, index)}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {active ? "You are filling this one in. " : ""}
                {flags === 0 ? "No red flags ticked" : flags === 1 ? "1 red flag ticked" : `${flags} red flags ticked`}
              </span>
            </button>
          );
        })}
      </div>
      {programs.length < MAX_PROGRAMS && (
        <Button variant="outline" className="mt-3 min-h-11 gap-2" onClick={onAdd}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add another program
        </Button>
      )}
    </section>
  );
}

function RemoveProgramButton({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="min-h-11 gap-1.5 text-muted-foreground">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This clears everything you ticked and wrote for this program. Your other programs stay as they are. If you'd
            like to keep it, print it first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ProgramSummary({ program }: { program: Program }) {
  const flags = totalFlags(program);
  const answers = answersWritten(program);
  const gut = gutCheckTrue(program);
  const started = flags > 0 || answers > 0 || gut > 0;

  if (!started) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        Nothing is ticked for this program yet. Tick what you see and hear, and a plain summary will show here.
      </p>
    );
  }

  return (
    <>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Red flags ticked: {flags} of {FLAG_GROUPS.reduce((sum, group) => sum + group.items.length, 0)}
        </p>
        <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card print:border-0">
          {FLAG_GROUPS.map((group) => (
            <li key={group.id} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5 text-sm print:px-0 print:py-1">
              <span className="text-foreground">{group.title}</span>
              <span className="shrink-0 font-semibold text-foreground">
                {flagsInGroup(program, group).length} of {group.items.length}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="space-y-1 text-sm leading-relaxed text-foreground">
        <li>
          Integrity questions with an answer written down: <strong>{answers} of {INTEGRITY_QUESTIONS.length}</strong>
        </li>
        <li>
          Reality check statements that feel true: <strong>{gut} of {GUT_CHECK_ITEMS.length}</strong>
        </li>
      </ul>
      <ToolNote>
        {flags > 0 ? (
          <p>Address these specific issues before deciding. Proceed with caution and ask more questions.</p>
        ) : (
          <p>No red flags ticked for this program so far. Continue due diligence.</p>
        )}
        <p className="mt-2">
          <strong>If you feel rushed, pressured, or confused—that's a signal to pause.</strong>
        </p>
        <p className="mt-2">
          <strong>Trust patterns—not promises.</strong>
        </p>
      </ToolNote>
    </>
  );
}

function CompanionLinks() {
  return (
    <div className="print:hidden">
      <h2 className="mb-3 text-lg font-semibold text-foreground">Suggested Companion Resources</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {COMPANION_LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="flex min-h-12 items-center rounded-lg border border-border px-3.5 py-3 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TreatmentRedFlags() {
  useGuideTracking("/treatment-red-flags", "Treatment Red Flags Checklist");
  const saved = useSavedTool<RedFlagsSheet>("tool:treatment-red-flags", blankSheet);

  const programs = tidyPrograms(saved.data.programs);
  const activeIndex = Math.max(
    0,
    programs.findIndex((p) => p.id === saved.data.activeId),
  );
  const program = programs[activeIndex];
  const label = programLabel(program, activeIndex);

  const updateProgram = (changes: Partial<Program>) =>
    saved.patch({
      programs: programs.map((p) => (p.id === program.id ? { ...p, ...changes } : p)),
      activeId: program.id,
    });

  const selectProgram = (id: string) => saved.patch({ programs, activeId: id });

  const addProgram = () => {
    const id = newProgramId();
    saved.patch({ programs: [...programs, blankProgram(id)], activeId: id });
  };

  const removeProgram = () => {
    const rest = programs.filter((p) => p.id !== program.id);
    const next = rest.length > 0 ? rest : [blankProgram(newProgramId())];
    saved.patch({ programs: next, activeId: next[Math.min(activeIndex, next.length - 1)].id });
    // Back up to the list so she can see which programs are left.
    document.getElementById(PICKER_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setGroupFlags = (group: FlagGroup, selected: string[]) =>
    updateProgram({ flags: [...program.flags.filter((flag) => !group.items.includes(flag)), ...selected] });

  return (
    <>
      <Helmet>
        <title>Treatment Industry Red Flags Guide | Sober Helpline</title>
        <meta
          name="description"
          content="Learn to identify unethical marketing, referrals, and placement pressure in the addiction treatment industry. Protect your family from predatory practices."
        />
      </Helmet>

      <ToolShell
        title="Treatment Industry Red Flags Guide"
        summary="How to identify unethical marketing, referrals, and placement pressure. Protect your family from predatory practices in the treatment industry. Use one sheet for each program you are considering."
        note="Informed by NAATP (National Association of Addiction Treatment Providers) ethics standards and SAMHSA treatment locator guidelines."
        kind="Checklist"
        minutes={15}
        saved={saved}
        hideReset
      >
        <ToolNote title="Purpose">
          <p>
            When families are scared, overwhelmed, and desperate for help, the treatment industry can feel impossible to
            navigate. While many ethical, high-quality programs exist, there are also business practices that prioritize
            admissions over outcomes.
          </p>
          <p className="mt-3">This guide helps families:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 font-semibold">
            <li>Slow down decision-making</li>
            <li>Ask the right questions</li>
            <li>Spot red flags early</li>
            <li>Avoid rushed or inappropriate placements</li>
          </ul>
          <p className="mt-3 text-base font-semibold">
            Ethical treatment welcomes questions.
            <br />
            Unethical treatment rushes answers.
          </p>
        </ToolNote>

        <SafetyBox
          topics={["emergency", "withdrawal"]}
          title="Slowing down is for choosing a program, not for an emergency"
        />

        <ToolSection title="Why Families Are Vulnerable">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Treatment decisions are often made:</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>During emotional crises</li>
                <li>Under time pressure</li>
                <li>With limited knowledge</li>
                <li>While fearing worst-case outcomes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Unethical operators rely on:</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>Panic</li>
                <li>Guilt</li>
                <li>Urgency</li>
                <li>Promises of certainty</li>
              </ul>
            </div>
          </div>
          <ToolNote tone="caution">
            <strong>If you feel rushed, pressured, or confused—that's a signal to pause.</strong>
          </ToolNote>
        </ToolSection>

        {/* Merged from "How the Treatment Industry Actually Works" */}
        <ToolSection
          title="How the Treatment Industry Actually Works"
          description="Understanding the business of treatment so you can advocate effectively."
        >
          <div>
            <h3 className="text-base font-semibold text-foreground">How Treatment Centers Are Funded</h3>
            <div className="mt-3 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Insurance-Based Programs</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">These programs rely heavily on:</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                  <li>Insurance authorizations</li>
                  <li>Utilization reviews</li>
                  <li>Approved lengths of stay</li>
                </ul>
                <div className="mt-2 rounded-lg bg-muted/50 p-3 print:bg-transparent print:p-0">
                  <p className="text-sm font-medium text-foreground">What families should know:</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                    <li>Length of stay is often influenced by insurance—not just clinical need</li>
                    <li>Programs may discharge when coverage ends</li>
                    <li>"Medical necessity" language matters</li>
                  </ul>
                  <p className="mt-2 text-sm italic leading-relaxed text-foreground/90">
                    This does not mean care is bad—but it does mean financial forces are involved.
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Private-Pay Programs</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  These programs are funded directly by families or individuals.
                </p>
                <div className="mt-2 rounded-lg bg-muted/50 p-3 print:bg-transparent print:p-0">
                  <p className="text-sm font-medium text-foreground">What families should know:</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                    <li>Quality varies widely</li>
                    <li>Higher cost does not guarantee better care</li>
                    <li>"Luxury" does not equal "clinical depth"</li>
                  </ul>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    Private-pay programs should still provide clear clinical rationale, offer structured aftercare
                    planning, and be transparent about costs and expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">Admissions Is Often a Sales Role</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              This is one of the least understood—and most important—areas.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">In many organizations:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Admissions staff are not clinicians</li>
              <li>Their role is to fill beds</li>
              <li>They are trained to reduce hesitation</li>
            </ul>
            <p className="mt-2 text-sm italic leading-relaxed text-foreground/90">
              This doesn't automatically mean deception—but it does mean families must separate marketing language from
              clinical reality.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">How Referrals Actually Work</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Families often assume recommendations are purely clinical. Sometimes they are. Sometimes they are not.
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">Referral Relationships Can Include:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Financial incentives</li>
              <li>Marketing agreements</li>
              <li>Ownership overlap</li>
              <li>Informal "preferred partner" arrangements</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">Ethical providers are transparent about this.</p>
            <p className="mt-3 text-sm font-medium text-foreground">Families should always ask:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>"Are there any financial relationships tied to this referral?"</li>
              <li>"What alternatives did you consider?"</li>
              <li>"Why is this level of care appropriate?"</li>
            </ul>
          </div>
        </ToolSection>

        {/* Carried over from the Treatment Reality Navigator prompt page */}
        <ToolNote title="Common myths, not personal failures">
          <ul className="list-disc space-y-1 pl-5">
            <li>"If we find the right place, this will finally be fixed"</li>
            <li>"More expensive means better"</li>
            <li>"Length of stay guarantees outcomes"</li>
            <li>"Treatment will fix motivation, honesty, or willingness"</li>
          </ul>
        </ToolNote>

        <ProgramPicker programs={programs} activeId={program.id} onSelect={selectProgram} onAdd={addProgram} />

        {/* Keyed by program so nothing typed for one program lingers on screen for another. */}
        <div key={program.id} className="space-y-6 print:space-y-4">
          <ToolSection step={1} title="The program and the call" description="So you can tell your notes apart later.">
            <SavedInput
              label="Name of the program"
              value={program.name}
              onChange={(name) => updateProgram({ name })}
              maxLength={120}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SavedInput
                label="Date of the call"
                type="date"
                value={program.callDate}
                onChange={(callDate) => updateProgram({ callDate })}
              />
              <SavedInput
                label="Who I spoke to"
                hint="Their name and role, if you got them."
                value={program.spokeTo}
                onChange={(spokeTo) => updateProgram({ spokeTo })}
              />
            </div>
          </ToolSection>

          {FLAG_GROUPS.map((group, index) => (
            <ToolSection key={group.id} step={index + 2} title={group.title} description={group.description}>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">Check any that apply:</p>
                <CheckList
                  options={group.items}
                  selected={flagsInGroup(program, group)}
                  onChange={(selected) => setGroupFlags(group, selected)}
                />
              </div>
              <SavedTextarea
                label="Specific examples or concerns:"
                placeholder="Document specific instances you've observed..."
                rows={2}
                value={program.flagNotes[group.id]}
                onChange={(value) => updateProgram({ flagNotes: { ...program.flagNotes, [group.id]: value } })}
              />
            </ToolSection>
          ))}

          <ToolNote title="How Ethical Providers Behave">
            <ul className="grid list-disc gap-x-6 gap-y-1 pl-5 sm:grid-cols-2">
              {ETHICAL_BEHAVIORS.map((behavior) => (
                <li key={behavior}>{behavior}</li>
              ))}
            </ul>
          </ToolNote>

          <ToolSection
            step={7}
            title="Questions That Reveal Integrity"
            description={
              <>
                Ask these questions and notice the response. <strong>Tone matters. Defensiveness is a red flag.</strong>{" "}
                Write down what they said.
              </>
            }
          >
            {INTEGRITY_QUESTIONS.map((q) => (
              <SavedTextarea
                key={q.id}
                label={q.question}
                hint="Their answer, and how they answered it."
                rows={2}
                value={program.answers[q.id] ?? ""}
                onChange={(value) => updateProgram({ answers: { ...program.answers, [q.id]: value } })}
              />
            ))}
          </ToolSection>

          <ToolSection
            step={8}
            title="Family Reality Check"
            description="Ask yourself honestly—check each statement that feels TRUE:"
          >
            <CheckList
              options={GUT_CHECK_ITEMS}
              selected={program.gutCheck.filter((item) => GUT_CHECK_ITEMS.includes(item))}
              onChange={(gutCheck) => updateProgram({ gutCheck })}
            />
            <ToolNote tone="caution">
              <strong>Trust patterns—not promises.</strong>
            </ToolNote>
          </ToolSection>

          <ToolSection step={9} title="Additional Notes & Observations">
            <SavedTextarea
              label="Anything else about this program"
              placeholder="Document any other concerns, observations, or questions about this program..."
              rows={4}
              value={program.notes}
              onChange={(notes) => updateProgram({ notes })}
            />
          </ToolSection>

          <ToolSection title={`What you found: ${label}`} tone="highlight">
            <ProgramSummary program={program} />
          </ToolSection>

          {(programs.length > 1 || hasAnything(program)) && (
            <div className="flex justify-end print:hidden">
              <RemoveProgramButton label={label} onRemove={removeProgram} />
            </div>
          )}
        </div>

        {/* Merged from "How the Treatment Industry Actually Works" */}
        <ToolSection
          title={'Why Families Are Often Told "Everything Is Going Great"'}
          description="For after admission, when the updates start coming."
        >
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">Families frequently hear:</p>
            <ul className="mt-1 space-y-1 text-sm italic leading-relaxed text-muted-foreground">
              <li>"They're doing amazing."</li>
              <li>"They're very motivated."</li>
              <li>"No major concerns."</li>
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            <strong>Early stabilization can look like recovery—but it is not the same thing.</strong>
          </p>
          <ToolNote title="Families should ask:">
            <ul className="list-disc space-y-1 pl-5">
              <li>What behaviors have changed?</li>
              <li>How are they handling discomfort?</li>
              <li>What happens when structure is reduced?</li>
              <li>What does accountability look like after discharge?</li>
            </ul>
            <p className="mt-3 font-medium">Honest providers discuss risk, not just progress.</p>
          </ToolNote>
        </ToolSection>

        <ToolNote title="Final Reframe">
          <p className="text-base font-semibold">
            Ethical treatment respects your fear.
            <br />
            Unethical treatment exploits it.
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              <strong>Slowing down</strong> is not denial.
            </li>
            <li>
              <strong>Asking questions</strong> is not obstruction.
            </li>
            <li>
              <strong>Advocating</strong> is not being difficult.
            </li>
          </ul>
        </ToolNote>

        <CompanionLinks />

        <div className="print:hidden">
          <RelatedResources currentPath="/treatment-red-flags" />
        </div>
      </ToolShell>
    </>
  );
}
