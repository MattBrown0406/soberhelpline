import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Users, FileText, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import SEOHead from "@/components/SEOHead";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatTime12h = (time24: string) => {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

const CoachingOnboarding = () => {
  const [searchParams] = useSearchParams();
  const planType = searchParams.get("plan") || "single";
  const [firstSession, setFirstSession] = useState<any>(null);
  const [hasIntake, setHasIntake] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [allSessions, setAllSessions] = useState<any[]>([]);

  const planLabels: Record<string, string> = {
    "single": "Emergency Game Plan™",
    "emergency": "Emergency Game Plan™",
    "stabilization": "Family Stabilization Plan™",
    "parallel-recovery": "Parallel Recovery Program™",
  };

  const planName = planLabels[planType] || "Coaching Session";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Get latest bookings for this user, ordered by date
    const { data: bookings } = await supabase
      .from("consultation_bookings")
      .select("*")
      .eq("client_user_id", user.id)
      .eq("status", "confirmed")
      .order("booking_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (bookings && bookings.length > 0) {
      setFirstSession(bookings[0]);
      setAllSessions(bookings);
    }

    // Check if intake assessment exists
    const { data: intake } = await supabase
      .from("coaching_intake_assessments")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    setHasIntake(!!intake);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const firstSessionDate = firstSession
    ? new Date(firstSession.booking_date + "T00:00:00")
    : null;

  const firstSessionFormatted = firstSessionDate
    ? `${DAYS[firstSessionDate.getDay()]}, ${firstSessionDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${formatTime12h(firstSession.start_time)}`
    : "your scheduled date";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Welcome to Coaching | Sober Helpline"
        description="Welcome to Sober Helpline's Family Coaching Platform. Get started with your upcoming session."
      />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Logo & Success Banner */}
        <div className="text-center mb-8">
          <img src={logo} alt="Sober Helpline" className="w-32 h-auto mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Booking Confirmed</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Welcome to Sober Helpline's Coaching Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            You've taken an important step. Here's everything you need to know before your first session.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Your First Session */}
          <Card className="border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Step 1</Badge>
                    <h2 className="text-xl font-semibold">Your Upcoming Session</h2>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Your first {planName} session is scheduled for:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mb-3">
                    <p className="text-lg font-semibold text-foreground">{firstSessionFormatted}</p>
                    {firstSession?.zoom_meeting_url && (
                      <p className="text-sm text-muted-foreground mt-1">
                        A Zoom link has been sent to your email. You can also join directly from this site when it's time.
                      </p>
                    )}
                  </div>
                  {allSessions.length > 1 && (
                    <details className="mb-3">
                      <summary className="text-sm text-primary cursor-pointer font-medium">
                        View all {allSessions.length} scheduled sessions
                      </summary>
                      <div className="mt-2 space-y-1">
                        {allSessions.map((s, i) => {
                          const d = new Date(s.booking_date + "T00:00:00");
                          return (
                            <div key={s.id} className="text-sm flex items-center gap-2 py-1">
                              <Badge variant="outline" className="text-xs">Session {i + 1}</Badge>
                              <span>
                                {DAYS[d.getDay()]}, {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {formatTime12h(s.start_time)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  )}
                  <p className="text-sm text-muted-foreground">
                    <strong>What to expect:</strong> Your coach will review your intake information ahead of the session. Come prepared to discuss your current family situation openly. This is a confidential, judgment-free space focused entirely on helping your family find stability and clarity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Invite Family Members */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 hover:bg-blue-100">Step 2</Badge>
                    <h2 className="text-xl font-semibold">Invite Your Family</h2>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Family coaching is most effective when key family members participate. You're welcome to invite as many family members as you'd like to join the session.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-sm space-y-2">
                    <p className="font-medium text-blue-900 dark:text-blue-300">How to invite family members:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-300/80">
                      <li>Check your email for the Zoom meeting link and passcode</li>
                      <li>Forward that email or share the Zoom link directly with family members you'd like to include</li>
                      <li>They can join from any device — no account needed</li>
                    </ol>
                    <p className="text-blue-700 dark:text-blue-400 italic mt-2">
                      Spouses, parents, siblings, adult children — anyone who plays a role in the family dynamic is welcome.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Complete Intake Assessment */}
          <Card className={!hasIntake ? "border-amber-300 dark:border-amber-700" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${hasIntake ? "bg-emerald-100 dark:bg-emerald-950/30" : "bg-amber-100 dark:bg-amber-950/30"}`}>
                  <FileText className={`h-5 w-5 ${hasIntake ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={hasIntake ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 hover:bg-emerald-100" : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 hover:bg-amber-100"}>Step 3</Badge>
                    <h2 className="text-xl font-semibold">Family Coaching Intake Assessment™</h2>
                  </div>
                  {hasIntake ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Assessment completed</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your coach will review your responses before your session. You can update your assessment anytime from the Family Coaching page.
                      </p>
                      <Link to="/family-coaching">
                        <Button variant="outline" size="sm" className="mt-2">
                          Review or Update Assessment <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-muted-foreground">
                        Please complete the Family Coaching Intake Assessment™ before your first session. This helps your coach prepare and make the most of your time together.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        It takes approximately 12–15 minutes and covers your family situation, emotional well-being, and coaching goals.
                      </p>
                      <Link to="/family-coaching">
                        <Button className="mt-1">
                          Complete Intake Assessment <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Rescheduling */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <RefreshCw className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Step 4</Badge>
                    <h2 className="text-xl font-semibold">Need to Reschedule?</h2>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Life happens. If you need to reschedule your session, here's how:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                    <ol className="list-decimal list-inside space-y-2">
                      <li>
                        <strong>Email your coach directly</strong> — Reply to your confirmation email or contact us at{" "}
                        <a href="mailto:matt@soberhelpline.com" className="text-primary underline">matt@soberhelpline.com</a>
                      </li>
                      <li>
                        <strong>Provide at least 24 hours' notice</strong> — This ensures your coach can offer the slot to another family in need
                      </li>
                      <li>
                        <strong>Request a new time</strong> — We'll work with you to find a time that works for everyone
                      </li>
                    </ol>
                    <p className="text-muted-foreground mt-3 italic">
                      Please note: Sessions cancelled with less than 24 hours' notice may not be eligible for rescheduling.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center pt-4 pb-8">
            <p className="text-muted-foreground mb-4">
              Questions? Reach out anytime at{" "}
              <a href="mailto:matt@soberhelpline.com" className="text-primary underline">matt@soberhelpline.com</a>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/family-coaching">
                <Button variant="outline">Go to Family Coaching</Button>
              </Link>
              <Link to="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingOnboarding;
