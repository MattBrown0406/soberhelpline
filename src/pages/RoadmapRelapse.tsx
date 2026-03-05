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
  ChevronDown,
  Phone,
  BookOpen,
  ExternalLink,
  Video,
  ArrowRight,
  Heart,
  Shield,
  AlertTriangle,
  Users,
  Brain,
  Search,
  Scale,
  Baby,
  Siren,
  CircleAlert,
  Ban,
  HandHeart,
  RefreshCw,
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
  ctaPhone?: boolean;
  emergencyNumbers?: boolean;
}

// ─── First 48 Hours ───
const triageItems: ChecklistItem[] = [
  {
    id: "safety-check",
    title: "Check: is this a safety emergency?",
    description:
      "First things first — is anyone in danger? If they've overdosed, are unconscious, or you suspect they've taken something that could kill them: call 911. Don't hesitate. Don't worry about getting them in trouble. Naloxone (Narcan) can reverse an opioid overdose — if you have it, use it. If there's violence, if children are unsafe, if they're threatening self-harm — 911 first, everything else second. If the situation is not an immediate emergency, keep reading.",
    icon: Siren,
    emergencyNumbers: true,
  },
  {
    id: "dont-react",
    title: "Do NOT react from emotion — not today",
    description:
      "You want to scream. You want to cry. You want to throw them out. You want to say every terrible thing you've been holding back. Do not do any of this right now. Not because those feelings aren't valid — they are — but because decisions made in the first 24 hours of discovering a relapse are almost always the wrong ones. You're in shock. Your nervous system is in fight-or-flight. This is not the state to make life-altering decisions about your marriage, your living situation, or their future. Give yourself 24-48 hours. Call your support person. Call your therapist. Call your interventionist. Talk to someone who isn't in the blast radius before you talk to the person who caused it.",
    icon: Brain,
  },
  {
    id: "activate-plan",
    title: "Activate your relapse plan",
    description:
      "If you built a relapse response plan during the Treatment or Early Recovery stage — now is when you use it. Pull it out. It has your answers: who to call, what the consequences are, under what circumstances you pursue re-treatment, what the non-negotiables are. Follow the plan. That's why you wrote it when you were thinking clearly — so you wouldn't have to think clearly right now. If you don't have a relapse plan: that's okay. Keep reading. We'll build one in real time.",
    icon: Shield,
    linkText: "Family Relapse Response Plan Template",
    linkUrl: "#",
  },
  {
    id: "call-support",
    title: "Call your support network",
    description:
      "Your interventionist. Your therapist. Your sponsor (yes, family members can have sponsors in Al-Anon). Your one trusted person. Call them. Not to fix the situation — to anchor yourself. You need someone who will listen without panicking and help you think through next steps. If you don't have anyone to call: call us. That's what we're here for. This is not a burden. This is exactly why support networks exist.",
    icon: Users,
    ctaPhone: true,
  },
];

// ─── This Week ───
const weekItems: ChecklistItem[] = [
  {
    id: "understand-what-happened",
    title: "Understand what happened — without interrogating",
    description:
      "When you're calm enough (and that might take a few days), you need to understand the scope. Was this a one-time slip or a return to regular use? How long has it actually been going on? (It's almost always longer than they'll initially admit.) What triggered it? Did they stop going to meetings? Did something stressful happen? Were they taking their medication? You're not looking for excuses — you're looking for data. The answers determine your response. A person who slipped once, told you immediately, and wants to get back on track is a very different situation from someone who's been secretly using for three weeks and only got caught because you found the evidence. Both are relapse. The response is different.",
    icon: Search,
  },
  {
    id: "enforce-boundaries",
    title: "Enforce your boundaries — every single one",
    description:
      "This is the moment of truth. Every boundary you set, every consequence you stated — they're live now. 'If you use again, you leave the house.' Did you mean it? 'If you relapse, I'm calling your interventionist.' Are you calling? 'If this happens again, I'm filing for separation.' Is the attorney being contacted? If you don't follow through, you've taught them the most dangerous lesson in addiction: that your words don't mean anything. That's not love. That's enabling disguised as mercy. Following through on consequences is the hardest thing you will ever do. It's also the most loving. It says: 'I love you too much to make it easy for you to kill yourself.' If you set consequences you now realize you can't enforce — that's a lesson for next time. But enforce what you can. Today.",
    icon: Shield,
    linkText: "Following Through: The Hardest Act of Love",
    linkUrl: "#",
  },
  {
    id: "separate-person-disease",
    title: "Separate the person from the disease — again",
    description:
      "You're furious. You feel betrayed. You might even hate them right now. That's okay. But remember: the person you love is still in there. The relapse is the disease asserting itself — the same way a cancer recurrence is the disease asserting itself. That doesn't mean there are no consequences. It doesn't mean you tolerate it. But it means the goal is still treatment, not punishment. Hold both truths at once: this is unacceptable AND this is a medical event. You can be furious and compassionate at the same time. That's the impossible emotional algebra of loving someone with addiction.",
    icon: Heart,
  },
  {
    id: "assess-retreatment",
    title: "Assess: is re-treatment needed?",
    description:
      "Not every relapse requires a return to inpatient treatment — but many do. Here's the honest filter: If the relapse was a brief slip, they're remorseful, they have a strong recovery network, and they're willing to immediately intensify their program (more meetings, restart therapy, adjust medication) — outpatient intensification may be enough. If the relapse was prolonged, secretive, involved dangerous substances (opioids, fentanyl, meth), or represents a pattern of repeated relapse — inpatient treatment is likely needed. A higher level of care than last time. The definition of insanity is doing the same thing and expecting different results. If the last treatment didn't work, the next one needs to be different — longer, more intensive, different approach, or different facility. Talk to a professional to assess. Don't make this call alone.",
    icon: CircleAlert,
    ctaPhone: true,
  },
];

