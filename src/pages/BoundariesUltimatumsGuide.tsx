import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle, Target, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function BoundariesUltimatumsGuide() {
  useGuideTracking("Requests, Demands, Ultimatums & Boundaries", "/boundaries-ultimatums-guide");
  return (
    <>
      <Helmet>
        <title>Requests, Demands, Ultimatums & Boundaries | Sober Helpline</title>
        <meta name="description" content="Advanced application guide for families impacted by addiction. Learn when and how to use requests, demands, ultimatums, and boundaries effectively." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
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
            <Link
              to="/family-education"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Education
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-10 w-10 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green">
                  Requests, Demands, Ultimatums & Boundaries
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Advanced Application for Families Impacted by Addiction
              </p>
            </div>

            {/* Why Families Need an Advanced Guide */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Why Families Need an Advanced Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Most families can define these terms. What they struggle with is:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Using them <strong>consistently</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Holding them <strong>without guilt</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Knowing <strong>which tool fits which situation</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Responding when <strong>emotions escalate</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Avoiding <strong>power struggles</strong></span>
                  </li>
                </ul>
                <p className="text-muted-foreground italic">
                  This guide focuses on application, timing, and nervous-system awareness—not just language.
                </p>
              </CardContent>
            </Card>

            {/* The Core Principle */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  The Core Principle (Advanced Level)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background p-4 rounded-lg border-l-4 border-amber-500">
                  <p className="text-lg font-medium">
                    Requests and demands rely on <strong>the other person's capacity</strong>.
                  </p>
                  <p className="text-lg font-medium mt-2">
                    Boundaries rely on <strong>your behavior</strong>.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  In active addiction, capacity is unreliable.
                </p>
                <p className="text-muted-foreground">This is why:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Requests often fail</li>
                  <li>• Demands escalate conflict</li>
                  <li>• Ultimatums collapse</li>
                  <li>• Boundaries—when applied correctly—work</li>
                </ul>
              </CardContent>
            </Card>

            {/* Comparison Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Quick High-Level Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Tool</TableHead>
                        <TableHead className="font-semibold">Who Controls the Outcome</TableHead>
                        <TableHead className="font-semibold">Works Best When</TableHead>
                        <TableHead className="font-semibold">Common Failure</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Request</TableCell>
                        <TableCell>Them</TableCell>
                        <TableCell>Stable relationships</TableCell>
                        <TableCell>Ignored</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Demand</TableCell>
                        <TableCell>You (force-based)</TableCell>
                        <TableCell>Short-term compliance</TableCell>
                        <TableCell>Power struggles</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Ultimatum</TableCell>
                        <TableCell>Conditional you/them</TableCell>
                        <TableCell>Real leverage exists</TableCell>
                        <TableCell>Not enforced</TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/5">
                        <TableCell className="font-medium">Boundary</TableCell>
                        <TableCell>You</TableCell>
                        <TableCell>Any stage</TableCell>
                        <TableCell>Inconsistency</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* 1. Requests */}
            <Card className="mb-8">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/30 rounded-t-lg">
                <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
                  1. Requests (When & How They Still Matter)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Requests Are</h4>
                  <p className="text-muted-foreground">Requests ask for change without consequence.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">When Requests Still Work</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li>• The person is sober or stable</li>
                    <li>• Trust is intact</li>
                    <li>• Capacity exists</li>
                    <li>• The issue is low-stakes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Why Requests Fail in Addiction</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li>• Craving overrides logic</li>
                    <li>• Stress reduces capacity</li>
                    <li>• Promises feel sincere—but collapse</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-700 dark:text-blue-400">Advanced Insight</p>
                  <p className="text-muted-foreground mt-1">
                    Repeating the same request after it's been ignored is not communication—it's hope-based bargaining.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Demands */}
            <Card className="mb-8">
              <CardHeader className="bg-orange-50 dark:bg-orange-950/30 rounded-t-lg">
                <CardTitle className="text-xl text-orange-700 dark:text-orange-400">
                  2. Demands (Why They Backfire Long-Term)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Demands Are</h4>
                  <p className="text-muted-foreground">Demands attempt to control behavior through pressure, fear, or authority.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">When Families Use Them</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li>• After repeated boundary violations</li>
                    <li>• When fear escalates</li>
                    <li>• When patience is exhausted</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Why Demands Fail</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li>• Increase defiance or secrecy</li>
                    <li>• Trigger shame and resistance</li>
                    <li>• Create compliance without change</li>
                    <li>• Escalate emotional volatility</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-orange-700 dark:text-orange-400">Advanced Insight</p>
                  <p className="text-muted-foreground mt-1">
                    Demands often feel strong—but they outsource regulation to force instead of structure.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Ultimatums */}
            <Card className="mb-8">
              <CardHeader className="bg-red-50 dark:bg-red-950/30 rounded-t-lg">
                <CardTitle className="text-xl text-red-700 dark:text-red-400">
                  3. Ultimatums (The Most Misused Tool)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Ultimatums Are</h4>
                  <p className="text-muted-foreground">Conditional statements with consequences.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Why Ultimatums Fail</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li>• Families aren't ready to enforce them</li>
                    <li>• They're delivered emotionally</li>
                    <li>• Consequences aren't realistic</li>
                    <li>• They're used as leverage—not policy</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">When Ultimatums Can Work</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li>• Consequences are planned in advance</li>
                    <li>• Everyone is aligned</li>
                    <li>• The family is emotionally regulated</li>
                    <li>• The outcome is acceptable either way</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="font-medium text-red-700 dark:text-red-400">Advanced Insight</p>
                  <p className="text-muted-foreground mt-1">
                    An unenforced ultimatum is not neutral—it teaches boundaries are negotiable.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 4. Boundaries */}
            <Card className="mb-8 border-2 border-emerald-500/50">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 rounded-t-lg">
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400">
                  4. Boundaries (The Most Misunderstood Tool)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Boundaries Actually Are</h4>
                  <p className="text-muted-foreground mb-3">
                    Boundaries are decisions about <strong>what you will do</strong> in response to behavior.
                  </p>
                  <p className="text-muted-foreground mb-2">They are:</p>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Predictable
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Behavior-based
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Non-punitive
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      About protection—not control
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Boundaries Are Not</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Threats
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Emotional reactions
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Attempts to change someone else
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Punishment
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">The Advanced Boundary Formula</h4>
                  <p className="text-lg font-medium text-center mb-4">
                    Behavior + Response + Consistency
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Example:</strong></p>
                    <ul className="space-y-1 ml-6">
                      <li>• "If you're using, I won't provide money."</li>
                      <li>• "If yelling starts, I'll leave the conversation."</li>
                      <li>• "If treatment is refused, housing changes."</li>
                    </ul>
                    <p className="mt-3 italic">No debate. No emotion. No escalation.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Why Boundaries Feel So Hard to Hold</h4>
                  <ul className="space-y-1 ml-6 text-muted-foreground">
                    <li>• Guilt</li>
                    <li>• Fear of abandonment</li>
                    <li>• Fear of escalation</li>
                    <li>• Hope after promises</li>
                    <li>• Trauma-driven hypervigilance</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border-l-4 border-emerald-500">
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">Key Insight</p>
                  <p className="text-muted-foreground mt-1">
                    Boundaries fail when families regulate the other person instead of themselves.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Application */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Advanced Application: Matching Tool to Situation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="font-semibold">Situation: Emotional Manipulation</p>
                    <p className="text-muted-foreground">
                      <strong>Best Tool:</strong> Boundary<br />
                      <strong>Why:</strong> Requests invite debate. Demands escalate.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="font-semibold">Situation: Immediate Safety Risk</p>
                    <p className="text-muted-foreground">
                      <strong>Best Tool:</strong> External authority + boundary<br />
                      <strong>Why:</strong> This exceeds family capacity.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="font-semibold">Situation: Repeated Broken Promises</p>
                    <p className="text-muted-foreground">
                      <strong>Best Tool:</strong> Boundary + reduced access<br />
                      <strong>Why:</strong> Insight isn't enough.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="font-semibold">Situation: Early Recovery Stability</p>
                    <p className="text-muted-foreground">
                      <strong>Best Tool:</strong> Requests + boundaries<br />
                      <strong>Why:</strong> Capacity is growing but fragile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  What to Expect When Boundaries Are Working
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• Increased emotional reactions initially</li>
                  <li>• Attempts to negotiate or guilt</li>
                  <li>• Accusations of being "cold" or "uncaring"</li>
                  <li>• Temporary escalation</li>
                </ul>
                <div className="mt-4 p-4 bg-background rounded-lg border">
                  <p className="font-semibold text-foreground">
                    This is not failure. It is system adjustment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Family Nervous System Factor */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  The Family Nervous System Factor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">Boundaries Fail When Families:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Speak from fear
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Escalate emotionally
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Over-explain
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Seek validation
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">Boundaries Work When Families:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Stay regulated
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Keep language simple
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Repeat without justification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Follow through calmly
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Reframe */}
            <Card className="mb-8 border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Critical Reframe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  Boundaries are not about getting someone to change.<br />
                  They are about creating conditions where change becomes possible—and protecting yourself if it doesn't.
                </p>
              </CardContent>
            </Card>

            {/* Reflection Questions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Advanced Reflection Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                  <li>Which tool do we overuse?</li>
                  <li>Where do we collapse boundaries emotionally?</li>
                  <li>What consequence are we afraid to allow?</li>
                  <li>Are we asking for change—or planning for reality?</li>
                  <li>What would consistency look like for 30 days?</li>
                </ol>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-300 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-700 dark:text-slate-300">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families don't struggle with boundaries because they don't care enough.
                  They struggle because they care deeply and are afraid of what will happen if they stop managing outcomes.
                </p>
                <div className="p-4 bg-background rounded-lg border-l-4 border-primary">
                  <p className="text-foreground font-medium">
                    Boundaries are not withdrawal of love.<br />
                    They are the container that allows love to survive chaos.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Suggested Companion Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Boundary Setting Worksheet
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Enabling Self-Assessment
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Guilt vs. Responsibility Module
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Trauma & Hypervigilance Assessment
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      What I Can Control Today (Guided Meditation)
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link to="/family-education">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Family Education
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
