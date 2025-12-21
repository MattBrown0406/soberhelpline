import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, RotateCcw, HelpCircle, Heart, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    nextId: string | null;
    isOutcome?: boolean;
    outcomeType?: "enabling" | "helping" | "mixed";
  }[];
}

const decisionTree: TreeNode[] = [
  {
    id: "start",
    question: "Think about a specific action you're considering taking for your loved one. What is your primary motivation?",
    description: "Be honest with yourself about why you want to take this action.",
    options: [
      { label: "To prevent them from experiencing discomfort or consequences", nextId: "prevent-consequences" },
      { label: "To support their recovery journey or healthy choices", nextId: "support-recovery" },
      { label: "To reduce my own anxiety or discomfort", nextId: "reduce-anxiety" },
    ],
  },
  {
    id: "prevent-consequences",
    question: "Are the consequences you're trying to prevent natural results of their substance use or unhealthy choices?",
    description: "Natural consequences include things like job loss, relationship problems, financial difficulties, or legal issues that result from their behavior.",
    options: [
      { label: "Yes, these are direct results of their choices", nextId: "natural-consequences-yes" },
      { label: "No, these are unrelated hardships", nextId: "unrelated-hardships" },
    ],
  },
  {
    id: "natural-consequences-yes",
    question: "If you take this action, will it allow them to avoid facing the reality of their situation?",
    options: [
      { label: "Yes, they won't have to deal with the full impact", nextId: "outcome-enabling-shield" },
      { label: "No, they'll still need to face their situation", nextId: "consider-boundaries" },
    ],
  },
  {
    id: "unrelated-hardships",
    question: "Is your loved one actively working on their recovery or making healthy choices?",
    options: [
      { label: "Yes, they're putting in genuine effort", nextId: "outcome-helping-support" },
      { label: "No, they're still in active addiction", nextId: "outcome-mixed-timing" },
    ],
  },
  {
    id: "support-recovery",
    question: "Is your loved one asking for this support, or are you offering it unsolicited?",
    options: [
      { label: "They asked for specific help", nextId: "asked-for-help" },
      { label: "I'm offering without being asked", nextId: "unsolicited-offer" },
    ],
  },
  {
    id: "asked-for-help",
    question: "Does their request align with their recovery goals?",
    description: "Consider whether this help moves them toward independence or keeps them dependent on you.",
    options: [
      { label: "Yes, it supports their growth and recovery", nextId: "outcome-helping-aligned" },
      { label: "It might actually hinder their progress", nextId: "outcome-enabling-hinder" },
      { label: "I'm not sure", nextId: "check-accountability" },
    ],
  },
  {
    id: "unsolicited-offer",
    question: "Are you trying to control their recovery process or timeline?",
    options: [
      { label: "I might be trying to speed things up or manage their choices", nextId: "outcome-enabling-control" },
      { label: "No, I'm offering resources while respecting their autonomy", nextId: "outcome-helping-resources" },
    ],
  },
  {
    id: "reduce-anxiety",
    question: "Is your anxiety related to their safety or your own discomfort with the situation?",
    options: [
      { label: "Their immediate physical safety is at risk", nextId: "safety-concern" },
      { label: "I'm uncomfortable watching them struggle", nextId: "discomfort-struggle" },
    ],
  },
  {
    id: "safety-concern",
    question: "Is there an immediate, life-threatening emergency?",
    description: "Examples include overdose, severe withdrawal, suicidal behavior, or domestic violence.",
    options: [
      { label: "Yes, this is a crisis situation", nextId: "outcome-helping-crisis" },
      { label: "No, but I'm worried about future safety", nextId: "future-safety" },
    ],
  },
  {
    id: "discomfort-struggle",
    question: "Would stepping back and letting them experience this struggle help them learn and grow?",
    options: [
      { label: "Probably yes, but it's hard to watch", nextId: "outcome-enabling-rescue" },
      { label: "No, they genuinely need support right now", nextId: "check-accountability" },
    ],
  },
  {
    id: "consider-boundaries",
    question: "Have you clearly communicated your boundaries around this issue?",
    options: [
      { label: "Yes, and I'm sticking to them", nextId: "outcome-helping-boundaries" },
      { label: "No, or I keep changing my boundaries", nextId: "outcome-enabling-boundaries" },
    ],
  },
  {
    id: "check-accountability",
    question: "Will this action hold them accountable for their choices while still showing love?",
    description: "Healthy support maintains accountability. Enabling removes accountability.",
    options: [
      { label: "Yes, they remain responsible for their actions", nextId: "outcome-helping-accountable" },
      { label: "No, it lets them off the hook", nextId: "outcome-enabling-accountability" },
    ],
  },
  {
    id: "future-safety",
    question: "Are you trying to prevent a hypothetical future harm, or addressing a pattern you've already seen?",
    options: [
      { label: "I'm worried about what might happen", nextId: "outcome-mixed-anticipatory" },
      { label: "This is based on a real pattern of dangerous behavior", nextId: "outcome-helping-pattern" },
    ],
  },
  // Outcomes
  {
    id: "outcome-enabling-shield",
    question: "OUTCOME: This appears to be ENABLING behavior",
    description: "You're shielding your loved one from natural consequences of their choices. While this comes from a place of love, it prevents them from experiencing the reality that often motivates change. Consider stepping back and allowing natural consequences to occur.",
    options: [],
  },
  {
    id: "outcome-enabling-hinder",
    question: "OUTCOME: This may be ENABLING behavior",
    description: "Even though they asked for help, providing it might actually slow their progress toward independence and recovery. Consider whether there's a way to support them that encourages their own problem-solving instead.",
    options: [],
  },
  {
    id: "outcome-enabling-control",
    question: "OUTCOME: This appears to be ENABLING behavior",
    description: "Trying to control or manage their recovery timeline takes away their ownership of the process. Recovery must be their journey. Focus on supporting from the sidelines rather than driving the process.",
    options: [],
  },
  {
    id: "outcome-enabling-rescue",
    question: "OUTCOME: This is likely ENABLING behavior",
    description: "Rescuing someone from natural struggles to reduce your own discomfort prevents their growth. Learning to tolerate your own anxiety while they face challenges is one of the hardest but most important skills for family members.",
    options: [],
  },
  {
    id: "outcome-enabling-boundaries",
    question: "OUTCOME: This may be ENABLING behavior",
    description: "Inconsistent boundaries send mixed messages and make it easier for problematic patterns to continue. Work on establishing and maintaining clear, consistent boundaries as an act of love.",
    options: [],
  },
  {
    id: "outcome-enabling-accountability",
    question: "OUTCOME: This is ENABLING behavior",
    description: "Removing accountability prevents your loved one from connecting their choices to their consequences. This connection is often what motivates lasting change. Let them experience the results of their decisions.",
    options: [],
  },
  {
    id: "outcome-helping-support",
    question: "OUTCOME: This is HELPING behavior",
    description: "Supporting someone through unrelated hardships while they're actively working on recovery is appropriate and loving. Continue to encourage their recovery efforts while providing this support.",
    options: [],
  },
  {
    id: "outcome-helping-aligned",
    question: "OUTCOME: This is HELPING behavior",
    description: "Responding to specific requests that align with recovery goals is healthy support. You're respecting their autonomy while providing appropriate assistance. This builds trust and supports their journey.",
    options: [],
  },
  {
    id: "outcome-helping-resources",
    question: "OUTCOME: This is HELPING behavior",
    description: "Offering resources while respecting their choice to accept or decline is healthy. You're making support available without forcing it. Continue to offer with open hands, not controlling expectations.",
    options: [],
  },
  {
    id: "outcome-helping-crisis",
    question: "OUTCOME: This is HELPING behavior",
    description: "In genuine emergencies, intervening to protect life is absolutely appropriate. Call 911, use Narcan if available for overdose, or contact crisis services. Safety comes first in life-threatening situations.",
    options: [],
  },
  {
    id: "outcome-helping-boundaries",
    question: "OUTCOME: This is HELPING behavior",
    description: "Maintaining clear, consistent boundaries while still offering love is one of the healthiest things you can do. Boundaries protect your wellbeing and model healthy behavior for your loved one.",
    options: [],
  },
  {
    id: "outcome-helping-accountable",
    question: "OUTCOME: This is HELPING behavior",
    description: "Supporting while maintaining accountability is the gold standard. You can love someone deeply while still letting them be responsible for their choices. This is healthy, sustainable support.",
    options: [],
  },
  {
    id: "outcome-helping-pattern",
    question: "OUTCOME: This is likely HELPING behavior",
    description: "Addressing documented patterns of dangerous behavior with appropriate interventions (professional help, treatment discussions, safety planning) is responsible and loving. Consider involving professionals if you haven't already.",
    options: [],
  },
  {
    id: "outcome-mixed-timing",
    question: "OUTCOME: Consider the TIMING carefully",
    description: "Providing support during active addiction is complicated. While compassion is important, help during active use can sometimes prolong the addiction. Consider whether your help might make it easier for them to continue using without facing consequences.",
    options: [],
  },
  {
    id: "outcome-mixed-anticipatory",
    question: "OUTCOME: This requires REFLECTION",
    description: "Acting on anticipated future problems (that haven't occurred) can sometimes be enabling through over-protection. However, if you have genuine safety concerns based on patterns, it's okay to prepare. Talk to a professional to help distinguish between helpful preparation and enabling anxiety.",
    options: [],
  },
];

