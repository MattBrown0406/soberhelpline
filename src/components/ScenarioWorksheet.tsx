import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User } from "@supabase/supabase-js";
import { Brain, AlertTriangle, DollarSign, MessageSquare, Heart, Users, RotateCcw, Frown, FileText, Printer, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface ScenarioWorksheetProps {
  user: User;
}

interface Scenario1State {
  emotions: string[];
  pastPattern: string;
  actionPlanSays: string;
  valuesResponse: string;
  boundary: string;
}

interface Scenario2State {
  crisisOrChaos: string;
  withinControl: string;
  enablingTemptation: string;
  recoveryResponse: string;
  calmResponse: string;
}

interface Scenario3State {
  feelings: string[];
  argueRisk: string;
  regulationTool: string;
  boundaryWithout: string;
  endConversation: string;
}

interface Scenario4State {
  concerningBehavior: string;
  supportVsMonitoring: string;
  appropriateBoundary: string;
  communicateConcern: string;
  necessaryConsequence: string;
}

interface Scenario5State {
  violatedValue: string;
  familyBoundary: string;
  yourRole: string;
  clearStatement: string;
  protectConsistency: string;
}

interface Scenario6State {
  emotions: string[];
  secrecyAligned: string;
  supportiveAction: string;
  boundaryInPlace: string;
  whoInformed: string;
}

interface Scenario7State {
  guiltThought: string;
  guiltBasis: string;
  valueHonored: string;
  regulationTool: string;
  reminder: string;
}

interface ReflectionState {
  mostFamiliar: string;
  likelyAbandon: string;
  supportNeeded: string;
}

export default function ScenarioWorksheet({ user }: ScenarioWorksheetProps) {
  const [scenario1, setScenario1] = useState<Scenario1State>({
    emotions: [],
    pastPattern: "",
    actionPlanSays: "",
    valuesResponse: "",
    boundary: ""
  });

  const [scenario2, setScenario2] = useState<Scenario2State>({
    crisisOrChaos: "",
    withinControl: "",
    enablingTemptation: "",
    recoveryResponse: "",
    calmResponse: ""
  });

  const [scenario3, setScenario3] = useState<Scenario3State>({
    feelings: [],
    argueRisk: "",
    regulationTool: "",
    boundaryWithout: "",
    endConversation: ""
  });

  const [scenario4, setScenario4] = useState<Scenario4State>({
    concerningBehavior: "",
    supportVsMonitoring: "",
    appropriateBoundary: "",
    communicateConcern: "",
    necessaryConsequence: ""
  });

  const [scenario5, setScenario5] = useState<Scenario5State>({
    violatedValue: "",
    familyBoundary: "",
    yourRole: "",
    clearStatement: "",
    protectConsistency: ""
  });

  const [scenario6, setScenario6] = useState<Scenario6State>({
    emotions: [],
    secrecyAligned: "",
    supportiveAction: "",
    boundaryInPlace: "",
    whoInformed: ""
  });

  const [scenario7, setScenario7] = useState<Scenario7State>({
    guiltThought: "",
    guiltBasis: "",
    valueHonored: "",
    regulationTool: "",
    reminder: ""
  });

  const [reflection, setReflection] = useState<ReflectionState>({
    mostFamiliar: "",
    likelyAbandon: "",
    supportNeeded: ""
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleEmotionToggle = (emotion: string, current: string[], setter: (emotions: string[]) => void) => {
    if (current.includes(emotion)) {
      setter(current.filter(e => e !== emotion));
    } else {
      setter([...current, emotion]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scenario1Emotions = ["Hope", "Relief", "Fear", "Guilt", "Skepticism"];
  const scenario3Feelings = ["Anger", "Guilt", "Fear", "Sadness"];
  const scenario6Emotions = ["Anger", "Disappointment", "Fear", "Sadness", "Relief", "Compassion"];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-10">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-logo-green">"What Would You Do?"</CardTitle>
                  <CardDescription>Scenario-Based Exercises for Family Recovery</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={(e) => { e.stopPropagation(); handlePrint(); }} variant="outline" size="sm" className="gap-2 print:hidden">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
        {/* Purpose Section */}
        <div className="bg-muted/50 p-4 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">Purpose</h3>
          <p className="text-muted-foreground text-sm mb-3">
            Most families know what they should do—until emotions take over. These scenarios help you practice values-based, recovery-aligned responses before you are under pressure.
          </p>
          <p className="text-foreground font-medium italic">
            There are no perfect answers. There are consistent ones.
          </p>
        </div>

        {/* How to Use */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">How to Use These Exercises</h3>
          <p className="text-muted-foreground text-sm mb-2">For each scenario:</p>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
            <li>Read the situation slowly.</li>
            <li>Answer honestly—not ideally.</li>
            <li>Refer to your values, boundaries, and action plan.</li>
            <li>Notice emotional reactions as much as decisions.</li>
          </ol>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {/* Scenario 1 */}
          <AccordionItem value="scenario-1" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scenario 1: The "Just One More Chance" Moment</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Situation</h4>
                <p className="text-muted-foreground text-sm">
                  Your loved one has refused treatment multiple times. Today, they show up calm and sincere. They ask for "one more chance" and promise to stop using without treatment.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">What emotion shows up first for you?</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {scenario1Emotions.map(emotion => (
                      <label key={emotion} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={scenario1.emotions.includes(emotion)}
                          onCheckedChange={() => handleEmotionToggle(emotion, scenario1.emotions, (emotions) => setScenario1({...scenario1, emotions}))}
                        />
                        <span className="text-sm">{emotion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="s1-pattern">What past pattern does this resemble?</Label>
                  <Textarea
                    id="s1-pattern"
                    value={scenario1.pastPattern}
                    onChange={(e) => setScenario1({...scenario1, pastPattern: e.target.value})}
                    placeholder="Describe any similar situations from the past..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s1-actionplan">What does your Family Recovery Action Plan say about this situation?</Label>
                  <Textarea
                    id="s1-actionplan"
                    value={scenario1.actionPlanSays}
                    onChange={(e) => setScenario1({...scenario1, actionPlanSays: e.target.value})}
                    placeholder="Reference your action plan..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s1-values">What is a values-based response, even if it's uncomfortable?</Label>
                  <Textarea
                    id="s1-values"
                    value={scenario1.valuesResponse}
                    onChange={(e) => setScenario1({...scenario1, valuesResponse: e.target.value})}
                    placeholder="How would you respond based on your values..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s1-boundary">What boundary needs to be stated clearly right now?</Label>
                  <Textarea
                    id="s1-boundary"
                    value={scenario1.boundary}
                    onChange={(e) => setScenario1({...scenario1, boundary: e.target.value})}
                    placeholder="Write the boundary statement..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Scenario 2 */}
          <AccordionItem value="scenario-2" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scenario 2: The Financial Emergency</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Situation</h4>
                <p className="text-muted-foreground text-sm">
                  Your loved one calls saying they need money immediately for rent, food, or transportation. You suspect substance use but don't know for sure.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="s2-crisis">Is this a crisis or chaos? Why?</Label>
                  <Textarea
                    id="s2-crisis"
                    value={scenario2.crisisOrChaos}
                    onChange={(e) => setScenario2({...scenario2, crisisOrChaos: e.target.value})}
                    placeholder="Analyze whether this is a true crisis or manufactured chaos..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s2-control">What is within your control in this moment?</Label>
                  <Textarea
                    id="s2-control"
                    value={scenario2.withinControl}
                    onChange={(e) => setScenario2({...scenario2, withinControl: e.target.value})}
                    placeholder="List what you can actually control..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s2-enabling">What enabling behavior are you tempted to engage in?</Label>
                  <Textarea
                    id="s2-enabling"
                    value={scenario2.enablingTemptation}
                    onChange={(e) => setScenario2({...scenario2, enablingTemptation: e.target.value})}
                    placeholder="Be honest about your impulses..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s2-recovery">What response aligns with recovery—not relief?</Label>
                  <Textarea
                    id="s2-recovery"
                    value={scenario2.recoveryResponse}
                    onChange={(e) => setScenario2({...scenario2, recoveryResponse: e.target.value})}
                    placeholder="What would support their recovery, not just make you feel better..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s2-calm">Write a calm, short response you could actually say:</Label>
                  <Textarea
                    id="s2-calm"
                    value={scenario2.calmResponse}
                    onChange={(e) => setScenario2({...scenario2, calmResponse: e.target.value})}
                    placeholder="Write the actual words you would use..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Scenario 3 */}
          <AccordionItem value="scenario-3" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scenario 3: The Emotional Outburst</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Situation</h4>
                <p className="text-muted-foreground text-sm">
                  When you hold a boundary, your loved one becomes angry, blames you, and accuses you of not caring.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">What feelings does this trigger in you?</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {scenario3Feelings.map(feeling => (
                      <label key={feeling} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={scenario3.feelings.includes(feeling)}
                          onCheckedChange={() => handleEmotionToggle(feeling, scenario3.feelings, (feelings) => setScenario3({...scenario3, feelings}))}
                        />
                        <span className="text-sm">{feeling}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="s3-risk">What is the risk if you argue or defend yourself?</Label>
                  <Textarea
                    id="s3-risk"
                    value={scenario3.argueRisk}
                    onChange={(e) => setScenario3({...scenario3, argueRisk: e.target.value})}
                    placeholder="Consider what happens if you engage..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s3-tool">What emotional regulation tool could you use here?</Label>
                  <Textarea
                    id="s3-tool"
                    value={scenario3.regulationTool}
                    onChange={(e) => setScenario3({...scenario3, regulationTool: e.target.value})}
                    placeholder="Name a specific tool or technique..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s3-boundary">What is your boundary without explanation?</Label>
                  <Textarea
                    id="s3-boundary"
                    value={scenario3.boundaryWithout}
                    onChange={(e) => setScenario3({...scenario3, boundaryWithout: e.target.value})}
                    placeholder="State the boundary simply, without justification..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s3-end">When should you end the conversation?</Label>
                  <Textarea
                    id="s3-end"
                    value={scenario3.endConversation}
                    onChange={(e) => setScenario3({...scenario3, endConversation: e.target.value})}
                    placeholder="What signals tell you it's time to disengage..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Scenario 4 */}
          <AccordionItem value="scenario-4" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scenario 4: Early Recovery Confusion</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Situation</h4>
                <p className="text-muted-foreground text-sm">
                  Your loved one is newly sober but stops attending meetings, therapy, or aftercare. They insist they're "fine" and that you're being controlling.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="s4-concern">What behavior concerns you most?</Label>
                  <Textarea
                    id="s4-concern"
                    value={scenario4.concerningBehavior}
                    onChange={(e) => setScenario4({...scenario4, concerningBehavior: e.target.value})}
                    placeholder="Identify the specific concerning behaviors..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s4-support">What is the difference between support and monitoring here?</Label>
                  <Textarea
                    id="s4-support"
                    value={scenario4.supportVsMonitoring}
                    onChange={(e) => setScenario4({...scenario4, supportVsMonitoring: e.target.value})}
                    placeholder="Distinguish between healthy support and controlling behavior..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s4-boundary">What boundary or expectation is appropriate at this stage?</Label>
                  <Textarea
                    id="s4-boundary"
                    value={scenario4.appropriateBoundary}
                    onChange={(e) => setScenario4({...scenario4, appropriateBoundary: e.target.value})}
                    placeholder="Define reasonable expectations for early recovery..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s4-communicate">How can you communicate concern without controlling?</Label>
                  <Textarea
                    id="s4-communicate"
                    value={scenario4.communicateConcern}
                    onChange={(e) => setScenario4({...scenario4, communicateConcern: e.target.value})}
                    placeholder="Write what you would say..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s4-consequence">What consequence might be necessary if patterns continue?</Label>
                  <Textarea
                    id="s4-consequence"
                    value={scenario4.necessaryConsequence}
                    onChange={(e) => setScenario4({...scenario4, necessaryConsequence: e.target.value})}
                    placeholder="Define what will happen if behavior doesn't change..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Scenario 5 */}
          <AccordionItem value="scenario-5" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scenario 5: Family Undermining</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Situation</h4>
                <p className="text-muted-foreground text-sm">
                  Another family member secretly gives your loved one money or housing, undermining your boundaries.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="s5-value">What value is being violated for you?</Label>
                  <Textarea
                    id="s5-value"
                    value={scenario5.violatedValue}
                    onChange={(e) => setScenario5({...scenario5, violatedValue: e.target.value})}
                    placeholder="Name the core value that feels violated..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s5-boundary">What boundary is needed with the family member?</Label>
                  <Textarea
                    id="s5-boundary"
                    value={scenario5.familyBoundary}
                    onChange={(e) => setScenario5({...scenario5, familyBoundary: e.target.value})}
                    placeholder="Define what you need from this family member..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s5-role">What is your role—and what is not?</Label>
                  <Textarea
                    id="s5-role"
                    value={scenario5.yourRole}
                    onChange={(e) => setScenario5({...scenario5, yourRole: e.target.value})}
                    placeholder="Clarify what is and isn't your responsibility..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s5-statement">Write a clear statement addressing the issue:</Label>
                  <Textarea
                    id="s5-statement"
                    value={scenario5.clearStatement}
                    onChange={(e) => setScenario5({...scenario5, clearStatement: e.target.value})}
                    placeholder="Write what you would say to this family member..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s5-protect">How will you protect your own consistency if they refuse to cooperate?</Label>
                  <Textarea
                    id="s5-protect"
                    value={scenario5.protectConsistency}
                    onChange={(e) => setScenario5({...scenario5, protectConsistency: e.target.value})}
                    placeholder="Plan for maintaining your boundaries regardless..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Scenario 6 */}
          <AccordionItem value="scenario-6" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scenario 6: The Relapse Disclosure</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Situation</h4>
                <p className="text-muted-foreground text-sm">
                  Your loved one admits to a relapse and asks you not to tell anyone and not to "overreact."
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">What emotions immediately surface?</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {scenario6Emotions.map(emotion => (
                      <label key={emotion} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={scenario6.emotions.includes(emotion)}
                          onCheckedChange={() => handleEmotionToggle(emotion, scenario6.emotions, (emotions) => setScenario6({...scenario6, emotions}))}
                        />
                        <span className="text-sm">{emotion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="s6-secrecy">Is secrecy aligned with recovery? Why or why not?</Label>
                  <Textarea
                    id="s6-secrecy"
                    value={scenario6.secrecyAligned}
                    onChange={(e) => setScenario6({...scenario6, secrecyAligned: e.target.value})}
                    placeholder="Analyze the request for secrecy..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s6-supportive">What supportive action aligns with accountability?</Label>
                  <Textarea
                    id="s6-supportive"
                    value={scenario6.supportiveAction}
                    onChange={(e) => setScenario6({...scenario6, supportiveAction: e.target.value})}
                    placeholder="How can you support while maintaining accountability..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s6-boundary">What boundary needs to remain in place?</Label>
                  <Textarea
                    id="s6-boundary"
                    value={scenario6.boundaryInPlace}
                    onChange={(e) => setScenario6({...scenario6, boundaryInPlace: e.target.value})}
                    placeholder="State the boundary that must be maintained..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s6-who">Who should be informed or involved?</Label>
                  <Textarea
                    id="s6-who"
                    value={scenario6.whoInformed}
                    onChange={(e) => setScenario6({...scenario6, whoInformed: e.target.value})}
                    placeholder="List appropriate people to inform..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Scenario 7 */}
          <AccordionItem value="scenario-7" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Frown className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scenario 7: The Guilt Trap</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Situation</h4>
                <p className="text-muted-foreground text-sm">
                  You say no to a request, and later you feel overwhelming guilt and second-guess yourself.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="s7-thought">What thought fuels the guilt most strongly?</Label>
                  <Textarea
                    id="s7-thought"
                    value={scenario7.guiltThought}
                    onChange={(e) => setScenario7({...scenario7, guiltThought: e.target.value})}
                    placeholder="Identify the core thought driving guilt..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s7-basis">Is this guilt based on responsibility or fear?</Label>
                  <Textarea
                    id="s7-basis"
                    value={scenario7.guiltBasis}
                    onChange={(e) => setScenario7({...scenario7, guiltBasis: e.target.value})}
                    placeholder="Analyze the source of your guilt..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s7-value">What value were you honoring by saying no?</Label>
                  <Textarea
                    id="s7-value"
                    value={scenario7.valueHonored}
                    onChange={(e) => setScenario7({...scenario7, valueHonored: e.target.value})}
                    placeholder="Name the value you were protecting..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s7-tool">What emotional regulation tool can help you stay grounded?</Label>
                  <Textarea
                    id="s7-tool"
                    value={scenario7.regulationTool}
                    onChange={(e) => setScenario7({...scenario7, regulationTool: e.target.value})}
                    placeholder="Name a specific tool or technique..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="s7-reminder">What reminder would help you hold your boundary?</Label>
                  <Textarea
                    id="s7-reminder"
                    value={scenario7.reminder}
                    onChange={(e) => setScenario7({...scenario7, reminder: e.target.value})}
                    placeholder="Write an affirmation or reminder..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Reflection Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg text-logo-green">Reflection: Your Patterns</CardTitle>
            <CardDescription>Answer honestly:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="r-familiar">Which scenario felt most familiar?</Label>
              <Textarea
                id="r-familiar"
                value={reflection.mostFamiliar}
                onChange={(e) => setReflection({...reflection, mostFamiliar: e.target.value})}
                placeholder="Which situation resonated most with your experience..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="r-abandon">Where are you most likely to abandon your plan?</Label>
              <Textarea
                id="r-abandon"
                value={reflection.likelyAbandon}
                onChange={(e) => setReflection({...reflection, likelyAbandon: e.target.value})}
                placeholder="Identify your vulnerabilities..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="r-support">What support would strengthen your follow-through?</Label>
              <Textarea
                id="r-support"
                value={reflection.supportNeeded}
                onChange={(e) => setReflection({...reflection, supportNeeded: e.target.value})}
                placeholder="What would help you stay consistent..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Reframe */}
        <div className="bg-logo-green/10 p-6 rounded-lg border border-logo-green/20 text-center">
          <h3 className="font-bold text-logo-green text-lg mb-3">Key Reframe</h3>
          <p className="text-foreground mb-2">
            You don't build confidence by getting it right every time.
          </p>
          <p className="text-foreground font-semibold">
            You build it by responding consistently over time.
          </p>
          <p className="text-muted-foreground mt-4 text-sm italic">
            Practicing these scenarios prepares you to act from clarity—not panic—when it matters most.
          </p>
        </div>

        {/* Companion Resources */}
        <div className="bg-muted/50 p-4 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Suggested Companion Resources
          </h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/family-action-plan">
              <Button variant="outline" size="sm">Family Recovery Action Plan</Button>
            </Link>
            <Link to="/crisis-chaos">
              <Button variant="outline" size="sm">Crisis vs. Chaos Decision Guide</Button>
            </Link>
            <Link to="/family-videos">
              <Button variant="outline" size="sm">Boundary Setting Worksheet</Button>
            </Link>
            <Link to="/emotional-regulation">
              <Button variant="outline" size="sm">Emotional Regulation Tools Guide</Button>
            </Link>
          </div>
        </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
