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
  AlertTriangle,
  ChevronDown,
  Phone,
  BookOpen,
  Headphones,
  ExternalLink,
  Video,
  Eye,
  FileText,
  BookOpenCheck,
  Brain,
  MessageCircle,
  Users,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Ban,
  Heart,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

// ─── Checklist Items ───
interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  linkText?: string;
  linkUrl?: string;
  secondaryLinkText?: string;
  secondaryLinkUrl?: string;
}

const weekItems: ChecklistItem[] = [
  {
    id: "join-zoom",
    title: "Join the free “The Family Squares” Zoom call",
    description:
      "Every Monday at 7 PM PST, families just like yours come together for a free, live support call. You'll hear from others who've been exactly where you are — and from professionals who can help. You don't have to talk. Just showing up is a step. You don't need proof to join. You just need a question.",
    icon: Video,
    linkText: "Register for Monday Zoom",
    linkUrl: "/monday-zoom-registration",
  },
  {
    id: "learn-warning-signs",
    title: "Learn what the warning signs actually look like",
    description:
      "Addiction doesn't always look like what you see on TV. It's not always needles and rock bottom. Sometimes it's subtle — mood swings, new friends, money disappearing, sleeping too much or too little, losing interest in things they used to love, being secretive about their phone. Sometimes it's a personality shift you can't explain. Here's a comprehensive list of warning signs by substance — read it and see what matches.",
    icon: Eye,
    linkText: "Understanding Addiction",
    linkUrl: "/understanding-addiction",
  },
  {
    id: "pay-attention",
    title: "Start paying attention — without investigating",
    description:
      "There's a difference between being observant and playing detective. You don't need to search their room, read their texts, or follow them. You need to pay attention to patterns with clear eyes. What time do they come home? How's their mood when they arrive? Are they eating? Are they spending money they shouldn't have — or not having money they should? Keep a mental note for the next week or two. Patterns tell the truth.",
    icon: Brain,
  },
  {
    id: "write-observations",
    title: "Write down what you've noticed — with dates",
    description:
      "Get a notebook or open a note on your phone that only you can access. Write down what you've observed — not what you think it means, just what you've seen. 'Tuesday 3/4 — came home at 2 AM, said they were at Jake's. Pupils dilated. Went straight to bed.' 'Saturday 3/8 — asked for $200, couldn't explain what for. Got angry when I asked.' Dates and specifics. This is your evidence file. You may never need it — but if you do, you'll be glad you have it.",
    icon: FileText,
  },
  {
    id: "educate-substance",
    title: "Educate yourself on the substance you suspect",
    description:
      "If you have an idea what they might be using — pills, alcohol, weed, something harder — learn about it. Not from scare-tactic websites. Real information: what it does, what the signs of use look like, what withdrawal looks like, how fast it progresses. Knowledge is the opposite of panic. The more you understand, the better you'll be able to respond when the time comes.",
    icon: BookOpenCheck,
    linkText: "Understanding Addiction",
    linkUrl: "/understanding-addiction",
  },
  {
    id: "check-assumptions",
    title: "Check your own assumptions",
    description:
      "Before you go further, be honest with yourself about a few things: Have you been explaining away what you've seen? ('They're just stressed.' 'It's just a phase.' 'They only drink on weekends.') Have you been avoiding the topic because you're afraid of the answer? That's normal — and it's human. But denial in the family is the mirror image of denial in the addict. Naming it is the first step. You don't have to act on it yet. Just name it.",
    icon: Heart,
  },
];

const monthItems: ChecklistItem[] = [
  {
    id: "calm-conversation",
    title: "Have a calm, curious conversation (not a confrontation)",
    description:
      "When you're ready — and only when you're ready — you can open a conversation. This is NOT a confrontation. Not an accusation. Not 'I know what you're doing.' It's a check-in. 'Hey, I've noticed you seem different lately. Is everything okay? I'm asking because I care, not because I'm trying to start a fight.' That's it. Then listen. Really listen. They'll probably deflect or deny — that's expected. You're not trying to get a confession. You're planting a seed that says 'I see you, and I'm paying attention.'",
    icon: MessageCircle,
    linkText: "Communication Guide",
    linkUrl: "/communication-guide",
  },
  {
    id: "talk-to-someone",
    title: "Talk to someone who's been through this",
    description:
      "You don't have to figure this out in isolation. Talking to someone who's been in your shoes — another family member who's dealt with addiction, a support group, even an online community — can help you process what you're seeing without the fear of judgment. Sometimes you just need someone to say 'Yeah, that's what it looked like for us too.'",
    icon: Users,
    linkText: "Join Our Free Weekly Support Group",
    linkUrl: "/monday-zoom-registration",
  },
  {
    id: "professional-consultation",
    title: "Consider a professional consultation — even this early",
    description:
      "You don't have to wait for proof. You don't have to wait for a crisis. A professional interventionist or addiction counselor can help you assess what you're seeing and tell you whether your concerns are founded — and what to do about it either way. Think of it like going to the doctor when something feels wrong. You don't wait for the diagnosis to make the appointment. A 15-minute call can save you months of guessing.",
    icon: PhoneCall,
  },
];

