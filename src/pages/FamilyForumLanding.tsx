import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users, Heart, MessageCircle, Shield, CheckCircle2, ChevronRight,
  Phone, Calendar, Lock, Star, MessagesSquare, BookOpen, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import familyHero from "@/assets/family-hero.png";
import healingCircle from "@/assets/blog-healing-circle-family-support.png";

const faqItems = [
  {
    question: "Who is the forum for?",
    answer: "The forum is for family members — spouses, parents, siblings, adult children — who are supporting a loved one through addiction. It doesn't matter where they are in the journey: active use, treatment, early recovery, or relapse. If addiction is affecting your family, you belong here.",
  },
  {
    question: "Is it really anonymous?",
    answer: "Yes. You choose your own username. Your real name, email, and contact information are never visible to other members. What you share stays in the community.",
  },
  {
    question: "Who moderates the forum?",
    answer: "The forum is moderated by certified professionals with direct experience in addiction intervention and family recovery. There are no automated-only moderation systems — a real human reviews flagged content and maintains the tone of the community.",
  },
  {
    question: "What's the difference between the forum and the Monday Zoom?",
    answer: "The Monday Zoom is a live, real-time call led by Matt Brown — great for urgent questions and direct guidance. The forum is always available: post at 2am, respond on your lunch break, read when you're ready. Both are included with membership.",
  },
  {
    question: "What does membership cost?",
    answer: "Family support membership is $14.99/month. It includes the forum, the full education library (60+ guides), recorded webinars, AI-powered tools, and access to the Monday Zoom. Cancel anytime.",
  },
];

const topics = [
  { icon: Users, label: "Introductions & Welcome", desc: "New here? Meet the community.", color: "bg-blue-500" },
  { icon: Heart, label: "Share Your Story", desc: "A safe space for your journey.", color: "bg-pink-500" },
  { icon: MessageCircle, label: "Ask the Community", desc: "Real answers from families who've been there.", color: "bg-green-500" },
  { icon: Shield, label: "Setting Boundaries", desc: "Strategies that actually work.", color: "bg-orange-500" },
  { icon: MessagesSquare, label: "Intervention Discussions", desc: "Planning or considering an intervention.", color: "bg-red-500" },
  { icon: BookOpen, label: "Treatment Discussions", desc: "Navigating rehab, IOP & sober living.", color: "bg-cyan-500" },
  { icon: Heart, label: "Recovery Wins", desc: "Celebrate progress — big and small.", color: "bg-yellow-500" },
  { icon: Sparkles, label: "Self-Care & Wellness", desc: "Because you matter too.", color: "bg-purple-500" },
];

