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
  Sparkles,
  Heart,
  Shield,
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  Users,
  Sunrise,
  Brain,
  Scale,
  Baby,
  CloudRain,
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
  extraLinks?: { text: string; url: string }[];
}

// ─── First Week Home ───
const firstWeekItems: ChecklistItem[] = [
  {
    id: "reentry-agreement",
    title: "Implement the re-entry agreement — day one",
    description:
      "If you built a re-entry agreement during the Treatment Stage, now is when it goes live. Not next week. Not 'when things settle down.' Day one. Sit down together — calmly, not as an interrogation — and review the expectations. Meeting attendance, drug testing, curfew, financial rules, household responsibilities. If they pushback ('I just got home, give me a break'), hold firm: 'This is how we start fresh. These aren't punishments — they're the structure that keeps you safe.' If you didn't build a re-entry agreement, do it now. Today. Even a simple one is better than none.",
    icon: Shield,
  },
  {
    id: "meeting-routine",
    title: "Establish the meeting routine immediately",
    description:
      "90 meetings in 90 days. That's the standard recommendation for a reason — it builds a habit, creates a support network, and fills time that would otherwise be dangerous. Help them find meetings: AA, NA, SMART Recovery, Celebrate Recovery, whatever fits. Drive them if needed. Don't nag — but do notice if they stop going. The meeting schedule should be set before the first week is over. Not 'I'll figure it out' — specific meetings, specific times, on a calendar. If they resist: 'This was part of our agreement. I'm not asking you to love it. I'm asking you to go.'",
    icon: Users,
  },
  {
    id: "space-balance",
    title: "Give them space — but not too much",
    description:
      "This is the tightrope. You want to hover. You want to check their phone, smell their breath, search their room. That's your trauma talking, and it's understandable — but it will destroy the relationship faster than relapse will. At the same time, total hands-off isn't the answer either. A newly sober person with zero accountability and unlimited privacy is at high risk. The middle ground: agreed-upon check-ins (not interrogations), open-door policy on devices (by agreement, not by snooping), and regular honest conversations about how they're feeling. Trust is rebuilt through consistent behavior over time — not through surveillance.",
    icon: Scale,
  },
];

// ─── First 30 Days ───
const thirtyDayItems: ChecklistItem[] = [
  {
    id: "stop-eggshells",
    title: "Stop walking on eggshells",
    description:
      "You're doing it right now. Tiptoeing around them. Avoiding conflict. Not saying what you really feel because you're terrified that any stress will trigger a relapse. Here's the truth: you cannot keep someone sober by managing their environment. Sobriety is their responsibility. Your responsibility is to be honest, boundaried, and present — not to be their emotional bodyguard. You're allowed to have a bad day. You're allowed to be angry about what happened. You're allowed to need things from them. Pretending everything is fine when it isn't is a different kind of enabling — and it will eat you alive. Start being honest. Gently, but honest.",
    icon: Eye,
  },
  {
    id: "trust-earned",
    title: "Address the elephant: trust is earned, not given",
    description:
      "They will want things to go back to normal. They'll say they've changed. They'll be frustrated that you're still cautious. This conversation needs to happen early: 'I love you. I believe you're trying. But trust was broken over months or years, and it doesn't come back in weeks. I'm going to trust your actions over time — not your words right now. That's not punishment. That's just how trust works.' This is one of the hardest things to say to someone you love. But it's honest, and honest is the only thing that works now. They need to hear it, and you need to say it.",
    icon: Heart,
  },
  {
    id: "pink-cloud",
    title: "Watch for pink cloud syndrome",
    description:
      "In early recovery, many people experience a 'pink cloud' — a euphoric period where everything feels amazing. They're grateful, motivated, making plans, saying all the right things. It feels like a miracle. Enjoy it — but don't trust it completely. The pink cloud fades, usually around the 30-60 day mark. When it does, reality hits hard: the wreckage is still there, the feelings they were numbing come flooding back, and the daily grind of sobriety without the high of novelty sets in. This is the highest-risk period for relapse. When you see the mood shift, don't panic — but do pay attention. Increase support, encourage meeting attendance, and check in more frequently.",
    icon: Sunrise,
  },
  {
    id: "your-recovery",
    title: "Continue YOUR recovery work",
    description:
      "The single most common mistake families make in early recovery: they stop taking care of themselves. They were in crisis mode, they went to support groups, they saw a therapist — and now that things are 'better,' they stop. Don't. You are recovering from trauma. Living with active addiction rewires your nervous system just like the drugs rewired theirs. You need ongoing support — therapy, support groups, self-care, boundaries around your own mental health. If you burn out, you can't help anyone. Keep going to your support group. Keep your therapy appointments. This is not selfish — it's survival.",
    icon: Brain,
    extraLinks: [
      { text: "Join Our Free Weekly Support Group", url: "/monday-zoom-registration" },
    ],
  },
];