// ─── What NOT to Do ───
const dontDoItems = [
  {
    title: "Don't search their room, phone, or belongings.",
    description:
      "If you find something, you can't un-find it — and the confrontation that follows usually goes badly. Wait until you have a plan.",
  },
  {
    title: "Don't tell everyone.",
    description:
      "Your instinct might be to call your sister, your mom, their boss. Hold off. Once other people know, the situation gets more volatile and harder to manage. Tell ONE person you trust. That's enough for now.",
  },
  {
    title: "Don't issue ultimatums you're not ready to enforce.",
    description:
      "\"If you're using drugs, you're out of this house\" only works if you mean it AND have a plan. Empty threats teach them your words don't mean anything.",
  },
  {
    title: "Don't Google \"how to drug test my kid/spouse.\"",
    description:
      "Home drug tests create more problems than they solve at this stage. If you're wrong, you've destroyed trust. If you're right, you've started a war without a battle plan. Get professional guidance first.",
  },
  {
    title: "Don't blame yourself.",
    description:
      "You didn't cause this. You can't control it. And you can't cure it. But you CAN respond to it wisely — and that's exactly what you're doing right now.",
  },
];

const STORAGE_KEY = "roadmap-suspicion-checklist";

const RoadmapSuspicion = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChecked(JSON.parse(saved));
      } catch {}
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
        title="Suspicion Stage — Recovery Roadmap | Sober Helpline"
        description="Something feels off. You can't quite name it, but you know something has changed. Trust that instinct — here's how to figure out what you're dealing with."
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-rose-500/8 via-background to-accent/10 border-b border-border/50 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔴</span>
            <span className="text-sm font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 px-3 py-1 rounded-full">
              Suspicion Stage
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Something feels off. Trust that instinct.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            You can't quite name it, but you know something has changed. You're not imagining things. Let's help you figure out what you're dealing with.
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
        {/* ─── Trust What You're Seeing ─── */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  👁️ First — Trust What You're Seeing
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you're here, something made you worried enough to search for answers. That matters. Families almost always know before they have proof. The gut feeling that something is wrong? It's usually right. You're not paranoid. You're not overreacting. And looking for information is not a betrayal — it's love.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── This Week — Clarity Checklist ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            ✅ This Week — Clarity Checklist
          </h2>
          <div className="space-y-3">
            {weekItems.map((item) => (
              <SuspicionActionCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── This Month — Next Steps ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📋 This Month — Next Steps
          </h2>
          <div className="space-y-3">
            {monthItems.map((item) => (
              <SuspicionActionCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
                showSpecialCta={item.id}
              />
            ))}
          </div>
        </div>

        {/* ─── What NOT to Do ─── */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Ban className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              What NOT to Do Right Now
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These are common mistakes families make at this stage. Avoiding them will protect you — and your loved one.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {dontDoItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold text-lg leading-none mt-0.5 flex-shrink-0">✕</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ─── When You're Ready ─── */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">
                  When your suspicions have been confirmed
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  If you've seen the evidence, had the conversation, or just know in your gut — it's time for the next stage. The Confirmation Stage gives you a concrete action plan for what to do once you know.
                </p>
                <Link to="/roadmap/confirmation">
                  <Button>
                    Move to Confirmation Stage
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── If Things Escalate ─── */}
        <Alert className="border-destructive/30 bg-destructive/5 py-5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="ml-2">
            <p className="font-semibold text-foreground mb-1">
              If things go from suspicion to crisis fast — an overdose, a DUI, a violent episode — skip ahead. Get safe first.
            </p>
            <Link to="/roadmap/crisis">
              <Button variant="destructive" size="sm" className="mt-3">
                Go to Crisis Stage
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </AlertDescription>
        </Alert>

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
              <Link
                to="/monday-zoom-registration"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Video className="w-3.5 h-3.5 flex-shrink-0" />
                Weekly Support Group — Monday 7 PM PT
              </Link>
              <a
                href="tel:5412415668"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Phone className="w-4 h-4" />
                Talk to Someone: (541) 241-5668
              </a>
              <p className="text-xs text-muted-foreground italic pl-6">
                Even if you're not sure yet. Especially if you're not sure yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── Checklist Action Card ───
function SuspicionActionCard({
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
      <Card
        className={`border-border/50 transition-all ${checked ? "bg-muted/30 border-primary/20" : "bg-card"}`}
      >
        <CardContent className="p-0">
          <div className="flex items-start gap-3 p-4">
            <Checkbox checked={checked} onCheckedChange={() => onToggle()} className="mt-1" />
            <div className="flex-1 min-w-0">
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <span
                  className={`font-semibold text-foreground leading-snug ${checked ? "line-through opacity-60" : ""}`}
                >
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {item.linkUrl && item.linkText && (
                  <Link
                    to={item.linkUrl}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {item.linkText}
                  </Link>
                )}

                {showSpecialCta === "professional-consultation" && (
                  <a href="tel:5412415668">
                    <Button size="sm" className="mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Schedule a Free Consultation: (541) 241-5668
                    </Button>
                  </a>
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

export default RoadmapSuspicion;
