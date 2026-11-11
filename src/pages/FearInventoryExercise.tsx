import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useSavedTool } from "@/hooks/useSavedTool";
import RelatedResources from "@/components/RelatedResources";
import SafetyBox from "@/components/SafetyBox";
import { CheckRow, SavedTextarea, ToolNote, ToolSection, ToolShell } from "@/components/tools/ToolKit";

// One page, four numbered steps: pick the fears that are yours (and write your
// own), look at each one, read the owner's teaching on fear, and commit to one
// action. Everything she ticks and writes is saved and prints.

// ---------------------------------------------------------------------------
// The owner's content
// ---------------------------------------------------------------------------

interface Fear {
  id: string;
  category: string;
  fear: string;
  reality: string;
}

const commonFears: Fear[] = [
  // Boundaries fears
  {
    id: "b1",
    category: "Setting Boundaries",
    fear: "If I set a boundary, they'll never speak to me again.",
    reality:
      "Boundaries often improve relationships over time by establishing mutual respect. The temporary distance can lead to healthier connection.",
  },
  {
    id: "b2",
    category: "Setting Boundaries",
    fear: "They'll overdose or die if I stop helping.",
    reality:
      "Continuing to shield someone from consequences often prolongs addiction. Recovery frequently begins when natural consequences are felt.",
  },
  {
    id: "b3",
    category: "Setting Boundaries",
    fear: "I'll be seen as heartless or uncaring by other family members.",
    reality:
      "Setting boundaries is an act of love, not abandonment. Those who understand addiction will recognize this—and others may eventually learn.",
  },
  {
    id: "b4",
    category: "Setting Boundaries",
    fear: "They'll become homeless and it will be my fault.",
    reality:
      "Adults make their own choices. Your boundary doesn't cause homelessness—their choices do. Homelessness is sometimes the reality check needed.",
  },
  // Communication fears
  {
    id: "c1",
    category: "Talking Differently About Addiction",
    fear: "If I name it as addiction, they'll shut down completely.",
    reality:
      "Avoiding the truth keeps everyone stuck. Naming addiction clearly and compassionately can open doors to honest conversation.",
  },
  {
    id: "c2",
    category: "Talking Differently About Addiction",
    fear: "Saying I'm worried will push them away.",
    reality: "Expressing genuine concern from a place of love, not control, often lands more softly than we expect.",
  },
  {
    id: "c3",
    category: "Talking Differently About Addiction",
    fear: "They'll use what I say against me later.",
    reality:
      "Manipulation may happen, but honest communication plants seeds. Truth spoken in love is never wasted—even if not immediately received.",
  },
  // Treatment fears
  {
    id: "t1",
    category: "Offering Treatment",
    fear: "Treatment won't work—they've failed before.",
    reality:
      "Relapse is common in recovery. Multiple treatment attempts are often part of the journey. Each attempt builds awareness and skills.",
  },
  {
    id: "t2",
    category: "Offering Treatment",
    fear: "We can't afford treatment.",
    reality:
      "Many options exist: insurance coverage, state-funded programs, sliding scale fees, scholarships. The path may require research, but options exist.",
  },
  {
    id: "t3",
    category: "Offering Treatment",
    fear: "They'll refuse and I'll feel like I failed.",
    reality:
      "Offering help is not a failure. Your job is to present options, not force outcomes. Planting the seed matters.",
  },
  {
    id: "t4",
    category: "Offering Treatment",
    fear: "Treatment will change them into someone I don't recognize.",
    reality:
      "Recovery often restores the person you knew before addiction took hold. The change you fear may be the return you've been hoping for.",
  },
  // Intervention fears
  {
    id: "i1",
    category: "Considering an Intervention",
    fear: "An intervention will destroy our relationship forever.",
    reality:
      "Interventions done with love and professional guidance often strengthen relationships by breaking denial and creating a path forward.",
  },
  {
    id: "i2",
    category: "Considering an Intervention",
    fear: "They'll feel ambushed and hate everyone involved.",
    reality:
      "Initial anger is common but usually temporary. Most people in recovery later express gratitude for the intervention.",
  },
  {
    id: "i3",
    category: "Considering an Intervention",
    fear: "What if the intervention doesn't work?",
    reality:
      "No single action guarantees recovery, but intervention breaks through denial. Even if they don't accept help immediately, a seed is planted.",
  },
  {
    id: "i4",
    category: "Considering an Intervention",
    fear: "Other family members won't participate and it will cause a family rift.",
    reality:
      "You cannot control others' participation. Moving forward with those who are willing models healthy action and may inspire others later.",
  },
];

