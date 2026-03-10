import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  Phone,
  BookOpen,
  Headphones,
  ExternalLink,
  Video,
  Users,
  FileText,
  Search,
  MapPin,
  Clock,
  Repeat,
  Luggage,
  Shield,
  Ban,
  Sparkles,
  Heart,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

// ─── Decision Checklist (Right Now) ───
interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  linkText?: string;
  linkUrl?: string;
}

const decisionItems: ChecklistItem[] = [
  {
    id: "join-zoom",
    title: "Join the free Monday Night Family Support Zoom call",
    description:
      "Every Monday at 7 PM PST, families just like yours come together for a free, live support call. You'll hear from others who've been exactly where you are — and from professionals who can help. You don't have to talk. Just showing up is a step.",
    icon: Video,
    linkText: "Register for Monday Zoom",
    linkUrl: "/monday-zoom-registration",
  },
  {
    id: "decide-approach",
    title: "Decide: professional intervention or family-led conversation?",
    description:
      "Let's be direct: a professionally-led intervention has a dramatically higher success rate than a family doing it alone. An interventionist has done this hundreds or thousands of times. They know exactly what your loved one will say, how they'll deflect, when they'll get angry, and how to keep the conversation on track. That said, not every situation requires a formal intervention. If your loved one is somewhat willing to talk and the addiction hasn't progressed to a severe level, a structured family conversation with professional coaching might be enough. Here's the honest filter: If you've already tried talking and it didn't work, if they've been to treatment before and relapsed, if there's been deception or manipulation, or if the substance is opioids/fentanyl/meth — get a professional. Full stop.",
    icon: Shield,
  },
  {
    id: "identify-team",
    title: "Identify your intervention team",
    description:
      "An intervention team is 3-6 people who the addicted person respects, loves, or depends on. Not everyone who cares should be on the team. You want people who can stay calm under pressure, follow the plan, and hold their boundary without caving. You do NOT want: anyone who will get emotional and give in, anyone who enables or minimizes the problem, anyone who has active conflict with the addicted person, or anyone who might tip them off. The interventionist will help you build this team — but start thinking about who belongs on it now.",
    icon: Users,
  },
  {
    id: "impact-statements",
    title: "Start gathering your impact statements",
    description:
      "Every person on the intervention team will write a letter — sometimes called an impact statement or a 'bottom line' letter. This is not a lecture. It's not a list of complaints. It's the most honest, specific, loving thing you've ever written. It follows a structure: I love you because [specific memories]. Your addiction has affected me by [specific incidents with dates]. I am asking you to accept help today. If you don't, [specific consequence I will follow through on]. This is the hardest thing most families have ever written. It's also the most powerful. Start yours now — even if it's rough. You'll refine it later.",
    icon: FileText,
  },
  {
    id: "research-treatment",
    title: "Research treatment options — have a plan BEFORE the intervention",
    description:
      "The single biggest mistake families make: they do the intervention and the person says yes... and nobody has a treatment bed ready. That 'yes' has a half-life of about 4-6 hours. After that, the fear kicks in and they change their mind. You need a bed lined up, insurance verified, bags packed, and a plan to get them there — BEFORE the intervention happens. Not after. An interventionist handles this logistics. If you're going it alone, start calling treatment centers now.",
    icon: Search,
    linkText: "Browse Vetted Treatment Providers",
    linkUrl: "/inpatient-treatment",
  },
];

