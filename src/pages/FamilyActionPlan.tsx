import { Helmet } from "react-helmet-async";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useSavedTool } from "@/hooks/useSavedTool";
import RelatedResources from "@/components/RelatedResources";
import {
  CheckList,
  CrisisLine,
  SavedInput,
  SavedTextarea,
  ToolNote,
  ToolSection,
  ToolShell,
} from "@/components/tools/ToolKit";

interface Boundary {
  behavior: string;
  statement: string;
  consequence: string;
}

interface ActionPlan {
  lovedOneStatus: string[];
  biggestChallenges: string;
  repeatedPatterns: string;
  familyValues: string[];
  otherValue: string;
  nonNegotiables: string;
  enablingPatterns: string[];
  additionalPatterns: string;
  boundaries: Boundary[];
  trueEmergency: string;
  notEmergencies: string;
  crisisResponses: string[];
  familySupports: string[];
  selfCareCommitments: string;
  burnoutSigns: string;
  groundingPhrase: string;
  accountabilityPerson: string;
  reviewFrequency: string[];
  progressToLookFor: string;
  signature: string;
  signDate: string;
}

const blankBoundary: Boundary = { behavior: "", statement: "", consequence: "" };

const blankPlan: ActionPlan = {
  lovedOneStatus: [],
  biggestChallenges: "",
  repeatedPatterns: "",
  familyValues: [],
  otherValue: "",
  nonNegotiables: "",
  enablingPatterns: [],
  additionalPatterns: "",
  boundaries: [{ ...blankBoundary }, { ...blankBoundary }],
  trueEmergency: "",
  notEmergencies: "",
  crisisResponses: [],
  familySupports: [],
  selfCareCommitments: "",
  burnoutSigns: "",
  groundingPhrase: "",
  accountabilityPerson: "",
  reviewFrequency: [],
  progressToLookFor: "",
  signature: "",
  signDate: "",
};

const STATUS_OPTIONS = ["Actively using", "In detox or treatment", "Early recovery", "Long-term recovery", "Relapsed or unstable"];
const VALUE_OPTIONS = ["Safety", "Honesty", "Accountability", "Stability", "Respect", "Health"];
const ENABLING_OPTIONS = [
  "Covering for consequences (work, legal, social)",
  "Providing money during active use",
  "Making excuses or lying",
  "Rescuing from predictable outcomes",
  "Managing emotions or crises we didn't create",
];
const CRISIS_OPTIONS = [
  "Calling emergency services when appropriate",
  "Not negotiating under pressure",
  "Referring to previously set boundaries",
  "Reaching out to a support person",
  "Taking a pause before responding",
];
const SUPPORT_OPTIONS = ["Therapy or counseling", "Support groups", "Coaching", "Educational resources", "Spiritual or community support"];
const REVIEW_OPTIONS = ["Monthly", "Quarterly", "As circumstances change"];

const MAX_BOUNDARIES = 6;

