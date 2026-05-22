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
  ArrowRight,
  Heart,
  Shield,
  MessageSquare,
  Users,
  Scale,
  DollarSign,
  Baby,
  Sparkles,
  Target,
  RefreshCw,
  HandHeart,
  Compass,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

// ─── Types ───
interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  linkText?: string;
  linkUrl?: string;
}

// ─── First 6 Months — Rebuilding Foundation ───
const foundationItems: ChecklistItem[] = [
  {
    id: "hard-conversations",
    title: "Have the conversations you've been avoiding",
    description:
      "By now, the acute crisis has passed and there's enough stability to go deeper. The questions that have been sitting in your chest: 'Where did the money go?' 'What were you doing all those nights?' 'Did you drive the kids while you were high?' 'Do you even remember what you said to me?' These conversations are necessary — but they need to happen in the right container. Family therapy. With a professional mediator. Not at the dinner table after a long day. Not in the car. Not during an argument about something else. Schedule it. Contain it. Process it. Then leave it in that room until the next session. These conversations will happen in layers over months — not one big purge. Let them unfold.",
    icon: MessageSquare,
    linkText: "Processing the Past Without Destroying the Present",
    linkUrl: "#",
  },
  {
    id: "renegotiate-agreement",
    title: "Renegotiate the re-entry agreement",
    description:
      "The rules you set at day one aren't the rules you need at month six. Curfew for a 35-year-old who's been sober for six months and attending meetings? Probably time to relax that. Random drug testing? Maybe shift to a trust-based check-in instead of weekly cups. This is important: loosening structure is a REWARD for consistent behavior, not a right. And the person in recovery should be part of the conversation — 'You've been consistent for six months. Let's talk about which guardrails we can adjust.' This builds agency and demonstrates that trust is being rebuilt through their actions. Don't loosen everything at once. Adjust gradually. And keep the non-negotiables non-negotiable.",
    icon: Shield,
  },
  {
    id: "financial-wreckage",
    title: "Address the financial wreckage — for real this time",
    description:
      "During treatment and early recovery, you assessed the damage. Now it's time to actually deal with it. Credit card debt, loans taken during active addiction, missed payments, stolen money, legal fees, treatment costs. This is a practical conversation, not an emotional one. Sit down together (or with a financial counselor) and build a real plan: What do we owe? What's the priority? How do we rebuild credit? When can they have financial autonomy again? Financial transparency should continue — shared access to accounts, regular check-ins on spending. Not because you don't trust them, but because financial secrecy is one of the earliest relapse indicators. This is also the time to address any legal consequences that are still pending — DUI court, probation requirements, restitution.",
    icon: DollarSign,
    linkText: "Rebuilding Finances After Addiction",
    linkUrl: "#",
  },
  {
    id: "let-them-fail",
    title: "Let them fail at small things",
    description:
      "This sounds counterintuitive, but it's critical. You've spent months (or years) managing everything — their schedule, their responsibilities, their consequences. In long-term recovery, you have to let go. Let them forget to pay a bill and deal with the late fee. Let them oversleep and face their boss. Let them burn dinner. Stop being the safety net for everyday life. Recovery means learning to live — with all the mundane failures that includes. Your job is to step back from the manager role you never asked for but couldn't let go of. If you keep rescuing them from small failures, you're training both of you that they can't handle life. They can. Let them prove it.",
    icon: HandHeart,
  },
];

