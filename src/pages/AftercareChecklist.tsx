import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useSavedTool } from "@/hooks/useSavedTool";
import RelatedResources from "@/components/RelatedResources";
import SafetyBox from "@/components/SafetyBox";
import { CheckRow, ChoiceGroup, SavedTextarea, ToolNote, ToolSection, ToolShell } from "@/components/tools/ToolKit";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// The checklist (the owner's words)
// ---------------------------------------------------------------------------

type SectionId = "clinical" | "structure" | "accountability" | "lifestyle" | "relapse" | "family";

interface ChecklistItem {
  text: string;
  /** Only applies to some families: she can mark it "doesn't apply" and it leaves the total. */
  optional?: boolean;
}

interface ChecklistSection {
  id: SectionId;
  title: string;
  items: ChecklistItem[];
}

const SECTIONS: ChecklistSection[] = [
  {
    id: "clinical",
    title: "Clinical & Professional Continuity",
    items: [
      { text: "A licensed clinician has recommended the discharge timing" },
      { text: "A written aftercare plan exists (not verbal only)" },
      { text: "Outpatient provider(s) are confirmed with appointment dates" },
      { text: "Psychiatric follow-up is scheduled (if applicable)", optional: true },
      { text: "Medication plan is clear, understood, and monitored" },
      { text: "Releases of information are signed for coordination of care" },
    ],
  },
  {
    id: "structure",
    title: "Level of Structure After Discharge",
    items: [
      { text: "Appropriate next level of care is arranged (IOP, PHP, OP, etc.)" },
      { text: "Structured daily schedule exists for the first 30–60 days" },
      { text: "Sober living or recovery-supportive housing is secured (if needed)", optional: true },
      { text: "Transportation to appointments is planned and reliable" },
      { text: "Curfews, house rules, and expectations are clearly defined" },
    ],
  },
  {
    id: "accountability",
    title: "Accountability & Monitoring (Not Surveillance)",
    items: [
      { text: "Clear expectations for meeting attendance or therapy" },
      { text: "Accountability partner or sponsor identified" },
      { text: "Regular check-ins with professionals are scheduled" },
      { text: "Consequences for missed commitments are defined" },
      { text: "Family understands their role without micromanaging" },
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle & Environmental Stability",
    items: [
      { text: "Living environment is substance-free" },
      { text: "High-risk relationships have been addressed or limited" },
      { text: "Employment/school plans are realistic and phased" },
      { text: "Daily routines support sleep, meals, and structure" },
      { text: "Financial expectations and boundaries are clarified" },
    ],
  },
  {
    id: "relapse",
    title: "Relapse Prevention Planning",
    items: [
      { text: "Personal relapse warning signs are identified" },
      { text: "A written response plan exists for early warning signs" },
      { text: "Clear steps are outlined if relapse occurs" },
      { text: "Family knows how to respond without panic or rescue" },
      { text: "Emergency contacts and crisis plans are documented" },
      {
        text: "We have naloxone (Narcan) at home and know how to use it (if opioids were ever involved)",
        optional: true,
      },
    ],
  },
  {
    id: "family",
    title: "Family Alignment & Boundaries",
    items: [
      { text: "Family boundaries are clearly stated and agreed upon" },
      { text: "Enabling behaviors have been identified and addressed" },
      { text: "Consequences for boundary violations are understood" },
      { text: "Family members are aligned (or have their own boundaries)" },
      { text: "Family support systems are in place (therapy, groups, coaching)" },
    ],
  },
];

type RealityAnswer = "yes" | "no";

const REALITY_QUESTIONS: { id: string; question: string; concernIf: RealityAnswer }[] = [
  { id: "q1", question: "Are we rushing discharge because we're exhausted or relieved?", concernIf: "yes" },
  { id: "q2", question: "Are we relying more on hope than structure?", concernIf: "yes" },
  { id: "q3", question: "Have similar discharge plans failed before?", concernIf: "yes" },
  { id: "q4", question: "Are boundaries likely to soften once they're home?", concernIf: "yes" },
  { id: "q5", question: "Would we feel confident holding limits if things get uncomfortable?", concernIf: "no" },
];

const YES_NO: readonly { value: RealityAnswer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const COMPANION_LINKS = [
  { to: "/relapse-warning-signs", label: "Relapse Warning Signs Tracker" },
  { to: "/family-action-plan", label: "Family Recovery Action Plan" },
  { to: "/crisis-chaos", label: "Crisis vs. Chaos Decision Guide" },
  { to: "/workbook/boundary-script", label: "Boundary Setting Worksheet" },
  { to: "/readiness-checklist", label: "Readiness for Change Checklist" },
];

// ---------------------------------------------------------------------------
// What is saved: one living sheet
// ---------------------------------------------------------------------------

interface AftercarePlan {
  /** Items she has confirmed (the item's text). */
  confirmed: string[];
  /** "If applicable" items she has marked as not applying to her family. */
  doesNotApply: string[];
  notes: Record<SectionId, string>;
  /** Honest yes/no answers, by question id. */
  reality: Record<string, RealityAnswer>;
}

const blankPlan: AftercarePlan = {
  confirmed: [],
  doesNotApply: [],
  notes: { clinical: "", structure: "", accountability: "", lifestyle: "", relapse: "", family: "" },
  reality: {},
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

// ---------------------------------------------------------------------------
// The result: his three bands, shown only once she has ticked something
// ---------------------------------------------------------------------------

type Band = "none" | "needs-answers" | "ready" | "gaps" | "major";

const BAND_MESSAGE: Record<"ready" | "gaps" | "major", string> = {
  ready: "Aftercare plan likely supports stability. Proceed with vigilance.",
  gaps: "Strengthen structure before discharge.",
  major: "Discharge may increase relapse risk. Advocate for adjustments.",
};

const BAND_STYLE: Record<"ready" | "gaps" | "major", string> = {
  ready: "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100",
  gaps: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100",
  major: "border-red-300 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100",
};

function readinessBand(confirmedCount: number, total: number, concerns: number, answered: number): Band {
  if (confirmedCount === 0 || total === 0) return "none";
  // No verdict from a half-finished sheet: a single tick must not read as
  // "discharge may increase relapse risk". The verdict waits for the five
  // honest questions, which she answers after going through every section.
  if (answered < REALITY_QUESTIONS.length) return "needs-answers";
  const share = confirmedCount / total;
  // Three or more honest concerns, or fewer than half the items confirmed.
  if (concerns > 2 || share < 0.5) return "major";
  if (share >= 0.8 && concerns <= 1) return "ready";
  return "gaps";
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function ChecklistItemRow({
  item,
  confirmed,
  doesNotApply,
  onConfirm,
  onDoesNotApply,
}: {
  item: ChecklistItem;
  confirmed: boolean;
  doesNotApply: boolean;
  onConfirm: (on: boolean) => void;
  onDoesNotApply: (on: boolean) => void;
}) {
  return (
    <div className="space-y-1.5 print:break-inside-avoid">
      <CheckRow checked={confirmed} onChange={onConfirm}>
        {item.text}
      </CheckRow>
      {item.optional && (
        <CheckRow checked={doesNotApply} onChange={onDoesNotApply} className="ml-6 border-dashed print:ml-6">
          <span className="text-muted-foreground">This doesn't apply to us</span>
        </CheckRow>
      )}
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AftercareChecklist() {
  useGuideTracking("/aftercare-checklist", "Aftercare Checklist");
  const saved = useSavedTool<AftercarePlan>("tool:aftercare-checklist", blankPlan);
  const plan = saved.data;

  // Older or partial saved copies may be missing pieces.
  const confirmed = Array.isArray(plan.confirmed) ? plan.confirmed : [];
  const doesNotApply = Array.isArray(plan.doesNotApply) ? plan.doesNotApply : [];
  const notes: Record<SectionId, string> = { ...blankPlan.notes, ...(isRecord(plan.notes) ? plan.notes : {}) };
  const reality: Record<string, RealityAnswer> = isRecord(plan.reality) ? (plan.reality as Record<string, RealityAnswer>) : {};

  const setConfirmed = (text: string, on: boolean) =>
    saved.patch({
      confirmed: on ? [...confirmed.filter((t) => t !== text), text] : confirmed.filter((t) => t !== text),
      // Confirming an item means it applies.
      doesNotApply: on ? doesNotApply.filter((t) => t !== text) : doesNotApply,
    });

  const setDoesNotApply = (text: string, on: boolean) =>
    saved.patch({
      doesNotApply: on ? [...doesNotApply.filter((t) => t !== text), text] : doesNotApply.filter((t) => t !== text),
      confirmed: on ? confirmed.filter((t) => t !== text) : confirmed,
    });

  // An "if applicable" item she has marked as not applying leaves the total.
  const counts = (item: ChecklistItem) => !(item.optional && doesNotApply.includes(item.text));
  const sectionProgress = (section: ChecklistSection) => {
    const counted = section.items.filter(counts);
    return { done: counted.filter((item) => confirmed.includes(item.text)).length, total: counted.length };
  };

  const countedItems = SECTIONS.flatMap((section) => section.items).filter(counts);
  const totalItems = countedItems.length;
  const confirmedCount = countedItems.filter((item) => confirmed.includes(item.text)).length;
  const leftOut = SECTIONS.flatMap((section) => section.items).length - totalItems;

  const answeredCount = REALITY_QUESTIONS.filter((q) => reality[q.id] === "yes" || reality[q.id] === "no").length;
  const concernCount = REALITY_QUESTIONS.filter((q) => reality[q.id] === q.concernIf).length;

  const band = readinessBand(confirmedCount, totalItems, concernCount, answeredCount);
  const stillOpen = SECTIONS.map((section) => ({
    section,
    items: section.items.filter((item) => counts(item) && !confirmed.includes(item.text)),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <Helmet>
        <title>Aftercare Readiness Checklist | Sober Helpline</title>
        <meta
          name="description"
          content="Assess discharge readiness and prevent discharge-to-relapse patterns with this comprehensive aftercare checklist for families."
        />
      </Helmet>

      <ToolShell
        title="Aftercare Readiness Checklist"
        summary="Preventing discharge-to-relapse patterns. Assess actual readiness based on confirmed plans and observable behaviors — not hope or insurance timelines. Tick things off as they are confirmed, before discharge and after they are home."
        note="Based on ASAM continuing care guidelines and Gorski's relapse prevention model. Discharge should be a clinical transition, not a relief milestone."
        kind="Living plan"
        saved={saved}
      >
        <ToolNote title="Purpose">
          <p>
            Leaving treatment is not the finish line—it is the most vulnerable transition in recovery. This checklist
            helps you assess actual readiness, not hope, fatigue, or insurance timelines.
          </p>
          <p className="mt-2 italic">Discharge should be a clinical transition—not a relief milestone.</p>
        </ToolNote>

        <ToolNote title="How to Use This Checklist">
          <ul className="list-disc space-y-1 pl-5">
            <li>Complete this before discharge, ideally 7–14 days in advance.</li>
            <li>Base answers on confirmed plans and observable behaviors, not intentions.</li>
            <li>If an item is uncertain, leave it unchecked.</li>
            <li>Use the results to advocate for additional structure if needed.</li>
            <li>It saves as you go, so you can come back and tick things off as they are confirmed.</li>
          </ul>
        </ToolNote>

        {SECTIONS.map((section, index) => {
          const progress = sectionProgress(section);
          return (
            <ToolSection
              key={section.id}
              step={index + 1}
              title={section.title}
              description={`${progress.done} of ${progress.total} confirmed`}
            >
              {section.id === "relapse" && (
                <SafetyBox
                  topics={["overdose", "withdrawal"]}
                  title="The weeks after treatment are the highest-risk time"
                  className="mb-0"
                />
              )}
              <div className="grid gap-2">
                {section.items.map((item) => (
                  <ChecklistItemRow
                    key={item.text}
                    item={item}
                    confirmed={confirmed.includes(item.text)}
                    doesNotApply={doesNotApply.includes(item.text)}
                    onConfirm={(on) => setConfirmed(item.text, on)}
                    onDoesNotApply={(on) => setDoesNotApply(item.text, on)}
                  />
                ))}
              </div>
              <SavedTextarea
                label="Notes / gaps:"
                placeholder="Document any gaps or concerns..."
                rows={2}
                value={notes[section.id]}
                onChange={(value) => saved.patch({ notes: { ...notes, [section.id]: value } })}
              />
            </ToolSection>
          );
        })}

        <ToolSection step={7} title="Emotional & Readiness Reality Check" description="Answer honestly:">
          {REALITY_QUESTIONS.map((q) => (
            <ChoiceGroup
              key={q.id}
              label={q.question}
              options={YES_NO}
              value={reality[q.id] ?? ""}
              onChange={(answer) => saved.patch({ reality: { ...reality, [q.id]: answer } })}
              columns={2}
            />
          ))}
          <ToolNote tone="caution">If multiple answers raise concern, slow down.</ToolNote>
        </ToolSection>

        <ToolSection title="Where things stand" tone="highlight">
          {band === "none" ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nothing is ticked yet. As you tick what is confirmed, your result will show here.
            </p>
          ) : (
            <>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4 print:border-0 print:p-0">
                  <dt className="text-sm text-muted-foreground">Items confirmed</dt>
                  <dd className="text-2xl font-bold text-foreground">
                    {confirmedCount} of {totalItems}
                  </dd>
                  {leftOut > 0 && (
                    <dd className="mt-1 text-xs text-muted-foreground">
                      {leftOut === 1 ? "1 item that doesn't apply to you isn't counted." : `${leftOut} items that don't apply to you aren't counted.`}
                    </dd>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-card p-4 print:border-0 print:p-0">
                  <dt className="text-sm text-muted-foreground">Concerns from your honest answers</dt>
                  <dd className="text-2xl font-bold text-foreground">
                    {answeredCount === 0 ? "Not answered yet" : `${concernCount} of ${REALITY_QUESTIONS.length}`}
                  </dd>
                  {answeredCount > 0 && answeredCount < REALITY_QUESTIONS.length && (
                    <dd className="mt-1 text-xs text-muted-foreground">
                      {answeredCount} of {REALITY_QUESTIONS.length} questions answered so far.
                    </dd>
                  )}
                </div>
              </dl>

              {band === "needs-answers" ? (
                <ToolNote>
                  When you have been through every section, answer the five honest questions in step 7 to see where
                  this leaves you.
                </ToolNote>
              ) : (
                <div
                  role="status"
                  className={cn("rounded-lg border p-4 print:break-inside-avoid print:border-foreground/30", BAND_STYLE[band])}
                >
                  <p className="text-base font-semibold leading-snug">{BAND_MESSAGE[band]}</p>
                  <p className="mt-1 text-sm leading-relaxed">
                    This is based only on what is ticked and answered above. Anything left unticked counts as not yet
                    confirmed.
                  </p>
                </div>
              )}

              {stillOpen.length > 0 && (
                <div className="print:hidden">
                  <h3 className="text-sm font-semibold text-foreground">Still to confirm</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    These are the gaps to raise with the treatment team.
                  </p>
                  <div className="mt-3 space-y-3">
                    {stillOpen.map((group) => (
                      <div key={group.section.id}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.section.title}</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
                          {group.items.map((item) => (
                            <li key={item.text}>{item.text}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </ToolSection>

        <div className="grid gap-4 md:grid-cols-2">
          <ToolNote title="What Families SHOULD Do Next">
            <ul className="list-disc space-y-1 pl-5">
              <li>Review this checklist with the treatment team</li>
              <li>Advocate for missing elements</li>
              <li>Align on boundaries before discharge</li>
              <li>Schedule a family check-in 2 weeks post-discharge</li>
              <li>Revisit this checklist monthly during early recovery</li>
            </ul>
          </ToolNote>
          <ToolNote tone="caution" title="What Families Should NOT Do">
            <ul className="list-disc space-y-1 pl-5">
              <li>Assume treatment "fixed" everything</li>
              <li>Remove structure too quickly</li>
              <li>Relax boundaries out of relief or guilt</li>
              <li>Rely on verbal promises alone</li>
              <li>Avoid planning for relapse "to stay positive"</li>
            </ul>
          </ToolNote>
        </div>

        <ToolNote title="Key Reframe">
          <p>
            Aftercare doesn't prevent relapse by itself. <strong>Structure, accountability, and consistency do.</strong>
          </p>
          <p className="mt-2 italic">Families help most by preparing for reality—not hoping it away.</p>
        </ToolNote>

        <CompanionLinks />

        <div className="print:hidden">
          <RelatedResources currentPath="/aftercare-checklist" />
        </div>
      </ToolShell>
    </>
  );
}
