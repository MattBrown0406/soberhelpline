import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarX, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";

type Phase = "ask" | "working" | "done" | "error";

/**
 * Reached from the "Stop weekly registration" link in the Monday reminder
 * email. Nothing changes until the person presses the button.
 */
const StopWeeklyRegistration = () => {
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid") || "";
  const token = searchParams.get("t") || "";
  const [phase, setPhase] = useState<Phase>("ask");
  const linkLooksRight = rid.length > 0 && /^[0-9a-f]{64}$/.test(token);

  const stop = async () => {
    setPhase("working");
    try {
      const { data, error } = await supabase.functions.invoke("stop-auto-registration", { body: { rid, t: token } });
      if (error || data?.ok !== true) throw error ?? new Error("not ok");
      setPhase("done");
    } catch {
      setPhase("error");
    }
  };

  return (
    <>
      <SEOHead
        title="Stop Weekly Registration | Sober Helpline"
        description="Stop being registered automatically for Family Squares each week."
        noIndex={true}
      />
      <div className="container mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-12">
        <Card className="w-full">
          <CardContent className="pt-6 text-center">
            {phase === "done" ? (
              <>
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-logo-green" aria-hidden="true" />
                <h1 className="text-xl font-bold text-foreground">Weekly registration is stopped</h1>
                <p className="mt-3 text-muted-foreground">
                  You will not be signed up automatically any more. If you are already registered for this coming
                  Monday, that one stays, and you may still get its reminder.
                </p>
                <p className="mt-3 text-muted-foreground">
                  You are welcome back any week. The meeting is free and you can register whenever you want to come.
                </p>
                <Button asChild className="mt-6">
                  <Link to="/family-squares">Go to Family Squares</Link>
                </Button>
              </>
            ) : !linkLooksRight ? (
              <>
                <CalendarX className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
                <h1 className="text-xl font-bold text-foreground">This link is incomplete</h1>
                <p className="mt-3 text-muted-foreground">
                  Open the "Stop weekly registration" link from your most recent reminder email again, or call us at
                  (458) 298-8008 and we will stop it for you.
                </p>
              </>
            ) : (
              <>
                <CalendarX className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
                <h1 className="text-xl font-bold text-foreground">Stop weekly registration?</h1>
                <p className="mt-3 text-muted-foreground">
                  Right now you are signed up for Family Squares automatically every Monday. If you stop, you
                  can still come any week by registering for that meeting.
                </p>
                {phase === "error" && (
                  <p role="alert" className="mt-4 text-sm text-destructive">
                    That did not go through. Please try again, or call us at (458) 298-8008.
                  </p>
                )}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button onClick={stop} disabled={phase === "working"} className="gap-2">
                    {phase === "working" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    Yes, stop weekly registration
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/family-squares">Keep it</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StopWeeklyRegistration;
