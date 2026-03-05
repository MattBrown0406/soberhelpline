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
  Clock,
  Shield,
  Ban,
  Sparkles,
  Heart,
  ArrowRight,
  HeartPulse,
  Home,
  DollarSign,
  CalendarCheck,
  ClipboardList,
  AlertTriangle,
  MessageCircle,
  BriefcaseMedical,
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
  warning?: string;
}

// ─── First 72 Hours Checklist ───
const immediateItems: ChecklistItem[] = [
  {
    id: "let-settle",
    title: "Let them settle in — resist the urge to call constantly",
    description:
      "The first 48-72 hours are the hardest for them. They're detoxing, disoriented, scared, angry, and grieving. They will probably call you crying, begging to come home, or raging that you did this to them. This is normal. The treatment team is handling it. Your job right now is to NOT rescue them. Most facilities restrict phone access in the first few days for exactly this reason. If they do call: 'I love you. I'm proud of you for being there. I'll talk to you when the team says it's okay.' That's it. Short. Loving. Firm.",
    icon: HeartPulse,
  },
  {
    id: "talk-treatment-team",
    title: "Talk to the treatment team — establish communication",
    description:
      "Call the facility and ask: Who is my loved one's primary counselor or case manager? How and when can I get updates? What is the family program and when does it start? What are the visitation rules? What should I NOT send or bring? Am I authorized to receive information (they may need a signed release)? Write this down. You'll need these contacts throughout treatment. If the facility doesn't have a family program or won't communicate with you — that's a red flag. Good treatment includes the family.",
    icon: MessageCircle,
  },
  {
    id: "notify-others",
    title: "Notify work, school, or anyone who needs to know — carefully",
    description:
      "Depending on the situation, people may need to be told something. An employer might need a medical leave request (you don't have to say 'rehab' — 'medical treatment' is sufficient and legally protected under FMLA in most cases). A school might need to know a parent is unavailable. Kids might need adjusted schedules. Keep the circle small and the details vague. 'They're receiving medical treatment and will be unavailable for [timeframe]' is enough for anyone who isn't immediate family.",
    icon: FileText,
  },
];

// ─── This Week Checklist ───
const weekItems: ChecklistItem[] = [
  {
    id: "family-program",
    title: "Start the family program — this is not optional",
    description:
      "If the treatment center offers a family program — family therapy, education sessions, multi-family groups — you attend. All of it. This is not a nice-to-have. Research consistently shows that family involvement during treatment is one of the strongest predictors of long-term recovery. These programs teach you things you need to know: what enabling looks like in recovery (it changes form), how to communicate without triggering, what to expect in early recovery, and how to set boundaries that support sobriety instead of undermining it. If you can't attend in person, ask about virtual options. If the facility doesn't offer a family program, find one independently. Al-Anon, our Monday support group, or a family therapist who specializes in addiction.",
    icon: Users,
    extraLinks: [
      { text: "Join Our Free Weekly Support Group", url: "/monday-zoom-registration" },
    ],
  },
  {
    id: "clean-house",
    title: "Clean house — literally",
    description:
      "While they're away, prepare the home. Remove all alcohol, drugs, paraphernalia, and anything associated with their use. All of it. Not hidden — gone. Check everywhere: medicine cabinets (lock up or remove all prescription meds, even Tylenol with codeine from a dental procedure 3 years ago), the garage, the car, coat pockets, hidden spots you know about. If other people in the household drink or use recreationally, that needs a family conversation NOW — before they come home. A newly sober person cannot come home to a full bar. This isn't negotiable.",
    icon: Home,
  },
  {
    id: "financial-reality",
    title: "Address the financial reality",
    description:
      "While things are calm, take an honest look at the financial damage. Pull bank statements, credit card statements, check for debts you don't know about, look for missing valuables. This isn't about building a case — it's about knowing where you stand. Addiction is expensive, and most families have no idea how much financial damage has accumulated until they look. You don't have to fix it all now. But you need to see the full picture so you can make informed decisions about what comes after treatment. If there are legal issues — DUIs, charges, civil matters — this is the time to consult an attorney.",
    icon: DollarSign,
  },
  {
    id: "support-network",
    title: "Start building your support network",
    description:
      "You've been the crisis manager. Now you need support — not for them, for YOU. During treatment is the best time to start because you're not putting out fires for once. Options: a therapist who understands addiction and family systems (not just any therapist — one who specializes), Al-Anon or Nar-Anon meetings, our weekly support group, a faith community if that's meaningful to you, or even just one friend who gets it and won't judge. You need at least one person you can call at 11 PM when things get hard. Line that up now.",
    icon: Heart,
    extraLinks: [
      { text: "Join Our Free Weekly Support Group", url: "/monday-zoom-registration" },
    ],
  },
];

