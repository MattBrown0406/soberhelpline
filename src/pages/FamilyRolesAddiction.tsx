import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Heart, Shield, Users, CheckCircle, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

const FamilyRolesAddiction = () => {
  useGuideTracking("Family Roles in Addiction", "/family-roles-addiction");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12 print:py-4 print:bg-white">
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
              Family Roles in Addiction (Beyond the Clichés)
            </h1>
            <p className="text-xl text-violet-700 font-medium">
              How Survival Strategies Form—and How Families Outgrow Them
            </p>
          </div>

          {/* Why This Guide Matters */}
          <Card className="mb-8 border-violet-200 bg-violet-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-violet-600" />
                Why This Guide Matters
              </h2>
              <p className="text-gray-700 mb-4">Many families have heard the classic roles:</p>
              <ul className="space-y-1 text-gray-700 mb-4 ml-4">
                <li>• The Hero</li>
                <li>• The Scapegoat</li>
                <li>• The Caretaker</li>
                <li>• The Mascot</li>
                <li>• The Lost Child</li>
              </ul>
              <p className="text-gray-700 mb-2">While these labels can be helpful, they often:</p>
              <ul className="space-y-1 text-gray-700 mb-4 ml-4">
                <li>• Oversimplify complex dynamics</li>
                <li>• Turn coping strategies into identities</li>
                <li>• Miss how roles change over time</li>
                <li>• Ignore the nervous system's role in survival</li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-violet-200">
                <p className="text-violet-800 font-semibold text-center">
                  Family roles are not personalities.<br />
                  They are adaptive responses to instability.
                </p>
              </div>
              <p className="text-gray-700 mt-4 italic">
                Understanding roles as strategies—not flaws—opens the door to change.
              </p>
            </CardContent>
          </Card>

          {/* A Core Reframe */}
          <Card className="mb-8 border-amber-200 bg-amber-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Core Reframe</h2>
              <p className="text-amber-800 font-bold text-lg mb-4">
                Roles form to keep the family functioning under stress.<br />
                They persist when stress never truly resolves.
              </p>
              <p className="text-gray-700 mb-2">In addiction-impacted systems:</p>
              <ul className="space-y-1 text-gray-700 mb-4 ml-4">
                <li>• Predictability disappears</li>
                <li>• Emotional safety is inconsistent</li>
                <li>• Crisis becomes normal</li>
                <li>• Someone adapts to fill the gaps</li>
              </ul>
              <p className="text-amber-700 font-medium italic">
                Roles are solutions—until they become limitations.
              </p>
            </CardContent>
          </Card>

          {/* How Roles Actually Form */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How Roles Actually Form</h2>
              <p className="text-gray-700 mb-4">Roles develop when:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Someone notices what reduces chaos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  A behavior is reinforced (praised, relied upon, or left alone)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Emotional expression feels unsafe
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Needs compete for limited attention
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Survival requires specialization
                </li>
              </ul>
              <p className="text-violet-700 font-medium mt-4 italic">
                Once a role works, it sticks.
              </p>
            </CardContent>
          </Card>

          {/* The Common Roles—Reframed */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-violet-600" />
            The Common Roles—Reframed
          </h2>

          {/* Role 1: The Stabilizer */}
          <Card className="mb-6 border-blue-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">1. The Stabilizer <span className="font-normal text-gray-500">(Often Called "The Hero")</span></h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">What They Do</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Perform</li>
                    <li>• Achieve</li>
                    <li>• Stay competent</li>
                    <li>• Carry responsibility</li>
                    <li>• Keep the family image intact</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Why It Develops</h4>
                  <p className="text-gray-700 text-sm">Achievement creates predictability and relief.</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg mb-3">
                <h4 className="font-semibold text-red-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Burnout, conditional self-worth, difficulty resting or receiving help</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-green-700">Exit Path: </span>
                  <span className="text-gray-700 text-sm">Learning to value presence over performance and allow imperfection.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role 2: The Regulator */}
          <Card className="mb-6 border-pink-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-pink-800 mb-4">2. The Regulator <span className="font-normal text-gray-500">(Often Called "The Caretaker")</span></h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-pink-700 mb-2">What They Do</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Manage emotions</li>
                    <li>• Anticipate needs</li>
                    <li>• Smooth conflict</li>
                    <li>• Absorb distress</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Why It Develops</h4>
                  <p className="text-gray-700 text-sm">Emotional regulation becomes a survival task.</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg mb-3">
                <h4 className="font-semibold text-red-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Over-responsibility, guilt when setting boundaries, difficulty letting others struggle</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-green-700">Exit Path: </span>
                  <span className="text-gray-700 text-sm">Returning emotional responsibility to its rightful owner.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role 3: The Pressure Valve */}
          <Card className="mb-6 border-amber-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-4">3. The Pressure Valve <span className="font-normal text-gray-500">(Often Called "The Mascot")</span></h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-700 mb-2">What They Do</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Use humor</li>
                    <li>• Distract</li>
                    <li>• Lighten tension</li>
                    <li>• Avoid seriousness</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Why It Develops</h4>
                  <p className="text-gray-700 text-sm">Reducing emotional intensity feels protective.</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg mb-3">
                <h4 className="font-semibold text-red-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Avoidance of depth, fear of conflict, emotional minimization</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-green-700">Exit Path: </span>
                  <span className="text-gray-700 text-sm">Learning that presence—not performance—creates connection.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role 4: The Discharger */}
          <Card className="mb-6 border-red-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4">4. The Discharger <span className="font-normal text-gray-500">(Often Called "The Scapegoat")</span></h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">What They Do</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Act out</li>
                    <li>• Draw attention</li>
                    <li>• Express anger openly</li>
                    <li>• Externalize family stress</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Why It Develops</h4>
                  <p className="text-gray-700 text-sm">Someone must carry what others can't express.</p>
                </div>
              </div>
              
              <div className="bg-red-100 p-3 rounded-lg mb-3">
                <h4 className="font-semibold text-red-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Shame, identity as "the problem," over-identification with blame</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-green-700">Exit Path: </span>
                  <span className="text-gray-700 text-sm">Separating expression from punishment and reclaiming complexity.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role 5: The Minimizer */}
          <Card className="mb-8 border-gray-300 print:border print:shadow-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-700 mb-4">5. The Minimizer <span className="font-normal text-gray-500">(Often Called "The Lost Child")</span></h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-600 mb-2">What They Do</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Stay quiet</li>
                    <li>• Reduce needs</li>
                    <li>• Avoid conflict</li>
                    <li>• Stay invisible</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Why It Develops</h4>
                  <p className="text-gray-700 text-sm">Invisibility feels safer than competition.</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg mb-3">
                <h4 className="font-semibold text-red-700 mb-1">Hidden Cost</h4>
                <p className="text-gray-700 text-sm">Difficulty asserting needs, emotional disconnection, fear of taking up space</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-green-700">Exit Path: </span>
                  <span className="text-gray-700 text-sm">Gradually reclaiming voice, needs, and visibility.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles Are Fluid */}
          <Card className="mb-8 border-violet-200 bg-violet-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Roles Are Fluid—Not Fixed</h2>
              <p className="text-gray-700 mb-4">Important truths:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                  People move between roles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                  One person may hold multiple roles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                  Roles shift with stress levels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                  Roles intensify during crisis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                  Roles can dissolve with stability
                </li>
              </ul>
              <p className="text-violet-700 font-semibold mt-4">
                No one is "just" one role.
              </p>
            </CardContent>
          </Card>

          {/* How Roles Maintain the Addiction System */}
          <Card className="mb-8 border-red-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                How Roles Maintain the Addiction System
              </h2>
              <p className="text-gray-700 mb-4">Roles unintentionally:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Absorb consequences
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Reduce pressure for change
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Stabilize chaos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Keep the system predictable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Delay restructuring
                </li>
              </ul>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 font-semibold text-center">
                  Addiction doesn't just survive in families.<br />
                  It adapts to them.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Why Families Resist Letting Roles Go */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Families Resist Letting Roles Go</h2>
              <p className="text-gray-700 mb-4">Letting go feels risky because:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Roles provide identity
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Roles create safety
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Roles earn approval
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  Roles prevent collapse (or seem to)
                </li>
              </ul>
              <p className="text-violet-700 font-medium italic">
                But roles that once saved the family can later block healing.
              </p>
            </CardContent>
          </Card>

          {/* How Roles Begin to Loosen */}
          <Card className="mb-8 border-green-200 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                How Roles Begin to Loosen
              </h2>
              <p className="text-gray-700 mb-4">Roles loosen when families:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Reduce crisis reactivity
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Establish clear boundaries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Allow discomfort without rescue
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Share responsibility
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Name dynamics without blame
                </li>
              </ul>
              <p className="text-green-700 font-medium italic">
                Change starts with awareness—not confrontation.
              </p>
            </CardContent>
          </Card>

          {/* What Role Exit Looks Like */}
          <Card className="mb-8 border-emerald-200 bg-emerald-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Role Exit Looks Like (Practically)</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>The Stabilizer</strong> rests without apologizing</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>The Regulator</strong> stops fixing emotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>The Pressure Valve</strong> allows seriousness</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>The Discharger</strong> is heard without being blamed</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>The Minimizer</strong> practices taking up space</span>
                </li>
              </ul>
              <p className="text-emerald-700 font-semibold mt-4">
                Small shifts compound.
              </p>
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
                  What role did I take on to survive?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What did that role protect me from?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What is it costing me now?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  When do I slip back into it?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  What would balance look like instead?
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* For Parents: A Key Insight */}
          <Card className="mb-8 border-blue-200 bg-blue-50 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">For Parents: A Key Insight</h2>
              <p className="text-blue-800 font-semibold text-lg mb-4">
                Children don't choose roles.<br />
                They step into what the system rewards or requires.
              </p>
              <p className="text-gray-700 mb-2">Repair begins when parents:</p>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Name roles compassionately
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Stop relying on them
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Allow children to change without guilt
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* A Grounding Reframe */}
          <Card className="mb-8 border-violet-300 bg-violet-100 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">A Grounding Reframe</h2>
              <p className="text-violet-800 text-lg font-medium mb-2">
                Roles are not who you are.<br />
                They are what you learned to do.
              </p>
              <p className="text-violet-700 font-semibold">
                You are allowed to outgrow them.
              </p>
            </CardContent>
          </Card>

          {/* Final Thought */}
          <Card className="mb-8 bg-gradient-to-r from-violet-600 to-purple-600 text-white print:bg-gray-100 print:text-gray-900">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Final Thought</h2>
              <p className="text-lg mb-4">
                Families heal not by erasing the past—but by updating the strategies that once kept them alive.
              </p>
              <p className="mb-2">When roles soften:</p>
              <ul className="space-y-1 mb-6 ml-4">
                <li>• Authenticity increases</li>
                <li>• Pressure decreases</li>
                <li>• Relationships rebalance</li>
                <li>• Recovery has room to grow</li>
              </ul>
              <p className="text-xl font-semibold">
                Freedom comes when families stop performing survival—and start practicing safety.
              </p>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <Card className="mb-8 print:border print:shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggested Companion Resources</h2>
              <div className="grid gap-3">
                <Link to="/strong-one" className="text-violet-600 hover:text-violet-800 hover:underline flex items-center gap-2">
                  → The Hidden Cost of Being the "Strong One"
                </Link>
                <Link to="/guilt-relief-resentment" className="text-violet-600 hover:text-violet-800 hover:underline flex items-center gap-2">
                  → The Guilt–Relief–Resentment Cycle
                </Link>
                <Link to="/parents-repairing-sibling-system" className="text-violet-600 hover:text-violet-800 hover:underline flex items-center gap-2">
                  → Parents: Repairing the Sibling System
                </Link>
                <Link to="/trauma-hypervigilance-assessment" className="text-violet-600 hover:text-violet-800 hover:underline flex items-center gap-2">
                  → Family Trauma & Hypervigilance Self-Assessment
                </Link>
                <Link to="/living-well-regardless" className="text-violet-600 hover:text-violet-800 hover:underline flex items-center gap-2">
                  → Living Well Regardless of Outcome
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center print:hidden">
            <Link to="/family-education">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Family Education
              </Button>
            </Link>
          </div>
        </div>
      </div>
    
          <RelatedResources currentPath="/family-roles-addiction" />
</Layout>
  );
};

export default FamilyRolesAddiction;
