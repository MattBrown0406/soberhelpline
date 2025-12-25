import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Printer, Scale, AlertTriangle, Shield, FileText, Users, Heart, Gavel, Home, Brain, Lock, Phone, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const LegalIssuesGuide = () => {
  useGuideTracking("/legal-issues-guide", "Legal Issues Families Should Understand");
  const [checklist, setChecklist] = useState<string[]>([]);

  const checklistItems = [
    "Do we understand our legal exposure?",
    "Are we unintentionally interfering with consequences?",
    "Have we protected children and vulnerable family members?",
    "Do we have legal counsel identified if needed?",
    "Are decisions being made from fear or clarity?",
  ];

  const handleCheckboxChange = (item: string) => {
    if (checklist.includes(item)) {
      setChecklist(checklist.filter((i) => i !== item));
    } else {
      setChecklist([...checklist, item]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Legal Issues Families Should Understand | The Sober Helpline</title>
        <meta 
          name="description" 
          content="A practical guide for families navigating addiction and the legal system. Understand common legal issues, avoid costly mistakes, and advocate wisely." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <Link to="/family-education">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Family Education
              </Button>
            </Link>
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Guide
            </Button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <Scale className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Legal Issues Families Should Understand
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A Practical Guide for Families Navigating Addiction and the Legal System
            </p>
          </div>

          {/* Purpose Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Purpose
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Families are often blindsided when addiction intersects with legal consequences. Arrests, court involvement, child custody concerns, restraining orders, or mandated treatment can escalate quickly—often during moments of crisis.
              </p>
              <p className="text-muted-foreground">This guide helps families:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Understand common legal issues tied to addiction</li>
                <li>Know what is (and isn't) their responsibility</li>
                <li>Avoid costly mistakes made under panic</li>
                <li>Advocate wisely without overstepping</li>
                <li>Prepare instead of reacting</li>
              </ul>
              <div className="bg-primary/10 p-4 rounded-lg mt-4">
                <p className="font-semibold text-foreground">Legal clarity reduces fear.</p>
                <p className="text-muted-foreground">Fear-driven decisions increase risk.</p>
              </div>
            </CardContent>
          </Card>

          {/* Important Disclaimer */}
          <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>IMPORTANT DISCLAIMER:</strong> This guide is educational only and does not replace advice from a qualified attorney. Laws vary by state and circumstance. When legal issues arise, consulting a licensed attorney is strongly recommended.
            </AlertDescription>
          </Alert>

          {/* Section 1: Criminal Charges */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-red-600" />
                1. Criminal Charges Related to Substance Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Addiction frequently intersects with the criminal system through:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>DUI / DWI</li>
                <li>Possession or distribution charges</li>
                <li>Theft or fraud</li>
                <li>Probation or parole violations</li>
                <li>Public intoxication or disorderly conduct</li>
              </ul>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Families Often Misunderstand</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>Paying fines or hiring a lawyer does not fix addiction</li>
                  <li>Legal pressure can motivate treatment—but only when paired with structure</li>
                  <li>Repeated legal rescue can delay accountability</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Helpful Family Role</h4>
                <ul className="list-disc pl-6 space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>Support lawful compliance</li>
                  <li>Encourage legal counsel (not avoidance)</li>
                  <li>Avoid interfering with court-ordered consequences</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Court-Mandated Treatment */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                2. Court-Mandated Treatment & Drug Courts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Some individuals enter treatment through:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Drug court</li>
                <li>Probation conditions</li>
                <li>Diversion programs</li>
                <li>Deferred sentencing agreements</li>
              </ul>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Families Should Know</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>Court-mandated treatment can be effective if taken seriously</li>
                  <li>Programs vary widely in quality and structure</li>
                  <li>Noncompliance has real consequences</li>
                  <li>Family interference can backfire legally</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Family Best Practice</h4>
                <ul className="list-disc pl-6 space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>Support accountability, not excuses</li>
                  <li>Avoid negotiating with courts or probation officers unless advised by counsel</li>
                  <li>Encourage compliance without rescuing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Arrests, Jail, and Bail */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-slate-600" />
                3. Arrests, Jail, and Bail Decisions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Families often feel pressure to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Post bail immediately</li>
                <li>Hire the most expensive attorney</li>
                <li>"Get them out at any cost"</li>
              </ul>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-amber-800 dark:text-amber-200">Important Considerations</h4>
                <ul className="list-disc pl-6 space-y-1 text-amber-700 dark:text-amber-300 text-sm">
                  <li>Jail can sometimes interrupt dangerous use patterns</li>
                  <li>Immediate release without structure often leads to relapse</li>
                  <li>Bail decisions should be strategic, not emotional</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Ask yourself:</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>Does release increase safety or risk?</li>
                  <li>Is there a treatment or supervision plan?</li>
                  <li>Are boundaries in place?</li>
                </ul>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="font-semibold text-foreground italic">
                  Getting someone out of jail is not always the most loving option.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Civil Liability */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                4. Civil Liability & Financial Exposure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Families may unknowingly expose themselves to legal risk through:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Co-signing leases or loans</li>
                <li>Allowing vehicle access</li>
                <li>Paying debts tied to illegal activity</li>
                <li>Housing someone who is violating parole or restraining orders</li>
              </ul>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Protective Steps</h4>
                <ul className="list-disc pl-6 space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>Do not co-sign under pressure</li>
                  <li>Clarify ownership of vehicles and property</li>
                  <li>Understand landlord and housing liability</li>
                  <li>Consult an attorney before making financial commitments</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Restraining Orders */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                5. Restraining Orders & Protective Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Addiction-related behaviors can escalate to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Domestic disturbances</li>
                <li>Threats or harassment</li>
                <li>Violations of protective orders</li>
              </ul>
              
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800 dark:text-red-200">What Families Need to Know</h4>
                <ul className="list-disc pl-6 space-y-1 text-red-700 dark:text-red-300 text-sm">
                  <li>Violating restraining orders is a serious offense</li>
                  <li>Encouraging contact can expose families to legal consequences</li>
                  <li>Safety must override guilt or reconciliation pressure</li>
                </ul>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="font-semibold text-foreground italic">
                  Protective orders exist to prevent harm—not to punish.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Child Custody & CPS */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" />
                6. Child Custody & Child Protective Services (CPS)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">When addiction affects parenting:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>CPS may investigate</li>
                <li>Custody arrangements may change</li>
                <li>Court oversight may be involved</li>
              </ul>
              
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800 dark:text-red-200">Common Family Mistakes</h4>
                <ul className="list-disc pl-6 space-y-1 text-red-700 dark:text-red-300 text-sm">
                  <li>Minimizing substance use to "protect" the parent</li>
                  <li>Coaching children on what to say</li>
                  <li>Ignoring mandated requirements</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Best Practices</h4>
                <ul className="list-disc pl-6 space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>Prioritize child safety and stability</li>
                  <li>Cooperate with investigations</li>
                  <li>Seek legal counsel early</li>
                  <li>Avoid enabling behaviors that risk custody loss</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Mental Health Holds */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-pink-600" />
                7. Mental Health Holds & Involuntary Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Families sometimes ask: <em>"Can we force them into treatment?"</em></p>
              <p className="text-muted-foreground">Depending on state law, options may include:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Emergency psychiatric holds</li>
                <li>Involuntary commitment for danger to self or others</li>
                <li>Crisis stabilization orders</li>
              </ul>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-amber-800 dark:text-amber-200">Important Reality</h4>
                <ul className="list-disc pl-6 space-y-1 text-amber-700 dark:text-amber-300 text-sm">
                  <li>These are temporary safety measures, not long-term solutions</li>
                  <li>Criteria are strict and evidence-based</li>
                  <li>Abuse of these systems can damage trust and credibility</li>
                </ul>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="font-semibold text-foreground italic">
                  Use these options only when safety is genuinely at risk.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Guardianship */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                8. Guardianship & Power of Attorney
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">In severe cases, families consider:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Temporary guardianship</li>
                <li>Conservatorship</li>
                <li>Medical power of attorney</li>
              </ul>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Families Should Understand</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>These are serious legal actions</li>
                  <li>They remove or limit autonomy</li>
                  <li>Courts require clear evidence</li>
                  <li>They carry long-term legal and emotional implications</li>
                </ul>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="font-semibold text-foreground italic">
                  These steps should always involve legal counsel and careful consideration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 9: Confidentiality & HIPAA */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-teal-600" />
                9. Confidentiality & HIPAA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Families often feel excluded from treatment updates.</p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Points</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>Adults have privacy rights</li>
                  <li>HIPAA limits what providers can share</li>
                  <li>Releases of information (ROI) are required</li>
                  <li>Lack of information does not equal lack of care</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Families can:</h4>
                <ul className="list-disc pl-6 space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>Encourage signed releases</li>
                  <li>Ask general questions about process</li>
                  <li>Share concerns without expecting details</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 10: When to Seek Legal Advice */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                10. When to Seek Legal Advice Immediately
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Families should consult an attorney when:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Arrests or charges occur</li>
                <li>CPS becomes involved</li>
                <li>Custody is threatened</li>
                <li>Restraining orders exist</li>
                <li>Financial liability is possible</li>
                <li>Guardianship is being considered</li>
              </ul>
              
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg text-center">
                <p className="font-semibold text-red-800 dark:text-red-200 italic">
                  Waiting often makes things worse.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 11: Critical Reframe */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-600" />
                11. A Critical Reframe for Families
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center mb-4">
                <p className="font-semibold text-foreground">
                  The legal system is not a treatment system.
                </p>
                <p className="text-muted-foreground">
                  But it can create leverage for treatment.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Families help most when they:</h4>
                <ul className="list-disc pl-6 space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>Respect legal boundaries</li>
                  <li>Avoid interference</li>
                  <li>Support accountability</li>
                  <li>Protect their own legal standing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 12: Preparedness Checklist */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                12. Family Legal Preparedness Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">Ask yourself:</p>
              <div className="space-y-3">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox
                      id={`checklist-${index}`}
                      checked={checklist.includes(item)}
                      onCheckedChange={() => handleCheckboxChange(item)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`checklist-${index}`}
                      className="text-foreground cursor-pointer"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg text-center mt-4">
                <p className="font-semibold text-foreground italic">
                  Preparation reduces chaos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Final Thought */}
          <Card className="mb-8 border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-center text-primary">Final Thought</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-lg font-medium text-foreground">
                Legal issues are frightening—but they do not mean failure.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200 text-center">Handled wisely, legal involvement can:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-green-700 dark:text-green-300 text-sm">
                    <li>Interrupt dangerous patterns</li>
                    <li>Increase accountability</li>
                    <li>Create structure</li>
                    <li>Protect safety</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-800 dark:text-red-200 text-center">Handled emotionally, legal issues can:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-red-700 dark:text-red-300 text-sm">
                    <li>Delay change</li>
                    <li>Increase risk</li>
                    <li>Harm families financially and legally</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg text-center mt-4">
                <p className="font-bold text-lg text-foreground">
                  Clarity, not panic, protects families best.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Companion Resources */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Suggested Companion Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link to="/family-advocacy-toolkit">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Family Advocacy Toolkit
                  </Button>
                </Link>
                <Link to="/crisis-chaos">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Crisis vs. Chaos Decision Guide
                  </Button>
                </Link>
                <Link to="/treatment-red-flags">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Treatment Industry Red Flags Guide
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center print:hidden">
            <Link to="/family-education">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Family Education
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalIssuesGuide;