export default function FamilyActionPlan() {
  useGuideTracking("/family-action-plan", "Family Recovery Action Plan");
  const saved = useSavedTool<ActionPlan>("tool:family-action-plan", blankPlan);
  const plan = saved.data;
  const boundaries = Array.isArray(plan.boundaries) && plan.boundaries.length > 0 ? plan.boundaries : blankPlan.boundaries;

  const updateBoundary = (index: number, field: keyof Boundary, value: string) =>
    saved.patch({ boundaries: boundaries.map((b, i) => (i === index ? { ...b, [field]: value } : b)) });
  const addBoundary = () => saved.patch({ boundaries: [...boundaries, { ...blankBoundary }] });
  const removeBoundary = (index: number) => saved.patch({ boundaries: boundaries.filter((_, i) => i !== index) });

  return (
    <>
      <Helmet>
        <title>Family Recovery Action Plan | Sober Helpline</title>
        <meta
          name="description"
          content="A practical roadmap for stability, boundaries, and healing. Create your family's action plan for recovery."
        />
      </Helmet>

      <ToolShell
        title="Family Recovery Action Plan"
        summary="A practical roadmap for stability, boundaries, and healing. Build a unified family plan that holds up under pressure, then come back and update it as things change."
        note="Structured around CRAFT principles, family systems theory, and evidence-based recovery planning frameworks."
        kind="Living plan"
        minutes={25}
        saved={saved}
      >
        <ToolNote title="This plan is about your recovery, not controlling theirs.">
          <p>
            Addiction creates chaos, urgency, and emotional reactivity. This action plan helps families move from crisis
            management to intentional, values-based decisions, whether your loved one is currently sober, in treatment, or
            actively using.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Complete this plan during a calm moment, not during a crisis.</li>
            <li>You don't have to finish in one sitting. It saves as you go.</li>
            <li>Share it with supportive people who can help you stay accountable.</li>
            <li>
              <strong>This plan works best when families commit to consistency over comfort.</strong>
            </li>
          </ul>
        </ToolNote>

        <ToolSection step={1} title="Define your current reality" description="Answer honestly.">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">My loved one's current status (tick all that apply)</p>
            <CheckList
              options={STATUS_OPTIONS}
              selected={plan.lovedOneStatus}
              onChange={(lovedOneStatus) => saved.patch({ lovedOneStatus })}
              columns={2}
            />
          </div>
          <SavedTextarea
            label="The biggest ongoing challenges for our family are:"
            value={plan.biggestChallenges}
            onChange={(biggestChallenges) => saved.patch({ biggestChallenges })}
          />
          <SavedTextarea
            label="What patterns have repeated despite our best efforts?"
            value={plan.repeatedPatterns}
            onChange={(repeatedPatterns) => saved.patch({ repeatedPatterns })}
          />
        </ToolSection>

        <ToolSection
          step={2}
          title="Clarify your values and non-negotiables"
          description="Recovery decisions should align with values, not fear."
        >
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">The values we want to prioritize in our family include:</p>
            <CheckList
              options={VALUE_OPTIONS}
              selected={plan.familyValues}
              onChange={(familyValues) => saved.patch({ familyValues })}
              columns={2}
            />
          </div>
          <SavedInput
            label="Another value that matters to us"
            value={plan.otherValue}
            onChange={(otherValue) => saved.patch({ otherValue })}
          />
          <SavedTextarea
            label="Non-negotiables (behaviors we will not accept in our home or lives):"
            rows={4}
            value={plan.nonNegotiables}
            onChange={(nonNegotiables) => saved.patch({ nonNegotiables })}
          />
        </ToolSection>

        <ToolSection
          step={3}
          title="Identify enabling patterns to stop"
          description="Based on education and reflection, identify behaviors you are committed to changing."
        >
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">We will stop:</p>
            <CheckList
              options={ENABLING_OPTIONS}
              selected={plan.enablingPatterns}
              onChange={(enablingPatterns) => saved.patch({ enablingPatterns })}
            />
          </div>
          <SavedTextarea
            label="Additional patterns we will stop:"
            value={plan.additionalPatterns}
            onChange={(additionalPatterns) => saved.patch({ additionalPatterns })}
          />
        </ToolSection>

        <ToolSection step={4} title="Boundaries and consequences plan" description="For each boundary, be specific.">
          {boundaries.map((boundary, index) => (
            <div key={index} className="space-y-4 rounded-lg border border-border p-4 print:break-inside-avoid print:border-0 print:p-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Boundary {index + 1}</h3>
                {boundaries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground print:hidden"
                    onClick={() => removeBoundary(index)}
                    aria-label={`Remove boundary ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </Button>
                )}
              </div>
              <SavedInput
                label="Behavior triggering the boundary"
                value={boundary.behavior}
                onChange={(value) => updateBoundary(index, "behavior", value)}
              />
              <SavedTextarea
                label="Boundary statement"
                hint='In your own words, for example: "If you use in our home, I will ask you to leave for the night."'
                rows={2}
                value={boundary.statement}
                onChange={(value) => updateBoundary(index, "statement", value)}
              />
              <SavedTextarea
                label="Consequence we will follow through on"
                rows={2}
                value={boundary.consequence}
                onChange={(value) => updateBoundary(index, "consequence", value)}
              />
            </div>
          ))}
          {boundaries.length < MAX_BOUNDARIES && (
            <Button variant="outline" className="gap-2 print:hidden" onClick={addBoundary}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add another boundary
            </Button>
          )}
        </ToolSection>

        <ToolSection step={5} title="Crisis response plan" description="Emotions are highest during crises. Decide now.">
          <CrisisLine />
          <SavedTextarea
            label="What constitutes a true emergency (health, safety, legal)?"
            value={plan.trueEmergency}
            onChange={(trueEmergency) => saved.patch({ trueEmergency })}
          />
          <SavedTextarea
            label="What behaviors will not be treated as emergencies?"
            value={plan.notEmergencies}
            onChange={(notEmergencies) => saved.patch({ notEmergencies })}
          />
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">Our crisis response will include:</p>
            <CheckList
              options={CRISIS_OPTIONS}
              selected={plan.crisisResponses}
              onChange={(crisisResponses) => saved.patch({ crisisResponses })}
            />
          </div>
        </ToolSection>

        <ToolSection
          step={6}
          title="Family self-care and support plan"
          description="Recovery requires sustained support for families."
        >
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">Individual or family supports we will engage in:</p>
            <CheckList
              options={SUPPORT_OPTIONS}
              selected={plan.familySupports}
              onChange={(familySupports) => saved.patch({ familySupports })}
              columns={2}
            />
          </div>
          <SavedTextarea
            label="Personal commitments to self-care:"
            value={plan.selfCareCommitments}
            onChange={(selfCareCommitments) => saved.patch({ selfCareCommitments })}
          />
          <SavedTextarea
            label="Warning signs we are burning out or reverting to old patterns:"
            value={plan.burnoutSigns}
            onChange={(burnoutSigns) => saved.patch({ burnoutSigns })}
          />
        </ToolSection>

        <ToolSection step={7} title="Communication guidelines" description="To reduce conflict and manipulation.">
          <ToolNote title="We commit to:">
            <ul className="list-disc space-y-1 pl-5">
              <li>Speaking calmly and briefly</li>
              <li>Avoiding lectures and emotional arguments</li>
              <li>Repeating boundaries without justification</li>
              <li>Ending conversations that become abusive or circular</li>
            </ul>
          </ToolNote>
          <SavedTextarea
            label="Our grounding response phrase"
            hint={`Example: "We're not going to argue about this. Our decision remains the same."`}
            rows={2}
            value={plan.groundingPhrase}
            onChange={(groundingPhrase) => saved.patch({ groundingPhrase })}
          />
        </ToolSection>

        <ToolSection step={8} title="Review and accountability">
          <SavedInput
            label="Who will help hold us accountable to this plan?"
            value={plan.accountabilityPerson}
            onChange={(accountabilityPerson) => saved.patch({ accountabilityPerson })}
          />
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">How often will we review and update this plan?</p>
            <CheckList
              options={REVIEW_OPTIONS}
              selected={plan.reviewFrequency}
              onChange={(reviewFrequency) => saved.patch({ reviewFrequency })}
            />
          </div>
          <SavedTextarea
            label="What progress will we look for in ourselves, not our loved one?"
            value={plan.progressToLookFor}
            onChange={(progressToLookFor) => saved.patch({ progressToLookFor })}
          />
        </ToolSection>

        <ToolSection step={9} title="Commitment statement" description="Read and sign." tone="highlight">
          <p className="text-base italic leading-relaxed text-foreground">
            "We commit to focusing on our recovery, setting clear boundaries, and responding thoughtfully rather than
            reactively. We understand that we cannot control outcomes, but we can control our actions."
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <SavedInput
              label="Signature(s)"
              hint="Type your name or names."
              value={plan.signature}
              onChange={(signature) => saved.patch({ signature })}
            />
            <SavedInput label="Date" type="date" value={plan.signDate} onChange={(signDate) => saved.patch({ signDate })} />
          </div>
        </ToolSection>

        <ToolNote title="Final perspective">
          <p>
            Families do not heal by waiting for someone else to change. They heal by reclaiming their lives, integrity,
            and peace.
          </p>
          <p className="mt-2">
            This action plan is not rigid. It is a living document designed to support clarity, consistency, and
            compassion, especially when things get hard.
          </p>
        </ToolNote>

        <div className="print:hidden">
          <RelatedResources currentPath="/family-action-plan" />
        </div>
      </ToolShell>
    </>
  );
}
