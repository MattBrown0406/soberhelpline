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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  ChevronDown,
  Phone,
  BookOpen,
  Headphones,
  ExternalLink,
  Shield,
  Video,
  DollarSign,
  Lock,
  Users,
  Baby,
  FileText,
  ClipboardList,
  Search,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

// ─── Immediate Actions ───
const immediateActions = [
  {
    id: "safety",
    emoji: "🚨",
    title: "Make sure everyone is physically safe",
    content:
      "Before anything else: Is anyone in immediate physical danger right now? If yes, call 911. Not in 10 minutes. Now. If there's domestic violence, if someone is unconscious, if children are being neglected or harmed — that's a 911 call, not a family discussion. Everything else can wait until everyone is safe.",
    showHotlines: true,
  },
  {
    id: "no-permanent-decisions",
    emoji: "🚨",
    title: "Do NOT make any permanent decisions today",
    content:
      "Crisis makes you want to DO something — anything — right now. Don't kick them out at 2 AM with nowhere to go. Don't drain the bank account. Don't file for divorce this week. Don't call their employer. Crisis decisions made in panic almost always make things worse. The exception: if someone is in physical danger, act immediately (see #1). Everything else can wait 24-48 hours while you make a plan.",
  },
  {
    id: "call-professional",
    emoji: "🚨",
    title: "Call a professional — right now, not later",
    content:
      "You've been trying to handle this alone. That's over. A professional interventionist has been in this exact situation hundreds of times. They will not judge you. They will not sell you something you don't need. They will tell you exactly what to do next based on YOUR specific situation. One phone call. 15 minutes. It can change everything.",
    cta: {
      type: "phone" as const,
      label: "Call Now: (541) 241-5886",
      href: "tel:5412415886",
    },
    secondaryCta: {
      label: "Or schedule a video consultation",
      href: "/book-consultation",
    },
    footnote:
      "Available 24/7 for crisis situations. If you get voicemail, leave a message — you WILL get a call back.",
  },
];

// ─── Stabilization Checklist (This Week) ───
interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  linkText?: string;
  linkUrl?: string;
}

const weekItems: ChecklistItem[] = [
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
    id: "secure-finances",
    title: "Secure finances immediately",
    description:
      "If you haven't already: remove their access to joint bank accounts, credit cards, and any cash in the house. This isn't about punishment — it's about stopping the bleeding. Addiction is expensive, and every dollar accessible is a dollar at risk. If they're on your accounts, call your bank TODAY and ask about your options. You don't have to close the account — you can remove their card, change PINs, set up alerts.",
    icon: DollarSign,
  },
  {
    id: "secure-medications",
    title: "Secure medications and valuables",
    description:
      "Lock up or remove all prescription medications from the home — yours, grandma's, the kids'. Lock up jewelry, electronics, anything pawnable. If they have access to firearms, remove them or secure them with a trigger lock and store ammunition separately. This isn't about trust — it's about removing temptation and danger during a crisis.",
    icon: Lock,
  },
  {
    id: "tell-someone",
    title: "Tell ONE trusted person what's happening",
    description:
      "You cannot do this alone. Pick one person — a sibling, a parent, a best friend — and tell them the truth. The full truth. Not 'things have been a little rough.' The real version. You need someone who can check on you, help with logistics, and remind you that you're not crazy. Addiction isolates families just as much as it isolates the addict. Break the isolation today.",
    icon: Users,
  },
  {
    id: "protect-children",
    title: "Protect the children",
    description:
      "If there are children in the home, they need to be shielded from the worst of this — but not lied to. Age-appropriate honesty is always better than pretending everything is fine (they already know it's not). If the situation is volatile, make a plan for where the kids can go on short notice — a grandparent, aunt/uncle, trusted friend. Have a bag packed. This isn't dramatic — it's prepared.",
    icon: Baby,
    linkText: "Protecting Children from Addiction",
    linkUrl: "/protecting-children-addiction",
  },
  {
    id: "write-boundaries",
    title: "Write down your non-negotiable boundaries",
    description:
      "In crisis, boundaries get blurry. You say 'never again' and then cave 12 hours later because they're crying or threatening. Right now, while you're thinking clearly, write down 2-3 things that are absolutely non-negotiable. Not 10. Not a contract. Just 2-3 lines in the sand that you WILL enforce no matter what. Examples: 'No using in the house — if you use, you leave that night.' 'No driving the kids anywhere — I handle all transportation.' 'No money — period, for any reason, no exceptions.' Write them down. Tell someone else what they are. That person is your accountability partner.",
    icon: FileText,
    linkText: "Boundary Setting Worksheet",
    linkUrl: "/boundary-setting-worksheet",
  },
];