const getOutcomeStyle = (outcomeType?: "enabling" | "helping" | "mixed") => {
  switch (outcomeType) {
    case "enabling":
      return "border-destructive/50 bg-destructive/5";
    case "helping":
      return "border-green-500/50 bg-green-500/5";
    case "mixed":
      return "border-yellow-500/50 bg-yellow-500/5";
    default:
      return "";
  }
};

const getOutcomeIcon = (outcomeType?: "enabling" | "helping" | "mixed") => {
  switch (outcomeType) {
    case "enabling":
      return <AlertTriangle className="h-8 w-8 text-destructive" />;
    case "helping":
      return <CheckCircle2 className="h-8 w-8 text-green-600" />;
    case "mixed":
      return <HelpCircle className="h-8 w-8 text-yellow-600" />;
    default:
      return null;
  }
};

const getOutcomeType = (nodeId: string): "enabling" | "helping" | "mixed" | undefined => {
  if (nodeId.includes("outcome-enabling")) return "enabling";
  if (nodeId.includes("outcome-helping")) return "helping";
  if (nodeId.includes("outcome-mixed")) return "mixed";
  return undefined;
};

export default function EnablingDecisionTree() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = decisionTree.find((node) => node.id === currentNodeId);
  const isOutcome = currentNode?.options.length === 0;
  const outcomeType = getOutcomeType(currentNodeId);
  const progress = Math.min((history.length / 5) * 100, 100);

  const handleOptionSelect = (nextId: string | null) => {
    if (nextId) {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(nextId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(previousId);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentNodeId("start");
  };

  if (!isExpanded) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent cursor-pointer hover:border-primary/40 transition-all duration-300" onClick={() => setIsExpanded(true)}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Am I Enabling or Helping?</CardTitle>
              <CardDescription className="mt-1">
                Interactive decision tree to help you understand your actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            It's often difficult to know if what we're doing for our loved one is truly helping them 
            or if it's actually enabling their addiction to continue. This interactive guide will walk 
            you through a series of questions to help you gain clarity.
          </p>
          <Button className="w-full sm:w-auto">
            Start the Assessment <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-primary/20 transition-all duration-300",
      isOutcome && getOutcomeStyle(outcomeType)
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOutcome ? (
              getOutcomeIcon(outcomeType)
            ) : (
              <div className="p-2 rounded-full bg-primary/10">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg sm:text-xl">
                {isOutcome ? "Assessment Complete" : "Am I Enabling or Helping?"}
              </CardTitle>
              {!isOutcome && (
                <CardDescription>
                  Question {history.length + 1}
                </CardDescription>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="text-muted-foreground">
            Minimize
          </Button>
        </div>
        {!isOutcome && (
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div>
            <h3 className={cn(
              "font-semibold mb-2",
              isOutcome ? "text-lg" : "text-base"
            )}>
              {currentNode?.question}
            </h3>
            {currentNode?.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {currentNode.description}
              </p>
            )}
          </div>

          {!isOutcome && currentNode?.options && (
            <div className="space-y-3">
              {currentNode.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 px-4 whitespace-normal hover:bg-primary/5 hover:border-primary/40"
                  onClick={() => handleOptionSelect(option.nextId)}
                >
                  <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 text-muted-foreground" />
                </Button>
              ))}
            </div>
          )}

          {isOutcome && (
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">Remember</p>
                  <p className="text-sm text-muted-foreground">
                    This assessment is a guide, not a judgment. Loving someone with addiction is incredibly 
                    difficult, and the line between helping and enabling isn't always clear. Consider discussing 
                    your situation with a therapist or counselor who specializes in addiction.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={history.length === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