// ─── Preparation Checklist (This Week) ───
const prepItems: ChecklistItem[] = [
  {
    id: "set-logistics",
    title: "Set the logistics",
    description:
      "When and where will the intervention happen? Best practices: morning (they're most likely to be sober), in a private but neutral-feeling space (living room, not a restaurant), on a day when they don't have an excuse to leave quickly. The interventionist will guide timing, but start thinking about: What day works for the whole team? What time is the person most likely to be sober and calm? Where can you have an uninterrupted, private conversation? Is there a way to get them there without suspicion?",
    icon: MapPin,
  },
  {
    id: "rehearse",
    title: "Rehearse — yes, actually rehearse",
    description:
      "A professional interventionist will run a full rehearsal with the team — usually the night before or the morning of. This is non-negotiable. You'll practice reading your letters out loud. You'll practice what to do when they get angry, when they cry, when they try to leave, when they make promises to quit on their own. You'll practice staying calm when every instinct tells you to cave. If you're doing this without a professional: rehearse anyway. Read your letters to each other. Assign roles — who speaks first, who speaks last, who handles the 'I'll do it myself' response. Practice makes the difference between a conversation that changes a life and a fight that makes things worse.",
    icon: Repeat,
  },
  {
    id: "pack-bag",
    title: "Pack their bag",
    description:
      "If they say yes (and with professional guidance, the odds are very good), you need to be ready to go immediately. Pack a bag with: 5-7 days of comfortable clothing, toiletries, any required medications (bring the bottles, treatment needs to see them), insurance card, ID, phone charger, one comfort item (a photo, a book, a pillow). Put this bag in someone else's car. Not in the house where they might find it and get suspicious.",
    icon: Luggage,
  },
  {
    id: "prepare-answers",
    title: "Prepare for every answer",
    description:
      "They might say yes. They might say no. They might say 'I'll think about it' or 'I'll go next week' or 'I can do it on my own.' An interventionist prepares the team for every response. Here's the framework: YES = we leave for treatment within hours, not days. MAYBE/LATER = this is a no. 'I'll go Monday' is almost always 'I'll talk you out of it by Monday.' Your response: 'We have a bed for you right now. If you're willing to go, we go today.' NO = everyone reads their consequence. Not a threat — a boundary. 'If you choose not to accept help, I will [specific consequence].' And then you follow through. This is the hardest part. The interventionist will help you get ready for it.",
    icon: Clock,
  },
];

// ─── Common Mistakes ───
const mistakes = [
  {
    title: "Don't tip them off.",
    description:
      "The element of surprise isn't about ambush — it's about preventing them from preparing defenses, leaving town, or using before the conversation. Only the intervention team should know.",
  },
  {
    title: "Don't negotiate the treatment plan during the intervention.",
    description:
      "The plan is set before the intervention. If they start negotiating (\"I'll go but not to THAT place\" / \"I'll go outpatient instead\"), the interventionist handles this. The family's job is to stay on script.",
  },
  {
    title: "Don't skip the rehearsal.",
    description:
      "The #1 predictor of a failed intervention is an unprepared family. Rehearse.",
  },
  {
    title: "Don't let guilt derail you.",
    description:
      "They will say things designed to make you feel guilty. \"You're ganging up on me.\" \"If you loved me you wouldn't do this.\" \"I'll never forgive you.\" These are the addiction talking, not your loved one. Stay the course.",
  },
  {
    title: "Don't do it angry.",
    description:
      "If anyone on the team can't speak from love — genuine, gut-wrenching love — they shouldn't be in the room. This is not a confrontation. It's a rescue mission.",
  },
];

const STORAGE_KEY = "roadmap-pre-intervention-checklist";