// ─── Days 30-90 ───
const ninetyDayItems: ChecklistItem[] = [
  {
    id: "hard-conversations",
    title: "Start having real conversations about what happened",
    description:
      "At some point — usually after the first month, when things feel more stable — the hard conversations need to start. Not all at once. Not in anger. But honestly. The lies. The money. The broken promises. The things the kids saw. The trust that was shattered. These conversations are best done in family therapy with a professional who can keep things productive. Without a mediator, they tend to devolve into blame and defensiveness. If you're not in family therapy, start now. The wounds that don't get aired don't heal — they fester.",
    icon: MessageSquare,
  },
  {
    id: "rebuild-responsibility",
    title: "Rebuild structure and responsibility gradually",
    description:
      "In early recovery, your loved one needs to start contributing — to the household, to the family, to their own life. Not all at once, but steadily. Chores, employment (or job searching), parenting responsibilities, financial contributions. Sitting around the house 'focusing on recovery' with no responsibilities is a trap. Idle time is dangerous time. Recovery doesn't happen in a vacuum — it happens in real life, with real responsibilities. Add structure gradually: week 2, they're handling their own laundry and cooking one meal. Month 2, they're job searching or working. Month 3, they're carrying a meaningful share of household responsibility. Progress, not perfection.",
    icon: Clock,
  },
  {
    id: "relapse-signs",
    title: "Know the relapse warning signs",
    description:
      "Relapse doesn't start with using. It starts weeks before. The warning signs: skipping meetings ('I don't need them anymore'), isolating (spending more time alone, less time with sober support), romanticizing the past ('It wasn't that bad'), irritability and restlessness that increases over days, reconnecting with old friends or going to old places, stopping medication (if prescribed), lying about small things (the small lies always come first), and the big one — 'I can handle having just one.' If you see these signs, don't accuse. Do express concern: 'I've noticed [specific behavior]. I'm not accusing you of anything — I'm telling you what I see because I love you and I promised I would.' Then call your support network.",
    icon: AlertTriangle,
  },
];

// ─── Things That Will Happen ───
const realityChecks = [
  {
    title: "They'll test a boundary.",
    description:
      "It's not a matter of if, it's when. They'll come home late. They'll skip a meeting. They'll spend money they shouldn't. How you respond to the FIRST boundary test sets the tone for everything after it. Enforce the consequence calmly and without negotiation. 'We agreed to a curfew. You broke it. Here's what we agreed would happen.' If you let the first one slide, every boundary after it is meaningless.",
    icon: Shield,
  },
  {
    title: "They'll say you're not supportive enough.",
    description:
      "'You treat me like a criminal.' 'You don't trust me.' 'If you really supported my recovery, you'd stop bringing up the past.' This is manipulation — sometimes intentional, sometimes not. Your response: 'I'm supporting your recovery by holding you accountable. That's what support looks like right now. It will change as trust rebuilds.'",
    icon: MessageSquare,
  },
  {
    title: "You'll want to control everything.",
    description:
      "You'll want to track their location, count their pills, smell their coffee. This is your PTSD, not their problem. Get help for it. A therapist. A support group. Your own recovery work. You cannot monitor your way to peace of mind — it doesn't work and it poisons the relationship.",
    icon: Eye,
  },
  {
    title: "The kids will struggle.",
    description:
      "Even if the kids are relieved, they're confused. The parent who disappeared is back. The house is different. Everyone's acting weird. Kids process this slowly and often act out before they talk about it. Family therapy that includes the kids (age-appropriate) is important. Don't force conversations — but create space for them. 'Things have been different around here. You can talk to me about it whenever you want. No question is wrong.'",
    icon: Baby,
  },
  {
    title: "You'll grieve — and that's confusing.",
    description:
      "You'd think you'd be happy. And you are — sort of. But you're also grieving. Grieving the years lost. Grieving the relationship you thought you had. Grieving the person they were before addiction. Grieving your own lost time, health, and peace. Grief in recovery is real and rarely talked about. It doesn't mean you're not grateful. It means you're human.",
    icon: CloudRain,
  },
];

const STORAGE_KEY = "roadmap-early-recovery-checklist";