// ─── Before They Come Home Checklist ───
const dischargeItems: ChecklistItem[] = [
  {
    id: "structured-plan",
    title: "Create a structured home plan",
    description:
      "Treatment centers operate on structure: wake-up times, meal times, group times, lights out. Your loved one is going to come home to... what? Netflix and an empty schedule? That's a relapse recipe. Before they return, build a basic daily structure: When do they wake up? What does their morning look like? When are meetings? (AA/NA — 90 meetings in 90 days is the standard recommendation.) What's the plan for idle time? What about exercise? Who's their sponsor? If the treatment center does discharge planning, participate in it. If they don't, build the plan yourself — or with your interventionist.",
    icon: CalendarCheck,
  },
  {
    id: "reentry-boundaries",
    title: "Set clear expectations and boundaries for re-entry",
    description:
      "Before they walk through the door, the family needs to be aligned on the rules. This isn't punishment — it's protection. Common re-entry agreements: Random drug testing (they should welcome this if they're serious). Meeting attendance requirements. Curfew (yes, even for adults — structure matters in early recovery). Financial transparency — no private bank accounts, no cash advances. Employment or job search expectations. Zero tolerance for substance use in the home. Contribution to household (chores, responsibilities — sitting around 'recovering' all day is dangerous). Write these down. Share them with your loved one BEFORE discharge, ideally with the treatment counselor present. These aren't surprises — they're the framework for rebuilding trust.",
    icon: Shield,
  },
  {
    id: "relapse-plan",
    title: "Have a relapse plan — before you need one",
    description:
      "Nobody wants to think about relapse while their person is still in treatment. But statistically, 40-60% of people in recovery experience at least one relapse. That's not failure — it's a feature of a chronic illness. Having a plan BEFORE it happens means you won't have to make decisions in panic. Your relapse plan should answer: What are the early warning signs we'll watch for? What do we do at the first sign (not after full relapse)? Who do we call? (Interventionist, sponsor, counselor.) Under what circumstances would we pursue re-treatment? What are the non-negotiable consequences? Write this plan now. Share it with your support network. Put it in a drawer and hope you never need it — but know exactly where it is.",
    icon: ClipboardList,
  },
];

// ─── What to Expect Timeline ───
const timelinePhases = [
  {
    title: "Week 1-2: The Honeymoon... or the Meltdown",
    description:
      "They'll either be grateful and motivated ('I finally see it') or furious and manipulative ('You ruined my life, I'm leaving'). Both are normal. Both will change. Don't make decisions based on Week 1 emotions — yours or theirs.",
  },
  {
    title: "Week 2-4: The Real Work Begins",
    description:
      "The drugs are out of their system. Now the real issues surface — trauma, mental health, relationships, shame. This is when therapy gets hard and they might want to leave. If they call wanting to leave AMA (Against Medical Advice): 'I hear you. I love you. Talk to your counselor before making any decisions. I support you being there.' Do NOT agree to pick them up.",
  },
  {
    title: "Week 4+: Planning for the Future",
    description:
      "If they're in a 30+ day program, the last phase focuses on discharge planning, aftercare, and transition. THIS is when you need to be most involved. Attend family sessions. Participate in discharge planning. Make sure the plan includes: sober living or structured home environment, outpatient therapy, meeting attendance, and a sponsor.",
  },
  {
    title: "AMA (Against Medical Advice) Situations",
    description:
      "If they leave treatment early: do not panic, but do enforce your boundaries. Leaving AMA doesn't mean all is lost — but it does mean the re-entry agreement changes. They chose to leave the safety net. Your consequence should reflect that. Call your interventionist or counselor before reacting.",
  },
];

const STORAGE_KEY = "roadmap-treatment-checklist";

