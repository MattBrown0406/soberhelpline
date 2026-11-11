import { useState, type ComponentType } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Compass, Heart, LifeBuoy, Loader2, Shield, Sparkles, Trees, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { IconTile, KindPill, MemberHero, MemberPage, Panel } from "@/components/member/MemberUI";
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

      <MemberPage>
        <div className="container mx-auto max-w-5xl space-y-5 px-4 py-6 sm:py-10">
          <Link
            to="/member-home"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Member home
          </Link>

          <MemberHero
            eyebrow="Learning paths"
            title="Choose your learning path"
            subtitle={
              <>
                Each path is a short, ordered set of guides and exercises for one situation. Pick the one closest to
                what your family is facing now. You can change it whenever you like, and nothing you've finished is lost.
              </>
            }
          />

          <Panel className="flex items-start gap-3 p-4 sm:p-5">
            <IconTile icon={Compass} tone="amber" />
            <p className="min-w-0 self-center text-sm leading-relaxed text-foreground/80">
              Not sure?{" "}
              <Link
                to="/onboarding-quiz"
                className="relative inline-block rounded font-semibold text-primary underline underline-offset-4 after:absolute after:inset-x-0 after:-inset-y-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Answer five questions and we'll suggest one
              </Link>
              .
            </p>
          </Panel>

          <div className="grid gap-5 lg:grid-cols-2">
            {MEMBER_TRACKS.map((track) => {
              const Icon = iconMap[track.id] ?? Compass;
              const isCurrent = track.id === trackId;
              const done = track.steps.filter((s) => isCompleted(s.path)).length;
              // On her own path, the first step she hasn't finished is where she is now.
              const hereIndex = isCurrent ? track.steps.findIndex((s) => !isCompleted(s.path)) : -1;
              return (
                <Panel
                  key={track.id}
                  tone={isCurrent ? "amber" : undefined}
                  className={`flex flex-col gap-4 ${isCurrent ? "border-2 ring-4 ring-[#e8a73a]/15 print:ring-0" : ""}`}
                >
                  <div className="flex items-start gap-3.5">
                    <IconTile icon={Icon} tone={isCurrent ? "amber" : "navy"} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h2 className="text-lg font-semibold leading-snug text-foreground">{track.title}</h2>
                        {isCurrent && (
                          <KindPill tone="amber" className="gap-1">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            Your path
                          </KindPill>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{track.summary}</p>
                    </div>
                  </div>

                  <p className="rounded-xl bg-muted/50 p-3.5 text-sm leading-relaxed text-foreground print:bg-transparent print:p-0">{track.goal}</p>

                  {/* The steps as a line she can follow, like the one on the member home. */}
                  <ol className="relative ml-1 flex-1">
                    {track.steps.map((step, i) => {
                      const stepDone = isCompleted(step.path);
                      const isHere = i === hereIndex;
                      const last = i === track.steps.length - 1;
                      return (
                        <li key={`${step.path}-${i}`} className="relative pl-9">
                          {!last && (
                            <span
                              aria-hidden="true"
                              className={`absolute left-[11px] top-8 h-[calc(100%-1.25rem)] w-0.5 print:hidden ${stepDone ? "bg-green-500" : "bg-border"}`}
                            />
                          )}
                          <span
                            className={`absolute left-0 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                              stepDone
                                ? "bg-green-600 text-white"
                                : isHere
                                  ? "bg-[#16294a] text-white ring-4 ring-[#16294a]/15 dark:bg-sky-300 dark:text-slate-900 dark:ring-sky-300/20"
                                  : "border-2 border-border bg-card text-muted-foreground"
                            }`}
                          >
                            {stepDone ? <Check className="h-3.5 w-3.5" aria-label="Done" /> : <span className="tabular-nums">{i + 1}</span>}
                          </span>
                          <Link
                            to={step.path}
                            className={`block min-h-11 rounded-lg px-2.5 py-3 text-sm leading-snug underline-offset-4 transition-colors hover:bg-muted/60 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
                              isHere ? "font-semibold text-foreground" : stepDone ? "text-foreground/70" : "text-foreground"
                            }`}
                          >
                            {step.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ol>

                  <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {done > 0 ? `${done} of ${track.steps.length} done` : `${track.steps.length} steps`}
                    </span>
                    {isCurrent ? (
                      <Button asChild variant="outline" className="min-h-11 gap-2 rounded-xl">
                        <Link to="/member-home">
                          Continue on member home
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    ) : (
                      <Button onClick={() => choose(track.id)} disabled={choosing !== null} className="min-h-11 gap-2 rounded-xl">
                        {choosing === track.id && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
                        Choose this path
                      </Button>
                    )}
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>
      </MemberPage>
    </>
  );
}