const categories = ["Setting Boundaries", "Talking Differently About Addiction", "Offering Treatment", "Considering an Intervention"];

const REFLECTION_LABEL = "Your Reflection: What evidence do you have that this fear is likely to come true?";
const REFLECTION_PLACEHOLDER = "When I think about this fear honestly, I realize...";

const FEAR_SAYS = [
  '"Don\'t rock the boat"',
  '"You\'ll make things worse"',
  '"Wait until they\'re ready"',
  '"Keep the peace at all costs"',
  '"What will people think?"',
];

const LOVE_SAYS = [
  '"Speak truth with compassion"',
  '"Take action despite uncertainty"',
  '"Create healthy conditions for change"',
  '"Model recovery-oriented behavior"',
  '"Do what\'s right, not what\'s easy"',
];

const PARADOX_POINTS = [
  "Setting boundaries creates space for growth",
  "Honest conversations break through denial",
  "Offering treatment shows you believe in recovery",
  "Interventions disrupt the deadly status quo",
];

const RELATED_LINKS = [
  {
    to: "/boundaries-ultimatums",
    title: "Boundaries vs. Ultimatums",
    description: "Learn the difference and how to set healthy limits",
  },
  {
    to: "/values-exercise",
    title: "Values Clarification Exercise",
    description: "Reconnect with what matters most to guide your decisions",
  },
  {
    to: "/enabling-language-translator",
    title: "Enabling Language Translator",
    description: "Transform enabling responses into supportive ones",
  },
  {
    to: "/what-changes-when-families-change",
    title: "What Changes When Families Change",
    description: "Understanding the power of family transformation",
  },
];

// ---------------------------------------------------------------------------
// Saved shape
// ---------------------------------------------------------------------------

/** A fear she wrote herself, with her reflection on it. */
interface OwnFear {
  text: string;
  reflection: string;
}

interface FearInventory {
  /** Ids of the listed fears she ticked. */
  selectedFears: string[];
  ownFears: OwnFear[];
  /** Her reflection on each listed fear, by fear id. */
  reflections: Record<string, string>;
  commitment: string;
}

const blankOwnFear: OwnFear = { text: "", reflection: "" };

const blankInventory: FearInventory = {
  selectedFears: [],
  ownFears: [{ ...blankOwnFear }],
  reflections: {},
  commitment: "",
};

const MAX_OWN_FEARS = 6;

// Saved copies can be old or partial, so read every field defensively.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

function readOwnFears(raw: unknown): OwnFear[] {
  const list = Array.isArray(raw)
    ? raw.filter(isRecord).map((item) => ({
        text: typeof item.text === "string" ? item.text : "",
        reflection: typeof item.reflection === "string" ? item.reflection : "",
      }))
    : [];
  return list.length > 0 ? list : blankInventory.ownFears;
}

