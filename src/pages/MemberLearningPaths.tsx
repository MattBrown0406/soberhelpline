import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, AlertTriangle, TrendingUp, Heart, Video, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";

interface PathResource {
  title: string;
  path: string;
  type: "guide" | "tool" | "recording";
  note?: string;
}

interface LearningPath {
  id: string;
  icon: typeof BookOpen;
  color: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  timeEstimate: string;
  resources: PathResource[];
}

const paths: LearningPath[] = [
  {
    id: "just-found-out",
    icon: AlertTriangle,
    color: "amber",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    title: "Just Found Out",
    subtitle: "For families in the first weeks of discovery",
    description: "You've just realized the extent of what's happening. Start here to build the understanding you need before deciding on any action.",
    timeEstimate: "3–4 hours across a week",
    resources: [
      { title: "Why Willpower Fails (and What Actually Works)", path: "/why-willpower-fails", type: "guide", note: "Read this first — reframes everything" },
      { title: "The Disease vs. Choice Reality Map", path: "/disease-choice-reality-map", type: "guide" },
      { title: "Addiction Progression Timeline", path: "/addiction-progression-timeline", type: "guide" },
      { title: "Addiction Rewrites Family Rules", path: "/addiction-rewrites-family-rules", type: "guide" },
      { title: "Communication Guide for Families", path: "/communication-guide", type: "guide" },
      { title: "Family Action Plan", path: "/family-action-plan", type: "tool", note: "Work through this after reading the above" },
    ],
  },
  {
    id: "considering-intervention",
    icon: TrendingUp,
    color: "blue",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    title: "Considering Intervention",
    subtitle: "For families ready to take structured action",
    description: "Your loved one isn't seeking help and the situation is escalating. This path helps you understand what a professional intervention involves and how to assess whether you're ready.",
    timeEstimate: "4–5 hours across two weeks",
    resources: [
      { title: "Boundaries vs. Ultimatums — What's the Difference?", path: "/boundaries-ultimatums-guide", type: "guide", note: "Critical distinction before any conversation" },
      { title: "The No-Negotiation Guide", path: "/no-negotiation-guide", type: "guide" },
      { title: "Family Readiness Assessment", path: "/family-readiness-intensive", type: "tool" },
      { title: "Intervention Help — How It Works", path: "/intervention-help", type: "guide" },
      { title: "What Changes When Families Change", path: "/what-changes-when-families-change", type: "guide" },
      { title: "Readiness Checklist", path: "/readiness-checklist", type: "tool", note: "Complete this before scheduling a consultation" },
    ],
  },
  {
    id: "supporting-recovery",
    icon: TrendingUp,
    color: "green",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    title: "Supporting Someone in Treatment",
    subtitle: "For families with a loved one in or recently out of treatment",
    description: "Treatment has started. Now comes the harder work: learning how to support without enabling, and how to rebuild trust carefully.",
    timeEstimate: "3–4 hours across a week",
    resources: [
      { title: "Why Multiple Treatment Episodes Don't Mean Failure", path: "/multiple-treatment-episodes", type: "guide", note: "Essential if this isn't their first time" },
      { title: "Recovery Requirements", path: "/recovery-requirements", type: "guide" },
      { title: "Enabling Language Translator", path: "/enabling-language-translator", type: "tool", note: "Use this to audit your own words" },
      { title: "Aftercare Checklist", path: "/aftercare-checklist", type: "guide" },
      { title: "Relapse Warning Signs Tracker", path: "/relapse-warning-signs-tracker", type: "tool" },
      { title: "Boundary Drift", path: "/boundary-drift", type: "guide" },
    ],
  },
  {
    id: "taking-care-of-yourself",
    icon: Heart,
    color: "rose",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    title: "Taking Care of Yourself",
    subtitle: "For the family member carrying the most weight",
    description: "You've been focused entirely on your loved one. This path is about you — your grief, your patterns, and finding a way to live well regardless of what they choose.",
    timeEstimate: "Work through at your own pace",
    resources: [
      { title: "The Strong One Guide", path: "/strong-one-guide", type: "guide", note: "Start here — many families need this most" },
      { title: "Grief for Families Navigating Addiction", path: "/grief-for-family", type: "guide" },
      { title: "Guilt, Relief & the Resentment Cycle", path: "/guilt-relief-resentment-cycle", type: "guide" },
      { title: "Living Well Regardless", path: "/living-well-regardless", type: "guide" },
      { title: "Values Exercise", path: "/values-exercise", type: "tool" },
      { title: "Self-Care Worksheet", path: "/family-education", type: "tool", note: "In the Education Center under Pillar 5" },
    ],
  },
];

const typeIcon = {
  guide: BookOpen,
  tool: ArrowRight,
  recording: Video,
};

const typeLabel = {
  guide: "Guide",
  tool: "Interactive Tool",
  recording: "Recording",
};

export default function MemberLearningPaths() {
  return (
    <>
      <SEOHead
        title="Member Learning Paths | Sober Helpline"
        description="Curated reading sequences for families navigating addiction — organized by where you are right now."
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learning Paths</h1>
              <p className="text-muted-foreground text-sm">Curated sequences — start where you are</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border">
            <Link to="/zoom-recordings">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Recordings
              </Button>
            </Link>
            <Link to="/member-qa">
              <Button variant="outline" size="sm" className="gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" />
                Q&amp;A Archive
              </Button>
            </Link>
          </div>

          <p className="text-muted-foreground mb-8">
            These aren't courses — they're reading sequences designed around where you actually are.
            Pick the path that fits your situation right now, and work through it at your own pace.
            Each path links directly to guides and tools that already exist on the site.
          </p>

          <div className="space-y-8">
            {paths.map((path) => {
              const PathIcon = path.icon;
              return (
                <Card key={path.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-${path.color}-100 dark:bg-${path.color}-900/30`}>
                        <PathIcon className={`w-6 h-6 text-${path.color}-600 dark:text-${path.color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <Badge variant="secondary" className={`text-xs ${path.badgeColor}`}>
                            {path.timeEstimate}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{path.subtitle}</p>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{path.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {path.resources.map((res, idx) => {
                        const ResIcon = typeIcon[res.type];
                        return (
                          <li key={res.path}>
                            <Link
                              to={res.path}
                              className="flex items-start gap-3 rounded-lg p-3 border border-transparent hover:border-border hover:bg-muted/50 transition-colors group"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {res.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ResIcon className="h-3 w-3" />
                                    {typeLabel[res.type]}
                                  </span>
                                </div>
                                {res.note && (
                                  <p className="text-xs text-muted-foreground mt-0.5 italic">{res.note}</p>
                                )}
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Want to go deeper with a specific situation, or not sure which path fits?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/monday-zoom-registration">
                <Button variant="outline" size="sm">Join a Monday Meeting</Button>
              </Link>
              <Link to="/family-coaching">
                <Button size="sm">Private Coaching</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/family-education" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Education Center
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
