import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import { 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  HelpCircle, 
  Heart, 
  AlertTriangle, 
  CheckCircle2,
  Pause,
  AlertCircle,
  Shield,
  Scale,
  HandHeart,
  XCircle,
  FileText,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepData {
  // Step 1
  requestType: string[];
  requestOther: string;
  requestSentence: string;
  // Step 2
  situationType: "crisis" | "chaos" | "";
  // Step 3
  crisisResponse: string;
  crisisOther: string;
  // Step 4
  activelyUsing: "yes" | "no" | "unsure" | "";
  // Step 5
  reducesConsequences: "yes" | "no" | "";
  // Step 6
  accountabilityChecks: string[];
  // Step 7
  noResponse: string;
  recoveryAlternatives: string[];
  recoveryOther: string;
  // Step 9
  whatIWillDo: string;
  whatIWillNotDo: string;
  whatTheyMustDo: string;
  timeLimit: string;
  successIndicator: string;
  // Step 10
  fearOrGuilt: "fear" | "values" | "";
  respectSelf: "yes" | "no" | "";
  supportsRecovery: "recovery" | "discomfort" | "";
}

const initialStepData: StepData = {
  requestType: [],
  requestOther: "",
  requestSentence: "",
  situationType: "",
  crisisResponse: "",
  crisisOther: "",
  activelyUsing: "",
  reducesConsequences: "",
  accountabilityChecks: [],
  noResponse: "",
  recoveryAlternatives: [],
  recoveryOther: "",
  whatIWillDo: "",
  whatIWillNotDo: "",
  whatTheyMustDo: "",
  timeLimit: "",
  successIndicator: "",
  fearOrGuilt: "",
  respectSelf: "",
  supportsRecovery: "",
};

const requestTypes = [
  "Money",
  "Housing / a place to stay",
  "Transportation / a ride",
  "\"Talk me down\" emotional support",
  "Help with consequences (work, legal, school)",
];

const crisisResponses = [
  "Call emergency services / crisis line",
  "Take them to ER / medical evaluation",
  "Contact treatment professional / clinician",
  "Safety plan for minors/vulnerable adults",
];

const accountabilityItems = [
  "It requires their action (appointments, intake call, paperwork)",
  "It is time-limited and clearly defined",
  "It supports recovery behaviors (treatment, meetings, structure)",
  "It does not violate my values or boundaries",
  "I can do it without resentment",
];

const noResponses = [
  "\"I'm not able to do that.\"",
  "\"I care about you, and my boundary hasn't changed.\"",
  "\"I won't support anything that keeps this going.\"",
  "\"We can talk about treatment options, not money/housing/rides.\"",
];

const recoveryAlternativeOptions = [
  "Provide treatment center options",
  "Offer to drive to an assessment/detox only",
  "Offer to attend a family session",
  "Offer emotional support when sober/calm",
];

export default function EnablingDecisionTree() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<StepData>(initialStepData);
  const [outcome, setOutcome] = useState<"help" | "enabling" | "crisis" | "escalating" | null>(null);

  const updateStepData = <K extends keyof StepData>(key: K, value: StepData[K]) => {
    setStepData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: keyof StepData, item: string) => {
    const current = stepData[key] as string[];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateStepData(key, updated as StepData[typeof key]);
  };

  const handleNext = () => {
    // Handle conditional routing
    if (currentStep === 2) {
      if (stepData.situationType === "crisis") {
        setCurrentStep(3); // Go to crisis response
      } else {
        setCurrentStep(4); // Go to actively using
      }
    } else if (currentStep === 3) {
      // After crisis response, show crisis outcome
      setOutcome("crisis");
      setCurrentStep(11);
    } else if (currentStep === 5) {
      if (stepData.reducesConsequences === "yes") {
        setCurrentStep(7); // Go to healthiest no
      } else {
        setCurrentStep(6); // Go to accountability check
      }
    } else if (currentStep === 6) {
      const checkedCount = stepData.accountabilityChecks.length;
      if (checkedCount >= 3) {
        setCurrentStep(9); // Go to define help
      } else {
        setCurrentStep(7); // Go to healthiest no
      }
    } else if (currentStep === 7) {
      setOutcome("enabling");
      setCurrentStep(11);
    } else if (currentStep === 8) {
      setOutcome("escalating");
      setCurrentStep(11);
    } else if (currentStep === 9) {
      setCurrentStep(10); // Go to self-check
    } else if (currentStep === 10) {
      // Check self-assessment results
      const hasRedFlags = 
        stepData.fearOrGuilt === "fear" || 
        stepData.respectSelf === "no" || 
        stepData.supportsRecovery === "discomfort";
      
      if (hasRedFlags) {
        setOutcome("enabling");
      } else {
        setOutcome("help");
      }
      setCurrentStep(11);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 11) {
      // Go back based on outcome path
      if (outcome === "crisis") {
        setCurrentStep(3);
      } else if (outcome === "escalating") {
        setCurrentStep(8);
      } else if (outcome === "help") {
        setCurrentStep(10);
      } else {
        setCurrentStep(7);
      }
      setOutcome(null);
    } else if (currentStep === 4 && stepData.situationType === "crisis") {
      setCurrentStep(2);
    } else if (currentStep === 7) {
      // Could come from step 5 or step 6
      if (stepData.reducesConsequences === "yes") {
        setCurrentStep(5);
      } else {
        setCurrentStep(6);
      }
    } else if (currentStep === 9) {
      setCurrentStep(6);
    } else {
      setCurrentStep(prev => Math.max(0, prev - 1));
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setStepData(initialStepData);
    setOutcome(null);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return stepData.requestType.length > 0 || stepData.requestOther.length > 0;
      case 2:
        return stepData.situationType !== "";
      case 3:
        return stepData.crisisResponse !== "" || stepData.crisisOther !== "";
      case 4:
        return stepData.activelyUsing !== "";
      case 5:
        return stepData.reducesConsequences !== "";
      case 6:
        return true; // Can proceed with any number of checks
      case 7:
        return stepData.noResponse !== "";
      case 9:
        return stepData.whatIWillDo.length > 0 && stepData.whatTheyMustDo.length > 0;
      case 10:
        return stepData.fearOrGuilt !== "" && stepData.respectSelf !== "" && stepData.supportsRecovery !== "";
      default:
        return true;
    }
  };

  const getStepIcon = (step: number) => {
    const icons: { [key: number]: React.ReactNode } = {
      0: <Pause className="h-5 w-5" />,
      1: <HelpCircle className="h-5 w-5" />,
      2: <AlertCircle className="h-5 w-5" />,
      3: <Shield className="h-5 w-5" />,
      4: <AlertTriangle className="h-5 w-5" />,
      5: <Scale className="h-5 w-5" />,
      6: <CheckCircle2 className="h-5 w-5" />,
      7: <XCircle className="h-5 w-5" />,
      8: <AlertTriangle className="h-5 w-5" />,
      9: <FileText className="h-5 w-5" />,
      10: <User className="h-5 w-5" />,
    };
    return icons[step] || <HelpCircle className="h-5 w-5" />;
  };

  if (!isExpanded) {
    return (
      <Card 
        className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent cursor-pointer hover:border-amber-600 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 ring-2 ring-amber-500/30" 
        onClick={() => setIsExpanded(true)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Is This Help or Enabling?</CardTitle>
              <CardDescription className="mt-1">
                A step-by-step guide before you say yes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            When families are stressed, they often respond quickly to requests — especially requests wrapped 
            in urgency, guilt, or crisis language. This decision tree helps you pause, think clearly, and 
            choose responses that support recovery, safety, and your well-being.
          </p>
          <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <HandHeart className="h-4 w-4 text-green-600" />
              <span><strong>Helping</strong> supports responsibility</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span><strong>Enabling</strong> removes responsibility</span>
            </div>
          </div>
          <Button className="w-full sm:w-auto">
            Start the Assessment <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <ToolBrandHeader
              title="Is This Help or Enabling? — Decision Tree"
              subtitle="This step-by-step guide helps you pause before responding to requests, distinguish true crisis from chaos, and make decisions aligned with recovery and your own well-being."
              clinicalNote="Based on CRAFT principles and healthy detachment practices. Helping supports responsibility. Enabling removes it."
            />
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
              <Pause className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Before You Start: The 10-Second Pause</h3>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <p className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">1</span>
                  <span>Take one slow breath in.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">2</span>
                  <span>Exhale fully.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">3</span>
                  <span>Say (silently or out loud): <em>"I don't have to decide right now."</em></span>
                </p>
              </div>
            </div>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <span>
                  <strong>If the person is intoxicated, threatening, or escalating,</strong> skip ahead to 
                  the safety protocol.
                </span>
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={() => setCurrentStep(8)}
              >
                Go to Safety Protocol
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 1: What exactly are they asking for?</h3>
              <p className="text-sm text-muted-foreground mb-4">Check all that apply:</p>
            </div>
            <div className="space-y-3">
              {requestTypes.map((type) => (
                <div key={type} className="flex items-center space-x-3">
                  <Checkbox
                    id={type}
                    checked={stepData.requestType.includes(type)}
                    onCheckedChange={() => toggleArrayItem("requestType", type)}
                  />
                  <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="other"
                  checked={stepData.requestOther.length > 0}
                  onCheckedChange={(checked) => { if (!checked) updateStepData("requestOther", ""); }}
                />
                <div className="flex-1">
                  <Input
                    placeholder="Something else..."
                    value={stepData.requestOther}
                    onChange={(e) => updateStepData("requestOther", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Label htmlFor="request-sentence" className="text-sm font-medium">
                Write the request in one sentence (no story):
              </Label>
              <Textarea
                id="request-sentence"
                placeholder="They are asking me to..."
                value={stepData.requestSentence}
                onChange={(e) => updateStepData("requestSentence", e.target.value)}
                className="mt-2"
                rows={2}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 2: Is this a true crisis or chaos?</h3>
              <div className="p-4 bg-muted/50 rounded-lg mb-4">
                <p className="text-sm">
                  <strong>A true crisis</strong> involves immediate risk to life or safety.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Examples: overdose risk, suicidal threat with intent, violence risk, medical emergency.
                </p>
              </div>
            </div>
            <RadioGroup
              value={stepData.situationType}
              onValueChange={(value) => updateStepData("situationType", value as "crisis" | "chaos")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="crisis" id="crisis" />
                <Label htmlFor="crisis" className="flex-1 cursor-pointer">
                  <span className="font-medium text-destructive">Crisis</span>
                  <span className="text-sm text-muted-foreground block">There is a safety risk</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="chaos" id="chaos" />
                <Label htmlFor="chaos" className="flex-1 cursor-pointer">
                  <span className="font-medium">Chaos</span>
                  <span className="text-sm text-muted-foreground block">Painful but not unsafe</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 3: Crisis Response</h3>
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
                <p className="text-sm font-medium text-destructive">
                  Crisis response should be professional, not family rescue.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Choose the appropriate response:</p>
            <RadioGroup
              value={stepData.crisisResponse}
              onValueChange={(value) => updateStepData("crisisResponse", value)}
              className="space-y-2"
            >
              {crisisResponses.map((response) => (
                <div key={response} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={response} id={response} />
                  <Label htmlFor={response} className="cursor-pointer">{response}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Other response..."
                value={stepData.crisisOther}
                onChange={(e) => {
                  updateStepData("crisisOther", e.target.value);
                  if (e.target.value) updateStepData("crisisResponse", "");
                }}
              />
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-medium mb-1">Important:</p>
              <p className="text-sm text-muted-foreground">
                A crisis response is not the same as removing all consequences. After safety is addressed, 
                return to your boundaries and plan.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 4: Are they actively using or unstable right now?</h3>
            </div>
            <RadioGroup
              value={stepData.activelyUsing}
              onValueChange={(value) => updateStepData("activelyUsing", value as "yes" | "no" | "unsure")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="yes" id="using-yes" />
                <Label htmlFor="using-yes" className="flex-1 cursor-pointer">
                  <span className="font-medium">Yes / likely</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="no" id="using-no" />
                <Label htmlFor="using-no" className="flex-1 cursor-pointer">
                  <span className="font-medium">No / in stable recovery</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="unsure" id="using-unsure" />
                <Label htmlFor="using-unsure" className="flex-1 cursor-pointer">
                  <span className="font-medium">Unsure</span>
                  <span className="text-sm text-muted-foreground block">Treat as "likely" and proceed with caution</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 5: Would helping reduce consequences of using?</h3>
              <p className="text-sm text-muted-foreground mb-4">Ask yourself these questions honestly:</p>
            </div>
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                Would this make it easier for them to continue using?
              </p>
              <p className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                Would this protect them from a consequence they need to feel?
              </p>
              <p className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                Would I be doing something they can and should do themselves?
              </p>
            </div>
            <RadioGroup
              value={stepData.reducesConsequences}
              onValueChange={(value) => updateStepData("reducesConsequences", value as "yes" | "no")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border border-destructive/30 rounded-lg hover:bg-destructive/5 transition-colors">
                <RadioGroupItem value="yes" id="reduces-yes" />
                <Label htmlFor="reduces-yes" className="flex-1 cursor-pointer">
                  <span className="font-medium text-destructive">Yes</span>
                  <span className="text-sm text-muted-foreground block">This is likely enabling</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-green-500/30 rounded-lg hover:bg-green-500/5 transition-colors">
                <RadioGroupItem value="no" id="reduces-no" />
                <Label htmlFor="reduces-no" className="flex-1 cursor-pointer">
                  <span className="font-medium text-green-600">No</span>
                  <span className="text-sm text-muted-foreground block">It may be help—let's check further</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 6: Does the help increase accountability?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Healthy help has conditions and accountability—not endless access. Check all that apply:
              </p>
            </div>
            <div className="space-y-3">
              {accountabilityItems.map((item) => (
                <div 
                  key={item} 
                  className={cn(
                    "flex items-start space-x-3 p-3 border rounded-lg transition-colors",
                    stepData.accountabilityChecks.includes(item) && "bg-green-500/10 border-green-500/30"
                  )}
                >
                  <Checkbox
                    id={item}
                    checked={stepData.accountabilityChecks.includes(item)}
                    onCheckedChange={() => toggleArrayItem("accountabilityChecks", item)}
                    className="mt-0.5"
                  />
                  <Label htmlFor={item} className="cursor-pointer text-sm">{item}</Label>
                </div>
              ))}
            </div>
            <div className={cn(
              "p-4 rounded-lg border",
              stepData.accountabilityChecks.length >= 3 
                ? "bg-green-500/10 border-green-500/30" 
                : "bg-destructive/10 border-destructive/30"
            )}>
              <p className="text-sm font-medium">
                {stepData.accountabilityChecks.length} of 5 checked
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stepData.accountabilityChecks.length >= 3 
                  ? "This appears to be healthy help. Let's define it clearly." 
                  : "This may be enabling. Consider how to say no with love."}
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 7: The Healthiest "No"</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose one response (short, calm, no debate):
              </p>
            </div>
            <RadioGroup
              value={stepData.noResponse}
              onValueChange={(value) => updateStepData("noResponse", value)}
              className="space-y-2"
            >
              {noResponses.map((response) => (
                <div key={response} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={response} id={response} />
                  <Label htmlFor={response} className="cursor-pointer text-sm italic">{response}</Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">What you CAN offer that aligns with recovery:</p>
              <div className="space-y-2">
                {recoveryAlternativeOptions.map((alt) => (
                  <div key={alt} className="flex items-center space-x-3">
                    <Checkbox
                      id={alt}
                      checked={stepData.recoveryAlternatives.includes(alt)}
                      onCheckedChange={() => toggleArrayItem("recoveryAlternatives", alt)}
                    />
                    <Label htmlFor={alt} className="cursor-pointer text-sm">{alt}</Label>
                  </div>
                ))}
                <Input
                  placeholder="Other recovery-aligned alternative..."
                  value={stepData.recoveryOther}
                  onChange={(e) => updateStepData("recoveryOther", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-destructive">Step 8: Safety Protocol</h3>
              <p className="text-sm font-medium mb-4">
                If they are intoxicated, abusive, or escalating—this is not a productive moment.
              </p>
            </div>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="font-medium text-destructive mb-3">Do:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-destructive" />
                  End the conversation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-destructive" />
                  Maintain safety
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-destructive" />
                  Follow crisis protocols if needed
                </li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium mb-2">Use a script:</p>
              <div className="space-y-2 text-sm italic text-muted-foreground">
                <p>"I'm ending this conversation. We can talk when you're sober/calm."</p>
                <p>"I'm not going to argue. We'll talk later."</p>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg text-sm">
              <strong>Then return to your plan.</strong>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 9: Define the Help Clearly</h3>
              <p className="text-sm text-muted-foreground mb-4">
                No open-ended help. Fill in the agreement:
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="will-do" className="text-sm font-medium">What I will do:</Label>
                <Textarea
                  id="will-do"
                  placeholder="Be specific about what you're agreeing to..."
                  value={stepData.whatIWillDo}
                  onChange={(e) => updateStepData("whatIWillDo", e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="will-not-do" className="text-sm font-medium">What I will NOT do:</Label>
                <Textarea
                  id="will-not-do"
                  placeholder="Be clear about the limits..."
                  value={stepData.whatIWillNotDo}
                  onChange={(e) => updateStepData("whatIWillNotDo", e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="they-must-do" className="text-sm font-medium">What they must do for this help to continue:</Label>
                <Textarea
                  id="they-must-do"
                  placeholder="Required actions from them..."
                  value={stepData.whatTheyMustDo}
                  onChange={(e) => updateStepData("whatTheyMustDo", e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="time-limit" className="text-sm font-medium">Time limit / boundary (date or condition):</Label>
                <Input
                  id="time-limit"
                  placeholder="e.g., 30 days, until first appointment, etc."
                  value={stepData.timeLimit}
                  onChange={(e) => updateStepData("timeLimit", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="success" className="text-sm font-medium">How I will know this is working (observable behavior):</Label>
                <Textarea
                  id="success"
                  placeholder="What will I see that shows progress?"
                  value={stepData.successIndicator}
                  onChange={(e) => updateStepData("successIndicator", e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 10: The Family Self-Check</h3>
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                This is the most important step. Answer honestly:
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-3">Am I doing this out of fear/guilt or values/clarity?</p>
                <RadioGroup
                  value={stepData.fearOrGuilt}
                  onValueChange={(value) => updateStepData("fearOrGuilt", value as "fear" | "values")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fear" id="fear" />
                    <Label htmlFor="fear" className="text-destructive cursor-pointer">Fear/Guilt</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="values" id="values" />
                    <Label htmlFor="values" className="text-green-600 cursor-pointer">Values/Clarity</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-3">Will I respect myself tomorrow if I say yes?</p>
                <RadioGroup
                  value={stepData.respectSelf}
                  onValueChange={(value) => updateStepData("respectSelf", value as "yes" | "no")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="respect-yes" />
                    <Label htmlFor="respect-yes" className="text-green-600 cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="respect-no" />
                    <Label htmlFor="respect-no" className="text-destructive cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-3">Does this choice support recovery—or reduce discomfort?</p>
                <RadioGroup
                  value={stepData.supportsRecovery}
                  onValueChange={(value) => updateStepData("supportsRecovery", value as "recovery" | "discomfort")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recovery" id="supports-recovery" />
                    <Label htmlFor="supports-recovery" className="text-green-600 cursor-pointer">Recovery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="discomfort" id="reduces-discomfort" />
                    <Label htmlFor="reduces-discomfort" className="text-destructive cursor-pointer">Discomfort reduction</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {(stepData.fearOrGuilt === "fear" || stepData.respectSelf === "no" || stepData.supportsRecovery === "discomfort") && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  Your answers suggest you may want to reconsider this decision.
                </p>
              </div>
            )}
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            {outcome === "help" && (
              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <h3 className="text-xl font-semibold text-green-600">This is HELP</h3>
                </div>
                <p className="text-sm mb-4">
                  Based on your responses, this support appears to be healthy help that maintains 
                  accountability, has clear boundaries, and supports recovery.
                </p>
                {stepData.whatIWillDo && (
                  <div className="mt-4 p-4 bg-background rounded border">
                    <h4 className="font-medium text-sm mb-2">Your Agreement:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>What you will do:</strong> {stepData.whatIWillDo}</p>
                      {stepData.whatIWillNotDo && <p><strong>What you will NOT do:</strong> {stepData.whatIWillNotDo}</p>}
                      <p><strong>What they must do:</strong> {stepData.whatTheyMustDo}</p>
                      {stepData.timeLimit && <p><strong>Time limit:</strong> {stepData.timeLimit}</p>}
                      {stepData.successIndicator && <p><strong>Success indicator:</strong> {stepData.successIndicator}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {outcome === "enabling" && (
              <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <h3 className="text-xl font-semibold text-destructive">This is ENABLING</h3>
                </div>
                <p className="text-sm mb-4">
                  Based on your responses, this action would likely reduce consequences, fuel dependency, 
                  or increase chaos rather than supporting recovery.
                </p>
                {stepData.noResponse && (
                  <div className="mt-4 p-4 bg-background rounded border">
                    <h4 className="font-medium text-sm mb-2">Your Response:</h4>
                    <p className="text-sm italic">{stepData.noResponse}</p>
                    {stepData.recoveryAlternatives.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">What you CAN offer instead:</p>
                        <ul className="text-sm list-disc list-inside mt-1">
                          {stepData.recoveryAlternatives.map(alt => (
                            <li key={alt}>{alt}</li>
                          ))}
                          {stepData.recoveryOther && <li>{stepData.recoveryOther}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {outcome === "crisis" && (
              <div className="p-6 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Crisis Response Completed</h3>
                </div>
                <p className="text-sm mb-4">
                  You've identified this as a true crisis and selected an appropriate professional response.
                </p>
                <div className="mt-4 p-4 bg-background rounded border">
                  <h4 className="font-medium text-sm mb-2">Your Response:</h4>
                  <p className="text-sm">{stepData.crisisResponse || stepData.crisisOther}</p>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded text-sm">
                  <strong>Remember:</strong> After safety is addressed, return to your boundaries and plan.
                </div>
              </div>
            )}

            {outcome === "escalating" && (
              <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-destructive" />
                  <h3 className="text-xl font-semibold text-destructive">Safety First</h3>
                </div>
                <p className="text-sm mb-4">
                  You've identified that the person is intoxicated, abusive, or escalating. 
                  This is not a time for discussion—protect yourself first.
                </p>
                <div className="p-3 bg-background rounded border text-sm">
                  <strong>Your plan:</strong> End the conversation, maintain safety, return to your plan when it's safe.
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">Remember</p>
                  <p className="text-sm text-muted-foreground">
                    You can love someone and still say no. You can care and still refuse to participate in addiction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles: { [key: number]: string } = {
      0: "Before You Start",
      1: "Step 1: The Request",
      2: "Step 2: Crisis or Chaos?",
      3: "Step 3: Crisis Response",
      4: "Step 4: Actively Using?",
      5: "Step 5: Consequences Check",
      6: "Step 6: Accountability Check",
      7: "Step 7: The Healthiest No",
      8: "Step 8: Safety Protocol",
      9: "Step 9: Define the Help",
      10: "Step 10: Self-Check",
      11: "Assessment Complete",
    };
    return titles[currentStep] || "";
  };

  return (
    <Card className={cn(
      "border-primary/20 transition-all duration-300",
      outcome === "help" && "border-green-500/30",
      outcome === "enabling" && "border-destructive/30",
      outcome === "crisis" && "border-primary/30",
      outcome === "escalating" && "border-destructive/30"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              outcome === "help" && "bg-green-500/10",
              outcome === "enabling" && "bg-destructive/10",
              outcome === "escalating" && "bg-destructive/10",
              !outcome && "bg-primary/10"
            )}>
              {currentStep === 11 ? (
                outcome === "help" ? <CheckCircle2 className="h-6 w-6 text-green-600" /> :
                outcome === "enabling" ? <AlertTriangle className="h-6 w-6 text-destructive" /> :
                <Shield className="h-6 w-6 text-primary" />
              ) : (
                getStepIcon(currentStep)
              )}
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Is This Help or Enabling?
              </CardTitle>
              <CardDescription>
                {getStepTitle()}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="text-muted-foreground">
            Minimize
          </Button>
        </div>
        {currentStep < 11 && (
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {renderStep()}
        
        <div className="flex items-center justify-between pt-6 mt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
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
          {currentStep < 11 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              {currentStep === 10 ? "See Result" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