// ─── What Changes Now ───
const changesItems: ChecklistItem[] = [
  {
    id: "rewrite-plan",
    title: "Rewrite the relapse plan with what you've learned",
    description:
      "If you had a relapse plan, it just got field-tested. What worked? What didn't? Were the consequences realistic? Did you follow through? Were there warning signs you missed? Update the plan with what you now know. If you didn't have a plan before, write one now — you have real-world data to work with. The updated plan should include: earlier warning signs you now recognize, faster response triggers (don't wait as long next time), adjusted consequences that you WILL enforce, professional contacts on speed dial, and a clear threshold for when re-treatment is non-negotiable.",
    icon: RefreshCw,
    linkText: "Relapse Plan 2.0: Learning from Experience",
    linkUrl: "#",
  },
  {
    id: "address-kids",
    title: "Address the kids — honestly and age-appropriately",
    description:
      "If the kids know (and they probably know more than you think), they need to hear from you. Not a long explanation. Not details. Just honesty: '[Parent] is having a hard time again with their illness. We're getting them help. You are safe. This is not your fault. You can ask me anything.' Then answer what they ask — truthfully, simply, without catastrophizing. If they don't ask anything, that's okay too. They're processing. Keep the door open. And if they're old enough to understand what relapse means, don't pretend it's something else. Kids who are lied to about addiction grow up not trusting the people who were supposed to protect them.",
    icon: Baby,
  },
  {
    id: "decide-your-needs",
    title: "Decide what YOU need — and take it",
    description:
      "After a relapse, the focus immediately goes to the person who relapsed. What do THEY need? How do WE help THEM? Stop. What do you need? Do you need space? Take it. Do you need to not see them for a few days? That's okay. Do you need a day where you don't think about addiction at all? Take it. Do you need to seriously consider whether you can continue in this relationship? That's allowed. Do you need to scream into a pillow and cry for an hour? That's healthy. Your needs don't disappear because they relapsed. If anything, your needs just got more urgent. This is not selfish. You cannot pour from an empty cup, and yours has been emptied and refilled and emptied again. Take what you need.",
    icon: HandHeart,
  },
];

const allItems = [...triageItems, ...weekItems, ...changesItems];

// ─── What NOT to Do ───
const dontDoItems = [
  {
    title: "Don't use it as a weapon.",
    body: "\"I knew you'd do this. You always do this.\" — Even if it's true, weaponizing relapse ensures they'll never come to you honestly again. Save the anger for therapy.",
  },
  {
    title: "Don't blame yourself.",
    body: "You didn't cause it. Not with something you said, something you didn't say, something you did, or something you didn't do. You are not that powerful. Addiction is.",
  },
  {
    title: "Don't let guilt override your boundaries.",
    body: "They will try to use your guilt — consciously or not. \"I relapsed because you were too hard on me.\" \"If you hadn't kicked me out, this wouldn't have happened.\" These are manipulation, not truth. Your boundaries didn't cause the relapse. The disease did.",
  },
  {
    title: "Don't compare to other families.",
    body: "\"Why can't you stay sober like so-and-so?\" Every recovery is different. Comparison helps no one.",
  },
  {
    title: "Don't give up on them — but don't sacrifice yourself either.",
    body: "There is a line between \"I'll never stop loving you\" and \"I'll let you destroy my life.\" Both can be true. Finding that line is the work of this stage.",
  },
  {
    title: "Don't assume this is the end.",
    body: "Many people who eventually achieve lasting sobriety relapsed multiple times first. This could be the setback before the breakthrough. Or it could be a pattern that requires a fundamentally different approach. A professional can help you see which one it is.",
  },
];

