import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User } from "@supabase/supabase-js";
import { Heart, ChevronDown, Printer, Brain, Shield, Users, Moon, Flame, RefreshCw, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import { useWorksheetPersistence } from "@/hooks/useWorksheetPersistence";
import WorksheetSaveStatus from "@/components/WorksheetSaveStatus";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface SelfCareWorksheetProps {
  user: User;
}

interface BeliefState {
  selectedBeliefs: string[];
  beliefOther: string;
  beliefReframe: string;
}

interface NervousSystemState {
  dysregulationSigns: string[];
  dysregulationOther: string;
  currentRoutines: string;
  routineImprovements: string;
}

interface EmotionalState {
  suppressedEmotions: string[];
  emotionOther: string;
  safePlace: string;
  emotionReframe: string;
}

interface BoundaryState {
  boundaryPractices: string[];
  boundaryOther: string;
  hardestBoundary: string;
  boundaryCommitment: string;
}

interface IdentityState {
  lostInterests: string;
  personalGoals: string;
  joyWithoutGuilt: string;
  identityStatement: string;
}

interface MentalState {
  overthinkingPatterns: string[];
  overthinkingOther: string;
  containmentStrategy: string;
  redirectActivity: string;
}

interface RelationalState {
  safePeople: string;
  unsafePeople: string;
  boundaryWithOthers: string;
}

interface CrisisState {
  crisisBasics: string[];
  crisisOther: string;
  calmPractices: string[];
  calmOther: string;
  currentPhase: string;
}

interface RealLifeState {
  realLifeExamples: string[];
  realLifeOther: string;
  personalExample: string;
}

interface CheckState {
  reducesReactivity: string;
  increasesClarity: string;
  protectsHealth: string;
  livesWithIntegrity: string;
  strengthensLongTerm: string;
}

interface CommitmentState {
  weeklyCommitments: string;
  dailyCommitment: string;
  selfPermissions: string[];
  permissionOther: string;
  affirmation: string;
}

const beliefs = [
  "I can't relax when things aren't okay.",
  "Taking care of myself means I don't care enough.",
  "If I'm okay, something bad might happen.",
  "I don't deserve peace when they're struggling.",
  "I should be available 24/7 in case of emergency.",
  "Enjoying life feels wrong when they're suffering.",
  "Rest is selfish when someone needs help."
];

const dysregulationSigns = [
  "Hypervigilance",
  "Trouble sleeping",
  "Racing thoughts",
  "Irritability",
  "Constant scanning for danger",
  "Exhaustion without rest",
  "Difficulty concentrating",
  "Physical tension"
];

const suppressedEmotions = [
  "Grief",
  "Anger",
  "Relief",
  "Hope",
  "Resentment",
  "Fear",
  "Sadness",
  "Frustration"
];

const boundaryPractices = [
  "Saying no without justification",
  "Ending circular conversations",
  "Not engaging when intoxicated/abusive",
  "Protecting my time",
  "Protecting my finances",
  "Protecting my emotional energy",
  "Allowing consequences to occur",
  "Not over-explaining my decisions"
];

const overthinkingPatterns = [
  "Replaying conversations",
  "Predicting worst-case scenarios",
  "Analyzing every behavior",
  "Planning for every contingency",
  "Second-guessing my decisions",
  "Mentally rehearsing arguments"
];

const crisisBasics = [
  "Prioritize sleep",
  "Maintain regular meals",
  "Stay hydrated",
  "Reduce unnecessary decisions",
  "Lower expectations",
  "Seek immediate support"
];

const calmPractices = [
  "Build sustainable routines",
  "Replenish energy reserves",
  "Reflect and process experiences",
  "Strengthen boundaries",
  "Reconnect with interests",
  "Plan for future challenges"
];

const realLifeExamples = [
  "Going to bed instead of arguing",
  "Not answering a late-night call",
  "Eating even when you don't feel hungry",
  "Saying 'I'm not discussing this right now'",
  "Enjoying something without explaining yourself",
  "Choosing peace over proving a point",
  "Taking a walk alone",
  "Turning off my phone for an hour"
];

const selfPermissions = [
  "To rest",
  "To enjoy life",
  "To protect my energy",
  "To stop waiting",
  "To feel happy",
  "To have my own life",
  "To set limits",
  "To prioritize my health"
];

export default function SelfCareWorksheet({ user }: SelfCareWorksheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [beliefs, setBeliefs] = useState<BeliefState>({
    selectedBeliefs: [],
    beliefOther: "",
    beliefReframe: ""
  });

  const [nervousSystem, setNervousSystem] = useState<NervousSystemState>({
    dysregulationSigns: [],
    dysregulationOther: "",
    currentRoutines: "",
    routineImprovements: ""
  });

  const [emotional, setEmotional] = useState<EmotionalState>({
    suppressedEmotions: [],
    emotionOther: "",
    safePlace: "",
    emotionReframe: ""
  });

  const [boundary, setBoundary] = useState<BoundaryState>({
    boundaryPractices: [],
    boundaryOther: "",
    hardestBoundary: "",
    boundaryCommitment: ""
  });

  const [identity, setIdentity] = useState<IdentityState>({
    lostInterests: "",
    personalGoals: "",
    joyWithoutGuilt: "",
    identityStatement: ""
  });

  const [mental, setMental] = useState<MentalState>({
    overthinkingPatterns: [],
    overthinkingOther: "",
    containmentStrategy: "",
    redirectActivity: ""
  });

  const [relational, setRelational] = useState<RelationalState>({
    safePeople: "",
    unsafePeople: "",
    boundaryWithOthers: ""
  });

  const [crisis, setCrisis] = useState<CrisisState>({
    crisisBasics: [],
    crisisOther: "",
    calmPractices: [],
    calmOther: "",
    currentPhase: ""
  });

  const [realLife, setRealLife] = useState<RealLifeState>({
    realLifeExamples: [],
    realLifeOther: "",
    personalExample: ""
  });

  const [check, setCheck] = useState<CheckState>({
    reducesReactivity: "",
    increasesClarity: "",
    protectsHealth: "",
    livesWithIntegrity: "",
    strengthensLongTerm: ""
  });

  const [commitment, setCommitment] = useState<CommitmentState>({
    weeklyCommitments: "",
    dailyCommitment: "",
    selfPermissions: [],
    permissionOther: "",
    affirmation: ""
  });

  const { savedData, save, saveStatus } = useWorksheetPersistence(
    "self_care_worksheet",
    user
  );

  useEffect(() => {
    if (!savedData) return;
    if (savedData.beliefs)       setBeliefs(savedData.beliefs);
    if (savedData.nervousSystem) setNervousSystem(savedData.nervousSystem);
    if (savedData.emotional)     setEmotional(savedData.emotional);
    if (savedData.boundary)      setBoundary(savedData.boundary);
    if (savedData.identity)      setIdentity(savedData.identity);
    if (savedData.mental)        setMental(savedData.mental);
    if (savedData.relational)    setRelational(savedData.relational);
    if (savedData.crisis)        setCrisis(savedData.crisis);
    if (savedData.realLife)      setRealLife(savedData.realLife);
    if (savedData.check)         setCheck(savedData.check);
    if (savedData.commitment)    setCommitment(savedData.commitment);
    if (savedData.currentStep != null) setCurrentStep(savedData.currentStep);
  }, [savedData]);

  useEffect(() => {
    save({ beliefs, nervousSystem, emotional, boundary, identity, mental, relational, crisis, realLife, check, commitment, currentStep });
  }, [beliefs, nervousSystem, emotional, boundary, identity, mental, relational, crisis, realLife, check, commitment, currentStep]);

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

  const totalSteps = 11;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const beliefsList = [
    "I can't relax when things aren't okay.",
    "Taking care of myself means I don't care enough.",
    "If I'm okay, something bad might happen.",
    "I don't deserve peace when they're struggling.",
    "I should be available 24/7 in case of emergency.",
    "Enjoying life feels wrong when they're suffering.",
    "Rest is selfish when someone needs help."
  ];

  const dysregulationSignsList = [
    "Hypervigilance",
    "Trouble sleeping",
    "Racing thoughts",
    "Irritability",
    "Constant scanning for danger",
    "Exhaustion without rest",
    "Difficulty concentrating",
    "Physical tension"
  ];

  const suppressedEmotionsList = [
    "Grief",
    "Anger",
    "Relief",
    "Hope",
    "Resentment",
    "Fear",
    "Sadness",
    "Frustration"
  ];

  const boundaryPracticesList = [
    "Saying no without justification",
    "Ending circular conversations",
    "Not engaging when intoxicated/abusive",
    "Protecting my time",
    "Protecting my finances",
    "Protecting my emotional energy",
    "Allowing consequences to occur",
    "Not over-explaining my decisions"
  ];

  const overthinkingPatternsList = [
    "Replaying conversations",
    "Predicting worst-case scenarios",
    "Analyzing every behavior",
    "Planning for every contingency",
    "Second-guessing my decisions",
    "Mentally rehearsing arguments"
  ];

  const crisisBasicsList = [
    "Prioritize sleep",
    "Maintain regular meals",
    "Stay hydrated",
    "Reduce unnecessary decisions",
    "Lower expectations",
    "Seek immediate support"
  ];

  const calmPracticesList = [
    "Build sustainable routines",
    "Replenish energy reserves",
    "Reflect and process experiences",
    "Strengthen boundaries",
    "Reconnect with interests",
    "Plan for future challenges"
  ];

  const realLifeExamplesList = [
    "Going to bed instead of arguing",
    "Not answering a late-night call",
    "Eating even when you don't feel hungry",
    "Saying 'I'm not discussing this right now'",
    "Enjoying something without explaining yourself",
    "Choosing peace over proving a point",
    "Taking a walk alone",
    "Turning off my phone for an hour"
  ];

  const selfPermissionsList = [
    "To rest",
    "To enjoy life",
    "To protect my energy",
    "To stop waiting",
    "To feel happy",
    "To have my own life",
    "To set limits",
    "To prioritize my health"
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-10">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-rose-500" />
                <div>
                  <CardTitle className="text-logo-blue">Self-Care That Actually Helps</CardTitle>
                  <CardDescription>What Families Need When Loving Someone With Addiction</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isOpen && savedData && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                    In progress
                  </span>
                )}
                <WorksheetSaveStatus status={saveStatus} />
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{currentStep + 1} of {totalSteps}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <ToolBrandHeader
              title="Self-Care That Actually Helps"
              subtitle={'When families hear "self-care," many feel irritated, guilty, or dismissed. This worksheet reframes self-care as protecting your capacity to function, think clearly, and live meaningfully — regardless of whether your loved one changes.'}
              clinicalNote="Grounded in nervous system regulation, trauma-informed care, and family recovery research. Most families don't need indulgence — they need stability."
            />

            {/* Step 0: Understanding Your Beliefs About Self-Care */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 1: Why Self-Care Feels Wrong</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Families impacted by addiction often hold beliefs that prevent them from taking care of themselves. These beliefs come from love mixed with fear, not selfishness.
                </p>

                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-foreground font-medium mb-4">
                    Which of these beliefs resonate with you? (Check all that apply)
                  </p>
                  <div className="space-y-3">
                    {beliefsList.map(belief => (
                      <label key={belief} className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                          checked={beliefs.selectedBeliefs.includes(belief)}
                          onCheckedChange={() => handleCheckboxToggle(belief, beliefs.selectedBeliefs, (vals) => setBeliefs({...beliefs, selectedBeliefs: vals}))}
                          className="mt-1"
                        />
                        <span className="text-sm">{belief}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Label htmlFor="belief-other" className="text-sm">Other beliefs:</Label>
                    <Textarea
                      id="belief-other"
                      value={beliefs.beliefOther}
                      onChange={(e) => setBeliefs({...beliefs, beliefOther: e.target.value})}
                      placeholder="Write any other beliefs that prevent you from self-care..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Reality Check</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    <strong>Chronic self-neglect does not help your loved one. It only weakens you.</strong>
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                    Self-care is not about escaping reality. It is about becoming strong enough to face it without breaking.
                  </p>
                </div>

                <div>
                  <Label htmlFor="belief-reframe">How might you reframe one of your limiting beliefs?</Label>
                  <p className="text-xs text-muted-foreground mb-2">Example: "I can't relax when things aren't okay" → "My calm doesn't control their chaos—but it does protect my health."</p>
                  <Textarea
                    id="belief-reframe"
                    value={beliefs.beliefReframe}
                    onChange={(e) => setBeliefs({...beliefs, beliefReframe: e.target.value})}
                    placeholder="Write your reframed belief here..."
                  />
                </div>
              </div>
            )}

            {/* Step 1: Nervous System Care */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 2: Nervous System Care (The Foundation)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Families living with addiction are often in chronic fight-or-flight. A dysregulated nervous system cannot make good decisions. <strong>Calm is not complacency. It is capacity.</strong>
                </p>

                <div>
                  <Label className="text-sm font-medium">Which signs of dysregulation do you experience? (Check all that apply)</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {dysregulationSignsList.map(sign => (
                      <label key={sign} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={nervousSystem.dysregulationSigns.includes(sign)}
                          onCheckedChange={() => handleCheckboxToggle(sign, nervousSystem.dysregulationSigns, (vals) => setNervousSystem({...nervousSystem, dysregulationSigns: vals}))}
                        />
                        <span className="text-sm">{sign}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="dysregulation-other" className="text-sm">Other signs:</Label>
                    <input
                      type="text"
                      id="dysregulation-other"
                      value={nervousSystem.dysregulationOther}
                      onChange={(e) => setNervousSystem({...nervousSystem, dysregulationOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto bg-background"
                      placeholder="Describe..."
                    />
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">What Actually Helps:</h4>
                  <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-400">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Predictable routines (wake time, meals, sleep)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Grounding practices (breathing, body awareness)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Reducing stimulation during high stress</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Gentle movement (walking, stretching)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Consistent hydration and nutrition</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="current-routines">What routines do you currently have that support your nervous system?</Label>
                  <Textarea
                    id="current-routines"
                    value={nervousSystem.currentRoutines}
                    onChange={(e) => setNervousSystem({...nervousSystem, currentRoutines: e.target.value})}
                    placeholder="List any consistent practices you already have..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="routine-improvements">What ONE small routine could you add or improve this week?</Label>
                  <Textarea
                    id="routine-improvements"
                    value={nervousSystem.routineImprovements}
                    onChange={(e) => setNervousSystem({...nervousSystem, routineImprovements: e.target.value})}
                    placeholder="Be specific and realistic..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Emotional Self-Care */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 3: Emotional Self-Care (Not Suppression)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Families are often told to "stay strong," which leads to bottled emotions, emotional numbness, and sudden overwhelm.
                </p>
                <p className="text-foreground font-medium">
                  Feeling better does not mean you care less. It means you are human.
                </p>

                <div>
                  <Label className="text-sm font-medium">Which emotions have you been suppressing or minimizing?</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {suppressedEmotionsList.map(emotion => (
                      <label key={emotion} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={emotional.suppressedEmotions.includes(emotion)}
                          onCheckedChange={() => handleCheckboxToggle(emotion, emotional.suppressedEmotions, (vals) => setEmotional({...emotional, suppressedEmotions: vals}))}
                        />
                        <span className="text-sm">{emotion}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="emotion-other" className="text-sm">Other emotions:</Label>
                    <input
                      type="text"
                      id="emotion-other"
                      value={emotional.emotionOther}
                      onChange={(e) => setEmotional({...emotional, emotionOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto bg-background"
                      placeholder="Describe..."
                    />
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-3">Healthy Emotional Self-Care Includes:</h4>
                  <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-400">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Naming emotions without judgment</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Allowing grief, anger, relief, and hope to coexist</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Having at least one place where you don't minimize your pain</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Reducing shame about how you feel</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="safe-place">Where (or with whom) do you feel safe to express your true feelings without minimizing?</Label>
                  <Textarea
                    id="safe-place"
                    value={emotional.safePlace}
                    onChange={(e) => setEmotional({...emotional, safePlace: e.target.value})}
                    placeholder="This could be a person, group, journal, therapist, etc..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="emotion-reframe">Complete this sentence: "It's okay for me to feel _______ because _______."</Label>
                  <Textarea
                    id="emotion-reframe"
                    value={emotional.emotionReframe}
                    onChange={(e) => setEmotional({...emotional, emotionReframe: e.target.value})}
                    placeholder="Give yourself permission to feel..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Boundary-Based Self-Care */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 4: Boundary-Based Self-Care</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Boundaries are one of the most effective forms of self-care. Families often feel guilty setting boundaries—but boundaries reduce resentment and burnout.
                </p>
                <p className="text-foreground font-medium">
                  Boundaries are not punishment. They are protection.
                </p>

                <div>
                  <Label className="text-sm font-medium">Which boundary practices do you currently struggle with?</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {boundaryPracticesList.map(practice => (
                      <label key={practice} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={boundary.boundaryPractices.includes(practice)}
                          onCheckedChange={() => handleCheckboxToggle(practice, boundary.boundaryPractices, (vals) => setBoundary({...boundary, boundaryPractices: vals}))}
                        />
                        <span className="text-sm">{practice}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="boundary-other" className="text-sm">Other challenges:</Label>
                    <input
                      type="text"
                      id="boundary-other"
                      value={boundary.boundaryOther}
                      onChange={(e) => setBoundary({...boundary, boundaryOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto bg-background"
                      placeholder="Describe..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hardest-boundary">What is the hardest boundary for you to maintain, and why?</Label>
                  <Textarea
                    id="hardest-boundary"
                    value={boundary.hardestBoundary}
                    onChange={(e) => setBoundary({...boundary, hardestBoundary: e.target.value})}
                    placeholder="Be honest about what makes this boundary difficult..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="boundary-commitment">Write a commitment statement for one boundary you will protect this week:</Label>
                  <p className="text-xs text-muted-foreground mb-2">Example: "I will not engage in conversations after 10pm, because I need rest to function."</p>
                  <Textarea
                    id="boundary-commitment"
                    value={boundary.boundaryCommitment}
                    onChange={(e) => setBoundary({...boundary, boundaryCommitment: e.target.value})}
                    placeholder="I will..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Identity Recovery */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 5: Identity Recovery</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Addiction quietly takes over a family's identity. Many families stop asking: What do I want? What brings me meaning? Who am I outside of this crisis?
                </p>
                <p className="text-foreground font-medium">
                  You are more than someone's support system.
                </p>

                <div>
                  <Label htmlFor="lost-interests">What interests, hobbies, or passions have you set aside because of your loved one's addiction?</Label>
                  <Textarea
                    id="lost-interests"
                    value={identity.lostInterests}
                    onChange={(e) => setIdentity({...identity, lostInterests: e.target.value})}
                    placeholder="Think about what you used to enjoy before this crisis consumed your life..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="personal-goals">What personal goals do you have that don't depend on your loved one's recovery?</Label>
                  <Textarea
                    id="personal-goals"
                    value={identity.personalGoals}
                    onChange={(e) => setIdentity({...identity, personalGoals: e.target.value})}
                    placeholder="These are YOUR goals, not goals for them..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="joy-without-guilt">Describe one thing that brings you joy—and practice allowing yourself to enjoy it without guilt:</Label>
                  <Textarea
                    id="joy-without-guilt"
                    value={identity.joyWithoutGuilt}
                    onChange={(e) => setIdentity({...identity, joyWithoutGuilt: e.target.value})}
                    placeholder="What activity, person, or experience brings you genuine happiness?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="identity-statement">Complete this identity statement: "Beyond being a [parent/spouse/sibling] of someone with addiction, I am also someone who..."</Label>
                  <Textarea
                    id="identity-statement"
                    value={identity.identityStatement}
                    onChange={(e) => setIdentity({...identity, identityStatement: e.target.value})}
                    placeholder="Define yourself beyond this role..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Mental Self-Care */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 6: Mental Self-Care (Reducing Overthinking)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Families often live in mental overdrive. This is not denial—it's mental containment.
                </p>

                <div>
                  <Label className="text-sm font-medium">Which overthinking patterns do you experience?</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {overthinkingPatternsList.map(pattern => (
                      <label key={pattern} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={mental.overthinkingPatterns.includes(pattern)}
                          onCheckedChange={() => handleCheckboxToggle(pattern, mental.overthinkingPatterns, (vals) => setMental({...mental, overthinkingPatterns: vals}))}
                        />
                        <span className="text-sm">{pattern}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="overthinking-other" className="text-sm">Other patterns:</Label>
                    <input
                      type="text"
                      id="overthinking-other"
                      value={mental.overthinkingOther}
                      onChange={(e) => setMental({...mental, overthinkingOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto bg-background"
                      placeholder="Describe..."
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">What Helps:</h4>
                  <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-400">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Limiting "addiction thinking time"</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Writing thoughts down instead of cycling them</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Grounding in present-moment facts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Redirecting attention intentionally</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="containment-strategy">What strategy will you use to contain your "addiction thinking time"?</Label>
                  <p className="text-xs text-muted-foreground mb-2">Example: "I will journal for 15 minutes in the morning, then consciously redirect my thoughts."</p>
                  <Textarea
                    id="containment-strategy"
                    value={mental.containmentStrategy}
                    onChange={(e) => setMental({...mental, containmentStrategy: e.target.value})}
                    placeholder="Describe your mental containment approach..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="redirect-activity">What activity helps you redirect your attention when you're spiraling?</Label>
                  <Textarea
                    id="redirect-activity"
                    value={mental.redirectActivity}
                    onChange={(e) => setMental({...mental, redirectActivity: e.target.value})}
                    placeholder="This should be something absorbing enough to shift your focus..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Relational Self-Care */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 7: Relational Self-Care</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Families often isolate or over-explain. You don't owe everyone access to your pain.
                </p>

                <div className="bg-teal-50 dark:bg-teal-950/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">Healthy Relational Self-Care Includes:</h4>
                  <ul className="space-y-2 text-sm text-teal-700 dark:text-teal-400">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Choosing safe people</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Reducing exposure to judgment or minimization</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Asking for support without needing solutions</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Letting go of people who demand updates or explanations</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="safe-people">Who are the "safe people" in your life who support without judging or fixing?</Label>
                  <Textarea
                    id="safe-people"
                    value={relational.safePeople}
                    onChange={(e) => setRelational({...relational, safePeople: e.target.value})}
                    placeholder="List names or describe the qualities of safe people..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="unsafe-people">Who are the people you need to limit exposure to (those who judge, minimize, or demand explanations)?</Label>
                  <Textarea
                    id="unsafe-people"
                    value={relational.unsafePeople}
                    onChange={(e) => setRelational({...relational, unsafePeople: e.target.value})}
                    placeholder="You don't need to cut them off—just protect your energy..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="boundary-with-others">What boundary will you set with people who drain you or make you feel worse?</Label>
                  <Textarea
                    id="boundary-with-others"
                    value={relational.boundaryWithOthers}
                    onChange={(e) => setRelational({...relational, boundaryWithOthers: e.target.value})}
                    placeholder="Example: 'I will no longer give detailed updates to my cousin who always criticizes my decisions.'"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 7: Crisis vs. Calm Self-Care */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-cyan-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 8: Self-Care During Crisis vs. Calm</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Self-care changes with context—and that's okay. What you need during a crisis is different from what you need during calm periods.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3">During Crisis:</h4>
                    <div className="space-y-2">
                      {crisisBasicsList.map(basic => (
                        <label key={basic} className="flex items-center gap-2 cursor-pointer text-sm text-red-700 dark:text-red-400">
                          <Checkbox
                            checked={crisis.crisisBasics.includes(basic)}
                            onCheckedChange={() => handleCheckboxToggle(basic, crisis.crisisBasics, (vals) => setCrisis({...crisis, crisisBasics: vals}))}
                          />
                          <span>{basic}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={crisis.crisisOther}
                        onChange={(e) => setCrisis({...crisis, crisisOther: e.target.value})}
                        className="border rounded px-2 py-1 text-sm w-full bg-background"
                        placeholder="Other crisis basics..."
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">During Calm Periods:</h4>
                    <div className="space-y-2">
                      {calmPracticesList.map(practice => (
                        <label key={practice} className="flex items-center gap-2 cursor-pointer text-sm text-green-700 dark:text-green-400">
                          <Checkbox
                            checked={crisis.calmPractices.includes(practice)}
                            onCheckedChange={() => handleCheckboxToggle(practice, crisis.calmPractices, (vals) => setCrisis({...crisis, calmPractices: vals}))}
                          />
                          <span>{practice}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={crisis.calmOther}
                        onChange={(e) => setCrisis({...crisis, calmOther: e.target.value})}
                        className="border rounded px-2 py-1 text-sm w-full bg-background"
                        placeholder="Other calm practices..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="current-phase">Are you currently in a crisis or calm phase? What does your self-care need to look like right now?</Label>
                  <Textarea
                    id="current-phase"
                    value={crisis.currentPhase}
                    onChange={(e) => setCrisis({...crisis, currentPhase: e.target.value})}
                    placeholder="Be honest about where you are and what you need most..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 8: Real Life Self-Care */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 9: What Self-Care Looks Like in Real Life</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Real self-care is often small, unglamorous, and invisible to others. None of this is selfish.
                </p>

                <div>
                  <Label className="text-sm font-medium">Which of these real-life self-care actions resonate with you?</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {realLifeExamplesList.map(example => (
                      <label key={example} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={realLife.realLifeExamples.includes(example)}
                          onCheckedChange={() => handleCheckboxToggle(example, realLife.realLifeExamples, (vals) => setRealLife({...realLife, realLifeExamples: vals}))}
                        />
                        <span className="text-sm">{example}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="reallife-other" className="text-sm">Other examples:</Label>
                    <input
                      type="text"
                      id="reallife-other"
                      value={realLife.realLifeOther}
                      onChange={(e) => setRealLife({...realLife, realLifeOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto bg-background"
                      placeholder="Describe..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="personal-example">Describe a recent moment when you chose self-care—even if it felt small:</Label>
                  <Textarea
                    id="personal-example"
                    value={realLife.personalExample}
                    onChange={(e) => setRealLife({...realLife, personalExample: e.target.value})}
                    placeholder="Celebrate the small wins..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 9: Reality-Based Self-Care Check */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 10: A Reality-Based Self-Care Check</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use these questions to evaluate whether an action truly counts as self-care for you.
                </p>

                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                    Think of something you're considering doing for yourself. Then answer honestly:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reduces-reactivity" className="text-emerald-800 dark:text-emerald-300">Does this reduce reactivity?</Label>
                      <RadioGroup value={check.reducesReactivity} onValueChange={(val) => setCheck({...check, reducesReactivity: val})} className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yes" /> Yes</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="no" /> No</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="unsure" /> Unsure</label>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="increases-clarity" className="text-emerald-800 dark:text-emerald-300">Does this increase clarity?</Label>
                      <RadioGroup value={check.increasesClarity} onValueChange={(val) => setCheck({...check, increasesClarity: val})} className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yes" /> Yes</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="no" /> No</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="unsure" /> Unsure</label>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="protects-health" className="text-emerald-800 dark:text-emerald-300">Does this protect my health?</Label>
                      <RadioGroup value={check.protectsHealth} onValueChange={(val) => setCheck({...check, protectsHealth: val})} className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yes" /> Yes</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="no" /> No</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="unsure" /> Unsure</label>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="lives-integrity" className="text-emerald-800 dark:text-emerald-300">Does this help me live with integrity?</Label>
                      <RadioGroup value={check.livesWithIntegrity} onValueChange={(val) => setCheck({...check, livesWithIntegrity: val})} className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yes" /> Yes</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="no" /> No</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="unsure" /> Unsure</label>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="strengthens-longterm" className="text-emerald-800 dark:text-emerald-300">Does this strengthen me long-term?</Label>
                      <RadioGroup value={check.strengthensLongTerm} onValueChange={(val) => setCheck({...check, strengthensLongTerm: val})} className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yes" /> Yes</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="no" /> No</label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="unsure" /> Unsure</label>
                      </RadioGroup>
                    </div>
                  </div>

                  <p className="text-emerald-800 dark:text-emerald-300 font-medium mt-4">
                    If you answered "yes" to most of these—it counts as real self-care.
                  </p>
                </div>
              </div>
            )}

            {/* Step 10: Commitment & Affirmation */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-logo-blue">Part 11: Your Self-Care Commitment</h3>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Final Reframe</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Self-care is not about feeling good. It's about being able to live well—even when things are hard.
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                    Taking care of yourself does not harm your loved one. It may be the most loving thing you do—for both of you.
                  </p>
                </div>

                <div>
                  <Label htmlFor="weekly-commitments">What 2-3 self-care practices will you commit to this week?</Label>
                  <Textarea
                    id="weekly-commitments"
                    value={commitment.weeklyCommitments}
                    onChange={(e) => setCommitment({...commitment, weeklyCommitments: e.target.value})}
                    placeholder="Be specific and realistic..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="daily-commitment">What is ONE thing you will do for yourself every single day, no matter what?</Label>
                  <Textarea
                    id="daily-commitment"
                    value={commitment.dailyCommitment}
                    onChange={(e) => setCommitment({...commitment, dailyCommitment: e.target.value})}
                    placeholder="This should be small enough to be non-negotiable..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">You are allowed: (Check the permissions you're granting yourself)</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {selfPermissionsList.map(permission => (
                      <label key={permission} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={commitment.selfPermissions.includes(permission)}
                          onCheckedChange={() => handleCheckboxToggle(permission, commitment.selfPermissions, (vals) => setCommitment({...commitment, selfPermissions: vals}))}
                        />
                        <span className="text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="permission-other" className="text-sm">Other permissions:</Label>
                    <input
                      type="text"
                      id="permission-other"
                      value={commitment.permissionOther}
                      onChange={(e) => setCommitment({...commitment, permissionOther: e.target.value})}
                      className="ml-2 border rounded px-2 py-1 text-sm w-full sm:w-auto bg-background"
                      placeholder="Describe..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="affirmation">Write a personal affirmation to remind yourself that self-care is essential:</Label>
                  <p className="text-xs text-muted-foreground mb-2">Example: "My peace matters. Taking care of myself is an act of love, not abandonment."</p>
                  <Textarea
                    id="affirmation"
                    value={commitment.affirmation}
                    onChange={(e) => setCommitment({...commitment, affirmation: e.target.value})}
                    placeholder="Write your personal affirmation..."
                    className="mt-1"
                  />
                </div>

                <div className="bg-rose-100 dark:bg-rose-900/30 p-6 rounded-lg border-2 border-rose-300 dark:border-rose-700 text-center">
                  <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-rose-800 dark:text-rose-300 mb-2">
                    Congratulations on completing this worksheet.
                  </p>
                  <p className="text-rose-700 dark:text-rose-400">
                    Self-care is not a destination—it's a daily practice. Return to this worksheet whenever you need a reminder that you matter, too.
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>

              <Button
                onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
                disabled={currentStep === totalSteps - 1}
              >
                Next
              </Button>
            </div>

            {/* Print Button */}
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print Worksheet
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
