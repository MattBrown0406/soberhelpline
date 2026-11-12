import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Copy, Scale, Shield, Stethoscope, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import SafetyBox from "@/components/SafetyBox";
import { Button } from "@/components/ui/button";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useSavedTool } from "@/hooks/useSavedTool";
import { SavedInput, SavedTextarea, ToolNote, ToolSection, ToolShell } from "@/components/tools/ToolKit";
import {
  blankAIPromptSheet,
  boundaryPrompt,
  decisionPrompt,
  treatmentPrompt,
  type AIPromptSheet,
} from "@/data/aiPrompts";

// One page of three conversation starters for any AI chat tool. She fills in
// the blanks, copies the finished prompt, and keeps her notes here afterwards.

const inlineLink =
  "font-medium text-primary underline underline-offset-2 hover:text-primary/80 print:text-foreground print:no-underline";

const NO_NAMES = "No names needed. \"My son, 24\" is enough.";

/** Older or partial saved copies may be missing pieces. */
function section<K extends keyof AIPromptSheet>(sheet: Partial<AIPromptSheet>, key: K): AIPromptSheet[K] {
  const blank = blankAIPromptSheet[key];
  const saved = (sheet?.[key] ?? {}) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const field of Object.keys(blank)) {
    const value = saved[field];
    out[field] = typeof value === "string" ? value : "";
  }
  return out as AIPromptSheet[K];
}

async function copyPrompt(text: string, hasBlanks: boolean) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(
      hasBlanks
        ? "Copied. Some blanks are still empty: fill in the bracketed parts before you send it."
        : "Copied. Paste it as your first message in a new chat.",
    );
  } catch {
    toast.error("Copying didn't work on this device. Open the prompt below, then select the text and copy it.");
  }
}

function PromptCard({
  step,
  icon: Icon,
  title,
  useWhen,
  prompt,
  hasBlanks,
  fields,
  notes,
  onNotes,
  companion,
}: {
  step: number;
  icon: LucideIcon;
  title: string;
  useWhen: string;
  prompt: string;
  hasBlanks: boolean;
  fields: ReactNode;
  notes: string;
  onNotes: (value: string) => void;
  companion: ReactNode;
}) {
  return (
    <ToolSection
      step={step}
      title={title}
      description={
        <span className="flex items-start gap-2">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#b97a14] print:hidden" aria-hidden="true" />
          <span>{useWhen}</span>
        </span>
      }
    >
      <div className="space-y-4">
        <p className="text-sm font-semibold text-foreground">Fill in the blanks</p>
        {fields}
      </div>

      <div className="space-y-3 rounded-xl border border-[#16294a]/15 bg-[#16294a]/[0.03] p-4 dark:border-white/15 dark:bg-white/[0.03] print:border-0 print:bg-transparent print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your answers are added to the prompt for you.
          </p>
          <Button type="button" className="min-h-11 gap-2" onClick={() => void copyPrompt(prompt, hasBlanks)}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy this prompt
          </Button>
        </div>
        <details className="group">
          <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden">
            <span className="group-open:hidden">Read the full prompt</span>
            <span className="hidden group-open:inline">Hide the full prompt</span>
          </summary>
          <p className="mb-1 hidden text-sm font-semibold print:block">The prompt</p>
          <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-border bg-card p-4 font-sans text-sm leading-relaxed text-foreground print:mt-0 print:border-0 print:p-0">
            {prompt}
          </pre>
        </details>
      </div>

      <SavedTextarea
        label="After the conversation: what I decided, and what I want to remember"
        hint="The AI tool may not keep your chat. Write the part worth keeping here."
        rows={4}
        value={notes}
        onChange={onNotes}
      />

      <p className="text-sm leading-relaxed text-muted-foreground print:hidden">{companion}</p>
    </ToolSection>
  );
}