// ─── Forward Paths ───
const forwardPaths = [
  {
    title: "Back to Treatment",
    description:
      "If re-treatment is the plan, you've been here before — but this time you know more. The Treatment Stage has your checklist for what to do while they're away. This time, pay special attention to what went wrong in the aftercare plan last time.",
    buttonText: "Return to Treatment Stage",
    to: "/roadmap/treatment",
  },
  {
    title: "Intensified Outpatient/Recovery",
    description:
      "If the relapse was a slip and they're recommitting to recovery with increased support — more meetings, restart therapy, medication review — then you're heading back to Early Recovery with updated rules.",
    buttonText: "Return to Early Recovery Stage",
    to: "/roadmap/early-recovery",
  },
  {
    title: "You Need to Step Back",
    description:
      "If you've been through this cycle multiple times and you need to prioritize yourself and your children — that's a valid choice. It's not abandonment. It's self-preservation. Detaching with love doesn't mean stopping love. It means stopping destruction. Talk to a therapist and a support group before making this decision — but know that this path exists and no one gets to judge you for taking it.",
    links: [
      { text: "Detaching with Love: What It Really Means", url: "#" },
      { text: "Join Our Free Weekly Support Group", url: "/monday-zoom-registration" },
    ],
  },
  {
    title: "Professional Re-Intervention",
    description:
      "If they're refusing help after relapse, a second (or third) intervention often has a higher success rate than the first. They've been to treatment. They know what help looks like. The wall is thinner this time. A professional can help you break through again.",
    phone: true,
  },
];