// ─── Months 6-12 — Rebuilding Trust and Identity ───
const identityItems: ChecklistItem[] = [
  {
    id: "how-youve-changed",
    title: "Acknowledge how YOU'VE changed — and decide what you want",
    description:
      "Here's something nobody talks about: you're not the same person you were before all this. You've been through trauma, hypervigilance, loss, grief, and survival mode. Now that the crisis is over, you might realize some uncomfortable things. Maybe the relationship was broken before the addiction. Maybe you've outgrown patterns you can't go back to. Maybe you've discovered strengths you didn't know you had. Maybe you're angry — not at the addiction, but at the person. Long-term recovery is when the family members finally have space to process THEIR experience. Use it. Therapy isn't just for the person in recovery. It's for you. What do YOU want? Not what do they need. What do you want?",
    icon: Compass,
    linkText: "Your Own Recovery: Processing Trauma After the Crisis",
    linkUrl: "#",
  },
  {
    id: "rebuild-intentionally",
    title: "Rebuild the relationship intentionally — don't just drift",
    description:
      "After months of crisis management, many couples and families realize they don't know how to just... be together. The relationship was defined by the addiction — managing it, fighting about it, recovering from it. Now what? You have to rebuild intentionally. Date nights (yes, even if it feels forced at first). Shared activities that have nothing to do with recovery. Conversations about the future — not just the past. New traditions to replace the ones that were broken. This doesn't happen naturally. It requires effort, planning, and sometimes the vulnerability to say: 'I don't know how to be with you without the crisis. Can we figure it out together?'",
    icon: Heart,
  },
  {
    id: "kids-timeline",
    title: "Help the kids process — they're on their own timeline",
    description:
      "Kids don't recover on the same schedule as adults. A child who seemed fine during the crisis might start acting out six months later. A teenager who was angry might suddenly become withdrawn. A young child might start having nightmares or behavioral issues at school. This is normal. Their little nervous systems stored everything — even the things you thought they didn't notice. They noticed. Family therapy that includes the kids is important, but so is individual therapy for any child who's showing signs of struggle. And keep talking to them: 'Things are getting better. It's okay to have feelings about what happened. I'm here.' Consistently. For as long as it takes.",
    icon: Baby,
    linkText: "Children and Recovery: A Long-Term Guide",
    linkUrl: "#",
  },
  {
    id: "life-worth-sober",
    title: "Build a life worth staying sober for",
    description:
      "Sobriety without purpose is just white-knuckling. Long-term recovery works when the person in recovery — and the family — builds a life that's genuinely better than the one addiction created. That means: meaningful work or purpose, healthy relationships and social connections (beyond just AA/NA), physical health and activity, creative or spiritual outlets, goals that excite them, and a family environment that feels like home — not a halfway house. Your role as the family: create space for growth. Encourage new interests. Celebrate milestones (6 months, 1 year — these matter). And build YOUR life too. You deserve more than being a recovery monitor.",
    icon: Target,
  },
];

const allItems = [...foundationItems, ...identityItems];

// ─── Year+ Reflective Cards ───
const yearPlusCards = [
  {
    title: "Recovery changes the power dynamic — and that's uncomfortable.",
    body: "During active addiction, you held the power. You managed the money, the schedule, the consequences. In recovery, that power has to shift back toward balance. Letting go of control when control kept you safe is terrifying. But a relationship where one person is the permanent parent and the other is the permanent child doesn't work. The rebalancing is messy and takes time. Name it. Talk about it in therapy. It's one of the most common sources of conflict in long-term recovery.",
  },
  {
    title: "You might realize the relationship isn't going to make it.",
    body: "This is the thing no one says out loud: some relationships don't survive recovery. Not because recovery failed — but because once the crisis is over and both people can think clearly, they realize the relationship was broken underneath the addiction. Or that too much damage was done. Or that they've grown in different directions. If you're having these thoughts, you're not a bad person and you're not abandoning someone in recovery. You're being honest. Talk to a therapist — alone — about what you're feeling before making any decisions.",
    sensitive: true,
  },
  {
    title: "Milestones matter — celebrate them.",
    body: "Six months. One year. Two years. These aren't just dates — they're proof that the impossible happened. Celebrate them. Not with a parade — but with acknowledgment. 'I see how hard you've worked. I'm proud of you.' Simple. Honest. Powerful. And celebrate YOUR milestones too. You survived something. That deserves recognition.",
  },
  {
    title: "Complacency is the silent killer.",
    body: "The longer sobriety lasts, the easier it is to stop doing the things that made it work. They stop going to meetings ('I've got this'). You stop going to your support group ('Things are fine now'). The family stops therapy ('We don't need it anymore'). Structure erodes. Then something stressful happens — a job loss, a health scare, a family conflict — and there's no safety net. Complacency is the most common precursor to relapse in long-term recovery. Keep the foundation maintained. You don't stop changing the oil just because the car is running well.",
  },
];

