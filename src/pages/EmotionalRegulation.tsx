import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useSavedTool } from "@/hooks/useSavedTool";
import RelatedResources from "@/components/RelatedResources";
import { CheckList, CheckRow, SavedTextarea, ToolNote, ToolSection, ToolShell } from "@/components/tools/ToolKit";

// ---------------------------------------------------------------------------
// What is saved
// ---------------------------------------------------------------------------

interface RegulationSheet {
  /** Ids of the techniques she has marked as working for her. */
  worksForMe: string[];
  /** Tool 10: the daily practices she has chosen. */
  dailyPractices: string[];
  pausePlan: string;
}

const blankSheet: RegulationSheet = { worksForMe: [], dailyPractices: [], pausePlan: "" };

const asList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

// The ten techniques, in the owner's order. The wording for each is in the page below.
const TOOLS = [
  { id: "pause", title: "The Pause (Interrupting Reactivity)" },
  { id: "name-it", title: "Name It to Tame It (Labeling Emotions)" },
  { id: "grounding", title: "Grounding in the Present (5–4–3–2–1)" },
  { id: "boundary-script", title: "The Boundary Script (Reducing Emotional Escalation)" },
  { id: "reality-check", title: "Reality Check (Thought Reframing)" },
  { id: "containment", title: "Emotional Containment (Not Absorbing the Chaos)" },
  { id: "reset", title: "Post-Interaction Reset" },
  { id: "values-check", title: "Values-Based Decision Check" },
  { id: "guilt-test", title: "Guilt vs. Responsibility Test" },
  { id: "routine", title: "Build a Regulation Routine" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

const DAILY_PRACTICES = [
  "Deep breathing",
  "Journaling",
  "Physical movement",
  "Meditation or prayer",
  "Limiting crisis-focused conversations",
  "Education and reflection",
];

const GROUNDING_STEPS = [
  { count: 5, label: "things you can SEE" },
  { count: 4, label: "things you can TOUCH" },
  { count: 3, label: "things you can HEAR" },
  { count: 2, label: "things you can SMELL" },
  { count: 1, label: "thing you can TASTE" },
];

const COMPANION_LINKS = [
  { to: "/crisis-chaos", label: "Crisis vs. Chaos Decision Guide" },
  { to: "/workbook/boundary-script", label: "Boundary Setting Worksheet" },
  { to: "/family-action-plan", label: "Family Recovery Action Plan" },
  { to: "/scenario-exercise", label: "Scenario-Based Exercises" },
];

const inlineLink = "font-medium text-primary underline underline-offset-2 hover:text-primary/80 print:text-foreground print:no-underline";

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function WhenToUse({ items }: { items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">When to use:</h3>
      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** The "how to do it" box inside a technique. */
function HowTo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/40 p-4 text-sm leading-relaxed text-foreground print:break-inside-avoid print:bg-transparent print:p-0">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Why({ label = "Why it works:", children }: { label?: string; children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-foreground">
      <strong>{label}</strong> {children}
    </p>
  );
}

function Takeaway({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium leading-relaxed text-primary print:text-foreground">{children}</p>;
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

export default function EmotionalRegulation() {
  useGuideTracking("/emotional-regulation", "Emotional Regulation Tools for Families");
  const saved = useSavedTool<RegulationSheet>("tool:emotional-regulation", blankSheet);
  const sheet = saved.data;

  // Older or partial saved copies may be missing pieces.
  const worksForMe = asList(sheet.worksForMe);
  const dailyPractices = asList(sheet.dailyPractices);
  const pausePlan = typeof sheet.pausePlan === "string" ? sheet.pausePlan : "";

  const setWorks = (id: ToolId, on: boolean) =>
    saved.patch({ worksForMe: on ? [...worksForMe.filter((t) => t !== id), id] : worksForMe.filter((t) => t !== id) });

  const worksTick = (id: ToolId) => (
    <CheckRow checked={worksForMe.includes(id)} onChange={(on) => setWorks(id, on)}>
      This one works for me
    </CheckRow>
  );

  const myTools = TOOLS.filter((tool) => worksForMe.includes(tool.id));

  return (
    <>
      <Helmet>
        <title>Emotional Regulation Tools for Families | Sober Helpline</title>
        <meta
          name="description"
          content="Practical tools to stay grounded when addiction triggers chaos. Learn skills for responding with intention instead of impulse."
        />
      </Helmet>

      <ToolShell
        title="Emotional Regulation Tools for Families"
        summary="Staying grounded when addiction triggers chaos. Practical tools for responding with intention instead of impulse. Tick the ones that work for you, then write your own pause plan at the end."
        note="Based on Dialectical Behavior Therapy (DBT) distress tolerance skills and Polyvagal theory (Porges). Adapted for family members of those with substance use disorders."
        kind="Reference"
        saved={saved}
      >
        <ToolNote title="Purpose">
          <p>
            Addiction dysregulates everyone it touches. Families often respond from fear, anger, guilt, or urgency—then
            regret their reactions later. Emotional regulation is not about suppressing feelings; it is about responding
            with intention instead of impulse.
          </p>
          <p className="mt-2 font-semibold italic">Regulation is a skill. Skills can be practiced and strengthened.</p>
        </ToolNote>

        <ToolNote title="Core Principle">
          <p className="text-base">
            You cannot control someone else's addiction, <strong>but you can control how much it controls you.</strong>
          </p>
          <p className="mt-2">Emotional regulation creates space between what you feel and what you do.</p>
        </ToolNote>

        <ToolSection step={1} title={TOOLS[0].title}>
          <WhenToUse
            items={[
              "During heated conversations",
              "When you feel pressure to respond immediately",
              "When guilt or panic spikes",
            ]}
          />
          <HowTo title="How to do it:">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Stop talking.</li>
              <li>Take 3 slow breaths (in through the nose, out through the mouth).</li>
              <li>
                Say one of the following:
                <ul className="mt-2 space-y-1 italic text-muted-foreground">
                  <li>"I need a moment before responding."</li>
                  <li>"I'm not making this decision right now."</li>
                  <li>"Let's pause this conversation."</li>
                </ul>
              </li>
            </ol>
          </HowTo>
          <Why>Pausing interrupts emotional hijacking and prevents boundary violations.</Why>
          {worksTick("pause")}
        </ToolSection>

        <ToolSection step={2} title={TOOLS[1].title}>
          <WhenToUse
            items={["When emotions feel overwhelming or confusing", "When you're about to react emotionally"]}
          />
          <HowTo title="How to do it:">
            <p className="mb-2">Silently or out loud, name what you're feeling:</p>
            <ul className="space-y-1 italic text-muted-foreground">
              <li>"I'm feeling afraid."</li>
              <li>"I'm feeling guilty."</li>
              <li>"I'm feeling angry and helpless."</li>
            </ul>
          </HowTo>
          <Why>Labeling emotions reduces their intensity and restores cognitive clarity.</Why>
          {worksTick("name-it")}
        </ToolSection>

        <ToolSection step={3} title={TOOLS[2].title}>
          <WhenToUse items={["During panic or anxiety", "After a triggering call or interaction"]} />
          <HowTo title="How to do it:">
            <p className="mb-3">Identify:</p>
            <ul className="grid gap-2 sm:grid-cols-5">
              {GROUNDING_STEPS.map((step) => (
                <li
                  key={step.count}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-3.5 py-2.5 sm:flex-col sm:gap-1 sm:px-2 sm:py-3 sm:text-center print:border-0 print:p-0"
                >
                  <span className="w-6 shrink-0 text-center text-2xl font-bold text-primary sm:w-auto print:text-foreground">
                    {step.count}
                  </span>
                  <span className="text-sm text-muted-foreground sm:text-xs">{step.label}</span>
                </li>
              ))}
            </ul>
          </HowTo>
          <Why>Grounding shifts your nervous system out of fight-or-flight.</Why>
          {worksTick("grounding")}
        </ToolSection>

        <ToolSection step={4} title={TOOLS[3].title}>
          <WhenToUse
            items={["When boundaries are challenged", "When conversations become circular or manipulative"]}
          />
          <HowTo title="How to do it:">
            <p className="mb-2">Choose one short phrase and repeat it calmly:</p>
            <ul className="space-y-1 italic">
              <li>"I'm not able to help with that."</li>
              <li>"My boundary hasn't changed."</li>
              <li>"We can talk when things are calmer."</li>
            </ul>
          </HowTo>
          <Why>Repetition without explanation reduces escalation and manipulation.</Why>
          {worksTick("boundary-script")}
        </ToolSection>

        <ToolSection step={5} title={TOOLS[4].title}>
          <WhenToUse items={["When catastrophic thinking appears", "When fear drives decision-making"]} />
          <HowTo title="Ask yourself:">
            <ul className="list-disc space-y-2 pl-5">
              <li>What do I know vs. what am I assuming?</li>
              <li>Have I survived this before?</li>
              <li>What is actually within my control right now?</li>
            </ul>
          </HowTo>
          <div className="rounded-lg border border-border p-4 text-sm leading-relaxed print:break-inside-avoid print:border-0 print:p-0">
            <h3 className="mb-2 font-semibold text-foreground">Replace the thought:</h3>
            <p className="text-muted-foreground line-through">"If I don't fix this, everything will fall apart."</p>
            <p className="font-medium text-primary print:text-foreground">→ "I can respond without rescuing."</p>
          </div>
          {worksTick("reality-check")}
        </ToolSection>

        <ToolSection step={6} title={TOOLS[5].title}>
          <WhenToUse items={["When your loved one is emotional, intoxicated, or dysregulated"]} />
          <HowTo title="How to do it:">
            <ul className="list-disc space-y-1 pl-5">
              <li>Lower your voice</li>
              <li>Shorten responses</li>
              <li>Avoid emotional mirroring</li>
              <li>End conversations that escalate</li>
            </ul>
          </HowTo>
          <Takeaway>
            <em>"Their emotions are not mine to manage."</em>
          </Takeaway>
          {worksTick("containment")}
        </ToolSection>

        <ToolSection step={7} title={TOOLS[6].title}>
          <WhenToUse items={["After intense conversations or crises"]} />
          <HowTo title="Options:">
            <ul className="list-disc space-y-1 pl-5">
              <li>Walk outside</li>
              <li>Stretch or move your body</li>
              <li>Write down what you're feeling</li>
              <li>Talk to a safe support person</li>
              <li>
                Re-read your{" "}
                <Link to="/family-action-plan" className={inlineLink}>
                  Family Recovery Action Plan
                </Link>
              </li>
            </ul>
          </HowTo>
          <Why label="Why it matters:">Without a reset, stress accumulates and erodes boundaries.</Why>
          {worksTick("reset")}
        </ToolSection>

        <ToolSection step={8} title={TOOLS[7].title}>
          <WhenToUse items={["When torn between fear and boundaries"]} />
          <HowTo title="Ask:">
            <ul className="list-disc space-y-2 pl-5">
              <li>Does this decision align with my values?</li>
              <li>Will I respect myself tomorrow if I do this?</li>
              <li>Is this helping recovery—or avoiding discomfort?</li>
            </ul>
          </HowTo>
          <Takeaway>Values create stability when emotions fluctuate.</Takeaway>
          {worksTick("values-check")}
        </ToolSection>

        <ToolSection step={9} title={TOOLS[8].title}>
          <WhenToUse items={["When guilt pushes you to rescue"]} />
          <HowTo title="Ask:">
            <ul className="list-disc space-y-2 pl-5">
              <li>Is this truly my responsibility?</li>
              <li>Am I preventing a consequence that could support change?</li>
              <li>Am I acting out of love or fear?</li>
            </ul>
          </HowTo>
          <p className="text-sm leading-relaxed text-foreground">
            <strong>Guilt is a feeling.</strong>
            <br />
            <span className="font-medium text-primary print:text-foreground">Responsibility is a choice.</span>
          </p>
          {worksTick("guilt-test")}
        </ToolSection>

        <ToolSection step={10} title={TOOLS[9].title}>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-foreground">Daily practices (choose 1–2):</p>
            <CheckList
              options={DAILY_PRACTICES}
              selected={dailyPractices}
              onChange={(next) => saved.patch({ dailyPractices: next })}
              columns={2}
            />
          </div>
          <Takeaway>Consistency matters more than intensity.</Takeaway>
          {worksTick("routine")}
        </ToolSection>

        <ToolSection title="Quick Reference: What Regulation Is and Isn't">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4 print:break-inside-avoid print:border-0 print:p-0">
              <h3 className="text-sm font-semibold text-foreground">Regulation IS:</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
                <li>Calm</li>
                <li>Clear</li>
                <li>Consistent</li>
                <li>Self-directed</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100 print:break-inside-avoid print:border-0 print:p-0">
              <h3 className="text-sm font-semibold">Regulation is NOT:</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                <li>Numbing</li>
                <li>Avoiding</li>
                <li>Suppressing feelings</li>
                <li>Ignoring reality</li>
              </ul>
            </div>
          </div>
        </ToolSection>

        <ToolNote title="Final Reframe">
          <p className="text-base">
            You do not need to be perfectly calm to be effective.
            <br />
            <strong>You need to be regulated enough to choose your response.</strong>
          </p>
          <p className="mt-2">
            Emotional regulation is the foundation that allows boundaries, consistency, and recovery-oriented decisions
            to hold.
          </p>
        </ToolNote>

        <ToolSection title="My pause plan" tone="highlight">
          <div className="text-sm leading-relaxed text-foreground">
            <p className="font-semibold">The ones that work for me:</p>
            {myTools.length > 0 ? (
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {myTools.map((tool) => (
                  <li key={tool.id}>{tool.title}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-muted-foreground">
                None ticked yet. As you try the tools above, tick the ones that help and they will be listed here.
              </p>
            )}
          </div>
          <SavedTextarea
            label="My pause plan: when I feel myself reacting, I will…"
            hint="A sentence or two in your own words is enough. You can change it any time."
            rows={4}
            value={pausePlan}
            onChange={(next) => saved.patch({ pausePlan: next })}
          />
        </ToolSection>

        <CompanionLinks />

        <div className="print:hidden">
          <RelatedResources currentPath="/emotional-regulation" />
        </div>
      </ToolShell>
    </>
  );
}
