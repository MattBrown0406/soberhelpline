import SafetyBox from "@/components/SafetyBox";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
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

// ---------------------------------------------------------------------------
// The checklists (the owner's words)
// ---------------------------------------------------------------------------

const PREPARATION_ITEMS = [
  "I am regulated and calm",
  "I know what decision is being discussed",
  "I have specific questions written down",
  "I understand what I'm asking for (clarity, delay, reassessment, support)",
  "I am prepared to pause the process if needed",
];

const CLINICAL_QUESTIONS = [
  '"What problem is this level of care addressing specifically?"',
  '"What would indicate this plan is not working?"',
  '"What does success look like in the next 30 days?"',
  '"What happens if motivation drops?"',
  '"What risks concern you most right now?"',
];

const DISCHARGE_QUESTIONS = [
  '"What structure is in place after discharge?"',
  '"What are the relapse risks we should anticipate?"',
  '"Who is accountable for follow-up?"',
  '"What support does the family need to maintain boundaries?"',
];

const ETHICS_QUESTIONS = [
  '"Are there financial relationships tied to this recommendation?"',
  '"What alternatives did you consider?"',
  '"Can we have this in writing?"',
];

const TRACKING_ITEMS = [
  "Names, roles, and contact info documented",
  "Dates of major decisions recorded",
  "Recommendations given (in writing if possible)",
  "Concerns raised and responses noted",
  "Aftercare commitments confirmed",
  "Missed follow-ups tracked",
];

const VALUES_ANCHOR_ITEMS = [
  "Did we act with integrity?",
  "Did we stay within our role?",
  "Did we protect safety and clarity?",
  "Did we maintain our boundaries?",
  "Did we avoid rescuing?",
];

const SCRIPTS = [
  { title: "Asking for Clarity", line: '"Can you help us understand the reasoning behind this recommendation?"' },
  { title: "Slowing the Process", line: '"We need time to review this before deciding."' },
  {
    title: "Addressing Concerns Without Accusation",
    line: '"We\'re noticing a gap here and want to understand how it\'s being addressed."',
  },
  { title: "Reinforcing Boundaries", line: '"Our family boundaries are firm. We want the plan to align with that."' },
  { title: "Asking for Reassessment", line: '"Given what we\'re seeing, can we revisit the level of care?"' },
];

const COMPANION_LINKS = [
  { to: "/treatment-red-flags", label: "Treatment Industry Red Flags Guide" },
  { to: "/treatment-questions", label: "40 Questions to Ask a Treatment Center" },
  { to: "/aftercare-checklist", label: "Aftercare Readiness Checklist" },
  { to: "/family-action-plan", label: "Family Recovery Action Plan" },
  { to: "/crisis-chaos", label: "Crisis vs. Chaos Decision Guide" },
  { to: "/workbook/guilt-check", label: "Guilt vs. Responsibility Worksheet" },
];

// ---------------------------------------------------------------------------
// What is saved
// ---------------------------------------------------------------------------

interface ContactNote {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  who: string;
  said: string;
  agreed: string;
  /** YYYY-MM-DD */
  followUp: string;
}

interface AdvocacySheet {
  preparation: string[];
  preparationNotes: string;
  clinicalQuestions: string[];
  dischargeQuestions: string[];
  ethicsQuestions: string[];
  questionNotes: string;
  tracking: string[];
  trackingNotes: string;
  /** Calls and meetings, newest first. */
  contacts: ContactNote[];
  valuesAnchor: string[];
  generalNotes: string;
}

const MAX_CONTACTS = 60;
const FIRST_CONTACT_ID = "contact-1";

const blankContact = (id: string): ContactNote => ({ id, date: "", who: "", said: "", agreed: "", followUp: "" });