function readReflections(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!isRecord(raw)) return out;
  for (const [key, value] of Object.entries(raw)) if (typeof value === "string") out[key] = value;
  return out;
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function FearToExamine({
  number,
  category,
  fear,
  reality,
  reflection,
  onReflection,
}: {
  number: number;
  category: string;
  fear: string;
  /** The owner's reality check. Fears she wrote herself don't have one. */
  reality?: string;
  reflection: string;
  onReflection: (value: string) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-border p-4 print:break-inside-avoid print:border-0 print:p-0">
      <div className="flex items-start gap-3">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground print:border print:border-foreground/40"
          aria-hidden="true"
        >
          {number}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{category}</p>
          <h3 className="whitespace-pre-wrap text-base font-semibold leading-snug text-foreground">"{fear}"</h3>
        </div>
      </div>
      {reality && <ToolNote title="Reality Check">{reality}</ToolNote>}
      <SavedTextarea label={REFLECTION_LABEL} placeholder={REFLECTION_PLACEHOLDER} value={reflection} onChange={onReflection} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FearInventoryExercise() {
  useGuideTracking("/fear-inventory-exercise", "Fear Inventory Exercise");
  const saved = useSavedTool<FearInventory>("tool:fear-inventory", blankInventory);

  const selectedFears = Array.isArray(saved.data.selectedFears)
    ? saved.data.selectedFears.filter((id): id is string => typeof id === "string")
    : [];
  const ownFears = readOwnFears(saved.data.ownFears);
  const reflections = readReflections(saved.data.reflections);
  const commitment = typeof saved.data.commitment === "string" ? saved.data.commitment : "";

  const pickedFears = commonFears.filter((fear) => selectedFears.includes(fear.id));
  // Keep each written fear's place in the list, so its reflection stays with it.
  const writtenFears = ownFears.map((fear, index) => ({ ...fear, index })).filter((fear) => fear.text.trim() !== "");
  const fearCount = pickedFears.length + writtenFears.length;

  const toggleFear = (id: string, on: boolean) =>
    saved.patch({ selectedFears: on ? [...selectedFears.filter((f) => f !== id), id] : selectedFears.filter((f) => f !== id) });

  const updateOwnFear = (index: number, partial: Partial<OwnFear>) =>
    saved.patch({ ownFears: ownFears.map((fear, i) => (i === index ? { ...fear, ...partial } : fear)) });
  const addOwnFear = () => saved.patch({ ownFears: [...ownFears, { ...blankOwnFear }] });
  const removeOwnFear = (index: number) => {
    const rest = ownFears.filter((_, i) => i !== index);
    saved.patch({ ownFears: rest.length > 0 ? rest : [{ ...blankOwnFear }] });
  };

  return (
    <>
      <Helmet>
        <title>Fear Inventory Exercise | What Are We Afraid Will Happen? | Sober Helpline</title>
        <meta
          name="description"
          content="An interactive exercise helping families identify and examine fears that prevent them from taking action. Discover how fear holds families back from setting boundaries, offering treatment, and considering intervention."
        />
      </Helmet>

      <ToolShell
        title="Fear Inventory Exercise"
        summary="What are we afraid will happen? Identify the fears holding you back, examine whether they're based in reality, and choose courage over fear-driven paralysis."
        note="Inspired by the 4th Step inventory process from 12-Step recovery and adapted with CBT fear-hierarchy techniques for family members."
        kind="Worksheet"
        minutes={20}
        saved={saved}
      >
        <ToolNote title="What This Exercise Will Help You Do">
          <p>
            Every family facing a loved one's addiction wrestles with fear. These fears feel protective—they seem to keep
            us safe from conflict, rejection, or worse outcomes. But too often,{" "}
            <strong>fear becomes the very thing that prevents us from taking actions that could save a life.</strong>
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Identify the specific fears holding you back</li>
            <li>Examine whether those fears are based in likely reality</li>
            <li>Recognize how fear prevents helpful action</li>
            <li>Choose courage over fear-driven paralysis</li>
          </ul>
          <p className="mt-3">
            This is not about ignoring real risks or being reckless. It's about distinguishing between{" "}
            <em>legitimate caution</em> and <em>fear-based avoidance</em> that keeps everyone stuck.
          </p>
        </ToolNote>

        <ToolNote tone="caution">
          <strong>Remember:</strong> The fears that feel most protective are often the ones keeping you from the very
          actions that could help your loved one find recovery.
        </ToolNote>

        <ToolSection
          step={1}
          title="Identify Your Fears"
          description="Review the common fears below. Check every fear that resonates with you—even a little. Being honest here is essential."
        >
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">{category}</h3>
              <div className="grid gap-2">
                {commonFears
                  .filter((fear) => fear.category === category)
                  .map((fear) => (
                    <CheckRow key={fear.id} checked={selectedFears.includes(fear.id)} onChange={(on) => toggleFear(fear.id, on)}>
                      {fear.fear}
                    </CheckRow>
                  ))}
              </div>
            </div>
          ))}

          <div className="space-y-3 border-t border-border pt-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Other Fears</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Are there other fears not listed above? Write them here, one fear in each box. You will look at each of
                them in step 2, alongside the ones you ticked.
              </p>
            </div>
            {ownFears.map((fear, index) => (
              <div key={index} className="space-y-1">
                <SavedTextarea
                  label={ownFears.length > 1 ? `A fear of my own (${index + 1})` : "A fear of my own"}
                  placeholder="I'm also afraid that..."
                  rows={2}
                  maxLength={600}
                  value={fear.text}
                  onChange={(text) => updateOwnFear(index, { text })}
                />
                {(ownFears.length > 1 || fear.text.trim() !== "") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="min-h-11 gap-1.5 text-muted-foreground print:hidden"
                    onClick={() => removeOwnFear(index)}
                    aria-label={`Remove my own fear ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove this fear
                  </Button>
                )}
              </div>
            ))}
            {ownFears.length < MAX_OWN_FEARS && (
              <Button variant="outline" className="min-h-11 gap-2 print:hidden" onClick={addOwnFear}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add another fear
              </Button>
            )}
          </div>

          {fearCount > 0 && (
            <p className="rounded-lg bg-muted/50 p-4 text-sm text-foreground/80 print:hidden">
              You've identified{" "}
              <strong className="text-foreground">
                {fearCount} fear{fearCount !== 1 ? "s" : ""}
              </strong>{" "}
              to examine. This takes courage—well done.
            </p>
          )}
        </ToolSection>

        <SafetyBox
          topics={["overdose", "suicide", "emergency", "violence"]}
          title="Some fears are warnings, not just fears"
          className="mb-0"
        />

        <ToolSection
          step={2}
          title="Examine Each Fear"
          description="Now let's examine each fear you identified. For each one, consider the reality check provided and reflect on your own experience."
        >
          {fearCount === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground">No Fears Selected</p>
              <p className="mt-1">
                Go back to step 1 and select at least one fear to examine. Being honest about our fears is the first step
                to moving past them.
              </p>
            </div>
          ) : (
            <>
              {pickedFears.map((fear, index) => (
                <FearToExamine
                  key={fear.id}
                  number={index + 1}
                  category={fear.category}
                  fear={fear.fear}
                  reality={fear.reality}
                  reflection={reflections[fear.id] ?? ""}
                  onReflection={(value) => saved.patch({ reflections: { ...reflections, [fear.id]: value } })}
                />
              ))}
              {writtenFears.map((fear, position) => (
                <FearToExamine
                  key={`own-${fear.index}`}
                  number={pickedFears.length + position + 1}
                  category="A fear of my own"
                  fear={fear.text.trim()}
                  reflection={fear.reflection}
                  onReflection={(reflection) => updateOwnFear(fear.index, { reflection })}
                />
              ))}
            </>
          )}
        </ToolSection>

        <ToolSection step={3} title="The Truth About Fear">
          <p className="text-base leading-relaxed text-foreground/90">
            Most of our fears are about <strong>future events that haven't happened and may never happen</strong>. We
            create vivid mental movies of worst-case scenarios and then live as if they're certain.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-amber-300 p-4 dark:border-amber-800 print:break-inside-avoid print:border-0 print:p-0">
              <h3 className="mb-2 font-semibold text-foreground">Fear Says:</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                {FEAR_SAYS.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/30 p-4 print:break-inside-avoid print:border-0 print:p-0">
              <h3 className="mb-2 font-semibold text-foreground">Love Says:</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                {LOVE_SAYS.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-muted p-5 print:break-inside-avoid print:bg-transparent print:p-0">
            <h3 className="font-semibold text-foreground">A Critical Question:</h3>
            <p className="text-lg italic text-foreground">
              "What if doing nothing—because of fear—costs your loved one their life?"
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              The worst-case scenario families fear often isn't the consequence of action—it's the consequence of{" "}
              <em>continued inaction</em>. Addiction is progressive and potentially fatal. The loving action you fear
              taking today may be the very thing that opens a door tomorrow.
            </p>
          </div>

          <ToolNote title="The Paradox of Loving Action">
            <p>
              Fear tells us that protective inaction keeps our loved one safe. But the opposite is often true:{" "}
              <strong>
                The actions we avoid because of fear are frequently the very actions that can save a life.
              </strong>
            </p>
            <ul className="mt-3 space-y-1">
              {PARADOX_POINTS.map((point) => (
                <li key={point}>✓ {point}</li>
              ))}
            </ul>
          </ToolNote>
        </ToolSection>

        <ToolSection
          step={4}
          title="Your Commitment"
          description="You've identified your fears and examined whether they're based in reality. Now it's time to choose courage over fear."
          tone="highlight"
        >
          <SavedTextarea
            label="Reflect and Respond:"
            hint="What is ONE action you've been avoiding because of fear? What would it look like to take that step this week?"
            placeholder="The action I've been avoiding is... I could take this step by..."
            rows={4}
            value={commitment}
            onChange={(value) => saved.patch({ commitment: value })}
          />
          <div className="rounded-lg border border-primary/20 bg-background p-5 print:break-inside-avoid print:border-0 print:p-0">
            <h3 className="mb-3 text-center font-semibold text-foreground">An Affirmation for Families</h3>
            <p className="text-center text-lg italic text-foreground">
              "I choose to act from love, not fear. I cannot control outcomes, but I can control my willingness to do
              what's right. I release the need for certainty and embrace the courage to try."
            </p>
          </div>
        </ToolSection>

        {fearCount > 0 && commitment.trim() !== "" && (
          <ToolNote>
            You've taken an important step in understanding how fear affects your decisions. Remember: courage isn't the
            absence of fear—it's taking action despite fear.
          </ToolNote>
        )}

        <section className="print:hidden">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Related Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {RELATED_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <h3 className="font-medium text-foreground">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="print:hidden">
          <RelatedResources currentPath="/fear-inventory-exercise" />
        </div>
      </ToolShell>
    </>
  );
}
