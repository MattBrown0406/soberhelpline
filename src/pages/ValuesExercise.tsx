import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, FileText, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const ValuesExercise = () => {
  const [coreValues, setCoreValues] = useState<string[]>(["", "", "", "", ""]);

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...coreValues];
    newValues[index] = value;
    setCoreValues(newValues);
  };

  const handlePrint = () => {
    window.print();
  };

  const valuesList = [
    "Safety", "Honesty", "Integrity", "Compassion", "Accountability",
    "Stability", "Respect", "Responsibility", "Health", "Growth",
    "Connection", "Trust", "Boundaries", "Consistency", "Self-respect",
    "Peace", "Courage", "Family", "Balance", "Clarity"
  ];

  return (
    <>
      <Helmet>
        <title>Values Clarification Exercise | Sober Helpline</title>
        <meta name="description" content="A printable values clarification exercise to help families make decisions from what matters, not what hurts." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header - Hidden in print */}
        <header className="bg-primary text-primary-foreground py-4 print:hidden">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:1-800-555-0199" className="text-lg font-semibold hover:underline">
              1-800-555-0199
            </a>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Navigation - Hidden in print */}
          <div className="mb-6 flex justify-between items-center print:hidden">
            <Link to="/family-education">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Resources
              </Button>
            </Link>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print This Guide
            </Button>
          </div>

          {/* Printable Content */}
          <div className="bg-card rounded-lg border p-8 print:border-none print:p-0 print:bg-white">
            {/* Title */}
            <div className="text-center mb-8 border-b pb-6">
              <h1 className="text-3xl font-bold text-logo-green mb-2">Values Clarification Exercise</h1>
              <p className="text-xl text-muted-foreground italic">Making Decisions from What Matters, Not What Hurts</p>
            </div>

            {/* Purpose */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-logo-green mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Purpose
              </h2>
              <p className="text-muted-foreground mb-4">
                Addiction pulls families into constant reaction mode. Values clarification helps you step out of crisis thinking and reconnect with who you want to be, regardless of what your loved one chooses.
              </p>
              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-logo-green">
                <p className="font-medium text-center italic">
                  Values do not guarantee outcomes.<br />
                  They provide direction and integrity.
                </p>
              </div>
            </section>

            {/* How to Use */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-logo-green mb-3">How to Use This Exercise</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 mt-1 text-logo-green flex-shrink-0" />
                  <span>Complete this exercise when you are relatively calm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 mt-1 text-logo-green flex-shrink-0" />
                  <span>Answer honestly—there are no "right" values.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 mt-1 text-logo-green flex-shrink-0" />
                  <span>Revisit this exercise regularly as circumstances change.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 mt-1 text-logo-green flex-shrink-0" />
                  <span>Values guide behavior; they are not tools for control.</span>
                </li>
              </ul>
            </section>

            {/* Part 1 */}
            <section className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Part 1: Recognizing Value Drift</h2>
              <p className="text-muted-foreground mb-4">Addiction often pulls families away from their values.</p>
              <p className="font-medium mb-4">Answer briefly:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">In what ways has addiction disrupted your family's sense of stability or identity?</label>
                  <Textarea className="min-h-[80px] print:border print:border-gray-300" placeholder="Write your response here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">What behaviors or choices have you made that don't feel aligned with who you want to be?</label>
                  <Textarea className="min-h-[80px] print:border print:border-gray-300" placeholder="Write your response here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">What emotions tend to drive your decisions most often?</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {["Fear", "Guilt", "Anger", "Hope", "Exhaustion"].map((emotion) => (
                      <div key={emotion} className="flex items-center gap-2">
                        <Checkbox id={`emotion-${emotion}`} />
                        <label htmlFor={`emotion-${emotion}`} className="text-sm">{emotion}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Part 2 */}
            <section className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Part 2: Identifying Core Values</h2>
              <p className="text-muted-foreground mb-4">Below is a list of common values. Circle or highlight <strong>10</strong> that feel important to you right now.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {valuesList.map((value) => (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox id={`value-${value}`} />
                    <label htmlFor={`value-${value}`} className="text-sm">{value}</label>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Add any others:</label>
                <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Additional values..." />
              </div>
            </section>

            {/* Part 3 */}
            <section className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Part 3: Narrowing to What Matters Most</h2>
              <p className="text-muted-foreground mb-4">From the list above, choose <strong>5 core values</strong> that you want to guide your decisions moving forward.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="border rounded-lg p-3 text-center">
                    <span className="text-xs text-muted-foreground">Value #{index + 1}</span>
                    <Input
                      value={coreValues[index]}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      className="mt-2 text-center print:border print:border-gray-300"
                      placeholder="Enter value..."
                      maxLength={50}
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Reflection: Why did you choose these values?</label>
                <Textarea className="min-h-[80px] print:border print:border-gray-300" placeholder="Write your reflection here..." />
              </div>
            </section>

            {/* Part 4 */}
            <section className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Part 4: Defining Your Values in Action</h2>
              <p className="text-muted-foreground mb-4">Values only matter if they guide behavior.</p>
              <p className="font-medium mb-4">For each value, answer the following:</p>
              
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="mb-6 p-4 bg-muted/20 rounded-lg border">
                  <h3 className="font-semibold mb-3">
                    Value #{index + 1}: <span className="text-logo-green">{coreValues[index] || <span className="text-muted-foreground italic">Not yet entered</span>}</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">What this value means to me:</label>
                      <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Write your response..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">How this value shows up in my behavior:</label>
                      <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Write your response..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">One way I can live this value even when things are hard:</label>
                      <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Write your response..." />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Part 5 */}
            <section className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Part 5: Values vs. Fear Check</h2>
              <p className="text-muted-foreground mb-4">For each statement, decide whether it reflects fear-based action or values-based action.</p>
              
              <div className="space-y-4">
                {[
                  "I'm afraid of what will happen if I say no.",
                  "This boundary protects safety and honesty.",
                  "I don't want them to be mad at me.",
                  "This decision aligns with my integrity."
                ].map((statement, index) => (
                  <div key={index} className="p-3 bg-muted/20 rounded-lg border">
                    <p className="font-medium mb-2">"{statement}"</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox id={`fear-${index}`} />
                        <label htmlFor={`fear-${index}`} className="text-sm">Fear</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id={`values-${index}`} />
                        <label htmlFor={`values-${index}`} className="text-sm">Values</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Reflection: Which value do you tend to abandon when fear shows up?</label>
                <Textarea className="min-h-[80px] print:border print:border-gray-300" placeholder="Write your reflection here..." />
              </div>
            </section>

            {/* Part 6 */}
            <section className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Part 6: Applying Values to Real Decisions</h2>
              <p className="text-muted-foreground mb-4">Choose one current challenge and answer:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">What decision am I facing right now?</label>
                  <Textarea className="min-h-[80px] print:border print:border-gray-300" placeholder="Write your response here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Which value feels most relevant here?</label>
                  <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Write your response here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">What would a values-aligned decision look like—even if it's uncomfortable?</label>
                  <Textarea className="min-h-[80px] print:border print:border-gray-300" placeholder="Write your response here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">What fear-based response am I tempted to choose instead?</label>
                  <Textarea className="min-h-[80px] print:border print:border-gray-300" placeholder="Write your response here..." />
                </div>
              </div>
            </section>

            {/* Part 7 */}
            <section className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Part 7: Values-Based Commitment</h2>
              <p className="text-muted-foreground mb-4">Complete the statements:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Even when I feel afraid or guilty, I commit to acting from the value of:</label>
                  <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Write your commitment here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">One boundary or action I will take to honor this value:</label>
                  <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Write your response here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">One reminder I can return to when I feel uncertain:</label>
                  <Textarea className="min-h-[60px] print:border print:border-gray-300" placeholder="Write your reminder here..." />
                </div>
              </div>
            </section>

            {/* Final Reframe */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-logo-green mb-3">Final Reframe</h2>
              <div className="bg-logo-green/10 p-6 rounded-lg border border-logo-green/30 text-center">
                <p className="font-medium text-lg italic mb-2">
                  Values do not eliminate pain.<br />
                  They prevent regret.
                </p>
                <p className="text-muted-foreground">
                  When families act in alignment with their values, they regain clarity, self-respect, and stability—regardless of outcomes.
                </p>
              </div>
            </section>

            {/* Companion Resources */}
            <section className="border-t pt-6">
              <h2 className="text-lg font-semibold text-logo-green mb-3">Suggested Companion Resources</h2>
              <div className="flex flex-wrap gap-2 print:hidden">
                <Link to="/boundary-worksheet">
                  <Button variant="outline" size="sm">Boundary Setting Worksheet</Button>
                </Link>
                <Link to="/family-action-plan">
                  <Button variant="outline" size="sm">Family Recovery Action Plan</Button>
                </Link>
                <Link to="/crisis-chaos">
                  <Button variant="outline" size="sm">Crisis vs. Chaos Decision Guide</Button>
                </Link>
                <Link to="/emotional-regulation">
                  <Button variant="outline" size="sm">Emotional Regulation Tools</Button>
                </Link>
              </div>
              <ul className="hidden print:block text-sm text-muted-foreground space-y-1">
                <li>• Boundary Setting Worksheet</li>
                <li>• Family Recovery Action Plan</li>
                <li>• Crisis vs. Chaos Decision Guide</li>
                <li>• Emotional Regulation Tools</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default ValuesExercise;