const RoadmapRelapse = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("roadmap-relapse-checklist");
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  const toggle = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem("roadmap-relapse-checklist", JSON.stringify(updated));
  };

  const completedCount = allItems.filter((i) => checked[i.id]).length;
  const progressPercent = (completedCount / allItems.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[hsl(var(--destructive)/0.03)]">
      <SEOHead
        title="Relapse Stage — Recovery Roadmap | Sober Helpline"
        description="Relapse is not failure. It's a setback in a chronic illness. Here's your plan for the next 48 hours and beyond — for families navigating relapse."
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
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium mb-3 ml-4">
            🔴 Relapse Stage
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            It Happened. Now What?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            It happened. Everything you feared, everything you thought you'd moved past — it's back. You're not starting over. You're not back to square one. But you need a plan, and you need it now.
          </p>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-4">
            <Progress value={progressPercent} className="flex-1 h-2.5" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {completedCount}/{allItems.length}
            </span>
          </div>
        </div>

        {/* ─── Before Anything Else ─── */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-foreground mb-3">🔴 Before Anything Else</h2>
            <p className="text-muted-foreground leading-relaxed">
              Take a breath. Right now, your mind is racing: "How did I miss it?" "Was everything a lie?" "I can't do this again." Those feelings are valid. Every single one. But relapse is not a moral failure — not theirs, and not yours. Addiction is a chronic medical illness. The relapse rate for addiction (40-60%) is comparable to relapse rates for hypertension and diabetes. That doesn't make it hurt less. But it means this isn't about blame. It's about response. What happens in the next 48 hours matters more than anything that happened before this moment.
            </p>
          </CardContent>
        </Card>

        {/* ─── Emergency Bar ─── */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a href="tel:911" className="inline-flex items-center gap-1 font-bold text-destructive hover:underline">
              <Phone className="w-4 h-4" /> 911
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="tel:988" className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline">
              <Phone className="w-3.5 h-3.5" /> 988 Crisis Lifeline
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="tel:18002221222" className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline">
              <Phone className="w-3.5 h-3.5" /> Poison Control
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="tel:5412419151" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              <Phone className="w-3.5 h-3.5" /> (541) 241-9151
            </a>
          </CardContent>
        </Card>

        {/* ─── First 48 Hours ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            🚨 RIGHT NOW — First 48 Hours
          </h2>
          <div className="space-y-3">
            {triageItems.map((item) => (
              <RelapseCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggle(item.id)}
                urgent
              />
            ))}
          </div>
        </div>

        {/* ─── This Week ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📋 This Week — Assessment and Response
          </h2>
          <div className="space-y-3">
            {weekItems.map((item) => (
              <RelapseCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── What Changes Now ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            🔄 The Bigger Picture — What Changes Now
          </h2>
          <div className="space-y-3">
            {changesItems.map((item) => (
              <RelapseCard
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── What NOT to Do ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Ban className="w-6 h-6 text-destructive" />
            What NOT to Do After Relapse
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Read these before you say or do anything you can't take back.
          </p>
          <Card className="border-border/40 bg-muted/40">
            <CardContent className="p-6 md:p-8 space-y-5">
              {dontDoItems.map((item, i) => (
                <div key={i} className={i < dontDoItems.length - 1 ? "pb-5 border-b border-border/30" : ""}>
                  <p className="font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{item.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ─── Where Do You Go From Here ─── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Where Do You Go From Here?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {forwardPaths.map((path, i) => (
              <Card key={i} className="border-border/40 bg-card hover:shadow-sm transition-shadow">
                <CardContent className="p-5 flex flex-col h-full">
                  <p className="font-bold text-foreground mb-2">{path.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {path.description}
                  </p>
                  {path.to && (
                    <Link to={path.to}>
                      <Button size="sm" variant="outline" className="w-full">
                        {path.buttonText}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                  {path.links && (
                    <div className="space-y-2">
                      {path.links.map((link, j) => (
                        <Link
                          key={j}
                          to={link.url}
                          className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  )}
                  {path.phone && (
                    <a href="tel:5412419151">
                      <Button size="sm" className="w-full">
                        <Phone className="w-4 h-4 mr-1" />
                        Talk to an Interventionist
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
              <ResourceLink label="Relapse Is Not Failure: Understanding the Chronic Disease Model" to="#" />
              <ResourceLink label="Following Through on Consequences" to="#" />
              <ResourceLink label="When Relapse Becomes a Pattern" to="#" />
              <ResourceLink label="Detaching with Love" to="#" />
              <ResourceLink label="Talking to Kids After a Relapse" to="#" />
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
              <ResourceLink label="Vetted Provider Directory" to="/therapists" />
              <Link
                to="/monday-zoom-registration"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Video className="w-3.5 h-3.5 flex-shrink-0" />
                Weekly Support Group — Monday 7 PM PT
              </Link>
              <p className="text-xs text-muted-foreground italic pl-6">
                This is exactly when you need to show up.
              </p>
              <a
                href="tel:5412419151"
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <Phone className="w-4 h-4" />
                Talk to Someone: (541) 241-9151
              </a>
              <p className="text-xs text-muted-foreground italic pl-6">
                Relapse response is what we do. Call anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── Checklist Card ───
function RelapseCard({
  item,
  checked,
  onToggle,
  urgent,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
  urgent?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card
        className={`transition-all ${
          checked
            ? "bg-muted/30 border-primary/20 border-border/50"
            : urgent
            ? "bg-card border-destructive/20"
            : "bg-card border-border/50"
        }`}
      >
        <CardContent className="p-0">
          <div className="flex items-start gap-3 p-4">
            <Checkbox checked={checked} onCheckedChange={() => onToggle()} className="mt-1" />
            <div className="flex-1 min-w-0">
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <span
                  className={`font-semibold text-foreground leading-snug ${
                    checked ? "line-through opacity-60" : ""
                  }`}
                >
                  {urgent && !checked && "🚨 "}
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 ml-2 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>

                {item.emergencyNumbers && (
                  <div className="flex flex-wrap gap-2 text-sm">
                    <a href="tel:911" className="font-bold text-destructive hover:underline">911</a>
                    <span className="text-muted-foreground">|</span>
                    <a href="tel:988" className="font-semibold text-foreground hover:underline">988 Crisis Lifeline</a>
                    <span className="text-muted-foreground">|</span>
                    <a href="tel:18002221222" className="font-semibold text-foreground hover:underline">Poison Control: 1-800-222-1222</a>
                  </div>
                )}

                {item.ctaPhone && (
                  <a href="tel:5412419151">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-1" />
                      Call: (541) 241-9151
                    </Button>
                  </a>
                )}

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

export default RoadmapRelapse;