const RoadmapLongTermRecovery = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("roadmap-longterm-checklist");
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  const toggle = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem("roadmap-longterm-checklist", JSON.stringify(updated));
  };

  const completedCount = allItems.filter((i) => checked[i.id]).length;
  const progressPercent = (completedCount / allItems.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[hsl(var(--muted)/0.3)]">
      <SEOHead
        title="Long-Term Recovery Stage — Recovery Roadmap | Sober Helpline"
        description="Past the first 90 days. Rebuilding trust, processing the past, and creating a new normal. A stage-by-stage guide for families in long-term recovery."
      />

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl space-y-10">
        {/* ─── Header ─── */}
        <div>
          <Link
            to="/roadmap"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
          >
            ← Back to Recovery Roadmap
          </Link>
          <div className="inline-flex items-center gap-2 bg-muted/60 text-foreground px-3 py-1 rounded-full text-sm font-medium mb-3 ml-4">
            ⚪ Long-Term Recovery Stage
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            Rebuilding — Together
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The crisis is behind you. The structure is holding. Now comes the real question: what kind of relationship, family, and life do you want to build from here? This is where recovery becomes something more than just not using.
          </p>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-4">
            <Progress value={progressPercent} className="flex-1 h-2.5" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {completedCount}/{allItems.length}
            </span>
          </div>
        </div>

        {/* ─── Where You Are Now ─── */}
        <Card className="border-border/40 bg-muted/20">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-foreground mb-3">⚪ Where You Are Now</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you're here, you've survived something most families can't even imagine. The suspicion, the confirmation, the crisis, maybe an intervention, treatment, those terrifying first 90 days — you made it through. That's not nothing. That's extraordinary. But here's what long-term recovery teaches you: surviving isn't the same as thriving. The absence of crisis is not the presence of health. Your family went through something that changed everyone — and now you have to figure out who you all are on the other side of it. That's not a problem. That's the opportunity.
            </p>
          </CardContent>
        </Card>

        {/* ─── First 6 Months ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            🏗️ The First 6 Months — Rebuilding Foundation
          </h2>
          <div className="space-y-3">
            {foundationItems.map((item) => (
              <RecoveryCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── Months 6-12 ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            🔄 Months 6–12 — Rebuilding Trust and Identity
          </h2>
          <div className="space-y-3">
            {identityItems.map((item) => (
              <RecoveryCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── The Year+ Conversation ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            💭 The Year+ Conversation — What Nobody Tells You
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            These aren't action items. They're realities. Sit with them.
          </p>
          <div className="space-y-4">
            {yearPlusCards.map((card, i) => (
              <Card
                key={i}
                className={`border-border/30 ${
                  card.sensitive
                    ? "bg-muted/10 border-l-2 border-l-muted-foreground/30"
                    : "bg-muted/15"
                }`}
              >
                <CardContent className="p-6">
                  <p className="font-semibold text-foreground mb-3 leading-snug">
                    {card.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{card.body}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ─── Stage Transitions ─── */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">What Comes Next</h2>

          {/* Continuing */}
          <Card className="border-border/30 bg-muted/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground mb-2">Continuing in long-term recovery</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    There's no "graduation" from recovery. There's no finish line where you can stop being intentional. But it does get easier. The vigilance fades. The trust rebuilds. The relationship evolves. One day you'll realize you went a whole week without thinking about relapse. That's not complacency — that's healing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* If relapse happens */}
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground mb-2">If relapse happens — even after months or years</p>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    Relapse after long-term sobriety is devastating — but it's not back to square one. Everything they've learned, everything you've built, the support networks, the skills — those don't disappear. But you need to act quickly and firmly. Relapse after a long period of sobriety can be more dangerous because tolerance has dropped.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href="tel:4582027900">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call for Support
                      </Button>
                    </a>
                    <Link to="/roadmap/relapse">
                      <Button size="sm" variant="outline">
                        Go to Relapse Stage
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Resources ─── */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Recommended Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ResourceLink label="Rebuilding Trust: A Timeline, Not a Switch" to="#" />
              <ResourceLink label="When Recovery Reveals Relationship Problems" to="#" />
              <ResourceLink label="Financial Recovery: A Practical Guide" to="#" />
              <ResourceLink label="Complacency: The Silent Relapse Trigger" to="#" />
            </CardContent>
          </Card>

          <Card className="border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Support &amp; Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ResourceLink label="Recovery Podcasts" to="/recovery-podcasts" />
              <ResourceLink label="Find a Family Therapist" to="/therapists" />
              <Link
                to="/monday-zoom-registration"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Video className="w-3.5 h-3.5 flex-shrink-0" />
                Weekly Support Group — Monday 7 PM PT
              </Link>
              <p className="text-xs text-muted-foreground italic pl-6">
                Recovery is a long game. So is support.
              </p>
              <a
                href="tel:4582027900"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Phone className="w-4 h-4" />
                Talk to Someone: (458) 202-7900
              </a>
              <p className="text-xs text-muted-foreground italic pl-6">
                Long-term support. Not just crisis response.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Relapse Stage — Coming Soon</DialogTitle>
            <DialogDescription>
              The Relapse Stage of the Recovery Roadmap is being built. In the meantime, keep working through your long-term recovery plan and stay connected with your support team.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowComingSoon(false)}>
              Close
            </Button>
            <a href="tel:4582027900">
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
function RecoveryCard({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
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

export default RoadmapLongTermRecovery;
