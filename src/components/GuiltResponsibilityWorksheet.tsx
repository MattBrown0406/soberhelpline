import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User } from "@supabase/supabase-js";
import { Scale, ChevronDown, Printer, FileText, Heart, AlertTriangle, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ToolBrandHeader from "@/components/ToolBrandHeader";

interface GuiltResponsibilityWorksheetProps {
  user: User;
}

interface Part1State {
  guiltSoundsLike: string;
  bodyLocations: string[];
  bodyOther: string;
  triggers: string[];
  triggerOther: string;
}

interface Part2State {
  tendencies: string[];
  tendencyOther: string;
  regrettedDecisions: string;
}

interface Part3State {
  notMyResponsibilities: string;
}

interface Part4State {
  actingFor: string;
  sameDecisionLessFear: string;
  alignsWithBoundaries: string;
  respectMyself: string;
  preventingConsequence: string;
}

interface Part5State {
  guiltThought: string;
  reframedThought: string;
}

interface Part6State {
  guidingValues: string[];
  valueOther: string;
  valuesAlignedResponse: string;
}

interface Part7State {
  commitmentStatement: string;
  weakenedBoundary: string;
  reinforcementPhrase: string;
}

interface Part8State {
  driverOfResponse: string;
  whatDidWell: string;
  practiceNext: string;
}

interface AdditionalInsightsState {
  guiltOrigin: string;
  guiltMessage: string;
  fearBehindGuilt: string;
  whoShouldFeel: string;
  protectingFrom: string;
}

export default function GuiltResponsibilityWorksheet({ user }: GuiltResponsibilityWorksheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [part1, setPart1] = useState<Part1State>({
    guiltSoundsLike: "",
    bodyLocations: [],
    bodyOther: "",
    triggers: [],
    triggerOther: ""
  });

  const [part2, setPart2] = useState<Part2State>({
    tendencies: [],
    tendencyOther: "",
    regrettedDecisions: ""
  });

  const [part3, setPart3] = useState<Part3State>({
    notMyResponsibilities: ""
  });

  const [part4, setPart4] = useState<Part4State>({
    actingFor: "",
    sameDecisionLessFear: "",
    alignsWithBoundaries: "",
    respectMyself: "",
    preventingConsequence: ""
  });

  const [part5, setPart5] = useState<Part5State>({
    guiltThought: "",
    reframedThought: ""
  });

  const [part6, setPart6] = useState<Part6State>({
    guidingValues: [],
    valueOther: "",
    valuesAlignedResponse: ""
  });

  const [part7, setPart7] = useState<Part7State>({
    commitmentStatement: "",
    weakenedBoundary: "",
    reinforcementPhrase: ""
  });

  const [part8, setPart8] = useState<Part8State>({
    driverOfResponse: "",
    whatDidWell: "",
    practiceNext: ""
  });

  const [additionalInsights, setAdditionalInsights] = useState<AdditionalInsightsState>({
    guiltOrigin: "",
    guiltMessage: "",
    fearBehindGuilt: "",
    whoShouldFeel: "",
    protectingFrom: ""
  });

  const handleCheckboxToggle = (value: string, current: string[], setter: (values: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const bodyLocations = ["Chest", "Stomach", "Shoulders", "Head", "Throat", "Jaw"];
  const triggers = [
    "Requests for money",
    "Housing or transportation",
    "Emotional crises",
    "Treatment refusal",
    "Relapse",
    "Anger or blame from my loved one",
    "Seeing them struggle",
    "Family pressure to help more"
  ];
  const tendencies = [
    "Over-explain",
    "Give in",
    "Rescue",
    "Break boundaries",
    "Argue or justify",
    "Avoid conflict",
    "Apologize unnecessarily",
    "Take blame that isn't mine"
  ];
  const guidingValues = ["Safety", "Integrity", "Stability", "Honesty", "Self-respect", "Health", "Peace", "Growth"];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-10">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-logo-green">Guilt vs. Responsibility Worksheet</CardTitle>
                  <CardDescription>Making Decisions from Integrity, Not Emotional Pressure</CardDescription>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-8">
            <ToolBrandHeader
              title="Guilt vs. Responsibility Worksheet"
              subtitle="This worksheet helps you identify when guilt is driving your decisions — and how to shift back into responsibility, boundaries, and self-respect. It is not about eliminating guilt; it is about not letting guilt make the decisions."
              clinicalNote="Informed by cognitive-behavioral approaches and family recovery principles. Use this worksheet before or after emotionally charged situations."
            />

            {/* Part 1: Recognizing Guilt */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-logo-green">Part 1: Recognizing Guilt in Real Time</h3>
              </div>
              <p className="text-sm text-muted-foreground">Answer honestly.</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="guilt-sounds">When guilt shows up for me, it usually sounds like:</Label>
                  <p className="text-xs text-muted-foreground mb-2">(examples: "I should help," "I can't say no," "What if something bad happens?")</p>
                  <Textarea
                    id="guilt-sounds"
                    value={part1.guiltSoundsLike}
                    onChange={(e) => setPart1({...part1, guiltSoundsLike: e.target.value})}
                    placeholder="Write the internal messages you hear..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Where do I feel guilt most strongly in my body?</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {bodyLocations.map(location => (
                      <label key={location} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={part1.bodyLocations.includes(location)}
                          onCheckedChange={() => handleCheckboxToggle(location, part1.bodyLocations, (vals) => setPart1({...part1, bodyLocations: vals}))}
                        />
                        <span className="text-sm">{location}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="body-other" className="text-sm">Other location:</Label>
                    <input
                      type="text"
                      id="body-other"
                      value={part1.bodyOther}
                      onChange={(e) => setPart1({...part1, bodyOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm"
                      placeholder="Describe..."
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">What situations most reliably trigger guilt for me?</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {triggers.map(trigger => (
                      <label key={trigger} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={part1.triggers.includes(trigger)}
                          onCheckedChange={() => handleCheckboxToggle(trigger, part1.triggers, (vals) => setPart1({...part1, triggers: vals}))}
                        />
                        <span className="text-sm">{trigger}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="trigger-other" className="text-sm">Other triggers:</Label>
                    <input
                      type="text"
                      id="trigger-other"
                      value={part1.triggerOther}
                      onChange={(e) => setPart1({...part1, triggerOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto"
                      placeholder="Describe..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Part 2: What Guilt Pushes Me to Do */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-logo-green">Part 2: What Guilt Pushes Me to Do</h3>
              </div>

              <div>
                <Label className="text-sm font-medium">When I feel guilty, I tend to:</Label>
                <div className="grid sm:grid-cols-2 gap-2 mt-2">
                  {tendencies.map(tendency => (
                    <label key={tendency} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={part2.tendencies.includes(tendency)}
                        onCheckedChange={() => handleCheckboxToggle(tendency, part2.tendencies, (vals) => setPart2({...part2, tendencies: vals}))}
                      />
                      <span className="text-sm">{tendency}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2">
                  <Label htmlFor="tendency-other" className="text-sm">Other:</Label>
                  <input
                    type="text"
                    id="tendency-other"
                    value={part2.tendencyOther}
                    onChange={(e) => setPart2({...part2, tendencyOther: e.target.value})}
                    className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto"
                    placeholder="Describe..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="regretted">Decisions I've made from guilt that I later regretted include:</Label>
                <Textarea
                  id="regretted"
                  value={part2.regrettedDecisions}
                  onChange={(e) => setPart2({...part2, regrettedDecisions: e.target.value})}
                  placeholder="Be specific about times guilt led you to act against your values or boundaries..."
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            {/* Additional Insight: Understanding Your Guilt */}
            <div className="space-y-4 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Deeper Insight: Understanding Your Guilt</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">These additional questions can help you understand the roots and patterns of your guilt.</p>

              <div>
                <Label htmlFor="guilt-origin">Where did I first learn to feel responsible for other people's feelings or outcomes?</Label>
                <Textarea
                  id="guilt-origin"
                  value={additionalInsights.guiltOrigin}
                  onChange={(e) => setAdditionalInsights({...additionalInsights, guiltOrigin: e.target.value})}
                  placeholder="Think about childhood patterns, family roles, or messages you received..."
                  className="mt-1 bg-white dark:bg-background"
                />
              </div>

              <div>
                <Label htmlFor="guilt-message">What is the guilt really trying to tell me? What does it want me to believe?</Label>
                <Textarea
                  id="guilt-message"
                  value={additionalInsights.guiltMessage}
                  onChange={(e) => setAdditionalInsights({...additionalInsights, guiltMessage: e.target.value})}
                  placeholder="Sometimes guilt carries messages like 'you're not doing enough' or 'you should be able to fix this'..."
                  className="mt-1 bg-white dark:bg-background"
                />
              </div>

              <div>
                <Label htmlFor="fear-behind">What fear is hiding behind this guilt?</Label>
                <Textarea
                  id="fear-behind"
                  value={additionalInsights.fearBehindGuilt}
                  onChange={(e) => setAdditionalInsights({...additionalInsights, fearBehindGuilt: e.target.value})}
                  placeholder="Examples: fear of abandonment, fear of being seen as cruel, fear of something terrible happening..."
                  className="mt-1 bg-white dark:bg-background"
                />
              </div>

              <div>
                <Label htmlFor="who-should-feel">Whose guilt is this, really? Who should be feeling responsible here?</Label>
                <Textarea
                  id="who-should-feel"
                  value={additionalInsights.whoShouldFeel}
                  onChange={(e) => setAdditionalInsights({...additionalInsights, whoShouldFeel: e.target.value})}
                  placeholder="Sometimes we carry guilt that belongs to someone else..."
                  className="mt-1 bg-white dark:bg-background"
                />
              </div>

              <div>
                <Label htmlFor="protecting-from">By feeling guilty, what am I protecting myself from feeling?</Label>
                <Textarea
                  id="protecting-from"
                  value={additionalInsights.protectingFrom}
                  onChange={(e) => setAdditionalInsights({...additionalInsights, protectingFrom: e.target.value})}
                  placeholder="Guilt can sometimes be a shield against harder emotions like grief, anger, or helplessness..."
                  className="mt-1 bg-white dark:bg-background"
                />
              </div>
            </div>

            <Separator />

            {/* Part 3: Separating Guilt from Responsibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-logo-green">Part 3: Separating Guilt from Responsibility</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">I AM responsible for:</h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      My boundaries
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      My words and tone
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      My safety
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      My values
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      My follow-through
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      My healing
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3">I am NOT responsible for:</h4>
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-400">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Someone else's sobriety
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Their motivation or insight
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Their reaction to my boundaries
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Preventing every bad outcome
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Fixing the past
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <Label htmlFor="not-my-resp">Reflection: Which responsibilities have I taken on that are not actually mine?</Label>
                <Textarea
                  id="not-my-resp"
                  value={part3.notMyResponsibilities}
                  onChange={(e) => setPart3({...part3, notMyResponsibilities: e.target.value})}
                  placeholder="Be specific about responsibilities you've been carrying that belong to someone else..."
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            {/* Part 4: The Guilt vs. Responsibility Test */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-logo-green">Part 4: The Guilt vs. Responsibility Test</h3>
              </div>
              <p className="text-sm text-muted-foreground">Before responding to a request, answer the following:</p>

              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Am I acting to reduce their pain—or my discomfort?</Label>
                  <RadioGroup value={part4.actingFor} onValueChange={(v) => setPart4({...part4, actingFor: v})} className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="their-pain" id="their-pain" />
                      <Label htmlFor="their-pain" className="cursor-pointer">Their pain</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="my-discomfort" id="my-discomfort" />
                      <Label htmlFor="my-discomfort" className="cursor-pointer">My discomfort</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">Would I make the same decision if I were less afraid?</Label>
                  <RadioGroup value={part4.sameDecisionLessFear} onValueChange={(v) => setPart4({...part4, sameDecisionLessFear: v})} className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="fear-yes" />
                      <Label htmlFor="fear-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="fear-no" />
                      <Label htmlFor="fear-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">Does this align with my stated boundaries?</Label>
                  <RadioGroup value={part4.alignsWithBoundaries} onValueChange={(v) => setPart4({...part4, alignsWithBoundaries: v})} className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="boundary-yes" />
                      <Label htmlFor="boundary-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="boundary-no" />
                      <Label htmlFor="boundary-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">Will I respect myself after this decision?</Label>
                  <RadioGroup value={part4.respectMyself} onValueChange={(v) => setPart4({...part4, respectMyself: v})} className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="respect-yes" />
                      <Label htmlFor="respect-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="respect-no" />
                      <Label htmlFor="respect-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">Am I preventing a consequence that might support change?</Label>
                  <RadioGroup value={part4.preventingConsequence} onValueChange={(v) => setPart4({...part4, preventingConsequence: v})} className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="consequence-yes" />
                      <Label htmlFor="consequence-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="consequence-no" />
                      <Label htmlFor="consequence-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg mt-4">
                  <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
                    ⚠️ If most answers lean toward fear, discomfort, or boundary violations—pause before acting.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Part 5: Reframing the Guilt Thought */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-logo-green">Part 5: Reframing the Guilt Thought</h3>

              <div>
                <Label htmlFor="guilt-thought">Write the guilt-based thought:</Label>
                <p className="text-xs text-muted-foreground mb-1">"If I don't ____________, then __________________________."</p>
                <Textarea
                  id="guilt-thought"
                  value={part5.guiltThought}
                  onChange={(e) => setPart5({...part5, guiltThought: e.target.value})}
                  placeholder="Example: If I don't give them money, then they'll end up on the street."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="reframed">Now rewrite it using responsibility:</Label>
                <p className="text-xs text-muted-foreground mb-1">"I feel guilty, and I am still responsible for __________________."</p>
                <Textarea
                  id="reframed"
                  value={part5.reframedThought}
                  onChange={(e) => setPart5({...part5, reframedThought: e.target.value})}
                  placeholder='Example: "I feel guilty, and I am still responsible for holding my boundary."'
                  className="mt-1"
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Example:</strong> "I feel guilty, and I am still responsible for holding my boundary."
                </p>
              </div>
            </div>

            <Separator />

            {/* Part 6: Values Check */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-logo-green">Part 6: Values Check</h3>

              <div>
                <Label className="text-sm font-medium">Which value do I want guiding this decision?</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {guidingValues.map(value => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={part6.guidingValues.includes(value)}
                        onCheckedChange={() => handleCheckboxToggle(value, part6.guidingValues, (vals) => setPart6({...part6, guidingValues: vals}))}
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2">
                  <Label htmlFor="value-other" className="text-sm">Other:</Label>
                  <input
                    type="text"
                    id="value-other"
                    value={part6.valueOther}
                    onChange={(e) => setPart6({...part6, valueOther: e.target.value})}
                    className="ml-2 border rounded px-2 py-1 text-sm"
                    placeholder="Describe..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="values-response">What would a values-aligned response look like—even if it's uncomfortable?</Label>
                <Textarea
                  id="values-response"
                  value={part6.valuesAlignedResponse}
                  onChange={(e) => setPart6({...part6, valuesAlignedResponse: e.target.value})}
                  placeholder="Describe what acting from your chosen values would look like..."
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            {/* Part 7: Boundary Anchor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-logo-green">Part 7: Boundary Anchor</h3>

              <div>
                <Label htmlFor="commitment">"Even when I feel guilty, I commit to ____________________________."</Label>
                <Textarea
                  id="commitment"
                  value={part7.commitmentStatement}
                  onChange={(e) => setPart7({...part7, commitmentStatement: e.target.value})}
                  placeholder="Complete the commitment statement..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="weakened-boundary">Write one boundary guilt most often tries to weaken:</Label>
                <Textarea
                  id="weakened-boundary"
                  value={part7.weakenedBoundary}
                  onChange={(e) => setPart7({...part7, weakenedBoundary: e.target.value})}
                  placeholder="Which boundary does guilt attack most?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="reinforcement">Write one phrase you will use to reinforce it:</Label>
                <Textarea
                  id="reinforcement"
                  value={part7.reinforcementPhrase}
                  onChange={(e) => setPart7({...part7, reinforcementPhrase: e.target.value})}
                  placeholder='Example: "I can feel guilty and still say no."'
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            {/* Part 8: After-the-Fact Reflection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-logo-green">Part 8: After-the-Fact Reflection (Optional)</h3>
              <p className="text-sm text-muted-foreground">Use this section after a difficult interaction.</p>

              <div>
                <Label className="text-sm font-medium">Did guilt or responsibility drive my response?</Label>
                <RadioGroup value={part8.driverOfResponse} onValueChange={(v) => setPart8({...part8, driverOfResponse: v})} className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="guilt" id="driver-guilt" />
                    <Label htmlFor="driver-guilt" className="cursor-pointer">Guilt</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="responsibility" id="driver-resp" />
                    <Label htmlFor="driver-resp" className="cursor-pointer">Responsibility</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="did-well">What did I do well—even if it was hard?</Label>
                <Textarea
                  id="did-well"
                  value={part8.whatDidWell}
                  onChange={(e) => setPart8({...part8, whatDidWell: e.target.value})}
                  placeholder="Acknowledge your strengths, even small ones..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="practice-next">What would I like to practice differently next time?</Label>
                <Textarea
                  id="practice-next"
                  value={part8.practiceNext}
                  onChange={(e) => setPart8({...part8, practiceNext: e.target.value})}
                  placeholder="Without judgment, identify what you'd like to improve..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Final Reminder */}
            <div className="bg-logo-green/10 p-6 rounded-lg border border-logo-green/20 text-center">
              <h3 className="font-bold text-logo-green text-lg mb-3">Final Reminder</h3>
              <p className="text-foreground mb-2">
                <strong>Guilt is information—not instruction.</strong>
              </p>
              <p className="text-foreground mb-4">
                Responsibility is the skill of choosing integrity anyway.
              </p>
              <p className="text-muted-foreground italic">
                You are allowed to feel guilt and make healthy decisions.
              </p>
            </div>

            {/* Print Section */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 print:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Print Your Completed Worksheet</h3>
                  <p className="text-sm text-muted-foreground">
                    Save a copy of your responses to review later or share with a therapist or support person.
                  </p>
                </div>
                <Button onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print Worksheet
                </Button>
              </div>
            </div>

            {/* Companion Resources */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Suggested Companion Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link to="/family-education">
                  <Button variant="outline" size="sm">"Is This Help or Enabling?" Decision Tree</Button>
                </Link>
                <Link to="/family-education">
                  <Button variant="outline" size="sm">Boundary Setting Worksheet</Button>
                </Link>
                <Link to="/emotional-regulation">
                  <Button variant="outline" size="sm">Emotional Regulation Tools</Button>
                </Link>
                <Link to="/family-action-plan">
                  <Button variant="outline" size="sm">Family Recovery Action Plan</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
