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
  Users,
  ExternalLink,
  Ban,
  FileText,
  UserPlus,
  BookOpenCheck,
  MessageCircle,
  PhoneCall,
  Shield,
  Video,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  linkText?: string;
  linkUrl?: string;
  section: "week" | "month";
}

const actionItems: ActionItem[] = [
  {
    id: "join-zoom",
    title: "Join the free “The Family Squares” Zoom call",
    description:
      "Every Monday at 7 PM PST, families just like yours come together for a free, live support call. You'll hear from others who've been exactly where you are — and from professionals who can help. You don't have to talk. Just showing up is a step.",
    icon: Video,
    linkText: "Register for Monday Zoom",
    linkUrl: "/monday-zoom-registration",
    section: "week",
  },
  {
    id: "stop-money",
    title: "Stop giving them money — for any reason",
    description:
      "Every dollar you give is potentially funding their next use. This includes paying their bills, buying their groceries, or 'lending' money you know you'll never see again. This isn't punishment — it's removing the oxygen from the fire.",
    icon: Ban,
    linkText: "Read: Enabling vs. Helping",
    linkUrl: "/family-support",
    section: "week",
  },
  {
    id: "document-incidents",
    title: "Write down 3 specific recent incidents with dates",
    description:
      "When the time comes to have a conversation — or an intervention — you'll need specifics, not feelings. 'You were drunk last Tuesday and missed your daughter's recital' hits different than 'you drink too much.' Start documenting now.",
    icon: FileText,
    section: "week",
  },
  {
    id: "identify-allies",
    title: "Identify who else in the family knows",
    description:
      "Addiction thrives in secrecy and isolation. You need allies — people who see what you see and are willing to act. Make a list of family members or close friends who are aware of the problem. You'll need them.",
    icon: UserPlus,
    section: "week",
  },
  {
    id: "read-enabling",
    title: "Read: Understanding the difference between helping and enabling",
    description:
      "The hardest truth for families: most of what you're doing to 'help' is actually making things worse. Enabling isn't love — it's fear disguised as compassion. Understanding the difference is the first step to real change.",
    icon: BookOpenCheck,
    linkText: "Read: Enabling vs. Helping Guide",
    linkUrl: "/family-support",
    section: "week",
  },
  {
    id: "honest-conversation",
    title: "Have ONE honest conversation using a proven framework",
    description:
      "Not a lecture. Not a fight. Not an ambush. One calm, honest conversation using a specific framework. We'll give you the words.",
    icon: MessageCircle,
    linkText: "Get the Communication Guide",
    linkUrl: "/communication-guide",
    section: "month",
  },
  {
    id: "schedule-consultation",
    title: "Schedule a free consultation with a professional interventionist",
    description:
      "A 15-minute call can change everything. A professional interventionist has done this thousands of times. They'll tell you exactly where you stand and what your options are — no pressure, no sales pitch.",
    icon: PhoneCall,
    section: "month",
  },
  {
    id: "set-boundary",
    title: "Set your first boundary — with a real consequence",
    description:
      "Boundaries aren't boundaries without consequences attached. 'Don't come home drunk' means nothing if they come home drunk and nothing happens. We'll help you set a boundary that means something.",
    icon: Shield,
    linkText: "Boundary Setting Worksheet",
    linkUrl: "/boundary-setting-worksheet",
    section: "month",
  },
];

const STORAGE_KEY = "roadmap-confirmation-checklist";

const RoadmapConfirmation = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
  }, []);

  const toggleItem = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPercent = (completedCount / actionItems.length) * 100;

  const weekItems = actionItems.filter((i) => i.section === "week");
  const monthItems = actionItems.filter((i) => i.section === "month");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Confirmation Stage — Recovery Roadmap | Sober Helpline"
        description="You know your loved one is using. Get your action plan with specific steps for the Confirmation stage of family recovery."
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-accent/50 to-background border-b border-border/50 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🟠</span>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Confirmation Stage
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            You know your loved one is using. You don't know what to do.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            That's exactly where most families start — and exactly where we can help. Follow the steps below, one at a time.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Progress value={progressPercent} className="flex-1 h-3 max-w-xs" />
            <span className="text-sm font-medium text-muted-foreground">
              {completedCount}/{actionItems.length} completed
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl py-10 space-y-10">
        {/* This Week */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📋 This Week — Action Checklist
          </h2>
          <div className="space-y-3">
            {weekItems.map((item) => (
              <ActionCard key={item.id} item={item} checked={!!checked[item.id]} onToggle={() => toggleItem(item.id)} />
            ))}
          </div>
        </div>

        {/* This Month */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📅 This Month — Next Steps
          </h2>
          <div className="space-y-3">
            {monthItems.map((item) => (
              <ActionCard key={item.id} item={item} checked={!!checked[item.id]} onToggle={() => toggleItem(item.id)} />
            ))}
          </div>
        </div>

        {/* Crisis Alert */}
        <Alert className="border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="ml-2">
            <p className="font-semibold text-foreground mb-1">
              If things get worse before they get better — that's normal.
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              But if you're in crisis, don't wait.
            </p>
            <Button variant="destructive" size="sm" onClick={() => setShowCrisisModal(true)}>
              I Need Help Now
            </Button>
          </AlertDescription>
        </Alert>

        {/* Resources Sidebar */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Recommended Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ResourceLink label="Understanding Addiction as a Disease" to="/understanding-addiction" />
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
              <ResourceLink label="Join Our Weekly Support Group" to="/monday-zoom-registration" />
              <a href="tel:4582027900" className="flex items-center gap-2 text-sm text-primary hover:underline py-1">
                <Phone className="w-4 h-4" />
                Talk to Someone: (458) 202-7900
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Crisis Modal */}
      <Dialog open={showCrisisModal} onOpenChange={setShowCrisisModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Crisis Resources
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <p className="font-semibold text-foreground">If anyone is in immediate danger, call 911</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-semibold text-foreground">National Crisis Hotline: 988</p>
              <p className="text-sm text-muted-foreground">Call or text, 24/7</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-semibold text-foreground">Professional Intervention Help</p>
              <a href="tel:4582027900" className="text-primary hover:underline font-medium">(458) 202-7900</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function ActionCard({
  item,
  checked,
  onToggle,
}: {
  item: ActionItem;
  checked: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={`border-border/50 transition-all ${checked ? "bg-muted/30 border-primary/20" : "bg-card"}`}>
        <CardContent className="p-0">
          <div className="flex items-start gap-3 p-4">
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggle()}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <span className={`font-semibold text-foreground leading-snug ${checked ? "line-through opacity-60" : ""}`}>
                  {item.title}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                {item.linkUrl && item.linkText && (
                  <Link to={item.linkUrl} className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {item.linkText}
                  </Link>
                )}
                {item.id === "schedule-consultation" && (
                  <a href="tel:4582027900">
                    <Button size="sm" className="mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Call (458) 202-7900
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

export default RoadmapConfirmation;
