import { useState, type ComponentType } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, Compass, Heart, LifeBuoy, Loader2, Shield, Sparkles, Trees, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { MEMBER_TRACKS, useLearningPath } from "@/hooks/useLearningPath";
import { useToast } from "@/hooks/use-toast";

// Browse all learning paths (supabase/functions/_shared/memberTracks.json) and
// choose one. The chosen path drives /member-home and the guide member bar.

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  "crisis-first-72-hours": AlertTriangle,
  "boundary-setting": Shield,
  "treatment-decision": Compass,
  "relapse-response": LifeBuoy,
  "family-systems-enabling": Trees,
  "spouse-partner": Heart,
  "parent-track": Users,
  "sibling-track": Sparkles,
};

export default function FamilyEducationTracks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackId, setPath } = useLearningPath();
  const { isCompleted } = useEducationProgress();
  const [choosing, setChoosing] = useState<string | null>(null);

  const choose = async (id: string) => {
    setChoosing(id);
    const ok = await setPath(id);
    setChoosing(null);
    if (!ok) {
      toast({ title: "That didn't save", description: "Please try again in a moment.", variant: "destructive" });
      return;
    }
    navigate("/member-home");
  };

  return (
    <>
      <SEOHead
        title="Learning Paths | Sober Helpline"
        description="Choose one guided learning path for crisis, boundaries, treatment decisions, relapse, family systems, partners, parents, or siblings."
      />

      <div className="min-h-screen bg-background">
        <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
          <Link
            to="/member-home"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Member home
          </Link>

          <div className="mb-8 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Choose your learning path</h1>
            <p className="text-muted-foreground leading-relaxed">
              Each path is a short, ordered set of guides and exercises for one situation. Pick the one closest to
              what your family is facing now. You can change it whenever you like, and nothing you've finished is lost.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Not sure?{" "}
              <Link to="/onboarding-quiz" className="text-primary hover:underline">
                Answer five questions and we'll suggest one
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {MEMBER_TRACKS.map((track) => {
              const Icon = iconMap[track.id] ?? Compass;
              const isCurrent = track.id === trackId;
              const done = track.steps.filter((s) => isCompleted(s.path)).length;
              return (
                <Card key={track.id} className={isCurrent ? "border-2 border-primary/50" : "border"}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-lg">{track.title}</CardTitle>
                          {isCurrent && <Badge variant="secondary">Your path</Badge>}
                        </div>
                        <CardDescription className="mt-1">{track.summary}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">{track.goal}</p>
                    <ol className="space-y-1.5">
                      {track.steps.map((step, i) => {
                        const stepDone = isCompleted(step.path);
                        return (
                          <li key={`${step.path}-${i}`} className="flex items-start gap-2 text-sm">
                            {stepDone ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Done" />
                            ) : (
                              <span className="w-4 shrink-0 text-right text-muted-foreground tabular-nums">{i + 1}.</span>
                            )}
                            <Link to={step.path} className="text-foreground hover:text-primary hover:underline">
                              {step.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-xs text-muted-foreground">
                        {done > 0 ? `${done} of ${track.steps.length} done` : `${track.steps.length} steps`}
                      </span>
                      {isCurrent ? (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/member-home">Continue on member home</Link>
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => choose(track.id)} disabled={choosing !== null} className="gap-2">
                          {choosing === track.id && <Loader2 className="h-4 w-4 animate-spin" />}
                          Choose this path
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
