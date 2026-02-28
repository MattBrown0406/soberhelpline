import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Heart, Shield, AlertCircle, HelpCircle, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const AddictionRewritesFamilyRules = () => {
  useGuideTracking("How Addiction Rewrites Family Rules", "/addiction-rewrites-family-rules");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 print:py-4 print:bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <Link to="/family-education">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Family Education
              </Button>
            </Link>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Guide
            </Button>
          </div>

          <ToolBrandHeader
            title="How Addiction Rewrites Family Rules"
            subtitle="The unspoken codes that keep families stuck — and how to change them. Every family has rules. Addiction rewrites them without anyone noticing."
            clinicalNote="Based on Murray Bowen's family systems theory and Claudia Black's research on unspoken family rules in addiction ('Don't talk, don't trust, don't feel')."
          />

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 print:text-3xl">
              How Addiction Rewrites Family Rules
            </h1>
            <p className="text-xl text-teal-700 font-medium">
              The Unspoken Codes That Keep Families Stuck—and How to Change Them
            </p>
          </div>

          {/* Why This Guide Matters */}
          <Card className="mb-8 border-teal-200 bg-teal-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-teal-600" />
                Why This Guide Matters
              </h2>
              <p className="text-gray-700 mb-4">Families affected by addiction often say:</p>
              <ul className="space-y-2 text-gray-700 mb-4 italic">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">"</span>
                  We don't know how this became normal."
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">"</span>
                  We're always walking on eggshells."
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">"</span>
                  No one ever talks about it—but everyone feels it."
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">"</span>
                  We're exhausted, but nothing changes."
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                What they are describing is not a failure of love or effort.
              </p>
              <p className="text-gray-700 mb-4">
                They are describing a <strong>family rule system</strong> that has quietly been rewritten by addiction.
              </p>
              <div className="bg-white p-4 rounded-lg border border-teal-200">
                <p className="text-teal-800 font-semibold text-center">
                  Addiction doesn't just change behavior.<br />
                  It changes what a family believes is allowed, expected, and survivable.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* A Core Truth About Family Rules */}
          <Card className="mb-8 border-amber-200 bg-amber-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Core Truth About Family Rules</h2>
              <p className="text-amber-800 font-bold text-lg mb-4">
                Every family has rules—even if they are never spoken.
              </p>
              <p className="text-gray-700 mb-2">Rules answer questions like:</p>
              <ul className="space-y-1 text-gray-700 mb-4 ml-4">
                <li>• What can be talked about?</li>
                <li>• What emotions are acceptable?</li>
                <li>• Who gets attention?</li>
                <li>• What happens when something goes wrong?</li>
                <li>• How conflict is handled</li>
              </ul>
              <p className="text-amber-700 font-medium italic">
                When addiction enters a family, these rules often change without consent or awareness.
              </p>
            </CardContent>
          </Card>

          {/* How Rule Changes Begin */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How Rule Changes Begin</h2>
              <p className="text-gray-700 mb-4">Family rules begin to shift when:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  Crisis becomes frequent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  Stability feels fragile
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  Emotional expression escalates conflict
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  Someone's behavior feels unpredictable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  Fear replaces predictability
                </li>
              </ul>
              <p className="text-gray-700 mb-2">The family adapts to survive.</p>
              <p className="text-teal-700 font-medium italic">
                These adaptations are not conscious choices. They are protective responses.
              </p>
            </CardContent>
          </Card>

          {/* The Most Common Rules */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-teal-600" />
            The Most Common Rules Addiction Introduces
          </h2>

          {/* Rule 1 */}
          <Card className="mb-4 border-red-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4">Rule #1: "Don't Talk About It"</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">How It Forms</h4>
                  <p className="text-gray-700 text-sm">Talking leads to conflict, denial, or escalation.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">What It Sounds Like</h4>
                  <ul className="text-gray-700 text-sm italic space-y-1">
                    <li>"Let's not bring it up."</li>
                    <li>"Now isn't the time."</li>
                    <li>"It'll just make things worse."</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Isolation, confusion, suppressed emotions, children filling in the blanks themselves</p>
              </div>
            </CardContent>
          </Card>

          {/* Rule 2 */}
          <Card className="mb-4 border-orange-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4">Rule #2: "Don't Feel Too Much"</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">How It Forms</h4>
                  <p className="text-gray-700 text-sm">Big emotions seem to trigger relapse, rage, or withdrawal.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-2">What It Sounds Like</h4>
                  <ul className="text-gray-700 text-sm italic space-y-1">
                    <li>"Stay calm."</li>
                    <li>"Don't upset them."</li>
                    <li>"Be strong."</li>
                  </ul>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Emotional suppression, anxiety, difficulty identifying feelings, fear of vulnerability</p>
              </div>
            </CardContent>
          </Card>

          {/* Rule 3 */}
          <Card className="mb-4 border-amber-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Rule #3: "Keep the Peace at All Costs"</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">How It Forms</h4>
                  <p className="text-gray-700 text-sm">Conflict feels dangerous or exhausting.</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-700 mb-2">What It Sounds Like</h4>
                  <ul className="text-gray-700 text-sm italic space-y-1">
                    <li>"Just let it go."</li>
                    <li>"It's not worth it."</li>
                    <li>"We can deal with it later."</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <h4 className="font-semibold text-amber-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Boundary erosion, resentment, loss of trust, chronic tension beneath calm</p>
              </div>
            </CardContent>
          </Card>

          {/* Rule 4 */}
          <Card className="mb-4 border-purple-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4">Rule #4: "Protect the Family Image"</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">How It Forms</h4>
                  <p className="text-gray-700 text-sm">Shame and stigma create fear of judgment.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-2">What It Sounds Like</h4>
                  <ul className="text-gray-700 text-sm italic space-y-1">
                    <li>"We don't tell people our business."</li>
                    <li>"What will others think?"</li>
                    <li>"This stays in the family."</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Secrecy, lack of support, isolation, children learning to perform rather than be real</p>
              </div>
            </CardContent>
          </Card>

          {/* Rule 5 */}
          <Card className="mb-4 border-blue-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Rule #5: "Someone Has to Hold It Together"</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">How It Forms</h4>
                  <p className="text-gray-700 text-sm">Chaos requires compensation.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">What It Sounds Like</h4>
                  <ul className="text-gray-700 text-sm italic space-y-1">
                    <li>"You're the strong one."</li>
                    <li>"We rely on you."</li>
                    <li>"At least you're okay."</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Burnout, parentification, loss of childhood, identity built on function</p>
              </div>
            </CardContent>
          </Card>

          {/* Rule 6 */}
          <Card className="mb-8 border-pink-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-pink-800 mb-4">Rule #6: "Crisis Gets Attention"</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">How It Forms</h4>
                  <p className="text-gray-700 text-sm">Urgency dictates resources.</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-pink-700 mb-2">What It Sounds Like</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Attention spikes when things explode</li>
                    <li>• Calm periods feel invisible</li>
                  </ul>
                </div>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <h4 className="font-semibold text-pink-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Emotional whiplash, difficulty trusting stability, conditioning toward chaos</p>
              </div>
            </CardContent>
          </Card>

          {/* Why These Rules Persist */}
          <Card className="mb-8 border-gray-300 bg-gray-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why These Rules Persist</h2>
              <p className="text-gray-700 mb-4">These rules stay in place because they:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  Reduce immediate conflict
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  Create short-term stability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  Help families survive unbearable uncertainty
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  Become familiar—even when painful
                </li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-gray-300">
                <p className="text-gray-800 font-semibold text-center">
                  What once protected the family can later imprison it.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How These Rules Affect Children */}
          <Card className="mb-8 border-red-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                How These Rules Affect Children and Siblings
              </h2>
              <p className="text-gray-700 mb-4">Children growing up under these rules often learn:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Their needs are secondary
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Feelings are dangerous
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Silence equals safety
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Love requires adaptation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Stability depends on them
                </li>
              </ul>
              <p className="text-red-700 font-medium italic">
                These lessons follow them into adulthood.
              </p>
            </CardContent>
          </Card>

          {/* Why Rules Don't Automatically Reset */}
          <Card className="mb-8 border-amber-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Rules Don't Automatically Reset in Recovery</h2>
              <p className="text-gray-700 mb-4">Even when substance use decreases:</p>
              <ul className="space-y-1 text-gray-700 mb-4 ml-4">
                <li>• Fear remains</li>
                <li>• Habits persist</li>
                <li>• Roles stay rigid</li>
                <li>• Silence feels safer than change</li>
              </ul>
              <p className="text-gray-700 mb-2">Recovery without rule change often leads to:</p>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• Ongoing tension</li>
                <li>• Boundary confusion</li>
                <li>• Relapse vulnerability</li>
                <li>• Family burnout</li>
              </ul>
            </CardContent>
          </Card>

          {/* How Families Begin Rewriting the Rules */}
          <Card className="mb-8 border-green-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                How Families Begin Rewriting the Rules
              </h2>
              <p className="text-gray-700 mb-6 font-medium">Rule change must be intentional and gradual.</p>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Step 1: Name the Old Rules (Without Blame)</h3>
                  <p className="text-gray-700 mb-2">Ask:</p>
                  <ul className="text-gray-700 text-sm space-y-1 ml-4">
                    <li>• What were we not allowed to say?</li>
                    <li>• What emotions were unsafe?</li>
                    <li>• Who carried the most responsibility?</li>
                    <li>• What behaviors were tolerated?</li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">Naming creates choice.</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Step 2: Decide What No Longer Serves You</h3>
                  <p className="text-gray-700 mb-2">Not all rules are bad. Some are outdated.</p>
                  <div className="bg-white p-3 rounded border border-green-200 mt-2">
                    <p className="text-sm text-gray-600">Example:</p>
                    <p className="text-gray-700"><strong>Old rule:</strong> "Don't talk about it."</p>
                    <p className="text-green-700"><strong>New rule:</strong> "We talk about concerns calmly and directly."</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Step 3: Practice New Rules Consistently</h3>
                  <p className="text-gray-700 mb-2">New rules require:</p>
                  <ul className="text-gray-700 text-sm space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Repetition
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Boundaries
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Tolerance for discomfort
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Patience with setbacks
                    </li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">Expect pushback. That's normal.</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Step 4: Allow the System to Adjust</h3>
                  <p className="text-gray-700 mb-2">When rules change:</p>
                  <ul className="text-gray-700 text-sm space-y-1 ml-4">
                    <li>• Anxiety may rise temporarily</li>
                    <li>• Roles may wobble</li>
                    <li>• Old patterns may intensify briefly</li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">
                    This is not failure. It is reorganization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples of Healthier Replacement Rules */}
          <Card className="mb-8 border-teal-200 bg-teal-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Examples of Healthier Replacement Rules</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  "We talk about problems when they arise."
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  "Feelings are allowed—even uncomfortable ones."
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  "Boundaries are not punishments."
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  "No one person carries everything."
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  "We ask for help."
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  "Stability matters more than appearances."
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Reflection Questions */}
          <Card className="mb-8 border-purple-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-purple-600" />
                Reflection Questions for Families
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What unspoken rules shaped our family?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Which rules protected us—and which harmed us?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Who benefited from these rules?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Who paid the price?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What new rule would improve safety and clarity right now?
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* A Grounding Reframe */}
          <Card className="mb-8 border-teal-300 bg-teal-100 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Grounding Reframe</h2>
              <p className="text-teal-800 text-lg font-medium mb-2">
                Families don't fail because they had unhealthy rules.<br />
                They survive because those rules once worked.
              </p>
              <p className="text-teal-700 font-semibold">
                Healing begins when families are brave enough to update them.
              </p>
            </CardContent>
          </Card>

          {/* Final Thought */}
          <Card className="mb-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white print:bg-gray-100 print:text-gray-900">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Final Thought</h2>
              <p className="text-lg mb-4">
                Addiction rewrites family rules quietly—through fear, urgency, and survival.
              </p>
              <p className="mb-4">
                Recovery invites families to ask:
              </p>
              <p className="text-xl font-semibold italic mb-6">
                "What do we want to live by now?"
              </p>
              <p className="text-xl font-semibold">
                You are not breaking the family by changing the rules.<br />
                You are giving it a future.
              </p>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggested Companion Resources</h2>
              <div className="grid gap-3">
                <Link to="/family-roles-addiction" className="text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-2">
                  → Family Roles in Addiction (Beyond the Clichés)
                </Link>
                <Link to="/parents-repairing-sibling-system" className="text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-2">
                  → Parents: Repairing the Sibling System
                </Link>
                <Link to="/strong-one" className="text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-2">
                  → The Hidden Cost of Being the "Strong One"
                </Link>
                <Link to="/guilt-relief-resentment" className="text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-2">
                  → The Guilt–Relief–Resentment Cycle
                </Link>
                <Link to="/living-well-regardless" className="text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-2">
                  → Living Well Regardless of Outcome
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center print:hidden">
            <Link to="/family-education">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Family Education
              </Button>
            </Link>
          </div>
        </div>
      </div>
    
          <RelatedResources currentPath="/addiction-rewrites-family-rules" />
</Layout>
  );
};

export default AddictionRewritesFamilyRules;