const RoadmapPreIntervention = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
  }, []);

  const allItems = [...decisionItems, ...prepItems];
  const toggleItem = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPercent = (completedCount / allItems.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Pre-Intervention Stage — Recovery Roadmap | Sober Helpline"
        description="You've decided something has to change. Now let's turn that courage into a plan that actually works — preparation, team building, and execution."
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600/8 via-background to-accent/10 border-b border-border/50 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔵</span>
            <span className="text-sm font-semibold bg-blue-600/15 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">
              Pre-Intervention Stage
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            You've decided: something has to change.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            That decision took courage — more than you probably realize. Now let's turn that courage into a plan that actually works.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Progress value={progressPercent} className="flex-1 h-3 max-w-xs" />
            <span className="text-sm font-medium text-muted-foreground">
              {completedCount}/{allItems.length} completed
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl py-10 space-y-12">
        {/* ─── Intro Card ─── */}
        <Card className="border-blue-600/20 bg-blue-600/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  💡 The Truth About Interventions
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Most families picture interventions as dramatic ambushes they've seen on TV. That's not what this is. A professional intervention is a structured, rehearsed, loving conversation — with a clear plan and real consequences. The success rate when done professionally is over 90%. This isn't about ganging up on someone. It's about breaking through the wall that addiction has built around them — with preparation, precision, and love.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Right Now — Decision Checklist ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            ✅ Right Now — Decision Checklist
          </h2>
          <div className="space-y-3">
            {decisionItems.map((item) => (
              <PreInterventionCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
                showSpecialCta={item.id}
              />
            ))}
          </div>
        </div>

        {/* ─── This Week — Preparation ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📋 This Week — Preparation Checklist
          </h2>
          <div className="space-y-3">
            {prepItems.map((item) => (
              <PreInterventionCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── After the Intervention ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            After the Intervention
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* If they say yes */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground mb-2">If they say yes</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is the beginning. Not the end — the beginning. The hard work starts now, for them AND for you. Your next stage is the Treatment Stage — what to do while they're getting help.
                    </p>
                    <Link to="/roadmap/treatment">
                      <Button size="sm">
                        Go to Treatment Stage
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* If they say no */}
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground mb-2">If they say no</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      A "no" today doesn't mean "no" forever. Sometimes the intervention plants a seed that takes days or weeks to break through. What matters now is that YOU follow through on your boundaries. Every consequence you stated, you enforce. That's not punishment — that's the most loving thing you can do.
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Stay connected with your intervention team and support group. A second intervention, after consequences have been felt, has an even higher success rate than the first.
                    </p>
                    <a href="tel:5412415886">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Talk to Your Interventionist
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ─── Common Mistakes ─── */}
        <Card className="border-blue-600/20 bg-blue-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Ban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Common Mistakes — Don't Make These
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These are the errors that derail even well-intentioned interventions. Know them. Avoid them.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {mistakes.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg leading-none mt-0.5 flex-shrink-0">✕</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ─── Resources ─── */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Recommended Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ResourceLink label="Understanding Addiction" to="/understanding-addiction" />
              <ResourceLink label="Choosing the Right Treatment Center" to="/choosing-treatment-center" />
              <ResourceLink label="Family Support Resources" to="/family-support" />
              <ResourceLink label="Blog: Latest Articles" to="/blog" />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                Listen & Connect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ResourceLink label="Recovery Podcasts" to="/recovery-podcasts" />
              <ResourceLink label="Vetted Provider Directory" to="/inpatient-treatment" />
              <Link
                to="/monday-zoom-registration"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Video className="w-3.5 h-3.5 flex-shrink-0" />
                Weekly Support Group — Monday 7 PM PT
              </Link>
              <a
                href="tel:5412419151"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Phone className="w-4 h-4" />
                Talk to Someone: (541) 241-9151
              </a>
              <p className="text-xs text-muted-foreground italic pl-6">
                Free consultation. No pressure. Just answers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Treatment Stage — Coming Soon</DialogTitle>
            <DialogDescription>
              The Treatment Stage of the Recovery Roadmap is being built. In the meantime, keep working through your pre-intervention checklist and stay connected with your support team.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowComingSoon(false)}>
              Close
            </Button>
            <a href="tel:5412419151">
              <Button>
                <Phone className="w-4 h-4 mr-1" />
                Call for Guidance
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Checklist Card ───
function PreInterventionCard({
  item,
  checked,
  onToggle,
  showSpecialCta,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
  showSpecialCta?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={`border-border/50 transition-all ${checked ? "bg-muted/30 border-primary/20" : "bg-card"}`}>
        <CardContent className="p-0">
          <div className="flex items-start gap-3 p-4">
            <Checkbox checked={checked} onCheckedChange={() => onToggle()} className="mt-1" />
            <div className="flex-1 min-w-0">
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <span className={`font-semibold text-foreground leading-snug ${checked ? "line-through opacity-60" : ""}`}>
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>

                {item.linkUrl && item.linkText && (
                  <Link
                    to={item.linkUrl}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {item.linkText}
                  </Link>
                )}

                {showSpecialCta === "decide-approach" && (
                  <a href="tel:5412419151">
                    <Button size="sm" className="mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Schedule a Free Consultation: (541) 241-9151
                    </Button>
                  </a>
                )}

                {showSpecialCta === "research-treatment" && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2 rounded-md">
                    ⚠️ Avoid treatment centers that cold-call you or offer free flights. These are red flags for patient brokering — a predatory practice that puts profit over care. Also avoid programs that offer to have one of their own interventionists provide intervention services instead of giving you numbers of trusted partners. It is unethical for treatment centers to provide their own intervention services — it removes the objectivity from the process and only focuses on getting your loved one into THEIR program, not the RIGHT program.
                  </p>
                )}
              </CollapsibleContent>
            </div>
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  );
}

function ResourceLink({ label, to }: { label: string; to: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 text-sm text-primary hover:underline py-1">
      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
      {label}
    </Link>
  );
}

export default RoadmapPreIntervention;