const RoadmapEarlyRecovery = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
  }, []);

  const allItems = [...firstWeekItems, ...thirtyDayItems, ...ninetyDayItems];
  const toggleItem = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPercent = (completedCount / allItems.length) * 100;

  const openComingSoon = (title: string) => {
    setComingSoonTitle(title);
    setShowComingSoon(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Early Recovery Stage — Recovery Roadmap | Sober Helpline"
        description="They're home from treatment. The first 90 days are critical — for them and for you. Here's how to navigate early recovery as a family."
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-600/8 via-background to-accent/10 border-b border-border/50 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🟢</span>
            <span className="text-sm font-semibold bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">
              Early Recovery Stage
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            They're home. They're sober. Now what?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Everything feels fragile — because it is. But fragile doesn't mean hopeless. Here's how to navigate the first 90 days without losing your mind or their sobriety.
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
        <Card className="border-emerald-600/20 bg-emerald-600/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Sunrise className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  🟢 The Uncomfortable Truth
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Here's what nobody told you: the first 90 days of recovery are often harder on the family than treatment was. During treatment, professionals handled the hard stuff. Now it's on you. They're sober but raw — emotionally volatile, physically recovering, and terrified. You're relieved but hypervigilant — watching every move, analyzing every mood, holding your breath every time they leave the room. This is the most dangerous stage for the relationship. Not because anyone is doing something wrong — but because two traumatized people are trying to live together while healing from different wounds at the same time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Aftercare Disclaimer ─── */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  ⚠️ Important: Follow Your Treatment Team's Aftercare Plan
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The guidance on this page is designed to support your family — but it does not replace the aftercare recommendations from your loved one's professional treatment team. If the treatment team recommended sober living, IOP (Intensive Outpatient Program), PHP (Partial Hospitalization), continued therapy, or any other step-down level of care — those recommendations should be followed. Treatment professionals build aftercare plans based on clinical assessment and your loved one's specific needs. Skipping recommended levels of care to "just come home" is one of the most common and most costly mistakes families make. Trust the professionals who know your case.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── First Week After Treatment ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            🏠 First Week After Treatment — Immediate Priorities
          </h2>
          <div className="space-y-3">
            {firstWeekItems.map((item) => (
              <RecoveryCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── First 30 Days ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            ✅ The First 30 Days — Stabilization
          </h2>
          <div className="space-y-3">
            {thirtyDayItems.map((item) => (
              <RecoveryCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── Days 30-90 ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📋 Days 30-90 — Building the New Normal
          </h2>
          <div className="space-y-3">
            {ninetyDayItems.map((item) => (
              <RecoveryCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── Things That Will Happen ─── */}
        <div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              Things That Will Happen (And How to Handle Them)
            </h2>
            <p className="text-muted-foreground mb-6">
              These aren't worst-case scenarios. These are near-certainties. Knowing they're coming is half the battle.
            </p>
            <div className="space-y-4">
              {realityChecks.map((item, i) => (
                <Card key={i} className="border-border/50 bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground mb-2">{item.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Stage Transitions ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            What Comes Next
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* When things stabilize */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground mb-2">When things stabilize (90+ days)</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you've made it 90 days with consistent sobriety, meeting attendance, and honest communication — breathe. You're building something real. The next stage is about the long game: rebuilding trust, processing the past, and creating a new normal.
                    </p>
                    <Link to="/roadmap/long-term-recovery">
                      <Button size="sm">
                        Move to Long-Term Recovery
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
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
                    <p className="font-bold text-foreground mb-2">If relapse happens</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Relapse is not failure. It's a setback in a chronic illness. What matters is how fast you respond and how firmly you hold your boundaries. You already have a plan — use it.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a href="tel:5038362136">
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
        </div>

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
              <ResourceLink label="Aftercare Checklist" to="/aftercare-checklist" />
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
              <ResourceLink label="Find a Family Therapist" to="/therapists" />
              <Link
                to="/monday-zoom-registration"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Video className="w-3.5 h-3.5 flex-shrink-0" />
                Weekly Support Group — Monday 7 PM PT
              </Link>
              <p className="text-xs text-muted-foreground italic pl-6">
                You need this more now than you did during crisis.
              </p>
              <a
                href="tel:5038362136"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Phone className="w-4 h-4" />
                Talk to Someone: (503) 836-2136
              </a>
              <p className="text-xs text-muted-foreground italic pl-6">
                Post-treatment support. We don't disappear after the intervention.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{comingSoonTitle} — Coming Soon</DialogTitle>
            <DialogDescription>
              The {comingSoonTitle} of the Recovery Roadmap is being built. In the meantime, keep working through your early recovery checklist and stay connected with your support team.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowComingSoon(false)}>
              Close
            </Button>
            <a href="tel:5038362136">
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

                {item.extraLinks?.map((link, i) => (
                  <Link
                    key={i}
                    to={link.url}
                    className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {link.text}
                  </Link>
                ))}
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

export default RoadmapEarlyRecovery;