// ─── Path Forward (This Month) ───
const monthItems: ChecklistItem[] = [
  {
    id: "professional-assessment",
    title: "Get a professional assessment of your options",
    description:
      "Every crisis has a path forward — but the right path depends on your specific situation. How long has the addiction been active? Have they been to treatment before? Are they willing to talk? Are they in legal trouble? A professional interventionist or addiction counselor can assess your situation and map out your real options — not the ones you Googled at 3 AM. This is not optional. Get a professional involved.",
    icon: ClipboardList,
  },
  {
    id: "research-treatment",
    title: "Research treatment options (but don't book anything yet)",
    description:
      "If you're heading toward treatment, start researching — but do NOT book a facility based on a Google ad or a 'helpline' that's actually a patient brokering operation. The treatment industry has a dark side, and desperate families are the target. Use vetted resources only. Our provider directory lists only facilities we've personally investigated — no referral fees, no kickbacks, no brokering.",
    icon: Search,
    linkText: "Browse Vetted Providers",
    linkUrl: "/inpatient-treatment",
  },
  {
    id: "start-own-recovery",
    title: "Start your own recovery",
    description:
      "Here's the thing no one tells you: the addict isn't the only one who needs recovery. You've been living in crisis mode — hypervigilant, anxious, angry, exhausted. Your nervous system is fried. You deserve support too, and getting it isn't selfish — it's strategic. A family that's falling apart can't help anyone get sober. Start with one thing: our free weekly support group, a therapist, Al-Anon, or even just reading one article about family recovery.",
    icon: Heart,
    linkText: "Understanding Family Recovery",
    linkUrl: "/family-support",
  },
];

const STORAGE_KEY = "roadmap-crisis-checklist";