const RoadmapTreatment = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
  }, []);

  const allItems = [...immediateItems, ...weekItems, ...dischargeItems];
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
        title="Treatment Stage — Recovery Roadmap | Sober Helpline"
        description="Your loved one is in treatment. Here's what the family needs to do now — communication, preparation, and planning for what comes next."
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-purple-600/8 via-background to-accent/10 border-b border-border/50 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🟣</span>
            <span className="text-sm font-semibold bg-purple-600/15 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full">
              Treatment Stage
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            They're in treatment. Now it's your turn.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            You can finally breathe. But here's what no one tells you: your work is just beginning. What you do in the next 30-90 days determines whether this sticks.
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
        <Card className="border-purple-600/20 bg-purple-600/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <HeartPulse className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  💜 The Hard Truth
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your loved one is getting help. That's a victory — celebrate it. But treatment is not a cure. It's the beginning of a long process, and the family's role during treatment is just as important as the clinical work happening inside those walls. Most families make one of two mistakes right now: they either collapse in relief and disengage, or they white-knuckle through every day waiting for it to fail. Neither works. What works is using this time — while a professional team has your loved one — to prepare yourself, your home, and your family for what comes next.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Nervous System Warning ─── */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  ⚠️ Warning: Your Nervous System Doesn't Know the Crisis Is Over
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Your body and mind have been in crisis mode for so long that you may not know how to function without one. When the chaos suddenly stops — when they're safely in treatment and the phone isn't ringing at 3 AM — something strange happens: your nervous system looks for a new crisis. Because crisis has become your normal.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You may pick fights with your spouse or partner over things that don't matter. You may find yourself silently criticizing the treatment team — looking for signs they aren't doing it "right," latching onto the first thing that feels off as proof that your loved one isn't being properly cared for. You may feel an overwhelming urge to call the facility, challenge the counselors, or micromanage the process.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  This is not you being difficult. This is your nervous system doing the only thing it knows how to do. Recognize it for what it is — and resist the urge to act on it. This is the time to turn toward your own recovery process. Let the professionals care for your loved one. Your job right now is to start caring for yourself.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If you haven't already, this may be the perfect time to join our free Monday Night Family Support Zoom. You'll be with other families who understand exactly what you're feeling — many of them in this same stage. You don't have to talk. You just have to show up.
                </p>
                <Link
                  to="/monday-zoom-registration"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium mt-2"
                >
                  <Video className="w-4 h-4" />
                  Register for Monday Night Support — 7 PM PT
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── First 72 Hours ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            🕐 First 72 Hours — Immediate Actions
          </h2>
          <div className="space-y-3">
            {immediateItems.map((item) => (
              <TreatmentCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── This Week ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            ✅ This Week — Your Preparation
          </h2>
          <div className="space-y-3">
            {weekItems.map((item) => (
              <TreatmentCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── Before They Come Home ─── */}
        <div>
          <div className="bg-purple-600/5 border border-purple-600/20 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              🏠 Before They Come Home — Critical Preparation
            </h2>
            <p className="text-muted-foreground mb-6">
              This is the most important section on this page. What you prepare now determines the foundation they come home to.
            </p>
            <div className="space-y-3">
              {dischargeItems.map((item) => (
                <TreatmentCard
                  key={item.id}
                  item={item}
                  checked={!!checked[item.id]}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── What to Expect During Treatment ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            📅 What to Expect During Treatment
          </h2>
          <div className="space-y-4">
            {timelinePhases.map((phase, i) => (
              <Card
                key={i}
                className={`border-border/50 ${
                  phase.title.includes("AMA")
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "bg-card"
                }`}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-3">
                    {phase.title.includes("AMA") ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-foreground mb-2">{phase.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ─── Stage Transitions ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            What Comes Next
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* If they complete treatment */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground mb-2">When they complete treatment</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      They made it through. The next stage — Early Recovery — is about what happens when they come home. It's harder than treatment in many ways, but you're more prepared than you think.
                    </p>
                    <Button size="sm" onClick={() => openComingSoon("Early Recovery Stage")}>
                      Move to Early Recovery Stage
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* If they leave AMA or relapse */}
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground mb-2">If they leave AMA or relapse</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      This is not the end. Many people need more than one attempt at treatment. What matters now is your response — not reactive, not punishing, but boundaried and clear.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a href="tel:5038362136">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Talk to a Professional
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openComingSoon("Relapse Stage")}
                      >
                        Go to Relapse Stage
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
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
              <ResourceLink label="Vetted Provider Directory" to="/inpatient-treatment" />
              <Link
                to="/monday-zoom-registration"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Video className="w-3.5 h-3.5 flex-shrink-0" />
                Weekly Support Group — Monday 7 PM PT
              </Link>
              <a
                href="tel:5038362136"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Phone className="w-4 h-4" />
                Talk to Someone: (503) 836-2136
              </a>
              <p className="text-xs text-muted-foreground italic pl-6">
                Questions during treatment? We're still here.
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
              The {comingSoonTitle} of the Recovery Roadmap is being built. In the meantime, keep working through your treatment checklist and stay connected with your support team.
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
function TreatmentCard({
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

                {item.warning && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2 rounded-md">
                    ⚠️ {item.warning}
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

export default RoadmapTreatment;