const benefits = [
  {
    icon: Users,
    title: "Families Who Truly Understand",
    desc: "No explaining. No justifying. Everyone here knows what it's like to love someone struggling with addiction. You'll find people who get it — because they're living it too.",
  },
  {
    icon: Shield,
    title: "Professionally Moderated",
    desc: "The forum isn't just families talking to families. It's moderated by certified addiction intervention professionals who keep conversations grounded, safe, and productive.",
  },
  {
    icon: Lock,
    title: "Private & Anonymous",
    desc: "Your real name is never visible. You choose a username. What you share stays in the community. No employers, no family members outside the forum, no public exposure.",
  },
  {
    icon: Calendar,
    title: "Available 24/7 — Not Just Monday Nights",
    desc: "Crises don't wait for scheduled calls. Post at 2am when you can't sleep. Read when you need perspective. The community is always there.",
  },
  {
    icon: Heart,
    title: "Judgment-Free Zone",
    desc: "No shame. No 'you should have done this sooner.' Families in this forum have made every mistake in the book — and they're here to help you avoid them, not judge you for them.",
  },
  {
    icon: Star,
    title: "Part of a Bigger Support System",
    desc: "Membership includes the forum, 60+ education guides, recorded webinars, AI tools, and access to the free “The Family Squares”. You're not just joining a forum — you're joining a full recovery support system.",
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family addiction support forum and community for families navigating a loved one's addiction. Professionally moderated, anonymous, available 24/7.",
  url: "https://soberhelpline.com/family-support-forum",
  telephone: "+15412415668",
  sameAs: ["https://soberhelpline.com"],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FamilyForumLanding() {
  const [featuredThread, setFeaturedThread] = useState<{ id: string; title: string; created_at: string; topic_id: string } | null>(null);

  useEffect(() => {
    const fetchFeaturedThread = async () => {
      const { data } = await supabase
        .from('forum_posts')
        .select('id, title, created_at, topic_id')
        .eq('topic_id', 'share-story')
        .eq('is_pinned', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setFeaturedThread(data);
    };
    fetchFeaturedThread();
  }, []);

  return (
    <>
      <SEOHead
        title="Family Addiction Support Forum | Connect with Families Who Understand | Sober Helpline"
        description="Join a professionally moderated sober support forum for families navigating addiction. Anonymous, judgment-free, available 24/7. Connect with families who understand. Free to explore."
        jsonLd={[localBusinessSchema, faqSchema] as any}
      />

      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <section className="relative min-h-[520px] flex items-center overflow-hidden">
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img
              src={familyHero}
              alt="Families supporting each other through addiction recovery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          </div>

          <div className="relative container max-w-6xl mx-auto px-4 py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-5">
                <Users className="h-3.5 w-3.5" />
                Family Addiction Support Community
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                You Don't Have to Navigate This Alone
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                A private, professionally moderated forum for families supporting a loved one through addiction.
                Judgment-free. Anonymous. Always available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/monday-zoom-registration">
                  <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-8">
                    <Calendar className="h-4 w-4" />
                    Start with the Free Monday Zoom
                  </Button>
                </Link>
                <Link to="/family-membership">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Then Join Membership
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Free Zoom first · Membership for ongoing support · Coaching only if you need a private plan</p>
            </div>
          </div>
        </section>

        {/* Social Proof Strip */}
        <section className="border-y border-border/40 bg-muted/30 py-4">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />Anonymous & Private</span>
              <span className="hidden sm:block text-border">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />Professionally Moderated</span>
              <span className="hidden sm:block text-border">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />Available 24/7</span>
              <span className="hidden sm:block text-border">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />No Judgment</span>
              <span className="hidden sm:block text-border">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />Cancel Anytime</span>
            </div>
          </div>
        </section>

        {/* Post-Meeting Thread Callout */}
        {featuredThread && (
          <section className="pt-8 pb-0">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="rounded-xl border-2 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">🟢</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-0.5">
                    This Week's Meeting Thread
                  </p>
                  <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                    {featuredThread.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share your takeaways, questions, or reflections from Monday's session
                  </p>
                </div>
                <Link
                  to={`/family-forum/${featuredThread.topic_id}?post=${featuredThread.id}`}
                  className="flex-shrink-0 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Join Thread →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Why Join Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">Why Families Join This Forum</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Most support for addiction families is focused on the person struggling. This community is built for you — the family member carrying it all.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-logo-green mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Image + Copy Split Section */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={healingCircle}
                  alt="Family members supporting each other in addiction recovery"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-logo-green mb-5 leading-tight">
                  The Forum Other Families Wish They'd Found Sooner
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    When someone you love is struggling with addiction, the isolation can be as painful as the addiction itself.
                    Friends don't understand. Family members are in denial. And every well-meaning piece of advice from
                    someone who hasn't lived it just makes you feel more alone.
                  </p>
                  <p>
                    This forum exists because families deserve a place where they don't have to explain themselves.
                    Where "I paid his rent again even though I swore I wouldn't" isn't judged — it's understood.
                    Where you can ask "am I enabling?" at midnight and get a real, thoughtful answer.
                  </p>
                  <p>
                    The forum is professionally moderated by certified addiction intervention specialists —
                    not volunteers, not bots. Real professionals who keep conversations grounded
                    and ensure the community stays safe and constructive.
                  </p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link to="/family-membership">
                    <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white">
                      Join the Community
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forum Topics Preview */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-logo-green mb-3">What Families Talk About</h2>
              <p className="text-muted-foreground">8 discussion categories covering every part of the journey.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {topics.map((topic) => (
                <Card key={topic.label} className="hover:shadow-md transition-all border-border/50">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 ${topic.color} rounded-xl flex items-center justify-center mb-3`}>
                      <topic.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-logo-green text-sm mb-1">{topic.label}</h3>
                    <p className="text-xs text-muted-foreground">{topic.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">Full access to all topics included with membership.</p>
              <Link to="/family-membership">
                <Button size="lg" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Unlock Full Access — $14.99/mo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-primary/5 border-y border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-logo-green mb-3">Membership Includes Everything</h2>
              <p className="text-muted-foreground">The forum is just the beginning.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: MessagesSquare, label: "Private Family Forum", desc: "Anonymous, professionally moderated, always open" },
                { icon: Calendar, label: "The Family Squares", desc: "Live weekly call with Matt Brown — free for members" },
                { icon: BookOpen, label: "60+ Education Guides", desc: "Evidence-based curriculum for family recovery" },
                { icon: Sparkles, label: "AI-Powered Tools", desc: "Boundary builder, enabling coach, treatment navigator" },
                { icon: Heart, label: "Recorded Webinars", desc: "Watch past sessions on your schedule" },
                { icon: Shield, label: "Expert Moderation", desc: "Certified professionals keeping the community safe" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border/50">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-logo-green text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="inline-block bg-background rounded-2xl border border-primary/20 px-8 py-6 shadow-sm">
                <p className="text-4xl font-bold text-logo-green mb-1">$14.99<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground mb-4">Everything above · Cancel anytime</p>
                <Link to="/family-membership">
                  <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-10">
                    <Users className="h-4 w-4" />
                    Join the Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-logo-green mb-10 text-center">Common Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <Card key={item.question}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-logo-green">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-logo-green mb-3">
              The Conversation You've Been Needing Is Already Happening
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
              Families just like yours are in the forum right now — sharing, asking questions, and supporting each other.
              You can join them today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white px-8">
                  <Calendar className="h-4 w-4" />
                  Join the Free Monday Zoom
                </Button>
              </Link>
              <Link to="/family-membership">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Join Membership
                </Button>
              </Link>
              <a href="tel:5412415668">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call (541) 241-5668
                </Button>
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Not ready to join? The <Link to="/monday-zoom-registration" className="text-primary hover:underline">free Monday Zoom</Link> is open to everyone — no membership required.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}
