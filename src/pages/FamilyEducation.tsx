import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Video, Lock, Loader2, FileText, Headphones, Users, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import ControlWorksheet from "@/components/ControlWorksheet";
import BoundaryWorksheet from "@/components/BoundaryWorksheet";
import ScenarioWorksheet from "@/components/ScenarioWorksheet";
import EnablingDecisionTree from "@/components/EnablingDecisionTree";
import GuiltResponsibilityWorksheet from "@/components/GuiltResponsibilityWorksheet";
import SelfCareWorksheet from "@/components/SelfCareWorksheet";


export default function FamilyVideos() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkMembership = async () => {
      if (!user) {
        setHasMembership(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('provider_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null)
          .limit(1);

        if (error) {
          console.error('Error checking membership:', error);
          setHasMembership(false);
        } else {
          setHasMembership(data && data.length > 0);
        }
      } catch (err) {
        console.error('Membership check failed:', err);
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [user]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasMembership) {
    return (
      <>
        <Helmet>
          <title>Family Education Videos | Sober Helpline</title>
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
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-2xl">Members Only Content</CardTitle>
                <CardDescription>
                  This content is exclusive to family support members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join our family support membership for just $10/month to access our library of educational videos.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/family-membership">
                    <Button className="w-full">Become a Member</Button>
                  </Link>
                  <Link to="/family-support">
                    <Button variant="outline" className="w-full">Back to Family Support</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Family Education Videos | Sober Helpline</title>
        <meta name="description" content="Educational videos for families supporting loved ones through addiction and recovery." />
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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/family-support"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Support
              </Link>
              <Link to="/family-forum">
                <Button variant="outline" size="sm" className="gap-2 border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                  <Users className="h-4 w-4" />
                  Family Forum
                </Button>
              </Link>
              <Link to="/family-webinars">
                <Button variant="outline" size="sm" className="gap-2 border-purple-500/50 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30">
                  <Calendar className="h-4 w-4" />
                  Monthly Webinar
                </Button>
              </Link>
            </div>

            <div className="text-center mb-8">
              <Video className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Family Education Resources
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Expert-led video courses to help you understand addiction and support your loved one's recovery.
              </p>
            </div>

            {/* The Six Pillars Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-logo-green text-center mb-6">The Six Pillars</h2>
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-3 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</span>
                  <p className="text-foreground whitespace-nowrap">Understanding Addiction (Foundational)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">4</span>
                  <p className="text-foreground whitespace-nowrap">Treatment Literacy</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</span>
                  <p className="text-foreground whitespace-nowrap">Understanding Mental Health & Dual Diagnosis</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">5</span>
                  <p className="text-foreground whitespace-nowrap">Boundaries, Consequences, and Change</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</span>
                  <p className="text-foreground whitespace-nowrap">Understanding Family Systems and Enabling</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">6</span>
                  <p className="text-foreground whitespace-nowrap">Family Recovery</p>
                </div>
              </div>
            </div>

            {/* Enabling vs Helping Decision Tree */}
            <div className="mb-10">
              <EnablingDecisionTree />
            </div>

            {/* Self-Assessment */}
            {user && <FamilySelfAssessment user={user} />}

            {/* Control Worksheet */}
            {user && <ControlWorksheet user={user} />}

            {/* Boundary Worksheet */}
            {user && <BoundaryWorksheet user={user} />}

            {/* Scenario Worksheet */}
            {user && <ScenarioWorksheet user={user} />}

            {/* Guilt vs Responsibility Worksheet */}
            {user && <GuiltResponsibilityWorksheet user={user} />}

            {/* Self-Care Worksheet */}
            {user && <SelfCareWorksheet user={user} />}

            {/* Relapse Warning Signs Tracker */}
            <div className="mb-10 p-6 bg-muted/30 rounded-lg border">
              <h3 className="text-lg font-semibold text-logo-green mb-3">Relapse Warning Signs Tracker</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Return to active use is the end of a process that often begins days or weeks before the substance is used. This interactive tracker helps you identify emotional, behavioral, and cognitive warning signs early—when intervention is most effective.
              </p>
              <Link to="/relapse-warning-signs">
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Open Warning Signs Tracker
                </Button>
              </Link>
            </div>

            {/* Printable Resources */}
            <div className="mb-10 p-6 bg-muted/30 rounded-lg border">
              <h3 className="text-lg font-semibold text-logo-green mb-3">Printable Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download and print these guides to use when evaluating treatment options and supporting recovery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/treatment-questions">
                  <Button variant="outline" className="gap-2 border-blue-500/50 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30">
                    <FileText className="h-4 w-4" />
                    40 Questions to Ask a Treatment Center
                  </Button>
                </Link>
                <Link to="/recovery-requirements">
                  <Button variant="outline" className="gap-2 border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                    <FileText className="h-4 w-4" />
                    What Recovery Requires From Families
                  </Button>
                </Link>
                <Link to="/family-action-plan">
                  <Button variant="outline" className="gap-2 border-purple-500/50 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30">
                    <FileText className="h-4 w-4" />
                    Family Recovery Action Plan
                  </Button>
                </Link>
                <Link to="/scenario-exercise">
                  <Button variant="outline" className="gap-2 border-orange-500/50 text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/30">
                    <FileText className="h-4 w-4" />
                    Scenario Practice Exercise
                  </Button>
                </Link>
                <Link to="/readiness-checklist">
                  <Button variant="outline" className="gap-2 border-teal-500/50 text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/30">
                    <FileText className="h-4 w-4" />
                    Readiness for Change Checklist
                  </Button>
                </Link>
                <Link to="/crisis-chaos">
                  <Button variant="outline" className="gap-2 border-red-500/50 text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                    <FileText className="h-4 w-4" />
                    Crisis vs. Chaos Decision Guide
                  </Button>
                </Link>
                <Link to="/emotional-regulation">
                  <Button variant="outline" className="gap-2 border-sky-500/50 text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/30">
                    <FileText className="h-4 w-4" />
                    Emotional Regulation Tools
                  </Button>
                </Link>
                <Link to="/values-exercise">
                  <Button variant="outline" className="gap-2 border-amber-500/50 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30">
                    <FileText className="h-4 w-4" />
                    Values Clarification Exercise
                  </Button>
                </Link>
                <Link to="/talking-about-treatment">
                  <Button variant="outline" className="gap-2 border-indigo-500/50 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30">
                    <FileText className="h-4 w-4" />
                    How to Talk About Treatment
                  </Button>
                </Link>
                <Link to="/communication-guide">
                  <Button variant="outline" className="gap-2 border-rose-500/50 text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30">
                    <FileText className="h-4 w-4" />
                    What to Say / What Not to Say
                  </Button>
                </Link>
                <Link to="/aftercare-checklist">
                  <Button variant="outline" className="gap-2 border-cyan-500/50 text-cyan-700 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/30">
                    <FileText className="h-4 w-4" />
                    Aftercare Readiness Checklist
                  </Button>
                </Link>
                <Link to="/why-change-doesnt-happen">
                  <Button variant="outline" className="gap-2 border-violet-500/50 text-violet-700 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950/30">
                    <FileText className="h-4 w-4" />
                    Why Change Doesn't Happen When Families Try Harder
                  </Button>
                </Link>
                <Link to="/treatment-red-flags">
                  <Button variant="outline" className="gap-2 border-red-600/50 text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                    <FileText className="h-4 w-4" />
                    Treatment Industry Red Flags Guide
                  </Button>
                </Link>
                <Link to="/family-advocacy-toolkit">
                  <Button variant="outline" className="gap-2 border-green-600/50 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30">
                    <FileText className="h-4 w-4" />
                    Family Advocacy Toolkit
                  </Button>
                </Link>
                <Link to="/treatment-industry-guide">
                  <Button variant="outline" className="gap-2 border-slate-600/50 text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-950/30">
                    <FileText className="h-4 w-4" />
                    How the Treatment Industry Works
                  </Button>
                </Link>
                <Link to="/drug-induced-psychosis">
                  <Button variant="outline" className="gap-2 border-fuchsia-600/50 text-fuchsia-700 hover:bg-fuchsia-50 dark:text-fuchsia-400 dark:hover:bg-fuchsia-950/30">
                    <FileText className="h-4 w-4" />
                    Understanding Drug-Induced Psychosis
                  </Button>
                </Link>
              </div>
            </div>

            {/* Guided Meditations */}
            <div className="mb-10 p-6 bg-muted/30 rounded-lg border">
              <h3 className="text-lg font-semibold text-logo-green mb-3 flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Guided Meditations
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Audio resources to help you stay grounded during difficult moments.
              </p>
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-rose-600 dark:text-rose-400">Loving Enough to Let Go, Trusting Enough to Hope</h4>
                    <a href="/audio/loving-enough-to-let-go-meditation.mp3" download className="shrink-0">
                      <Button variant="ghost" size="sm" className="gap-1 text-rose-600 hover:text-rose-700 dark:text-rose-400">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                  <audio controls className="w-full">
                    <source src="/audio/loving-enough-to-let-go-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sky-600 dark:text-sky-400">Regaining Calm When Addiction Triggers Fear and Urgency</h4>
                    <a href="/audio/regaining-calm-meditation.mp3" download className="shrink-0">
                      <Button variant="ghost" size="sm" className="gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                  <audio controls className="w-full">
                    <source src="/audio/regaining-calm-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-purple-600 dark:text-purple-400">Releasing Sadness and Guilt with Compassion</h4>
                    <a href="/audio/releasing-sadness-guilt-meditation.mp3" download className="shrink-0">
                      <Button variant="ghost" size="sm" className="gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                  <audio controls className="w-full">
                    <source src="/audio/releasing-sadness-guilt-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-amber-600 dark:text-amber-400">Allowing Hope and Happiness to Return</h4>
                    <a href="/audio/allowing-hope-happiness-meditation.mp3" download className="shrink-0">
                      <Button variant="ghost" size="sm" className="gap-1 text-amber-600 hover:text-amber-700 dark:text-amber-400">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                  <audio controls className="w-full">
                    <source src="/audio/allowing-hope-happiness-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-teal-600 dark:text-teal-400">Finding Steadiness During a Holiday Without Them</h4>
                    <a href="/audio/finding-steadiness-holiday-meditation.mp3" download className="shrink-0">
                      <Button variant="ghost" size="sm" className="gap-1 text-teal-600 hover:text-teal-700 dark:text-teal-400">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                  <audio controls className="w-full">
                    <source src="/audio/finding-steadiness-holiday-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-emerald-600 dark:text-emerald-400">Letting Go of What Was Never About You (Don't Take It Personally)</h4>
                    <a href="/audio/letting-go-not-about-you-meditation.mp3" download className="shrink-0">
                      <Button variant="ghost" size="sm" className="gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                  <audio controls className="w-full">
                    <source src="/audio/letting-go-not-about-you-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>

            {/* Educational Videos - Coming Soon */}
            <div className="p-8 bg-muted/30 rounded-lg border text-center">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-logo-green mb-3">Educational Videos Coming Soon</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                We're developing a comprehensive library of information resource videos to help families navigate addiction and recovery. Check back soon for expert-led content on understanding addiction, setting boundaries, communication strategies, and more.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