export default function AIPrompts() {
  useGuideTracking("/ai-prompts", "AI Conversation Starters for Families");
  const saved = useSavedTool<AIPromptSheet>("tool:ai-prompts", blankAIPromptSheet);

  const decision = section(saved.data, "decision");
  const boundary = section(saved.data, "boundary");
  const treatment = section(saved.data, "treatment");

  const setDecision = (part: Partial<AIPromptSheet["decision"]>) => saved.patch({ decision: { ...decision, ...part } });
  const setBoundary = (part: Partial<AIPromptSheet["boundary"]>) => saved.patch({ boundary: { ...boundary, ...part } });
  const setTreatment = (part: Partial<AIPromptSheet["treatment"]>) =>
    saved.patch({ treatment: { ...treatment, ...part } });

  const anyBlank = (...values: string[]) => values.some((value) => !value.trim());

  return (
    <>
      <SEOHead
        title="AI Conversation Starters for Families | Sober Helpline Members"
        description="Three ready-made prompts for any AI chat tool: think a decision through, put a boundary into words, and get ready for a treatment call."
        noIndex
      />

      <ToolShell
        title="AI Conversation Starters for Families"
        summary="Three prompts you can paste into ChatGPT, Claude, Gemini or any other AI chat tool. Each one turns it into a steadier thinking partner for one job: a decision, a boundary, or a treatment call."
        kind="Reference"
        saved={saved}
      >
        <SafetyBox
          topics={["emergency", "suicide"]}
          title="An AI chat is not for emergencies"
          className="mb-0"
        />

        <ToolNote title="What an AI chat tool is good for, and what it isn't">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Good for:</strong> slowing down, sorting your thoughts at 2 a.m., and practicing the words before
              a hard conversation.
            </li>
            <li>
              <strong>It can sound sure and be wrong.</strong> Check anything medical, legal, or about a specific
              treatment program with a professional.
            </li>
            <li>
              <strong>It doesn't know your family.</strong> It only knows what you type. Bring what you work out to
              people who do: the Monday night group, the{" "}
              <Link to="/family-forum" className={inlineLink}>
                member forum
              </Link>
              , or your own counselor.
            </li>
            <li>
              <strong>Protect your privacy.</strong> What you type is kept by the company that runs the tool. Leave out
              full names, addresses, and anything you wouldn't want stored.
            </li>
          </ul>
        </ToolNote>

        <ToolNote title="How to use this page">
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Pick the prompt that fits today and fill in its blanks.</li>
            <li>
              Press <strong>Copy this prompt</strong>.
            </li>
            <li>Open the AI chat tool you use, start a new chat, paste, and send.</li>
            <li>Come back and write down what you decided. Your answers and notes save here automatically.</li>
          </ol>
        </ToolNote>

        <PromptCard
          step={1}
          icon={Scale}
          title="Is this helping, or enabling?"
          useWhen="Use it when they have asked you for something, or you are about to step in, and you can't tell whether you should."
          prompt={decisionPrompt(decision)}
          hasBlanks={anyBlank(decision.relationship, decision.situation, decision.action)}
          fields={
            <>
              <SavedInput
                label="My relationship to them"
                hint={NO_NAMES}
                value={decision.relationship}
                onChange={(relationship) => setDecision({ relationship })}
              />
              <SavedTextarea
                label="What is happening"
                hint="Just the facts of the last few days, in two or three sentences."
                rows={3}
                maxLength={1500}
                value={decision.situation}
                onChange={(situation) => setDecision({ situation })}
              />
              <SavedTextarea
                label="What I am thinking of doing"
                rows={2}
                maxLength={1000}
                value={decision.action}
                onChange={(action) => setDecision({ action })}
              />
            </>
          }
          notes={decision.notes}
          onNotes={(notes) => setDecision({ notes })}
          companion={
            <>
              Prefer to work it through here, without an AI tool? Try the short exercise{" "}
              <Link to="/workbook/helping-or-enabling" className={inlineLink}>
                Helping or enabling?
              </Link>
            </>
          }
        />

        <PromptCard
          step={2}
          icon={Shield}
          title="Put a boundary into words"
          useWhen="Use it when you know something has to change, and you want one sentence you can say calmly and keep."
          prompt={boundaryPrompt(boundary)}
          hasBlanks={anyBlank(boundary.relationship, boundary.situation, boundary.worry)}
          fields={
            <>
              <SavedInput
                label="My relationship to them"
                hint={NO_NAMES}
                value={boundary.relationship}
                onChange={(relationship) => setBoundary({ relationship })}
              />
              <SavedTextarea
                label="What I can't keep living with"
                hint="The behavior or situation, as plainly as you can put it."
                rows={3}
                maxLength={1500}
                value={boundary.situation}
                onChange={(situation) => setBoundary({ situation })}
              />
              <SavedTextarea
                label="What I'm afraid will happen if I set a boundary"
                rows={2}
                maxLength={1000}
                value={boundary.worry}
                onChange={(worry) => setBoundary({ worry })}
              />
            </>
          }
          notes={boundary.notes}
          onNotes={(notes) => setBoundary({ notes })}
          companion={
            <>
              If you are afraid of how they might react, read the safety note in{" "}
              <Link to="/boundaries-ultimatums" className={inlineLink}>
                Requests, Demands, Ultimatums &amp; Boundaries
              </Link>{" "}
              first. To write and save a boundary here, use{" "}
              <Link to="/workbook/boundary-script" className={inlineLink}>
                Write one boundary you can hold
              </Link>
              .
            </>
          }
        />

        <PromptCard
          step={3}
          icon={Stethoscope}
          title="Get ready for a treatment call"
          useWhen="Use it before you phone a program, so you understand the options and know what to ask."
          prompt={treatmentPrompt(treatment)}
          hasBlanks={anyBlank(treatment.who, treatment.using, treatment.tried, treatment.hoping)}
          fields={
            <>
              <SavedInput
                label="Who it's for"
                hint={"Relationship and rough age. \"My husband, 51\" is enough."}
                value={treatment.who}
                onChange={(who) => setTreatment({ who })}
              />
              <SavedTextarea
                label="What they are using, and for how long, as far as I know"
                rows={2}
                maxLength={1000}
                value={treatment.using}
                onChange={(using) => setTreatment({ using })}
              />
              <SavedTextarea
                label="What has been tried before"
                hint="Detox, treatment, meetings, medication, or nothing yet."
                rows={2}
                maxLength={1000}
                value={treatment.tried}
                onChange={(tried) => setTreatment({ tried })}
              />
              <SavedTextarea
                label="What I'm hoping treatment will do"
                rows={2}
                maxLength={1000}
                value={treatment.hoping}
                onChange={(hoping) => setTreatment({ hoping })}
              />
            </>
          }
          notes={treatment.notes}
          onNotes={(notes) => setTreatment({ notes })}
          companion={
            <>
              Keep your call notes in{" "}
              <Link to="/treatment-red-flags" className={inlineLink}>
                Treatment Red Flags: Program Check
              </Link>
              , and see the full list in{" "}
              <Link to="/treatment-questions" className={inlineLink}>
                40 Questions to Ask a Treatment Center
              </Link>
              . For help finding ethical treatment that fits your situation, call Sober Helpline at (458) 298-8008.
            </>
          }
        />

        <ToolSection title="If the conversation goes off track" tone="highlight">
          <p className="text-sm leading-relaxed text-foreground">
            You are in charge of the conversation. These short replies bring it back:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground">
            <li>"Shorter, please. One question at a time."</li>
            <li>"You're guessing. Stick to what I told you."</li>
            <li>"Don't just agree with me. What am I not seeing?"</li>
            <li>"Sum up what we decided in five lines." Then paste those lines into your notes above.</li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If its advice ever goes against the safety note at the top of this page, follow the safety note.
          </p>
        </ToolSection>
      </ToolShell>
    </>
  );
}
