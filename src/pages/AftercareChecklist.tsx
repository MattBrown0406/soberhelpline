import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Printer, AlertTriangle, CheckCircle2, Clock, Users, Home, Shield, Heart, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const AftercareChecklist = () => {
  useGuideTracking("Aftercare Checklist", "/aftercare-checklist");
  const [section1, setSection1] = useState<string[]>([]);
  const [section2, setSection2] = useState<string[]>([]);
  const [section3, setSection3] = useState<string[]>([]);
  const [section4, setSection4] = useState<string[]>([]);
  const [section5, setSection5] = useState<string[]>([]);
  const [section6, setSection6] = useState<string[]>([]);
  const [section7, setSection7] = useState<string[]>([]);
  const [notes, setNotes] = useState({
    section1: "",
    section2: "",
    section3: "",
    section4: "",
    section5: "",
    section6: "",
  });

  const section1Items = [
    "A licensed clinician has recommended the discharge timing",
    "A written aftercare plan exists (not verbal only)",
    "Outpatient provider(s) are confirmed with appointment dates",
    "Psychiatric follow-up is scheduled (if applicable)",
    "Medication plan is clear, understood, and monitored",
    "Releases of information are signed for coordination of care",
  ];

  const section2Items = [
    "Appropriate next level of care is arranged (IOP, PHP, OP, etc.)",
    "Structured daily schedule exists for the first 30–60 days",
    "Sober living or recovery-supportive housing is secured (if needed)",
    "Transportation to appointments is planned and reliable",
    "Curfews, house rules, and expectations are clearly defined",
  ];

  const section3Items = [
    "Clear expectations for meeting attendance or therapy",
    "Accountability partner or sponsor identified",
    "Regular check-ins with professionals are scheduled",
    "Consequences for missed commitments are defined",
    "Family understands their role without micromanaging",
  ];

  const section4Items = [
    "Living environment is substance-free",
    "High-risk relationships have been addressed or limited",
    "Employment/school plans are realistic and phased",
    "Daily routines support sleep, meals, and structure",
    "Financial expectations and boundaries are clarified",
  ];

  const section5Items = [
    "Personal relapse warning signs are identified",
    "A written response plan exists for early warning signs",
    "Clear steps are outlined if relapse occurs",
    "Family knows how to respond without panic or rescue",
    "Emergency contacts and crisis plans are documented",
  ];

  const section6Items = [
    "Family boundaries are clearly stated and agreed upon",
    "Enabling behaviors have been identified and addressed",
    "Consequences for boundary violations are understood",
    "Family members are aligned (or have their own boundaries)",
    "Family support systems are in place (therapy, groups, coaching)",
  ];

  const section7Questions = [
    { question: "Are we rushing discharge because we're exhausted or relieved?", concernIf: "yes" },
    { question: "Are we relying more on hope than structure?", concernIf: "yes" },
    { question: "Have similar discharge plans failed before?", concernIf: "yes" },
    { question: "Are boundaries likely to soften once they're home?", concernIf: "yes" },
    { question: "Would we feel confident holding limits if things get uncomfortable?", concernIf: "no" },
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

  const totalChecked = section1.length + section2.length + section3.length + 
    section4.length + section5.length + section6.length;
  const totalItems = section1Items.length + section2Items.length + section3Items.length + 
    section4Items.length + section5Items.length + section6Items.length;

  const concernCount = section7.filter((item, index) => {
    if (index === 4) return item === "no";
    return item === "yes";
  }).length;

  const getReadinessLevel = () => {
    const percentage = (totalChecked / totalItems) * 100;
    if (percentage >= 80 && concernCount <= 1) {
      return { level: "ready", message: "Aftercare plan likely supports stability. Proceed with vigilance.", color: "text-green-600" };
    } else if (percentage >= 50 || concernCount <= 2) {
      return { level: "gaps", message: "Strengthen structure before discharge.", color: "text-yellow-600" };
    } else {
      return { level: "major", message: "Discharge may increase relapse risk. Advocate for adjustments.", color: "text-red-600" };
    }
  };

  const readiness = getReadinessLevel();

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setSection1([]);
    setSection2([]);
    setSection3([]);
    setSection4([]);
    setSection5([]);
    setSection6([]);
    setSection7([]);
    setNotes({ section1: "", section2: "", section3: "", section4: "", section5: "", section6: "" });
  };

  const ChecklistSection = ({
    title,
    icon: Icon,
    items,
    checked,
    setChecked,
    noteKey,
  }: {
    title: string;
    icon: React.ElementType;
    items: string[];
    checked: string[];
    setChecked: React.Dispatch<React.SetStateAction<string[]>>;
    noteKey: keyof typeof notes;
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5 text-logo-green" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <Checkbox
              id={item}
              checked={checked.includes(item)}
              onCheckedChange={() => handleCheckboxChange(checked, setChecked, item)}
            />
            <label htmlFor={item} className="text-sm cursor-pointer leading-relaxed">
              {item}
            </label>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <label className="text-sm font-medium text-muted-foreground">Notes / gaps:</label>
          <Textarea
            placeholder="Document any gaps or concerns..."
            value={notes[noteKey]}
            onChange={(e) => setNotes({ ...notes, [noteKey]: e.target.value })}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <Helmet>
        <title>Aftercare Readiness Checklist | Sober Helpline</title>
        <meta name="description" content="Assess discharge readiness and prevent discharge-to-relapse patterns with this comprehensive aftercare checklist for families." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/family-education" className="inline-flex items-center text-logo-green hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Family Resources
        </Link>

        <ToolBrandHeader
          title="Aftercare Readiness Checklist"
          subtitle="Preventing discharge-to-relapse patterns. Assess actual readiness based on confirmed plans and observable behaviors — not hope or insurance timelines."
          clinicalNote="Based on ASAM continuing care guidelines and Gorski's relapse prevention model. Discharge should be a clinical transition, not a relief milestone."
        />

        <Alert className="mb-8 border-logo-green/30 bg-logo-green/5">
          <AlertTriangle className="h-5 w-5 text-logo-green" />
          <AlertDescription className="text-foreground">
            <strong>Purpose:</strong> Leaving treatment is not the finish line—it is the most vulnerable transition in recovery. 
            This checklist helps you assess actual readiness, not hope, fatigue, or insurance timelines.
            <br /><br />
            <em>Discharge should be a clinical transition—not a relief milestone.</em>
          </AlertDescription>
        </Alert>

        <Card className="mb-8 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">How to Use This Checklist</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Complete this before discharge, ideally 7–14 days in advance.</li>
              <li>Base answers on confirmed plans and observable behaviors, not intentions.</li>
              <li>If an item is uncertain, leave it unchecked.</li>
              <li>Use the results to advocate for additional structure if needed.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sticky Summary */}
        <Card className="mb-8 sticky top-4 z-10 border-2 border-logo-green/30 shadow-lg print:static print:shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Items Checked</p>
                <p className="text-2xl font-bold">{totalChecked} / {totalItems}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concerns Flagged</p>
                <p className="text-2xl font-bold">{concernCount} / 5</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-muted-foreground">Readiness Assessment</p>
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

        <ChecklistSection
          title="Section 1: Clinical & Professional Continuity"
          icon={CheckCircle2}
          items={section1Items}
          checked={section1}
          setChecked={setSection1}
          noteKey="section1"
        />

        <ChecklistSection
          title="Section 2: Level of Structure After Discharge"
          icon={Clock}
          items={section2Items}
          checked={section2}
          setChecked={setSection2}
          noteKey="section2"
        />

        <ChecklistSection
          title="Section 3: Accountability & Monitoring (Not Surveillance)"
          icon={Users}
          items={section3Items}
          checked={section3}
          setChecked={setSection3}
          noteKey="section3"
        />

        <ChecklistSection
          title="Section 4: Lifestyle & Environmental Stability"
          icon={Home}
          items={section4Items}
          checked={section4}
          setChecked={setSection4}
          noteKey="section4"
        />

        <ChecklistSection
          title="Section 5: Relapse Prevention Planning"
          icon={Shield}
          items={section5Items}
          checked={section5}
          setChecked={setSection5}
          noteKey="section5"
        />

        <ChecklistSection
          title="Section 6: Family Alignment & Boundaries"
          icon={Heart}
          items={section6Items}
          checked={section6}
          setChecked={setSection6}
          noteKey="section6"
        />

        {/* Section 7: Reality Check */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-logo-green" />
              Section 7: Emotional & Readiness Reality Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Answer honestly:</p>
            {section7Questions.map((item, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium mb-3">{item.question}</p>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`q7-${index}-yes`}
                      checked={section7[index] === "yes"}
                      onCheckedChange={() => {
                        const newSection7 = [...section7];
                        newSection7[index] = section7[index] === "yes" ? "" : "yes";
                        setSection7(newSection7);
                      }}
                    />
                    <label htmlFor={`q7-${index}-yes`} className="text-sm cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`q7-${index}-no`}
                      checked={section7[index] === "no"}
                      onCheckedChange={() => {
                        const newSection7 = [...section7];
                        newSection7[index] = section7[index] === "no" ? "" : "no";
                        setSection7(newSection7);
                      }}
                    />
                    <label htmlFor={`q7-${index}-no`} className="text-sm cursor-pointer">No</label>
                  </div>
                </div>
              </div>
            ))}
            <Alert className="mt-4 border-yellow-500/30 bg-yellow-50 dark:bg-yellow-900/10">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-foreground">
                If multiple answers raise concern, slow down.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* What Families SHOULD Do */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-green-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-green-600">What Families SHOULD Do Next</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  Review this checklist with the treatment team
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  Advocate for missing elements
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  Align on boundaries before discharge
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  Schedule a family check-in 2 weeks post-discharge
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  Revisit this checklist monthly during early recovery
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">What Families Should NOT Do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  Assume treatment "fixed" everything
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  Remove structure too quickly
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  Relax boundaries out of relief or guilt
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  Rely on verbal promises alone
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  Avoid planning for relapse "to stay positive"
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Key Reframe */}
        <Card className="mb-8 bg-logo-green/5 border-logo-green/30">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Key Reframe</h3>
            <p className="text-muted-foreground mb-2">
              Aftercare doesn't prevent relapse by itself.<br />
              <strong className="text-foreground">Structure, accountability, and consistency do.</strong>
            </p>
            <p className="text-sm italic mt-4">
              Families help most by preparing for reality—not hoping it away.
            </p>
          </CardContent>
        </Card>

        {/* Companion Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggested Companion Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link to="/relapse-warning-signs">
                <Button variant="outline" size="sm">Relapse Warning Signs Tracker</Button>
              </Link>
              <Link to="/family-action-plan">
                <Button variant="outline" size="sm">Family Recovery Action Plan</Button>
              </Link>
              <Link to="/crisis-chaos">
                <Button variant="outline" size="sm">Crisis vs. Chaos Decision Guide</Button>
              </Link>
              <Link to="/scenario-exercise">
                <Button variant="outline" size="sm">Boundary Setting Worksheet</Button>
              </Link>
              <Link to="/readiness-checklist">
                <Button variant="outline" size="sm">Readiness for Change Checklist</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    
          <RelatedResources currentPath="/aftercare-checklist" />
</Layout>
  );
};

export default AftercareChecklist;
