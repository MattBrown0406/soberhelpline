import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, Compass, Heart, LifeBuoy, Shield, Sparkles, Trees, Users, Video } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import tracks from "@/data/familyEducationTracks.json";
import onboardingSequence from "@/data/familyOnboardingSequence.json";

type Track = {
  slug: string;
  title: string;
  summary: string;
  goal: string;
  audience: string;
  resourcePaths: { title: string; path: string }[];
  forumTopic: { topicId: string; topicTitle: string; prompt: string };
};

type SequenceDay = {
  day: number;
  slug: string;
  subject: string;
  preview: string;
  trackSlug: string;
  headline: string;
  intro: string[];
  forumPrompt: string;
  forumTopicId: string;
};

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

const trackList = tracks as Track[];
const sequence = onboardingSequence as SequenceDay[];
const trackBySlug = Object.fromEntries(trackList.map((track) => [track.slug, track]));

export default function FamilyEducationTracks() {
  return (
    <>
      <SEOHead
        title="Curated Family Education Tracks | Sober Helpline"
        description="Choose a guided family education track for crisis, boundaries, treatment decisions, relapse, family systems, and more."
      />

      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link to="/family-education">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Family Education
              </Button>
            </Link>
            <Link to="/family-support-forum">
              <Button variant="outline" size="sm" className="gap-2 border-purple-500/40 text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-950/30">
                <Users className="h-4 w-4" />
                Family Forum
              </Button>
            </Link>
            <Link to="/monday-zoom-registration">
              <Button variant="outline" size="sm" className="gap-2 border-blue-500/40 text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/30">
                <Video className="h-4 w-4" />
                Monday Zoom
              </Button>
            </Link>
          </div>

          <div className="rounded-3xl border border-logo-blue/20 bg-gradient-to-br from-logo-blue/10 via-background to-logo-blue/5 p-8 md:p-10 mb-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-logo-blue/10 px-3 py-1.5 text-xs font-semibold text-logo-blue mb-4">
                <BookOpen className="h-3.5 w-3.5" />
                Guided Paths for New Members
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-3">Curated Family Education Tracks</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Instead of dropping families into a giant library and hoping they find the right article, these tracks give them a clear starting point based on what they are actually facing.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Each track includes a focused set of pages, a clear goal, and a matching discussion prompt so members can read, reflect, and then bring the right question into the forum.
              </p>
            </div>
          </div>

          <section className="mb-12">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Track Overview</h2>
                <p className="text-muted-foreground mt-2">Launch these as the primary guided paths for the Family Education Center.</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {trackList.map((track) => {
                const Icon = iconMap[track.slug] ?? BookOpen;
                return (
                  <Card key={track.slug} className="border-2 border-logo-green/10 hover:border-logo-green/30 transition-colors">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-logo-blue/10 p-2.5 border border-logo-green/20">
                          <Icon className="h-5 w-5 text-logo-blue" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-logo-blue">{track.title}</CardTitle>
                          <CardDescription className="mt-1 text-sm">{track.summary}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Goal</p>
                        <p className="text-sm text-foreground leading-relaxed">{track.goal}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Best for</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{track.audience}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Recommended pages</p>
                        <div className="flex flex-wrap gap-2">
                          {track.resourcePaths.map((resource) => (
                            <Link key={resource.path} to={resource.path}>
                              <Button variant="outline" size="sm" className="h-auto py-2 px-3 whitespace-normal text-left justify-start">
                                {resource.title}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Forum discussion</p>
                        <p className="font-medium text-foreground mb-1">{track.forumTopic.topicTitle}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{track.forumTopic.prompt}</p>
                        <Link to={`/family-forum/${track.forumTopic.topicId}`}>
                          <Button variant="ghost" className="px-0 h-auto text-logo-blue hover:text-logo-blue/80">
                            Open forum topic <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mb-12">
            <Card className="border-2 border-amber-500/20 bg-gradient-to-r from-amber-50/80 via-background to-orange-50/80 dark:from-amber-950/20 dark:via-background dark:to-orange-950/20">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">7-Day New Member Email Sequence</CardTitle>
                <CardDescription>
                  Each day points a new member to one focused track, one or two key resources, and one matching forum question.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sequence.map((day) => {
                  const track = trackBySlug[day.trackSlug] as Track | undefined;
                  return (
                    <div key={day.day} className="rounded-2xl border bg-background/80 p-4 md:p-5">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-logo-blue mb-1">Day {day.day}</p>
                          <h3 className="text-lg font-semibold text-foreground">{day.subject}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{day.preview}</p>
                        </div>
                        {track && (
                          <Link to={`/family-forum/${day.forumTopicId}`}>
                            <Button variant="outline" size="sm">Forum Topic</Button>
                          </Link>
                        )}
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-2">
                          {day.intro.map((paragraph) => (
                            <p key={paragraph} className="text-sm text-foreground leading-relaxed">{paragraph}</p>
                          ))}
                          {track && (
                            <div className="pt-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Featured track</p>
                              <p className="font-medium text-foreground">{track.title}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {track.resourcePaths.slice(0, 3).map((resource) => (
                                  <Link key={resource.path} to={resource.path}>
                                    <Button variant="outline" size="sm">{resource.title}</Button>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border bg-muted/30 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Discussion forum topic</p>
                          <p className="text-sm font-medium text-foreground mb-2">{day.forumPrompt}</p>
                          <Link to={`/family-forum/${day.forumTopicId}`}>
                            <Button className="w-full bg-logo-blue hover:bg-logo-blue/90 text-white">
                              Join the discussion
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
