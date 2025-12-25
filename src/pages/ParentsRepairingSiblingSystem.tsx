import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Heart, Shield, Users, CheckCircle, AlertCircle, HelpCircle, XCircle, MessageCircle } from "lucide-react";

const ParentsRepairingSiblingSystem = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 print:py-4 print:bg-white">
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

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 print:text-3xl">
              Parents: Repairing the Sibling System
            </h1>
            <p className="text-xl text-blue-700 font-medium">
              How to Acknowledge Unequal Impact, Restore Trust, and Support Healing Between Siblings
            </p>
          </div>

          {/* Why This Guide Matters */}
          <Card className="mb-8 border-blue-200 bg-blue-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-blue-600" />
                Why This Guide Matters
              </h2>
              <p className="text-gray-700 mb-4">
                When addiction enters a family, parents are forced into impossible decisions:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Where to put attention
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  How to manage crisis
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  How to protect everyone
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  How to survive emotionally
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                Most parents do the best they can under extraordinary stress.
              </p>
              <p className="text-gray-700 mb-4">
                And still—siblings are often impacted in ways that go unrecognized for years.
              </p>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-semibold text-center">
                  Repairing the sibling system is not about assigning blame.<br />
                  It is about acknowledging impact and restoring balance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* A Critical Truth for Parents */}
          <Card className="mb-8 border-amber-200 bg-amber-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Critical Truth for Parents</h2>
              <p className="text-amber-800 font-bold text-xl mb-4 text-center">
                Intent does not erase impact.
              </p>
              <p className="text-gray-700 mb-4">
                Parents may not have meant to neglect, minimize, or overlook siblings—but siblings may still carry:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Emotional absence
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Unequal attention
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Unacknowledged loss
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Pressure to be "easy" or "strong"
                </li>
              </ul>
              <p className="text-amber-700 font-medium italic">
                Repair begins when parents are willing to hold this reality without defending themselves.
              </p>
            </CardContent>
          </Card>

          {/* How Addiction Disrupts the Sibling System */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                How Addiction Disrupts the Sibling System
              </h2>
              <p className="text-gray-700 mb-4">Addiction often creates:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  A crisis-centered household
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Unequal distribution of attention
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Emotional triage
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Role rigidity (the strong one, the invisible one, the caretaker)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Chronic stress and unpredictability
                </li>
              </ul>
              <p className="text-gray-700 mt-4 italic">
                Over time, siblings adapt in different—and often conflicting—ways.
              </p>
            </CardContent>
          </Card>

          {/* Common Parental Missteps */}
          <Card className="mb-8 border-red-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Parental Missteps (Understandable, But Costly)</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-red-800 mb-2">1. Focusing Repair Only on the Addicted Child</h3>
                  <p className="text-gray-700 mb-2">Parents may unconsciously believe:</p>
                  <p className="text-gray-700 italic ml-4 mb-2">"If they recover, the family will heal."</p>
                  <p className="text-gray-700 mb-2">In reality:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Recovery addresses behavior—not relational history</li>
                    <li>• Siblings may still feel overlooked or unheard</li>
                    <li>• Repair requires separate attention to sibling impact</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-red-800 mb-2">2. Asking Siblings to Be "Supportive"</h3>
                  <p className="text-gray-700 mb-2">Well-intended phrases like:</p>
                  <ul className="space-y-1 text-gray-700 ml-4 italic">
                    <li>• "They're sick—try to understand"</li>
                    <li>• "They're doing better now"</li>
                    <li>• "We need to stick together"</li>
                  </ul>
                  <p className="text-gray-700 mt-2 mb-2">Can unintentionally:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Silence sibling pain</li>
                    <li>• Reinforce old hierarchies</li>
                    <li>• Pressure siblings into emotional labor</li>
                  </ul>
                  <p className="text-red-700 font-medium mt-2 italic">
                    Support cannot be demanded—it must be chosen.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-red-800 mb-2">3. Explaining Instead of Acknowledging</h3>
                  <p className="text-gray-700 mb-2">Parents often try to help siblings understand:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Why things were handled a certain way</li>
                    <li>• How bad things really were</li>
                    <li>• Why attention was unequal</li>
                  </ul>
                  <div className="mt-3 bg-white p-3 rounded border border-red-200">
                    <p className="text-red-800 font-semibold text-center">
                      Explanations do not heal.<br />Acknowledgment does.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Repair Actually Requires */}
          <Card className="mb-8 border-green-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                What Repair Actually Requires from Parents
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">1. Naming Unequal Impact—Out Loud</h3>
                  <p className="text-gray-700 mb-2">Repair begins when parents can say:</p>
                  <ul className="space-y-2 text-gray-700 ml-4 italic">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      "You carried more than you should have."
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      "You were affected too—and we didn't see it."
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      "Your needs weren't centered, and that matters."
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      "You deserved more support than you got."
                    </li>
                  </ul>
                  <p className="text-green-700 font-medium mt-3">
                    No justification. No comparison. No minimizing.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">2. Allowing Sibling Emotions Without Correction</h3>
                  <p className="text-gray-700 mb-2">Parents must tolerate:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Anger without defending</li>
                    <li>• Sadness without fixing</li>
                    <li>• Distance without panic</li>
                    <li>• Silence without pressure</li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">
                    Discomfort is not danger. It is part of repair.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">3. Separating Sibling Repair from Recovery Progress</h3>
                  <p className="text-gray-700 mb-2">Parents should avoid linking sibling healing to:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Sobriety milestones</li>
                    <li>• Treatment completion</li>
                    <li>• Improved behavior</li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">
                    Siblings heal on their own timeline—not the recovery timeline.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">4. Refusing to Triangulate</h3>
                  <p className="text-gray-700 mb-2">Parents must resist:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Carrying messages between siblings
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Asking one sibling to "reach out"
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Managing perceptions
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Encouraging reconciliation indirectly
                    </li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">
                    Triangulation recreates old dynamics. Repair requires direct choice and autonomy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Parents Can Do Right Now */}
          <Card className="mb-8 border-blue-200 bg-blue-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                What Parents Can Do Right Now
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Create Individual Space with Each Child</h3>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• One-on-one conversations</li>
                    <li>• No agenda</li>
                    <li>• No updates about the addicted sibling</li>
                    <li>• Curiosity instead of defense</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Ask Better Questions</h3>
                  <div className="bg-white p-4 rounded-lg border border-blue-200 space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Instead of:</p>
                      <p className="text-gray-700 italic">"Why didn't you say anything?"</p>
                      <p className="text-blue-600 font-medium mt-1">Ask: "What was it like for you?"</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Instead of:</p>
                      <p className="text-gray-700 italic">"Can't we move forward now?"</p>
                      <p className="text-blue-600 font-medium mt-1">Ask: "What still needs acknowledgment?"</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Respect Boundaries Without Personalizing Them</h3>
                  <p className="text-gray-700 mb-2">Sibling boundaries are not rejection. They are regulation.</p>
                  <p className="text-gray-700">Parents must model:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Respect
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Patience
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Emotional containment
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Repair Does Not Look Like */}
          <Card className="mb-8 border-gray-300 bg-gray-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Repair Does Not Look Like</h2>
              <p className="text-gray-700 mb-4">Repair does not mean:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Forcing family meetings
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Demanding forgiveness
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Pushing closeness
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Rewriting history
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Equalizing pain narratives
                </li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-gray-300 mt-4">
                <p className="text-gray-800 font-semibold text-center">
                  Repair means restoring agency and recognition.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Signs Repair Is Working */}
          <Card className="mb-8 border-green-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Signs Repair Is Working</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Siblings feel less pressure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Conversations are calmer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Boundaries are respected
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Parents listen more than explain
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Emotional honesty increases—even if closeness doesn't
                </li>
              </ul>
              <p className="text-green-700 font-medium mt-4 italic">
                Progress may look quiet. That is normal.
              </p>
            </CardContent>
          </Card>

          {/* When Parents Feel Guilt or Shame */}
          <Card className="mb-8 border-amber-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">When Parents Feel Guilt or Shame</h2>
              <p className="text-gray-700 mb-4">Parental guilt is common—and understandable.</p>
              <p className="text-gray-700 mb-2">But guilt-driven behavior often:</p>
              <ul className="space-y-1 text-gray-700 ml-4 mb-4">
                <li>• Rushes repair</li>
                <li>• Centers parental feelings</li>
                <li>• Recreates pressure on siblings</li>
              </ul>
              <div className="bg-amber-100 p-4 rounded-lg border border-amber-300">
                <p className="text-amber-800 font-semibold text-center">
                  The task is not to erase guilt.<br />
                  It is to act responsibly despite it.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* A Grounding Reframe */}
          <Card className="mb-8 border-blue-300 bg-blue-100 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Grounding Reframe for Parents</h2>
              <p className="text-blue-800 text-lg font-medium mb-4">
                Repair is not about being forgiven.<br />
                It is about being accountable and present now.
              </p>
              <p className="text-blue-700 font-semibold">
                You don't need to get it right in the past.<br />
                You need to show up differently in the present.
              </p>
            </CardContent>
          </Card>

          {/* Reflection Questions */}
          <Card className="mb-8 border-purple-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-purple-600" />
                Reflection Questions for Parents
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What did each child lose during the years of addiction?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Where did we unintentionally rely on certain children to be "easy"?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  How do we react when siblings express anger or distance?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What do we still feel defensive about—and why?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What would accountability look like without self-blame?
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Final Thought */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white print:bg-gray-100 print:text-gray-900">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Final Thought</h2>
              <p className="text-lg mb-4">
                Parents cannot undo the impact addiction had on siblings.
              </p>
              <p className="mb-2">But they can:</p>
              <ul className="space-y-1 mb-6 ml-4">
                <li>• Name it</li>
                <li>• Respect it</li>
                <li>• Make space for it</li>
                <li>• Stop repeating it</li>
              </ul>
              <p className="mb-4">
                Repairing the sibling system isn't about restoring harmony.<br />
                It's about restoring dignity, voice, and choice.
              </p>
              <p className="text-xl font-semibold">
                That repair—handled with humility—often becomes one of the most meaningful acts of parenting possible.
              </p>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggested Companion Resources</h2>
              <div className="grid gap-3">
                <Link to="/sibling-experience" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
                  → The Sibling Experience in Addiction
                </Link>
                <Link to="/sibling-guilt-anger-loyalty" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
                  → Sibling Guilt, Anger, and Loyalty Conflicts
                </Link>
                <Link to="/growing-up-shadow" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
                  → Growing Up in the Shadow of Addiction
                </Link>
                <Link to="/rebuilding-sibling-relationships" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
                  → Rebuilding Sibling Relationships in Recovery
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center print:hidden">
            <Link to="/family-education">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Family Education
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParentsRepairingSiblingSystem;
