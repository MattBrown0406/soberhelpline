import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Printer, AlertTriangle, Shield, DollarSign, MessageSquare, Users, Search, FileText, Clock, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const TreatmentRedFlags = () => {
  useGuideTracking("/treatment-red-flags", "Treatment Red Flags Checklist");
  const [marketingFlags, setMarketingFlags] = useState<string[]>([]);
  const [referralFlags, setReferralFlags] = useState<string[]>([]);
  const [salesFlags, setSalesFlags] = useState<string[]>([]);
  const [operationsFlags, setOperationsFlags] = useState<string[]>([]);
  const [financialFlags, setFinancialFlags] = useState<string[]>([]);
  const [integrityQuestions, setIntegrityQuestions] = useState<string[]>([]);
  const [realityCheck, setRealityCheck] = useState<string[]>([]);
  const [notes, setNotes] = useState({
    marketing: "",
    referral: "",
    sales: "",
    operations: "",
    financial: "",
    general: "",
  });

  const marketingItems = [
    "Claims guaranteed success or 100% cure rates",
    "Uses fear-based messaging (\"This could be their last chance\")",
    "Shames families for hesitation or asking questions",
    "Emphasizes luxury amenities over clinical care",
    "Uses vague buzzwords without specific explanations",
    "Makes relapse sound impossible at their program",
  ];

  const referralItems = [
    "Referrer receives fees or incentives for recommendations",
    "Only one program option is presented",
    "Questions about alternatives are deflected or discouraged",
    "Placement recommended before clinical assessment",
    "Insurance checked before clinical needs discussed",
    "Referrer has undisclosed financial connection to program",
  ];

  const salesItems = [
    "High-pressure timelines (\"We need a decision today\")",
    "Claims beds won't be available if you wait",
    "Offers expiring discounts or limited-time deals",
    "Focuses heavily on insurance verification first",
    "Payment discussed before clinical appropriateness",
    "Avoids providing written information or policies",
  ];

  const operationsItems = [
    "Staff credentials are unclear or unexplained",
    "Families are discouraged from involvement",
    "Updates are vague, infrequent, or dismissive",
    "Family education is optional or nonexistent",
    "No clear aftercare or discharge planning discussed",
    "Length of stay driven by insurance, not clinical need",
  ];

  const financialItems = [
    "Costs are not clearly explained upfront",
    "Out-of-pocket expenses are minimized or hidden",
    "Refund or cancellation policies are unclear",
    "Pressure to \"use up all insurance benefits\"",
    "Financial discussions prioritized over clinical care",
    "No written cost breakdown provided",
  ];

  const integrityItems = [
    "\"What would make this program NOT appropriate for our situation?\"",
    "\"What happens if this level of care isn't enough?\"",
    "\"How do you handle relapse or early discharge?\"",
    "\"How do families stay involved in the process?\"",
    "\"What outcomes do you actually track and measure?\"",
  ];

  const realityItems = [
    "I feel informed rather than pressured",
    "My questions are welcomed, not dismissed",
    "I am NOT being rushed emotionally",
    "This approach aligns with our family values",
    "I would recommend this approach to another family",
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

  const totalRedFlags = marketingFlags.length + referralFlags.length + salesFlags.length + 
    operationsFlags.length + financialFlags.length;
  const totalPossibleFlags = marketingItems.length + referralItems.length + salesItems.length + 
    operationsItems.length + financialItems.length;

  const positiveIndicators = realityCheck.length;
  const questionsAsked = integrityQuestions.length;

  const getRiskLevel = () => {
    if (totalRedFlags >= 10) {
      return { level: "high", message: "Multiple red flags detected. Strongly consider other options.", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/10" };
    } else if (totalRedFlags >= 5) {
      return { level: "moderate", message: "Several concerns present. Proceed with caution and ask more questions.", color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/10" };
    } else if (totalRedFlags >= 1) {
      return { level: "low", message: "Minor concerns. Address these specific issues before deciding.", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/10" };
    } else {
      return { level: "none", message: "No red flags identified. Continue due diligence.", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/10" };
    }
  };

  const risk = getRiskLevel();

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setMarketingFlags([]);
    setReferralFlags([]);
    setSalesFlags([]);
    setOperationsFlags([]);
    setFinancialFlags([]);
    setIntegrityQuestions([]);
    setRealityCheck([]);
    setNotes({ marketing: "", referral: "", sales: "", operations: "", financial: "", general: "" });
  };

  const RedFlagSection = ({
    title,
    icon: Icon,
    items,
    checked,
    setChecked,
    noteKey,
    description,
  }: {
    title: string;
    icon: React.ElementType;
    items: string[];
    checked: string[];
    setChecked: React.Dispatch<React.SetStateAction<string[]>>;
    noteKey: keyof typeof notes;
    description?: string;
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5 text-red-500" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground mb-3">Check any that apply:</p>
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
            <Checkbox
              id={item}
              checked={checked.includes(item)}
              onCheckedChange={() => handleCheckboxChange(checked, setChecked, item)}
              className="mt-0.5"
            />
            <label htmlFor={item} className="text-sm cursor-pointer leading-relaxed flex-1">
              🚩 {item}
            </label>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <label className="text-sm font-medium text-muted-foreground">Specific examples or concerns:</label>
          <Textarea
            placeholder="Document specific instances you've observed..."
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
        <title>Treatment Industry Red Flags Guide | Sober Helpline</title>
        <meta name="description" content="Learn to identify unethical marketing, referrals, and placement pressure in the addiction treatment industry. Protect your family from predatory practices." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/family-education" className="inline-flex items-center text-logo-blue hover:underline mb-6 print:hidden">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Family Resources
        </Link>

        <ToolBrandHeader
          title="Treatment Industry Red Flags Guide"
          subtitle="How to identify unethical marketing, referrals, and placement pressure. Protect your family from predatory practices in the treatment industry."
          clinicalNote="Informed by NAATP (National Association of Addiction Treatment Providers) ethics standards and SAMHSA treatment locator guidelines."
        />

        {/* Purpose Section */}
        <Alert className="mb-8 border-logo-green/30 bg-logo-green/5">
          <Shield className="h-5 w-5 text-logo-blue" />
          <AlertDescription className="text-foreground">
            <strong>Purpose:</strong> When families are scared, overwhelmed, and desperate for help, the treatment industry can feel impossible to navigate. 
            While many ethical, high-quality programs exist, there are also business practices that prioritize admissions over outcomes.
            <br /><br />
            This guide helps families: <strong>Slow down decision-making</strong> • <strong>Ask the right questions</strong> • <strong>Spot red flags early</strong> • <strong>Avoid rushed or inappropriate placements</strong>
          </AlertDescription>
        </Alert>

        <Card className="mb-8 bg-amber-50 dark:bg-amber-900/10 border-amber-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold text-amber-800 dark:text-amber-200">
              Ethical treatment welcomes questions.<br />
              Unethical treatment rushes answers.
            </p>
          </CardContent>
        </Card>

        {/* Why Families Are Vulnerable */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-logo-blue" />
              Why Families Are Vulnerable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Treatment decisions are often made:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• During emotional crises</li>
                  <li>• Under time pressure</li>
                  <li>• With limited knowledge</li>
                  <li>• While fearing worst-case outcomes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Unethical operators rely on:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Panic</li>
                  <li>• Guilt</li>
                  <li>• Urgency</li>
                  <li>• Promises of certainty</li>
                </ul>
              </div>
            </div>
            <Alert className="mt-4 border-blue-500/30 bg-blue-50 dark:bg-blue-900/10">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-foreground">
                <strong>If you feel rushed, pressured, or confused—that's a signal to pause.</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Sticky Summary */}
        <Card className="mb-8 sticky top-4 z-10 border-2 border-logo-green/30 shadow-lg print:static print:shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Red Flags Identified</p>
                <p className="text-2xl font-bold text-red-600">{totalRedFlags}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Integrity Questions Asked</p>
                <p className="text-2xl font-bold text-blue-600">{questionsAsked} / 5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Positive Indicators</p>
                <p className="text-2xl font-bold text-green-600">{positiveIndicators} / 5</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-muted-foreground">Risk Assessment</p>
                <p className={`font-semibold ${risk.color}`}>{risk.message}</p>
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

        {/* Red Flag Sections */}
        <RedFlagSection
          title="Marketing Language Red Flags"
          icon={MessageSquare}
          items={marketingItems}
          checked={marketingFlags}
          setChecked={setMarketingFlags}
          noteKey="marketing"
          description="Be cautious of messaging that overpromises, exploits emotions, or uses vague buzzwords."
        />

        <RedFlagSection
          title="Referral & Placement Red Flags"
          icon={Search}
          items={referralItems}
          checked={referralFlags}
          setChecked={setReferralFlags}
          noteKey="referral"
          description="Ethical referrals are needs-based, not profit-based. Placement should follow clinical evaluation."
        />

        <RedFlagSection
          title="Sales Tactics Disguised as Care"
          icon={Clock}
          items={salesItems}
          checked={salesFlags}
          setChecked={setSalesFlags}
          noteKey="sales"
          description="Quality treatment does not disappear overnight. Clinical care should come before financial logistics."
        />

        <RedFlagSection
          title="Program Operations Red Flags"
          icon={Building}
          items={operationsItems}
          checked={operationsFlags}
          setChecked={setOperationsFlags}
          noteKey="operations"
          description="Addiction affects families—ethical programs acknowledge this and plan for transitions."
        />

        <RedFlagSection
          title="Financial & Insurance Red Flags"
          icon={DollarSign}
          items={financialItems}
          checked={financialFlags}
          setChecked={setFinancialFlags}
          noteKey="financial"
          description="Length of stay should be clinically driven, not financially driven."
        />

        {/* How Ethical Providers Behave */}
        <Card className="mb-8 bg-green-50 dark:bg-green-900/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-green-700 dark:text-green-400">How Ethical Providers Behave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Encourage second opinions</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Welcome informed families</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Explain limitations honestly</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Involve families appropriately</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Coordinate across levels of care</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Discuss relapse risk realistically</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Respect boundaries and autonomy</div>
            </div>
          </CardContent>
        </Card>

        {/* Integrity Questions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Questions That Reveal Integrity
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Ask these questions and notice the response. <strong>Tone matters. Defensiveness is a red flag.</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrityItems.map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded bg-blue-50/50 dark:bg-blue-900/10">
                <Checkbox
                  id={`integrity-${item}`}
                  checked={integrityQuestions.includes(item)}
                  onCheckedChange={() => handleCheckboxChange(integrityQuestions, setIntegrityQuestions, item)}
                  className="mt-0.5"
                />
                <label htmlFor={`integrity-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1 font-medium">
                  {item}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Family Reality Check */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-logo-blue" />
              Family Reality Check
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Ask yourself honestly—check each statement that feels TRUE:
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {realityItems.map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded bg-green-50/50 dark:bg-green-900/10">
                <Checkbox
                  id={`reality-${item}`}
                  checked={realityCheck.includes(item)}
                  onCheckedChange={() => handleCheckboxChange(realityCheck, setRealityCheck, item)}
                  className="mt-0.5"
                />
                <label htmlFor={`reality-${item}`} className="text-sm cursor-pointer leading-relaxed flex-1">
                  {item}
                </label>
              </div>
            ))}
            <Alert className="mt-4 border-amber-500/30 bg-amber-50 dark:bg-amber-900/10">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-foreground">
                <strong>Trust patterns—not promises.</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* General Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes & Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Document any other concerns, observations, or questions about this program..."
              value={notes.general}
              onChange={(e) => setNotes({ ...notes, general: e.target.value })}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Final Reframe */}
        <Card className="mb-8 bg-logo-green/5 border-logo-green/30">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Final Reframe</h3>
            <p className="text-lg font-medium text-foreground mb-4">
              Ethical treatment respects your fear.<br />
              Unethical treatment exploits it.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Slowing down</strong> is not denial.</p>
              <p><strong>Asking questions</strong> is not obstruction.</p>
              <p><strong>Advocating</strong> is not being difficult.</p>
            </div>
          </CardContent>
        </Card>

        {/* Companion Resources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Companion Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
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
              <Link to="/readiness-checklist" className="flex items-center gap-2 p-3 rounded border hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-teal-500" />
                <span className="text-sm">Readiness for Change Checklist</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    
          <RelatedResources currentPath="/treatment-red-flags" />
</Layout>
  );
};

export default TreatmentRedFlags;