const blankSheet: AdvocacySheet = {
  preparation: [],
  preparationNotes: "",
  clinicalQuestions: [],
  dischargeQuestions: [],
  ethicsQuestions: [],
  questionNotes: "",
  tracking: [],
  trackingNotes: "",
  contacts: [blankContact(FIRST_CONTACT_ID)],
  valuesAnchor: [],
  generalNotes: "",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const asText = (value: unknown): string => (typeof value === "string" ? value : "");
const asList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

/** Fill in anything missing from an older or partial saved copy. */
function tidyContacts(raw: unknown): ContactNote[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.filter(isRecord).map((row, index) => {
    let id = asText(row.id) || `contact-${index + 1}`;
    if (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);
    return {
      id,
      date: asText(row.date),
      who: asText(row.who),
      said: asText(row.said),
      agreed: asText(row.agreed),
      followUp: asText(row.followUp),
    };
  });
}

const contactHasText = (row: ContactNote) => !!(row.date || row.who.trim() || row.said.trim() || row.agreed.trim() || row.followUp);

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function ReadingList({ title, items, tone = "plain" }: { title: string; items: ReactNode[]; tone?: "plain" | "caution" }) {
  return (
    <div
      className={
        tone === "caution"
          ? "rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100 print:break-inside-avoid print:border-foreground/30"
          : "rounded-lg border border-border bg-card p-4 text-foreground print:break-inside-avoid print:border-foreground/30"
      }
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ContactCard({
  row,
  number,
  onChange,
  onRemove,
}: {
  row: ContactNote;
  /** Counted from the oldest, so the number stays with the note. */
  number: number;
  onChange: (changes: Partial<ContactNote>) => void;
  onRemove: () => void;
}) {
  const name = `call or meeting ${number}`;
  return (
    <div className="space-y-4 rounded-lg border border-border p-4 print:break-inside-avoid print:border-0 print:border-t print:p-0 print:pt-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Call or meeting {number}</h3>
        {contactHasText(row) ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="min-h-11 gap-1.5 text-muted-foreground print:hidden" aria-label={`Remove ${name}`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this call or meeting?</AlertDialogTitle>
                <AlertDialogDescription>
                  This clears what you wrote about it. Your other notes stay as they are.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11 gap-1.5 text-muted-foreground print:hidden"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SavedInput label="Date" type="date" value={row.date} onChange={(date) => onChange({ date })} />
        <SavedInput
          label="Who you spoke with"
          hint="Name and role."
          value={row.who}
          onChange={(who) => onChange({ who })}
        />
      </div>
      <SavedTextarea label="What was said" rows={3} maxLength={1500} value={row.said} onChange={(said) => onChange({ said })} />
      <SavedTextarea
        label="What was agreed"
        hint="Who will do what, and by when."
        rows={2}
        maxLength={1500}
        value={row.agreed}
        onChange={(agreed) => onChange({ agreed })}
      />
      <SavedInput
        label="Follow-up date"
        hint="When you will check that it happened."
        type="date"
        value={row.followUp}
        onChange={(followUp) => onChange({ followUp })}
        className="sm:max-w-xs"
      />
    </div>
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

const inlineLink = "font-medium text-primary underline underline-offset-2 hover:text-primary/80 print:text-foreground print:no-underline";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FamilyAdvocacyToolkit() {
  useGuideTracking("/family-advocacy-toolkit", "Family Advocacy Toolkit");
  const saved = useSavedTool<AdvocacySheet>("tool:family-advocacy-toolkit", blankSheet);
  const sheet = saved.data;

  // Older or partial saved copies may be missing pieces.
  const preparation = asList(sheet.preparation);
  const contacts = tidyContacts(sheet.contacts);

  const updateContact = (id: string, changes: Partial<ContactNote>) =>
    saved.patch({ contacts: contacts.map((row) => (row.id === id ? { ...row, ...changes } : row)) });
  const addContact = () =>
    saved.patch({ contacts: [blankContact(`contact-${Date.now().toString(36)}`), ...contacts].slice(0, MAX_CONTACTS) });
  const removeContact = (id: string) => saved.patch({ contacts: contacts.filter((row) => row.id !== id) });

  return (
    <>
      <Helmet>
        <title>Family Advocacy Toolkit | Sober Helpline</title>
        <meta
          name="description"
          content="Learn to advocate effectively for your loved one without burning out or overstepping. Clear frameworks, scripts, and decision tools for families."
        />
      </Helmet>

      <ToolShell
        title="Family Advocacy Toolkit"
        summary="How to advocate effectively without burning out or overstepping. Clear frameworks, scripts, and decision tools for families navigating the treatment system."
        note="Based on patient advocacy best practices, NAATP family engagement standards, and clinical ethics in addiction medicine."
        kind="Checklist"
        saved={saved}
      >
        <ToolNote title="Purpose">
          <p>
            Families often know something is wrong—but don't know how to speak up, what to ask for, or when to push
            back. This toolkit provides clear frameworks, scripts, and decision tools to help families advocate
            ethically, calmly, and effectively—while still respecting professional roles and boundaries.
          </p>
          <p className="mt-3 text-base font-semibold">
            Advocacy is not control.
            <br />
            It is informed participation.
          </p>
        </ToolNote>

        <ToolSection step={1} title="The Advocacy Mindset">
          <div className="grid gap-4 md:grid-cols-2">
            <ReadingList
              title="What Advocacy IS"
              items={[
                "Asking informed questions",
                "Clarifying recommendations",
                "Ensuring continuity of care",
                "Protecting safety and dignity",
                "Slowing rushed decisions",
                "Representing family reality accurately",
              ]}
            />
            <ReadingList
              title="What Advocacy is NOT"
              tone="caution"
              items={[
                "Diagnosing",
                "Arguing clinical judgment emotionally",
                "Demanding specific outcomes",
                "Micromanaging treatment",
                "Speaking for an adult loved one without consent",
              ]}
            />
          </div>
          <ToolNote>
            <strong>Key Reframe:</strong> You are not interfering—you are participating.
          </ToolNote>
        </ToolSection>

        <ToolSection
          step={2}
          title="Know Your Role (Critical)"
          description="Families are most effective advocates when they stay in the right lane."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ReadingList
              title="Your Lane ✓"
              items={[
                "History and pattern reporting",
                "Boundary clarification",
                "Environmental context",
                "Follow-through at home",
                "Support planning",
                "Asking for explanations",
              ]}
            />
            <ReadingList
              title="Not Your Lane ✗"
              tone="caution"
              items={[
                "Treatment planning details",
                "Clinical diagnoses",
                "Medication decisions",
                "Therapist selection",
                "Day-to-day treatment execution",
              ]}
            />
          </div>
          <p className="text-sm italic leading-relaxed text-muted-foreground">
            Advocacy works best when roles are respected and coordinated.
          </p>
        </ToolSection>

        <ToolSection
          step={3}
          title="Advocacy Preparation Checklist"
          description="Before any important call, meeting, or decision:"
        >
          <CheckList
            options={PREPARATION_ITEMS}
            selected={preparation}
            onChange={(next) => saved.patch({ preparation: next })}
          />
          {preparation.length > 0 && (
            <Button
              variant="ghost"
              className="min-h-11 gap-1.5 text-muted-foreground print:hidden"
              onClick={() => saved.patch({ preparation: [] })}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Untick these for the next call
            </Button>
          )}
          <ToolNote tone="caution">
            <strong>If emotions are high, delay advocacy.</strong>
          </ToolNote>
          <SavedTextarea
            label="Notes about your preparation"
            hint="For example, the decision being discussed and the questions you want answered."
            value={asText(sheet.preparationNotes)}
            onChange={(preparationNotes) => saved.patch({ preparationNotes })}
          />
        </ToolSection>

        <ToolSection
          step={4}
          title="Core Advocacy Questions"
          description="Check off questions as you ask them. These surface integrity, planning quality, and realism."
        >
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground">Clinical & Treatment</h3>
            <CheckList
              options={CLINICAL_QUESTIONS}
              selected={asList(sheet.clinicalQuestions)}
              onChange={(clinicalQuestions) => saved.patch({ clinicalQuestions })}
            />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground">Discharge & Transitions</h3>
            <CheckList
              options={DISCHARGE_QUESTIONS}
              selected={asList(sheet.dischargeQuestions)}
              onChange={(dischargeQuestions) => saved.patch({ dischargeQuestions })}
            />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground">Ethics & Transparency</h3>
            <CheckList
              options={ETHICS_QUESTIONS}
              selected={asList(sheet.ethicsQuestions)}
              onChange={(ethicsQuestions) => saved.patch({ ethicsQuestions })}
            />
          </div>
          <SavedTextarea
            label="Notes about responses received"
            rows={4}
            value={asText(sheet.questionNotes)}
            onChange={(questionNotes) => saved.patch({ questionNotes })}
          />
        </ToolSection>

        <ToolSection step={5} title="Advocacy Scripts (Use Calm, Neutral Language)">
          <div className="grid gap-3">
            {SCRIPTS.map((script) => (
              <div key={script.title} className="rounded-lg border border-border p-4 print:break-inside-avoid print:border-0 print:p-0">
                <h3 className="text-sm font-medium text-muted-foreground">{script.title}</h3>
                <p className="mt-1 text-base italic leading-relaxed text-foreground">{script.line}</p>
              </div>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          step={6}
          title="Documentation & Tracking Tools"
          description="Families should maintain a simple advocacy record, especially during transitions."
        >
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">Keep Track Of:</p>
            <CheckList
              options={TRACKING_ITEMS}
              selected={asList(sheet.tracking)}
              onChange={(tracking) => saved.patch({ tracking })}
            />
          </div>
          <ToolNote>
            <strong>Why this matters:</strong> Consistency and memory protect families from confusion and
            miscommunication.
          </ToolNote>

          <div className="space-y-4 border-t border-border pt-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Calls and meetings</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Write a few lines after each call or meeting, while you still remember it. The newest is at the top.
              </p>
            </div>
            {contacts.length < MAX_CONTACTS && (
              <Button variant="outline" className="min-h-11 gap-2 print:hidden" onClick={addContact}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add a call or meeting
              </Button>
            )}
            {contacts.length === 0 && (
              <p className="text-sm leading-relaxed text-muted-foreground print:hidden">Nothing written down yet.</p>
            )}
            {contacts.map((row, index) => (
              <ContactCard
                key={row.id}
                row={row}
                number={contacts.length - index}
                onChange={(changes) => updateContact(row.id, changes)}
                onRemove={() => removeContact(row.id)}
              />
            ))}
          </div>

          <SavedTextarea
            label="Additional tracking notes"
            hint="For example, names, roles and phone numbers of the people on the treatment team."
            value={asText(sheet.trackingNotes)}
            onChange={(trackingNotes) => saved.patch({ trackingNotes })}
          />
        </ToolSection>

        <ToolSection step={7} title="Advocacy During High-Risk Moments">
          <SafetyBox topics={["emergency", "suicide", "overdose"]} title="In a crisis or after a relapse, safety comes first" />
          <div className="grid gap-4 md:grid-cols-3">
            <ReadingList
              title="During Crisis"
              tone="caution"
              items={[
                "Focus on safety first",
                "Avoid treatment debates",
                "Document what happened",
                "Return to advocacy after stabilization",
              ]}
            />
            <ReadingList
              title="During Discharge"
              items={[
                <>
                  Revisit{" "}
                  <Link to="/aftercare-checklist" className={inlineLink}>
                    Aftercare Readiness Checklist
                  </Link>
                </>,
                "Confirm appointments and structure",
                "Reassert family boundaries",
                "Do not rely on verbal assurances",
              ]}
            />
            <ReadingList
              title="After Relapse"
              items={[
                "Avoid blame or panic",
                'Ask: "What changes now?"',
                "Reassess structure and accountability",
                "Advocate for escalation if needed",
              ]}
            />
          </div>
        </ToolSection>

        <ToolSection step={8} title="Common Advocacy Pitfalls to Avoid">
          <ul className="grid list-disc gap-x-6 gap-y-1.5 pl-5 text-sm leading-relaxed text-foreground md:grid-cols-2">
            <li>Speaking from fear instead of facts</li>
            <li>Advocating alone without support</li>
            <li>Over-sharing family conflict details</li>
            <li>Trying to "convince" instead of clarify</li>
            <li>Backing down due to intimidation</li>
            <li>Assuming professionals know family boundaries</li>
          </ul>
        </ToolSection>

        <ToolSection step={9} title="When to Escalate Advocacy">
          <div className="grid gap-4 md:grid-cols-2">
            <ReadingList
              title="Escalation is appropriate when:"
              items={[
                "Safety concerns are dismissed",
                "Ethical red flags appear",
                "Communication breaks down",
                "Aftercare planning is inadequate",
                "Boundaries are repeatedly ignored",
              ]}
            />
            <ReadingList
              title="Escalation Options:"
              items={[
                "Ask for clinical supervisor involvement",
                "Request case conference",
                "Seek second opinions",
                "Pause discharge",
                "Consult an independent professional or advocate",
              ]}
            />
          </div>
          <ToolNote>
            <strong>Escalation does not equal hostility.</strong>
          </ToolNote>
        </ToolSection>

        <ToolSection
          step={10}
          title="Family Advocacy Self-Care"
          description="Advocacy is emotionally taxing. Families must:"
        >
          <ul className="grid list-disc gap-x-6 gap-y-1.5 pl-5 text-sm leading-relaxed text-foreground md:grid-cols-2">
            <li>Share advocacy responsibilities</li>
            <li>Debrief after difficult conversations</li>
            <li>
              Revisit{" "}
              <Link to="/emotional-regulation" className={inlineLink}>
                emotional regulation tools
              </Link>
            </li>
            <li>Avoid becoming the "case manager"</li>
            <li>Remember advocacy does not equal control</li>
          </ul>
          <p className="text-sm font-medium leading-relaxed text-foreground">
            You can advocate fiercely and still step back emotionally.
          </p>
        </ToolSection>

        <ToolSection step={11} title="Advocacy Values Anchor" description="Before and after advocating, ask:">
          <CheckList
            options={VALUES_ANCHOR_ITEMS}
            selected={asList(sheet.valuesAnchor)}
            onChange={(valuesAnchor) => saved.patch({ valuesAnchor })}
          />
          <ToolNote>
            <strong>If yes to all—you advocated well.</strong>
          </ToolNote>
        </ToolSection>

        <ToolNote title="Final Reframe">
          <p className="text-base font-semibold">
            Effective advocacy is calm, informed, and persistent—not loud, emotional, or controlling.
          </p>
          <p className="mt-2">
            Families do not need to fight the system.
            <br />
            They need to understand it—and engage wisely.
          </p>
        </ToolNote>

        <ToolSection title="Additional Notes & Observations">
          <SavedTextarea
            label="Anything else you want to remember"
            placeholder="Document any other advocacy notes, outcomes, or follow-up items..."
            rows={4}
            value={asText(sheet.generalNotes)}
            onChange={(generalNotes) => saved.patch({ generalNotes })}
          />
        </ToolSection>

        <CompanionLinks />

        <div className="print:hidden">
          <RelatedResources currentPath="/family-advocacy-toolkit" />
        </div>
      </ToolShell>
    </>
  );
}