const RoadmapCrisis = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
  }, []);

  const allItems = [...weekItems, ...monthItems];
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
        title="Crisis Stage — Recovery Roadmap | Sober Helpline"
        description="Things are falling apart. You're exhausted, scared, and out of ideas. Here's exactly what to do next — a calm, step-by-step crisis action plan for families."
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-amber-500/10 via-background to-accent/10 border-b border-border/50 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🟡</span>
            <span className="text-sm font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full">
              Crisis Stage
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Things are falling apart. You're in the right place.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            You're exhausted, scared, and out of ideas. That's okay. Here's exactly what to do next.
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
        {/* ─── RIGHT NOW — Immediate Actions ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            🚨 Right Now — Do These First
          </h2>
          <p className="text-muted-foreground mb-6">These are not optional. Do them in order.</p>
          <div className="space-y-4">
            {immediateActions.map((action) => (
              <ImmediateActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>

        {/* ─── This Week — Stabilization ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            ✅ This Week — Stabilization Checklist
          </h2>
          <div className="space-y-3">
            {weekItems.map((item) => (
              <CrisisActionCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── This Month — Path Forward ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📋 This Month — Path Forward
          </h2>
          <div className="space-y-3">
            {monthItems.map((item) => (
              <CrisisActionCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
                showSpecialCta={item.id}
              />
            ))}
          </div>
        </div>

        {/* ─── If Things Get Worse ─── */}
        <Alert className="border-destructive/30 bg-destructive/5 py-5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="ml-2">
            <p className="font-semibold text-foreground mb-1">
              If the situation escalates — overdose, violence, suicide threat — call 911 immediately.
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              You are not overreacting. You are not betraying them. You are saving a life.
            </p>
            <p className="text-sm text-muted-foreground">
              If you've been in crisis mode for weeks and nothing is changing, it may be time for a professional intervention. This is what interventionists do — they break through when the family can't.
            </p>
            <a href="tel:5412419151">
              <Button variant="destructive" size="sm" className="mt-3">
                <Phone className="w-4 h-4 mr-1" />
                Call Now: (541) 241-9151
              </Button>
            </a>
          </AlertDescription>
        </Alert>

        {/* ─── If Things Stabilize ─── */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">
                  If things start calming down, that's good — but don't mistake a pause for progress.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Crisis often comes in waves. Use the calm to prepare, not to relax. When you're ready, move to the next stage of your roadmap.
                </p>
                <Button onClick={() => setShowComingSoon(true)}>
                  I'm Ready for the Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Crisis Resources ─── */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-destructive" />
                Emergency Numbers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CrisisPhone label="Emergency" number="911" />
              <CrisisPhone label="Suicide & Crisis Lifeline" number="988" />
              <CrisisPhone label="Domestic Violence Hotline" number="1-800-799-7233" tel="18007997233" />
              <CrisisPhone label="SAMHSA National Helpline" number="1-800-662-4357" tel="18006624357" />
              <CrisisPhone label="Poison Control (overdose)" number="1-800-222-1222" tel="18002221222" />
              <CrisisPhone label="Professional Help (24/7)" number="(541) 241-9151" tel="5412419151" />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Crisis Reading & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ResourceLink label="Understanding Addiction" to="/understanding-addiction" />
              <ResourceLink label="Family Support Resources" to="/family-support" />
              <ResourceLink label="Recovery Podcasts" to="/recovery-podcasts" />
              <ResourceLink label="Blog: Latest Articles" to="/blog" />
              <div className="pt-2 border-t border-border/50 mt-2">
                <Link
                  to="/monday-zoom-registration"
                  className="flex items-center gap-2 text-sm text-primary hover:underline py-1 font-medium"
                >
                  <Video className="w-4 h-4" />
                  Weekly Support Group — Monday 7 PM PT
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pre-Intervention Stage — Coming Soon</DialogTitle>
            <DialogDescription>
              The next stage of the Recovery Roadmap is being built. In the meantime, keep working through your crisis checklist and reach out to a professional when you're ready.
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

// ─── Immediate Action Card ───
function ImmediateActionCard({
  action,
}: {
  action: (typeof immediateActions)[number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-0">
          <CollapsibleTrigger className="flex items-start gap-3 p-5 w-full text-left group">
            <span className="text-xl flex-shrink-0 mt-0.5">{action.emoji}</span>
            <span className="font-bold text-foreground text-lg leading-snug flex-1">
              {action.title}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-5 pb-5 pl-14 space-y-4">
              <p className="text-muted-foreground leading-relaxed">{action.content}</p>

              {action.showHotlines && (
                <div className="flex flex-wrap gap-2">
                  <a href="tel:911">
                    <Button variant="destructive" size="sm">
                      <Phone className="w-4 h-4 mr-1" /> 911
                    </Button>
                  </a>
                  <a href="tel:988">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" /> 988 Crisis Lifeline
                    </Button>
                  </a>
                  <a href="tel:18007997233">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" /> DV Hotline
                    </Button>
                  </a>
                </div>
              )}

              {action.cta && (
                <div>
                  <a href={action.cta.href}>
                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                      <Phone className="w-4 h-4 mr-2" />
                      {action.cta.label}
                    </Button>
                  </a>
                </div>
              )}

              {action.secondaryCta && (
                <Link
                  to={action.secondaryCta.href}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {action.secondaryCta.label}
                </Link>
              )}

              {action.footnote && (
                <p className="text-xs text-muted-foreground italic">{action.footnote}</p>
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}

// ─── Checklist Action Card ───
function CrisisActionCard({
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
  const Icon = item.icon;

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

                {showSpecialCta === "professional-assessment" && (
                  <a href="tel:5412419151">
                    <Button size="sm" className="mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Schedule Assessment: (541) 241-9151
                    </Button>
                  </a>
                )}

                {showSpecialCta === "research-treatment" && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2 rounded-md">
                    ⚠️ Be cautious of "free helplines" that are actually lead generation for treatment centers. If they ask for your insurance information before your name, hang up.
                  </p>
                )}

                {showSpecialCta === "start-own-recovery" && (
                  <Link
                    to="/monday-zoom-registration"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join Our Free Weekly Support Group
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

// ─── Helpers ───
function CrisisPhone({ label, number, tel }: { label: string; number: string; tel?: string }) {
  return (
    <a href={`tel:${tel || number}`} className="flex items-center justify-between py-1.5 group">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-primary group-hover:underline">{number}</span>
    </a>
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

export default RoadmapCrisis;
