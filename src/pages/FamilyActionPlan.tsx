import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

export default function FamilyActionPlan() {
  // Part 1 state
  const [lovedOneStatus, setLovedOneStatus] = useState<string[]>([]);
  const [biggestChallenges, setBiggestChallenges] = useState("");
  const [repeatedPatterns, setRepeatedPatterns] = useState("");

  // Part 2 state
  const [familyValues, setFamilyValues] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState("");
  const [nonNegotiables, setNonNegotiables] = useState("");

  // Part 3 state
  const [enablingPatterns, setEnablingPatterns] = useState<string[]>([]);
  const [additionalPatterns, setAdditionalPatterns] = useState("");

  // Part 4 state
  const [boundaries, setBoundaries] = useState([
    { behavior: "", statement: "", consequence: "" },
    { behavior: "", statement: "", consequence: "" }
  ]);

  // Part 5 state
  const [trueEmergency, setTrueEmergency] = useState("");
  const [notEmergencies, setNotEmergencies] = useState("");
  const [crisisResponses, setCrisisResponses] = useState<string[]>([]);

  // Part 6 state
  const [familySupports, setFamilySupports] = useState<string[]>([]);
  const [selfCareCommitments, setSelfCareCommitments] = useState("");
  const [burnoutSigns, setBurnoutSigns] = useState("");

  // Part 7 state
  const [groundingPhrase, setGroundingPhrase] = useState("");

  // Part 8 state
  const [accountabilityPerson, setAccountabilityPerson] = useState("");
  const [reviewFrequency, setReviewFrequency] = useState<string[]>([]);
  const [progressToLookFor, setProgressToLookFor] = useState("");

  // Part 9 state
  const [signature, setSignature] = useState("");
  const [signDate, setSignDate] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const updateBoundary = (index: number, field: keyof typeof boundaries[0], value: string) => {
    const newBoundaries = [...boundaries];
    newBoundaries[index][field] = value;
    setBoundaries(newBoundaries);
  };

  return (
    <>
      <Helmet>
        <title>Family Recovery Action Plan | Sober Helpline</title>
        <meta name="description" content="A practical roadmap for stability, boundaries, and healing. Create your family's action plan for recovery." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header - Hidden on print */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur print:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Link & Print Button - Hidden on print */}
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-videos"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Resources
              </Link>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print Document
              </Button>
            </div>

            {/* Printable Document Content */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8 md:p-12 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <ClipboardList className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Family Recovery Action Plan
                </h1>
                <p className="text-lg text-muted-foreground">
                  A Practical Roadmap for Stability, Boundaries, and Healing
                </p>
              </div>

              {/* Purpose Section */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Purpose</h2>
                <p className="text-muted-foreground mb-4">
                  Addiction creates chaos, urgency, and emotional reactivity. This action plan helps families move from crisis management to intentional, values-based decisions—regardless of whether their loved one is currently sober, in treatment, or actively using.
                </p>
                <p className="font-semibold text-primary italic">
                  This plan is about your recovery, not controlling theirs.
                </p>
              </section>

              {/* How to Use */}
              <section className="mb-8 p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                <h2 className="text-lg font-bold mb-3">How to Use This Guide</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Complete this plan during a calm moment, not during a crisis.</li>
                  <li>• Revisit and update it regularly.</li>
                  <li>• Share it with supportive people who can help you stay accountable.</li>
                  <li>• <strong>This plan works best when families commit to consistency over comfort.</strong></li>
                </ul>
              </section>

              {/* Part 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 1: Define Your Current Reality
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Answer honestly.</p>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">My loved one's current status (check all that apply):</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {["Actively using", "In detox or treatment", "Early recovery", "Long-term recovery", "Relapsed or unstable"].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={lovedOneStatus.includes(status)}
                            onCheckedChange={() => toggleArrayItem(lovedOneStatus, setLovedOneStatus, status)}
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">The biggest ongoing challenges for our family are:</p>
                    <Textarea
                      value={biggestChallenges}
                      onChange={(e) => setBiggestChallenges(e.target.value)}
                      placeholder="Describe your family's biggest challenges..."
                      className="min-h-[80px] print:border print:border-gray-300"
                    />
                  </div>

                  <div>
                    <p className="font-medium mb-2">What patterns have repeated despite our best efforts?</p>
                    <Textarea
                      value={repeatedPatterns}
                      onChange={(e) => setRepeatedPatterns(e.target.value)}
                      placeholder="Describe repeated patterns..."
                      className="min-h-[80px] print:border print:border-gray-300"
                    />
                  </div>
                </div>
              </section>

              {/* Part 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 2: Clarify Your Values & Non-Negotiables
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Recovery decisions should align with values, not fear.</p>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">The values we want to prioritize in our family include:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {["Safety", "Honesty", "Accountability", "Stability", "Respect", "Health"].map((value) => (
                        <label key={value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={familyValues.includes(value)}
                            onCheckedChange={() => toggleArrayItem(familyValues, setFamilyValues, value)}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Checkbox
                        checked={otherValue.length > 0}
                        onCheckedChange={() => {}}
                      />
                      <span className="text-sm">Other:</span>
                      <Input
                        value={otherValue}
                        onChange={(e) => setOtherValue(e.target.value)}
                        placeholder="Enter other value..."
                        className="flex-1 h-8 print:border print:border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Non-negotiables (behaviors we will not accept in our home or lives):</p>
                    <Textarea
                      value={nonNegotiables}
                      onChange={(e) => setNonNegotiables(e.target.value)}
                      placeholder="List your non-negotiables..."
                      className="min-h-[100px] print:border print:border-gray-300"
                    />
                  </div>
                </div>
              </section>

              {/* Part 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 3: Identify Enabling Patterns to Stop
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Based on education and reflection, identify behaviors you are committed to changing.</p>

                <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                  <p className="font-medium mb-3">We will stop:</p>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Covering for consequences (work, legal, social)",
                      "Providing money during active use",
                      "Making excuses or lying",
                      "Rescuing from predictable outcomes",
                      "Managing emotions or crises we didn't create"
                    ].map((pattern) => (
                      <li key={pattern} className="flex items-center gap-2">
                        <Checkbox
                          checked={enablingPatterns.includes(pattern)}
                          onCheckedChange={() => toggleArrayItem(enablingPatterns, setEnablingPatterns, pattern)}
                        />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="font-medium mb-2">Additional patterns we will stop:</p>
                  <Textarea
                    value={additionalPatterns}
                    onChange={(e) => setAdditionalPatterns(e.target.value)}
                    placeholder="List additional patterns..."
                    className="min-h-[80px] print:border print:border-gray-300"
                  />
                </div>
              </section>

              {/* Part 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 4: Boundaries & Consequences Plan
                </h2>
                <p className="text-sm text-muted-foreground mb-4">For each boundary, be specific.</p>

                <div className="space-y-6">
                  {boundaries.map((boundary, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3">Boundary #{index + 1}</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Behavior triggering the boundary:</p>
                          <Input
                            value={boundary.behavior}
                            onChange={(e) => updateBoundary(index, "behavior", e.target.value)}
                            placeholder="Describe the triggering behavior..."
                            className="print:border print:border-gray-300"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Boundary statement:</p>
                          <Input
                            value={boundary.statement}
                            onChange={(e) => updateBoundary(index, "statement", e.target.value)}
                            placeholder="Write your boundary statement..."
                            className="print:border print:border-gray-300"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Consequence we will follow through on:</p>
                          <Input
                            value={boundary.consequence}
                            onChange={(e) => updateBoundary(index, "consequence", e.target.value)}
                            placeholder="Describe the consequence..."
                            className="print:border print:border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <p className="text-sm text-muted-foreground italic">(Add additional boundaries as needed.)</p>
                </div>
              </section>

              {/* Part 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 5: Crisis Response Plan
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Emotions are highest during crises. Decide now.</p>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">What constitutes a true emergency (health, safety, legal)?</p>
                    <Textarea
                      value={trueEmergency}
                      onChange={(e) => setTrueEmergency(e.target.value)}
                      placeholder="Define what constitutes a true emergency..."
                      className="min-h-[60px] print:border print:border-gray-300"
                    />
                  </div>

                  <div>
                    <p className="font-medium mb-2">What behaviors will not be treated as emergencies?</p>
                    <Textarea
                      value={notEmergencies}
                      onChange={(e) => setNotEmergencies(e.target.value)}
                      placeholder="List behaviors that are not emergencies..."
                      className="min-h-[60px] print:border print:border-gray-300"
                    />
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">Our crisis response will include:</p>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Calling emergency services when appropriate",
                        "Not negotiating under pressure",
                        "Referring to previously set boundaries",
                        "Reaching out to a support person",
                        "Taking a pause before responding"
                      ].map((response) => (
                        <li key={response} className="flex items-center gap-2">
                          <Checkbox
                            checked={crisisResponses.includes(response)}
                            onCheckedChange={() => toggleArrayItem(crisisResponses, setCrisisResponses, response)}
                          />
                          {response}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Part 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 6: Family Self-Care & Support Plan
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Recovery requires sustained support for families.</p>

                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">Individual or family supports we will engage in:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        "Therapy or counseling",
                        "Support groups",
                        "Coaching",
                        "Educational resources",
                        "Spiritual or community support"
                      ].map((support) => (
                        <label key={support} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={familySupports.includes(support)}
                            onCheckedChange={() => toggleArrayItem(familySupports, setFamilySupports, support)}
                          />
                          {support}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Personal commitments to self-care:</p>
                    <Textarea
                      value={selfCareCommitments}
                      onChange={(e) => setSelfCareCommitments(e.target.value)}
                      placeholder="List your self-care commitments..."
                      className="min-h-[60px] print:border print:border-gray-300"
                    />
                  </div>

                  <div>
                    <p className="font-medium mb-2">Warning signs we are burning out or reverting to old patterns:</p>
                    <Textarea
                      value={burnoutSigns}
                      onChange={(e) => setBurnoutSigns(e.target.value)}
                      placeholder="Describe warning signs..."
                      className="min-h-[60px] print:border print:border-gray-300"
                    />
                  </div>
                </div>
              </section>

              {/* Part 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 7: Communication Guidelines
                </h2>
                <p className="text-sm text-muted-foreground mb-4">To reduce conflict and manipulation:</p>

                <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50 mb-4">
                  <p className="font-medium mb-3">We commit to:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Speaking calmly and briefly</li>
                    <li>• Avoiding lectures and emotional arguments</li>
                    <li>• Repeating boundaries without justification</li>
                    <li>• Ending conversations that become abusive or circular</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Our grounding response phrase:</p>
                  <p className="text-sm text-muted-foreground italic mb-2">
                    Example: "We're not going to argue about this. Our decision remains the same."
                  </p>
                  <Input
                    value={groundingPhrase}
                    onChange={(e) => setGroundingPhrase(e.target.value)}
                    placeholder="Enter your grounding response phrase..."
                    className="print:border print:border-gray-300"
                  />
                </div>
              </section>

              {/* Part 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 8: Review & Accountability
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Who will help hold us accountable to this plan?</p>
                    <Input
                      value={accountabilityPerson}
                      onChange={(e) => setAccountabilityPerson(e.target.value)}
                      placeholder="Enter name(s)..."
                      className="print:border print:border-gray-300"
                    />
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">How often will we review and update this plan?</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {["Monthly", "Quarterly", "As circumstances change"].map((freq) => (
                        <label key={freq} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={reviewFrequency.includes(freq)}
                            onCheckedChange={() => toggleArrayItem(reviewFrequency, setReviewFrequency, freq)}
                          />
                          {freq}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What progress will we look for in ourselves—not our loved one?</p>
                    <Textarea
                      value={progressToLookFor}
                      onChange={(e) => setProgressToLookFor(e.target.value)}
                      placeholder="Describe the progress you'll look for..."
                      className="min-h-[60px] print:border print:border-gray-300"
                    />
                  </div>
                </div>
              </section>

              {/* Part 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 9: Commitment Statement
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Read and sign:</p>

                <div className="p-6 border-2 rounded-lg bg-muted/30 print:bg-gray-50">
                  <p className="text-sm italic mb-6">
                    "We commit to focusing on our recovery, setting clear boundaries, and responding thoughtfully rather than reactively. We understand that we cannot control outcomes, but we can control our actions."
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Signature(s):</p>
                      <Input
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Type your name(s) as signature..."
                        className="print:border print:border-gray-300"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Date:</p>
                      <Input
                        type="date"
                        value={signDate}
                        onChange={(e) => setSignDate(e.target.value)}
                        className="w-48 print:border print:border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Final Perspective */}
              <section className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 print:bg-gray-50">
                <h2 className="text-lg font-bold text-logo-green mb-3">Final Perspective</h2>
                <p className="text-muted-foreground mb-4">
                  Families do not heal by waiting for someone else to change.<br />
                  They heal by reclaiming their lives, integrity, and peace.
                </p>
                <p className="text-sm text-muted-foreground">
                  This action plan is not rigid. It is a living document designed to support clarity, consistency, and compassion—especially when things get hard.
                </p>
              </section>

              {/* Footer for print */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground print:block hidden">
                <p>Sober Helpline | (541) 241-5886 | www.soberhelpline.com</p>
              </div>
            </div>

            {/* Bottom Print Button - Hidden on print */}
            <div className="mt-6 text-center print:hidden">
              <Button onClick={handlePrint} size="lg" className="gap-2">
                <Printer className="h-5 w-5" />
                Print This Document
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </>
  );
}
