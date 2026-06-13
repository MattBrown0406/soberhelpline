import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Printer, Shield, Users, FileText, MessageSquare, AlertTriangle, Heart, Target, ClipboardList, Scale, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const FamilyAdvocacyToolkit = () => {
  useGuideTracking("Family Advocacy Toolkit", "/family-advocacy-toolkit");
  const [preparationChecklist, setPreparationChecklist] = useState<string[]>([]);
  const [clinicalQuestions, setClinicalQuestions] = useState<string[]>([]);
  const [dischargeQuestions, setDischargeQuestions] = useState<string[]>([]);
  const [ethicsQuestions, setEthicsQuestions] = useState<string[]>([]);
  const [trackingItems, setTrackingItems] = useState<string[]>([]);
  const [valuesAnchor, setValuesAnchor] = useState<string[]>([]);
  const [notes, setNotes] = useState({
    preparation: "",
    questions: "",
    tracking: "",
    general: "",
  });

  const preparationItems = [
    "I am regulated and calm",
    "I know what decision is being discussed",
    "I have specific questions written down",
    "I understand what I'm asking for (clarity, delay, reassessment, support)",
    "I am prepared to pause the process if needed",
  ];

  const clinicalQuestionsItems = [
    "\"What problem is this level of care addressing specifically?\"",
    "\"What would indicate this plan is not working?\"",
    "\"What does success look like in the next 30 days?\"",
    "\"What happens if motivation drops?\"",
    "\"What risks concern you most right now?\"",
  ];

  const dischargeQuestionsItems = [
    "\"What structure is in place after discharge?\"",
    "\"What are the relapse risks we should anticipate?\"",
    "\"Who is accountable for follow-up?\"",
    "\"What support does the family need to maintain boundaries?\"",
  ];

  const ethicsQuestionsItems = [
    "\"Are there financial relationships tied to this recommendation?\"",
    "\"What alternatives did you consider?\"",
    "\"Can we have this in writing?\"",
  ];

  const trackingItemsList = [
    "Names, roles, and contact info documented",
    "Dates of major decisions recorded",
    "Recommendations given (in writing if possible)",
    "Concerns raised and responses noted",
    "Aftercare commitments confirmed",
    "Missed follow-ups tracked",
  ];

  const valuesAnchorItems = [
    "Did we act with integrity?",
    "Did we stay within our role?",
    "Did we protect safety and clarity?",
    "Did we maintain our boundaries?",
    "Did we avoid rescuing?",
  ];

  const handleCheckboxChange = (
    section: string[],
    setSection: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    if (section.includes(item)) {
      setSection(section.filter((i) => i !== item));
    } else {
      setSection([...section, item]);
    }
  };

  const totalPreparation = preparationChecklist.length;
  const totalQuestionsAsked = clinicalQuestions.length + dischargeQuestions.length + ethicsQuestions.length;
  const totalTracking = trackingItems.length;
  const totalValues = valuesAnchor.length;

  const getReadinessStatus = () => {
    if (totalPreparation >= 4) {
      return { message: "Ready to advocate effectively", color: "text-green-600" };
    } else if (totalPreparation >= 2) {
      return { message: "Partially prepared—review remaining items", color: "text-yellow-600" };
    } else {
      return { message: "Complete preparation before advocating", color: "text-red-600" };
    }
  };

  const readiness = getReadinessStatus();

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setPreparationChecklist([]);
    setClinicalQuestions([]);
    setDischargeQuestions([]);
    setEthicsQuestions([]);
    setTrackingItems([]);
    setValuesAnchor([]);
    setNotes({ preparation: "", questions: "", tracking: "", general: "" });
  };

  return (
    <Layout>
      <Helmet>
        <title>Family Advocacy Toolkit | Sober Helpline</title>
        <meta name="description" content="Learn to advocate effectively for your loved one without burning out or overstepping. Clear frameworks, scripts, and decision tools for families." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/family-education" className="inline-flex items-center text-logo-blue hover:underline mb-6 print:hidden">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Family Resources
        </Link>

        <ToolBrandHeader
          title="Family Advocacy Toolkit"
          subtitle="How to advocate effectively without burning out or overstepping. Clear frameworks, scripts, and decision tools for families navigating the treatment system."
          clinicalNote="Based on patient advocacy best practices, NAATP family engagement standards, and clinical ethics in addiction medicine."
        />

        {/* Purpose Section */}
        <Alert className="mb-8 border-logo-green/30 bg-logo-blue/5">
          <Shield className="h-5 w-5 text-logo-blue" />
          <AlertDescription className="text-foreground">
            <strong>Purpose:</strong> Families often know something is wrong—but don't know how to speak up, what to ask for, or when to push back. 
            This toolkit provides clear frameworks, scripts, and decision tools to help families advocate ethically, calmly, and effectively—while still respecting professional roles and boundaries.
          </AlertDescription>
        </Alert>

        <Card className="mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              Advocacy is not control.<br />
              It is informed participation.
            </p>
          </CardContent>
        </Card>

        {/* Section 1: The Advocacy Mindset */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-logo-blue" />
              Section 1: The Advocacy Mindset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-500/30">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">What Advocacy IS</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Asking informed questions</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Clarifying recommendations</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Ensuring continuity of care</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Protecting safety and dignity</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Slowing rushed decisions</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Representing family reality accurately</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-500/30">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">What Advocacy is NOT</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" /> Diagnosing</li>
                  <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" /> Arguing clinical judgment emotionally</li>
                  <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" /> Demanding specific outcomes</li>
                  <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" /> Micromanaging treatment</li>
                  <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" /> Speaking for an adult loved one without consent</li>
                </ul>
              </div>
            </div>
            <Alert className="mt-4 border-blue-500/30 bg-blue-50 dark:bg-blue-900/10">
              <AlertDescription className="text-foreground text-center">
                <strong>Key Reframe:</strong> You are not interfering—you are participating.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Section 2: Know Your Role */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="h-5 w-5 text-logo-blue" />
              Section 2: Know Your Role (Critical)
            </CardTitle>
            <p className="text-sm text-muted-foreground">Families are most effective advocates when they stay in the right lane.</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-500/30">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">Your Lane ✓</h4>
                <ul className="space-y-2 text-sm">
                  <li>• History and pattern reporting</li>
                  <li>• Boundary clarification</li>
                  <li>• Environmental context</li>
                  <li>• Follow-through at home</li>
                  <li>• Support planning</li>
                  <li>• Asking for explanations</li>
                </ul>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-500/30">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-3">Not Your Lane ✗</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Treatment planning details</li>
                  <li>• Clinical diagnoses</li>
                  <li>• Medication decisions</li>
                  <li>• Therapist selection</li>
                  <li>• Day-to-day treatment execution</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4 italic">
              Advocacy works best when roles are respected and coordinated.
            </p>
          </CardContent>
        </Card>

        {/* Sticky Summary */}
        <Card className="mb-8 sticky top-4 z-10 border-2 border-logo-green/30 shadow-lg print:static print:shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Preparation</p>
                <p className="text-2xl font-bold">{totalPreparation} / 5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions Asked</p>
                <p className="text-2xl font-bold text-blue-600">{totalQuestionsAsked} / 12</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documentation</p>
                <p className="text-2xl font-bold text-purple-600">{totalTracking} / 6</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`font-semibold ${readiness.color}`}>{readiness.message}</p>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" onClick={handleReset}>Reset</Button>
                <Button onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Advocacy Preparation Checklist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-logo-blue" />
              Section 3: Advocacy Preparation Checklist
            </CardTitle>
            <p className="text-sm text-muted-foreground">Before any important call, meeting, or decision:</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {preparationItems.map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`prep-${item}`}
                  checked={preparationChecklist.includes(item)}
                  onCheckedChange={() => handleCheckboxChange(preparationChecklist, setPreparationChecklist, item)}
                  className="mt-0.5"
                />
                <label htmlFor={`prep-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1">
                  {item}
                </label>
              </div>
            ))}
            <Alert className="mt-4 border-amber-500/30 bg-amber-50 dark:bg-amber-900/10">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-foreground">
                <strong>If emotions are high, delay advocacy.</strong>
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="Notes about your preparation..."
              value={notes.preparation}
              onChange={(e) => setNotes({ ...notes, preparation: e.target.value })}
              className="mt-4"
            />
          </CardContent>
        </Card>

        {/* Section 4: Core Advocacy Questions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Section 4: Core Advocacy Questions
            </CardTitle>
            <p className="text-sm text-muted-foreground">Check off questions as you ask them. These surface integrity, planning quality, and realism.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Clinical & Treatment */}
            <div>
              <h4 className="font-medium mb-3 text-blue-700 dark:text-blue-400">Clinical & Treatment</h4>
              <div className="space-y-2">
                {clinicalQuestionsItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 p-2 rounded bg-blue-50/50 dark:bg-blue-900/10">
                    <Checkbox
                      id={`clinical-${item}`}
                      checked={clinicalQuestions.includes(item)}
                      onCheckedChange={() => handleCheckboxChange(clinicalQuestions, setClinicalQuestions, item)}
                      className="mt-0.5"
                    />
                    <label htmlFor={`clinical-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Discharge & Transitions */}
            <div>
              <h4 className="font-medium mb-3 text-purple-700 dark:text-purple-400">Discharge & Transitions</h4>
              <div className="space-y-2">
                {dischargeQuestionsItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 p-2 rounded bg-purple-50/50 dark:bg-purple-900/10">
                    <Checkbox
                      id={`discharge-${item}`}
                      checked={dischargeQuestions.includes(item)}
                      onCheckedChange={() => handleCheckboxChange(dischargeQuestions, setDischargeQuestions, item)}
                      className="mt-0.5"
                    />
                    <label htmlFor={`discharge-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ethics & Transparency */}
            <div>
              <h4 className="font-medium mb-3 text-emerald-700 dark:text-emerald-400">Ethics & Transparency</h4>
              <div className="space-y-2">
                {ethicsQuestionsItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 p-2 rounded bg-emerald-50/50 dark:bg-emerald-900/10">
                    <Checkbox
                      id={`ethics-${item}`}
                      checked={ethicsQuestions.includes(item)}
                      onCheckedChange={() => handleCheckboxChange(ethicsQuestions, setEthicsQuestions, item)}
                      className="mt-0.5"
                    />
                    <label htmlFor={`ethics-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Notes about responses received..."
              value={notes.questions}
              onChange={(e) => setNotes({ ...notes, questions: e.target.value })}
              className="mt-4"
            />
          </CardContent>
        </Card>

        {/* Section 5: Advocacy Scripts */}
        <Card className="mb-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-logo-blue" />
              Section 5: Advocacy Scripts (Use Calm, Neutral Language)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Asking for Clarity</h4>
                <p className="text-sm italic">"Can you help us understand the reasoning behind this recommendation?"</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Slowing the Process</h4>
                <p className="text-sm italic">"We need time to review this before deciding."</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Addressing Concerns Without Accusation</h4>
                <p className="text-sm italic">"We're noticing a gap here and want to understand how it's being addressed."</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Reinforcing Boundaries</h4>
                <p className="text-sm italic">"Our family boundaries are firm. We want the plan to align with that."</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Asking for Reassessment</h4>
                <p className="text-sm italic">"Given what we're seeing, can we revisit the level of care?"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Documentation & Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-500" />
              Section 6: Documentation & Tracking Tools
            </CardTitle>
            <p className="text-sm text-muted-foreground">Families should maintain a simple advocacy record, especially during transitions.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium mb-3">Keep Track Of:</p>
            {trackingItemsList.map((item) => (
              <div key={item} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`tracking-${item}`}
                  checked={trackingItems.includes(item)}
                  onCheckedChange={() => handleCheckboxChange(trackingItems, setTrackingItems, item)}
                  className="mt-0.5"
                />
                <label htmlFor={`tracking-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1">
                  {item}
                </label>
              </div>
            ))}
            <Alert className="mt-4 border-blue-500/30 bg-blue-50 dark:bg-blue-900/10">
              <AlertDescription className="text-foreground">
                <strong>Why this matters:</strong> Consistency and memory protect families from confusion and miscommunication.
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="Additional tracking notes..."
              value={notes.tracking}
              onChange={(e) => setNotes({ ...notes, tracking: e.target.value })}
              className="mt-4"
            />
          </CardContent>
        </Card>

        {/* Section 7: Advocacy During High-Risk Moments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Section 7: Advocacy During High-Risk Moments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-500/30">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">During Crisis</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Focus on safety first</li>
                  <li>• Avoid treatment debates</li>
                  <li>• Document what happened</li>
                  <li>• Return to advocacy after stabilization</li>
                </ul>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-500/30">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-3">During Discharge</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Revisit Aftercare Readiness Checklist</li>
                  <li>• Confirm appointments and structure</li>
                  <li>• Reassert family boundaries</li>
                  <li>• Do not rely on verbal assurances</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-3">After Relapse</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Avoid blame or panic</li>
                  <li>• Ask: "What changes now?"</li>
                  <li>• Reassess structure and accountability</li>
                  <li>• Advocate for escalation if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Common Pitfalls */}
        <Card className="mb-8 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Section 8: Common Advocacy Pitfalls to Avoid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /> Speaking from fear instead of facts</div>
              <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /> Advocating alone without support</div>
              <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /> Over-sharing family conflict details</div>
              <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /> Trying to "convince" instead of clarify</div>
              <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /> Backing down due to intimidation</div>
              <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /> Assuming professionals know family boundaries</div>
            </div>
          </CardContent>
        </Card>

        {/* Section 9: When to Escalate */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-logo-blue" />
              Section 9: When to Escalate Advocacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Escalation is appropriate when:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Safety concerns are dismissed</li>
                  <li>• Ethical red flags appear</li>
                  <li>• Communication breaks down</li>
                  <li>• Aftercare planning is inadequate</li>
                  <li>• Boundaries are repeatedly ignored</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Escalation Options:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ask for clinical supervisor involvement</li>
                  <li>• Request case conference</li>
                  <li>• Seek second opinions</li>
                  <li>• Pause discharge</li>
                  <li>• Consult an independent professional or advocate</li>
                </ul>
              </div>
            </div>
            <Alert className="mt-4 border-blue-500/30 bg-blue-50 dark:bg-blue-900/10">
              <AlertDescription className="text-foreground text-center">
                <strong>Escalation does not equal hostility.</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Section 10: Self-Care */}
        <Card className="mb-8 bg-rose-50 dark:bg-rose-900/10 border-rose-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <Heart className="h-5 w-5" />
              Section 10: Family Advocacy Self-Care
            </CardTitle>
            <p className="text-sm text-muted-foreground">Advocacy is emotionally taxing. Families must:</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-rose-600" /> Share advocacy responsibilities</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-rose-600" /> Debrief after difficult conversations</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-rose-600" /> Revisit emotional regulation tools</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-rose-600" /> Avoid becoming the "case manager"</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-rose-600" /> Remember advocacy does not equal control</div>
            </div>
            <p className="text-sm text-center text-rose-700 dark:text-rose-400 font-medium mt-4">
              You can advocate fiercely and still step back emotionally.
            </p>
          </CardContent>
        </Card>

        {/* Section 11: Values Anchor */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-logo-blue" />
              Section 11: Advocacy Values Anchor
            </CardTitle>
            <p className="text-sm text-muted-foreground">Before and after advocating, ask:</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {valuesAnchorItems.map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded bg-green-50/50 dark:bg-green-900/10">
                <Checkbox
                  id={`values-${item}`}
                  checked={valuesAnchor.includes(item)}
                  onCheckedChange={() => handleCheckboxChange(valuesAnchor, setValuesAnchor, item)}
                  className="mt-0.5"
                />
                <label htmlFor={`values-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1">
                  {item}
                </label>
              </div>
            ))}
            <Alert className="mt-4 border-green-500/30 bg-green-50 dark:bg-green-900/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-foreground">
                <strong>If yes to all—you advocated well.</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Final Reframe */}
        <Card className="mb-8 bg-logo-blue/5 border-logo-green/30">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Final Reframe</h3>
            <p className="text-lg font-medium text-foreground mb-4">
              Effective advocacy is calm, informed, and persistent—<br />not loud, emotional, or controlling.
            </p>
            <p className="text-muted-foreground">
              Families do not need to fight the system.<br />
              They need to understand it—and engage wisely.
            </p>
          </CardContent>
        </Card>

        {/* General Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes & Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Document any other advocacy notes, outcomes, or follow-up items..."
              value={notes.general}
              onChange={(e) => setNotes({ ...notes, general: e.target.value })}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Companion Resources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Companion Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Link to="/treatment-red-flags" className="flex items-center gap-2 p-3 rounded border hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-red-500" />
                <span className="text-sm">Treatment Industry Red Flags Guide</span>
              </Link>
              <Link to="/treatment-questions" className="flex items-center gap-2 p-3 rounded border hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">40 Questions to Ask a Treatment Center</span>
              </Link>
              <Link to="/aftercare-checklist" className="flex items-center gap-2 p-3 rounded border hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-cyan-500" />
                <span className="text-sm">Aftercare Readiness Checklist</span>
              </Link>
              <Link to="/family-action-plan" className="flex items-center gap-2 p-3 rounded border hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Family Recovery Action Plan</span>
              </Link>
              <Link to="/crisis-chaos" className="flex items-center gap-2 p-3 rounded border hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-red-500" />
                <span className="text-sm">Crisis vs. Chaos Decision Guide</span>
              </Link>
              <Link to="/family-education" className="flex items-center gap-2 p-3 rounded border hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Guilt vs. Responsibility Worksheet</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    
          <RelatedResources currentPath="/family-advocacy-toolkit" />
</Layout>
  );
};

export default FamilyAdvocacyToolkit;
