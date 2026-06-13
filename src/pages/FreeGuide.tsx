import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Printer, BookOpen, Heart, Shield, Users, Brain, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const FreeGuide = () => {
  const [searchParams] = useSearchParams();
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    // Check if user came from lead magnet signup or has access token
    const accessGranted = searchParams.get("access") === "granted" || 
                          localStorage.getItem("leadMagnetDismissed") === "true";
    setCanAccess(accessGranted);
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  if (!canAccess) {
    return (
      <>
        <SEOHead
          title="Free Guide - 5 Things Families Wish They Knew | Sober Helpline"
          description="Get our free guide on what every family wishes they knew sooner about addiction."
        />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">Access Required</h1>
              <p className="text-muted-foreground mb-6">
                Share your email and we'll send you straight to the guide.
              </p>
              <Link to="/">
                <Button>Go to Homepage</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Free Guide - 5 Things Families Wish They Knew | Sober Helpline"
        description="What every family wishes they knew sooner about addiction. A practical guide for families navigating a loved one's substance use."
      />
      
      {/* Print-friendly styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { font-size: 12pt; }
          .print-container { max-width: 100% !important; padding: 0 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-background">
        {/* Header - No Print */}
        <div className="no-print sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print / Save PDF</span>
                <span className="sm:hidden">Print</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Guide Content */}
        <div className="print-container container mx-auto px-4 py-8 md:py-12 max-w-3xl">
          {/* Cover */}
          <div className="text-center mb-12 pb-12 border-b">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Free Family Resource
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              5 Things Every Family Wishes They Knew Sooner About Addiction
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A practical guide for families trying to get clearer, steadier, and less reactive
            </p>
            <div className="mt-8 text-sm text-muted-foreground">
              From Sober Helpline • soberhelpline.com
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed">
              If you're reading this, you're probably tired, confused, and wondering how things got this far. 
              You've likely tried pleading, reasoning, threatening, rescuing, and second-guessing yourself the whole time. 
              You're not alone, and this is not a sign that you have failed.
            </p>
            <p className="text-lg leading-relaxed">
              This guide shares five lessons families usually learn the hard way. They will not solve everything overnight, 
              but they can help you stop spinning and start making calmer, clearer decisions.
            </p>
          </div>

          {/* Thing 1 */}
          <Card className="mb-8 border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">You Didn't Cause It, You Can't Cure It, and You Can't Control It</h2>
                  <p className="text-muted-foreground mb-4">
                    This is one of the most important truths a family can learn. Addiction is not the result of bad parenting, 
                    not enough love, or one wrong move you made. A lot of forces shape it, and not all of them are in your control.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">What this means practically:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Stop searching for what you did wrong—it's not productive</li>
                      <li>• Release yourself from the pressure to "fix" them</li>
                      <li>• Focus on what you <em>can</em> control: your own responses, boundaries, and wellbeing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thing 2 */}
          <Card className="mb-8 border-l-4 border-l-logo-green print-break">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-logo-green/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-logo-blue">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Love Is Not Enough—And That's Okay</h2>
                  <p className="text-muted-foreground mb-4">
                    You can love someone with every fiber of your being and still not be able to save them. 
                    This is perhaps the most painful truth families face. Love is necessary, but it's not 
                    sufficient for recovery. Your loved one needs professional help, time, and their own 
                    internal motivation to change.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">The shift in thinking:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• From: "If I just loved them more/better, they'd change"</li>
                      <li>• To: "My love is constant, AND they need more than I can give"</li>
                      <li>• This isn't giving up—it's acknowledging reality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thing 3 */}
          <Card className="mb-8 border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-amber-600">3</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Helping Often Hurts—And It's Hard to Tell the Difference</h2>
                  <p className="text-muted-foreground mb-4">
                    Many well-intentioned actions that feel like helping actually make things worse. This is 
                    called "enabling"—when your help removes the natural consequences that might otherwise 
                    motivate change. The hardest part? Enabling often feels like love.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium mb-2">Common enabling behaviors (that feel like helping):</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Paying bills, rent, or debts to prevent consequences</li>
                      <li>• Making excuses to employers, family, or friends</li>
                      <li>• Bailing them out of legal trouble</li>
                      <li>• Giving money "for food" that becomes drug money</li>
                      <li>• Letting them live at home with no expectations</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>A better question:</strong> "Does this actually help, or does it only help me feel less panicked for the next hour?"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thing 4 */}
          <Card className="mb-8 border-l-4 border-l-blue-500 print-break">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Your Recovery Matters Just as Much as Theirs</h2>
                  <p className="text-muted-foreground mb-4">
                    Living with addiction in the family changes you. The stress, broken promises, vigilance, and chaos take a real toll. 
                    You may have started living in reaction mode, neglecting your own needs, and confusing constant worry with love.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">What family recovery looks like:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Attending support groups (Al-Anon, Nar-Anon, SMART Recovery Family)</li>
                      <li>• Working with a therapist who understands addiction</li>
                      <li>• Rebuilding your own identity outside of their addiction</li>
                      <li>• Reconnecting with activities and people you've neglected</li>
                      <li>• Learning to feel joy again, even while they're still struggling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thing 5 */}
          <Card className="mb-12 border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-purple-600">5</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Recovery Is Possible—But It Rarely Looks Like You Expect</h2>
                  <p className="text-muted-foreground mb-4">
                    People do recover from addiction. Every single day, people who seemed hopeless find 
                    their way to lasting recovery. But the path is rarely straight, and it usually takes 
                    longer than families hope. Multiple treatment attempts are common, not failure.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium mb-2">What recovery often looks like:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Multiple treatment attempts before something "sticks"</li>
                      <li>• Relapses that become learning experiences</li>
                      <li>• Slow, gradual progress rather than dramatic transformation</li>
                      <li>• Changes that start small and build over time</li>
                      <li>• A different timeline than you imagined</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Hold onto hope, but keep both feet on the ground.</strong> Recovery is possible, and your 
                    loved one's story is not over. But hope should not require you to abandon your own life in the meantime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Closing */}
          <div className="bg-gradient-to-br from-logo-blue/5 via-logo-blue/10 to-logo-blue/5 rounded-2xl p-8 mb-12 print-break">
            <h2 className="text-2xl font-bold text-center mb-4">What Now?</h2>
            <p className="text-center text-muted-foreground mb-6 max-w-xl mx-auto">
              Reading this guide is a solid first step. The next part is support, education, and people who can help you stay steady when things get messy.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Find Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with families who understand what you're going through
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-logo-green/10 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-logo-blue" />
                </div>
                <h3 className="font-semibold mb-1">Keep Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Understanding addiction helps you respond more effectively
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-1">Care for Yourself</h3>
                <p className="text-sm text-muted-foreground">
                  Your wellbeing matters—prioritize your own recovery
                </p>
              </div>
            </div>
          </div>

          {/* CTA - No Print */}
          <div className="no-print text-center border-t pt-12">
            <h3 className="text-xl font-bold mb-3">Ready for More Support?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              If you want more support, the family membership gives you the full curriculum, private forum, live webinars, and other tools you can actually use.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/family-membership">
                <Button size="lg" className="gap-2">
                  <Users className="w-4 h-4" />
                  Explore Membership
                </Button>
              </Link>
              <Link to="/family-education">
                <Button size="lg" variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Free Resources
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-12 pt-8 border-t">
            <p>© {new Date().getFullYear()} Sober Helpline. All rights reserved.</p>
            <p className="mt-1">soberhelpline.com</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeGuide;
