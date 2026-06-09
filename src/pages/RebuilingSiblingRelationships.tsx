import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Heart, Shield, Clock, Users, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const RebuildingSiblingRelationships = () => {
  useGuideTracking("/rebuilding-sibling-relationships", "Rebuilding Sibling Relationships in Recovery");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 print:py-4 print:bg-white">
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
            title="Rebuilding Sibling Relationships in Recovery"
            subtitle="What healing can look like — without pressure, pretending, or forced forgiveness. Reconnection is a process, not an event."
            clinicalNote="Informed by family reconciliation research, Al-Anon's principles of detachment and self-care, and restorative justice frameworks adapted for family systems."
          />


          {/* Why This Guide Matters */}
          <Card className="mb-8 border-purple-200 bg-purple-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-purple-600" />
                Why This Guide Matters
              </h2>
              <p className="text-gray-700 mb-4">
                When recovery begins, families often hope sibling relationships will:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  "Go back to normal"
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Heal quickly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Reconnect naturally
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Feel close again
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                For siblings, this expectation can feel overwhelming—or even unsafe.
              </p>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <p className="text-purple-800 font-semibold text-center">
                  Recovery does not automatically repair sibling relationships.<br />
                  It only creates the <span className="italic">possibility</span> for repair.
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                This guide explains what rebuilding actually requires, why it often takes time, and how families can avoid causing further harm by rushing the process.
              </p>
            </CardContent>
          </Card>

          {/* A Necessary Starting Truth */}
          <Card className="mb-8 border-amber-200 bg-amber-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Necessary Starting Truth</h2>
              <div className="space-y-4">
                <p className="text-gray-700 font-medium">
                  Recovery changes behavior.<br />
                  Repair requires acknowledgment, time, and choice.
                </p>
                <div className="bg-white p-4 rounded-lg border border-amber-300">
                  <p className="text-amber-800 font-semibold text-center">
                    Sobriety is not a reset button.<br />
                    It is the first condition for relational repair—not the completion of it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Sibling Relationships Are Often the Most Fragile */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                Why Sibling Relationships Are Often the Most Fragile
              </h2>
              <p className="text-gray-700 mb-4">Sibling relationships often carry:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Long memories
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Unequal attention histories
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Childhood role adaptations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Loyalty conflicts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Unresolved anger
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Pressure to "be supportive"
                </li>
              </ul>
              <p className="text-gray-700 mt-4 italic">
                Unlike parents or partners, siblings rarely chose involvement—and often had no power during the most damaging years.
              </p>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="mb-8 border-red-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes Families Make During Early Recovery</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-red-800 mb-2">1. Expecting Gratitude or Immediate Closeness</h3>
                  <p className="text-gray-700 mb-2">Siblings may:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Still feel hurt</li>
                    <li>• Need distance</li>
                    <li>• Feel wary of change</li>
                    <li>• Not trust words yet</li>
                  </ul>
                  <p className="text-red-700 font-medium mt-2 italic">
                    This is not punishment. It is self-protection.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-red-800 mb-2">2. Pressuring Forgiveness</h3>
                  <p className="text-gray-700 mb-2">Forgiveness:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Cannot be rushed</li>
                    <li>• Cannot be demanded</li>
                    <li>• Cannot be used as proof of healing</li>
                  </ul>
                  <p className="text-red-700 font-medium mt-2 italic">
                    Forced forgiveness often deepens resentment and emotional withdrawal.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-red-800 mb-2">3. Using Recovery as Moral Leverage</h3>
                  <p className="text-gray-700 mb-2">Statements like:</p>
                  <ul className="space-y-1 text-gray-700 ml-4 italic">
                    <li>• "They're sober now—you should be proud."</li>
                    <li>• "They're trying—can't you let it go?"</li>
                    <li>• "This is hard for them too."</li>
                  </ul>
                  <p className="text-red-700 font-medium mt-2 italic">
                    These invalidate sibling experience and reinforce old patterns of minimization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Siblings Actually Need */}
          <Card className="mb-8 border-green-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                What Siblings Actually Need to Feel Safe Rebuilding
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">1. Consistent Behavior Over Time</h3>
                  <p className="text-gray-700 mb-2">Words matter less than:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Reliability
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Accountability
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Respect for boundaries
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Emotional regulation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Absence of crisis
                    </li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">
                    Trust is rebuilt through pattern, not intention.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">2. Acknowledgment Without Defense</h3>
                  <p className="text-gray-700 mb-2">Meaningful repair begins when the recovering sibling can say:</p>
                  <ul className="space-y-1 text-gray-700 ml-4 italic">
                    <li>• "I hurt you."</li>
                    <li>• "You lost things because of me."</li>
                    <li>• "You didn't deserve that."</li>
                    <li>• "I don't expect anything from you."</li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2">
                    Not explanations. Not justifications. Not comparisons.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-2">3. Space to Choose the Pace</h3>
                  <p className="text-gray-700 mb-2">Siblings need permission to:</p>
                  <ul className="space-y-1 text-gray-700 ml-4">
                    <li>• Move slowly</li>
                    <li>• Stay distant</li>
                    <li>• Limit contact</li>
                    <li>• Define what feels safe</li>
                    <li>• Change their mind over time</li>
                  </ul>
                  <p className="text-green-700 font-medium mt-2 italic">
                    Choice restores agency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Role of Parents */}
          <Card className="mb-8 border-blue-200 bg-blue-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                The Role of Parents (This Is Critical)
              </h2>
              <p className="text-gray-700 mb-4">
                Parents can either support repair or unintentionally block it.
              </p>
              <p className="text-gray-700 mb-2 font-medium">Helpful parent behaviors include:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  Naming the impact on all children—not just the one in recovery
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  Avoiding pressure for unity
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  Refusing to triangulate
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  Respecting sibling boundaries
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  Letting relationships evolve organically
                </li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-semibold text-center">
                  Parents do not need to fix sibling relationships.<br />
                  They need to stop controlling the outcome.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What Rebuilding Actually Looks Like */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-purple-600" />
                What Rebuilding Actually Looks Like (In Reality)
              </h2>
              <p className="text-gray-700 mb-4">Rebuilding may involve:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Neutral contact before emotional closeness
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Practical trust before vulnerability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Clear boundaries before openness
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Separate relationships with parents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Long stretches of quiet consistency
                </li>
              </ul>
              <p className="text-purple-700 font-medium italic">
                Repair is often quiet—not dramatic.
              </p>
            </CardContent>
          </Card>

          {/* Signs of Healthy Direction */}
          <Card className="mb-8 border-green-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Signs a Sibling Relationship Is Moving in a Healthy Direction</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Less hypervigilance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Fewer emotional spikes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Increased predictability
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Respect for "no"
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  No pressure to perform closeness
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Emotional honesty without collapse
                </li>
              </ul>
              <p className="text-green-700 font-semibold mt-4">
                Closeness is optional. Safety is not.
              </p>
            </CardContent>
          </Card>

          {/* When Distance Is Still the Healthiest Choice */}
          <Card className="mb-8 border-gray-300 bg-gray-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">When Distance Is Still the Healthiest Choice</h2>
              <p className="text-gray-700 mb-4">In some cases, siblings may decide:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  Limited contact is best
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  No contact is necessary (temporarily or long-term)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  Relationship repair isn't possible yet
                </li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-gray-300">
                <p className="text-gray-800 font-medium text-center">
                  This is not failure. It is discernment.
                </p>
                <p className="text-gray-700 text-center mt-2 italic">
                  Recovery includes respecting the impact—not insisting on reconciliation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reflection Questions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-purple-200 print:border print:shadow-none">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                  Reflection Questions for Siblings
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    What would make contact feel safer right now?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    What behaviors matter most to me—not words?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    What boundaries protect my well-being?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    What pace feels honest—not pressured?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    What do I need that I've never been asked?
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 print:border print:shadow-none">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Reflection Questions for the Recovering Sibling
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Am I seeking relief from guilt—or offering repair?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Can I tolerate distance without defensiveness?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Am I respecting boundaries consistently?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Am I willing to listen without explaining?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Am I prepared to accept any outcome?
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* A Grounding Reframe */}
          <Card className="mb-8 border-purple-300 bg-purple-100 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Grounding Reframe</h2>
              <p className="text-purple-800 text-lg font-medium">
                Rebuilding sibling relationships is not about restoring the past.<br />
                It is about deciding—carefully—what kind of relationship is possible now.
              </p>
              <p className="text-purple-700 mt-4 font-semibold">
                That decision belongs to each sibling individually.
              </p>
            </CardContent>
          </Card>

          {/* Final Thought */}
          <Card className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white print:bg-gray-100 print:text-gray-900">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Final Thought</h2>
              <p className="text-lg mb-4">
                Recovery opens the door.<br />
                It does not dictate what happens next.
              </p>
              <p className="mb-4">
                Sibling relationships heal when:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Safety replaces urgency</li>
                <li>• Choice replaces pressure</li>
                <li>• Accountability replaces apology</li>
                <li>• Time replaces expectation</li>
              </ul>
              <p className="text-xl font-semibold">
                Repair happens when siblings feel seen—not managed.
              </p>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggested Companion Resources</h2>
              <div className="grid gap-3">
                <Link to="/sibling-experience" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                  → The Sibling Experience in Addiction
                </Link>
                <Link to="/sibling-guilt-anger-loyalty" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                  → Sibling Guilt, Anger, and Loyalty Conflicts
                </Link>
                <Link to="/growing-up-shadow" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                  → Growing Up in the Shadow of Addiction
                </Link>
                <Link to="/how-trauma-shapes-addiction" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                  → Family Trauma & Hypervigilance Self-Assessment
                </Link>
                <Link to="/living-well-regardless" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                  → Living Well Regardless of Outcome
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center print:hidden">
            <Link to="/family-education">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Family Education
              </Button>
            </Link>
          </div>
        </div>
      </div>
    
          <RelatedResources currentPath="/rebuilding-sibling-relationships" />
</Layout>
  );
};

export default RebuildingSiblingRelationships;
