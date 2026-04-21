import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Landmark,
  Loader2,
  MapPin,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const partnerHighlights = [
  "A trusted Central Oregon family resource you can refer to without handing families a sales pitch",
  "Weekly free Monday Zoom access for families who need help now, even before they are ready for formal intervention",
  "A low-cost family pathway that can reduce chaos, improve alignment, and create treatment readiness",
  "Escalation path from family education to coaching to full intervention support when clinically appropriate",
];

const weeklyCurriculum = [
  {
    week: "Week 1",
    title: "Stabilize the Family System",
    focus: "Clarify what is happening, reduce panic, and identify the most urgent threats to the family.",
  },
  {
    week: "Week 2",
    title: "CRAFT Foundations",
    focus: "Teach families how reinforcement, timing, and communication affect behavior change.",
  },
  {
    week: "Week 3",
    title: "Enabling vs. Helping",
    focus: "Identify rescue patterns and replace them with boundary-based support.",
  },
  {
    week: "Week 4",
    title: "Communication That Lands",
    focus: "Practice short, clear, non-escalating language for difficult conversations.",
  },
  {
    week: "Week 5",
    title: "Treatment Readiness",
    focus: "Recognize openings, anticipate resistance, and prepare for rapid treatment placement.",
  },
  {
    week: "Week 6",
    title: "Family Alignment",
    focus: "Get key family members on the same page about consequences, expectations, and messaging.",
  },
  {
    week: "Week 7",
    title: "Relapse and Re-entry Planning",
    focus: "Build a practical response plan for setbacks, failed discharges, and mixed motivation.",
  },
  {
    week: "Week 8",
    title: "Sustainable Next Steps",
    focus: "Help families choose ongoing support, coaching, intervention work, or monitored maintenance.",
  },
];

const intakeSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().default(""),
  city: z.string().trim().min(2, "City is required").max(100),
  relationship: z.string().trim().min(1, "Select your relationship"),
  attendanceStatus: z.enum(["referred-seat", "need-seat", "need-scholarship"]),
  referredBy: z.string().trim().min(2, "Tell us who referred you").max(200),
  reasonForComing: z.string().trim().min(20, "Please share a brief assessment").max(2000),
  householdSummary: z.string().trim().max(1000).optional().default(""),
});

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  relationship: "",
  attendanceStatus: "need-seat" as "referred-seat" | "need-seat" | "need-scholarship",
  referredBy: "",
  reasonForComing: "",
  householdSummary: "",
};

export default function CentralOregonFamilyProgram() {
  const { toast } = useToast();
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nextStep = useMemo(() => {
    if (formData.attendanceStatus === "referred-seat") {
      return {
        title: "Next step: we'll confirm your spot",
        copy: "You already have a provider or community referral. Submit the intake and we'll follow up with seat confirmation and onboarding details.",
        ctaLabel: "Join the Monday Zoom while you wait",
        ctaHref: "/monday-zoom-registration",
      };
    }

    if (formData.attendanceStatus === "need-scholarship") {
      return {
        title: "Next step: scholarship review",
        copy: "If cost is a barrier, complete the intake and then use the scholarship path below so we can review financial hardship before enrollment.",
        ctaLabel: "Open scholarship request",
        ctaHref: "/book-consultation?plan=stabilization",
      };
    }

    return {
      title: "Next step: book a seat",
      copy: "If you are unattached and ready to join, complete the intake and then use the seat-booking path below so we know you want the next available opening.",
      ctaLabel: "Book a consultation / seat request",
      ctaHref: "/book-consultation?plan=stabilization",
    };
  }, [formData.attendanceStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = intakeSchema.safeParse(formData);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) nextErrors[String(err.path[0])] = err.message;
      });
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...result.data,
        program: "Central Oregon Family Program",
        next_step:
          result.data.attendanceStatus === "referred-seat"
            ? "Confirm referred seat"
            : result.data.attendanceStatus === "need-scholarship"
              ? "Financial hardship or scholarship review"
              : "Book a seat",
      };

      const { error } = await supabase.functions.invoke("central-oregon-family-intake", {
        body: payload,
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData(defaultForm);
      toast({
        title: "Intake received",
        description: "Thanks. We have your Central Oregon Family Program intake.",
      });
    } catch (error) {
      console.error("Central Oregon Family Program intake error:", error);
      toast({
        title: "Submission issue",
        description: "Your form could not be sent automatically. Please call (541) 241-5668 and mention the Central Oregon Family Program.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Central Oregon Family Program | Sober Helpline"
        description="Central Oregon Family Program for families living with addiction. See the pilot overview, partner referral pitch, family flyer content, 8-week curriculum, and online intake form."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Central Oregon Family Program",
          provider: {
            "@type": "Organization",
            name: "Sober Helpline",
            url: "https://soberhelpline.com",
            telephone: "+1-541-241-5668",
          },
          areaServed: "Central Oregon",
          serviceType: "Family addiction education and intervention support",
          url: "https://soberhelpline.com/central-oregon-family-program",
        }}
      />

      <div className="min-h-screen bg-background">
        <nav className="container max-w-6xl mx-auto px-4 py-4 text-sm text-muted-foreground">
          <Link to="/oregon/bend" className="inline-flex items-center gap-2 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Bend family support
          </Link>
        </nav>

        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                  <MapPin className="h-4 w-4" />
                  Central Oregon pilot program area
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-logo-green mb-5 leading-tight">
                  Central Oregon Family Program
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mb-6">
                  A family-first pathway for Central Oregon households living with addiction. This area brings the pilot one-pager, treatment partner pitch, family-facing landing page, 8-week curriculum, and intake into one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#family-intake">
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      <ClipboardList className="h-4 w-4" />
                      Start family intake
                    </Button>
                  </a>
                  <Link to="/monday-zoom-registration">
                    <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                      <Calendar className="h-4 w-4" />
                      Free Monday Zoom
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="h-5 w-5 text-primary" />
                    Pilot one-pager overview
                  </CardTitle>
                  <CardDescription>Built for families, referrers, and treatment partners in the Bend and greater Central Oregon area.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Format:</strong> 8 weeks, family-first, practical education plus structured next steps.</p>
                  <p><strong className="text-foreground">Who it serves:</strong> parents, spouses, siblings, adult children, and key supporters of someone struggling with addiction.</p>
                  <p><strong className="text-foreground">What makes it useful:</strong> families get immediate support before they have treatment certainty, financial clarity, or a full intervention plan.</p>
                  <p><strong className="text-foreground">Escalation path:</strong> weekly group support, coaching, treatment matching, and intervention services when needed.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: HeartHandshake,
                  title: "For families in the fog",
                  copy: "A steady starting point when the home is chaotic, the loved one is resisting help, and nobody knows the right next move.",
                },
                {
                  icon: Users,
                  title: "For treatment partners",
                  copy: "A clean referral destination for families who are not ready, not attached, or need help becoming treatment-ready.",
                },
                {
                  icon: BookOpen,
                  title: "For education and action",
                  copy: "Each week adds practical skills, clearer boundaries, and a more organized family response.",
                },
                {
                  icon: Landmark,
                  title: "For Central Oregon",
                  copy: "Localized for Bend and surrounding communities where families often need support before a larger intervention spend makes sense.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <Card key={title}>
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h2 className="font-semibold text-logo-green mb-2">{title}</h2>
                    <p className="text-sm text-muted-foreground">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/40 border-y border-border/50">
          <div className="container max-w-6xl mx-auto px-4 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                <Users className="h-4 w-4" />
                Treatment center partner pitch
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
                A referral option for families who are not yet attached to care
              </h2>
              <p className="text-muted-foreground mb-4">
                Many families are asking for help before they are clinically organized, financially prepared, or unified enough to commit to treatment. This program gives providers a place to send those families now instead of losing them to delay.
              </p>
              <p className="text-muted-foreground">
                The value for partners is simple: families get supported early, resistance is reduced, and treatment conversations happen with more alignment and less desperation.
              </p>
            </div>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Why partners would refer here</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {partnerHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                <HeartHandshake className="h-4 w-4" />
                Family-facing flyer / landing page content
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
                If addiction is running your family, this is a place to get organized
              </h2>
              <p className="text-muted-foreground mb-4">
                You do not have to wait for your loved one to agree, hit bottom, or magically become honest before your family gets help. The Central Oregon Family Program is designed for families who need a steadier plan right now.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Learn what is helping and what is accidentally making things worse",
                  "Get aligned with other family members before the next crisis hits",
                  "Understand treatment readiness, leverage, and boundaries",
                  "Know when to keep going, when to escalate, and where to ask for more help",
                ].map((item) => (
                  <div key={item} className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mb-2" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>What families can expect</CardTitle>
                <CardDescription>This is the website version of the flyer copy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Weekly teaching, practical discussion, and next-step guidance.</p>
                <p>Non-shaming, family-centered support rooted in real intervention experience.</p>
                <p>Clear branching if you are unattached, need a seat, or need financial hardship consideration.</p>
                <p>Access to free Monday Zoom support while enrollment and follow-up are happening.</p>
                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <a href="#family-intake" className="w-full sm:w-auto">
                    <Button className="w-full gap-2">
                      Start intake
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="tel:5412415668" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      (541) 241-5668
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                <BookOpen className="h-4 w-4" />
                8-week curriculum guide
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
                Structured enough to create movement, simple enough for families to follow
              </h2>
              <p className="text-muted-foreground">
                Each week has a practical focus. The aim is not to flood families with theory. It is to help them think clearly, act consistently, and become more treatment-ready over time.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {weeklyCurriculum.map((item) => (
                <Card key={item.week} className="h-full">
                  <CardHeader>
                    <CardDescription>{item.week}</CardDescription>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.focus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="family-intake" className="py-12">
          <div className="container max-w-6xl mx-auto px-4 grid gap-8 lg:grid-cols-[1fr_0.85fr] items-start">
            <Card className="border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Central Oregon Family Program intake</CardTitle>
                <CardDescription>
                  Tell us why you are coming, who referred you, and whether you already have a seat, need a seat, or need scholarship review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                    <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-logo-green mb-2">Thanks, your intake is in.</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We received your Central Oregon Family Program request. Use the next-step links on this page while we follow up.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/monday-zoom-registration">
                        <Button className="gap-2 w-full sm:w-auto">
                          <Calendar className="h-4 w-4" />
                          Join Monday Zoom
                        </Button>
                      </Link>
                      <a href="tel:5412415668">
                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                          <Phone className="h-4 w-4" />
                          Call (541) 241-5668
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className={errors.name ? "border-destructive" : ""} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className={errors.email ? "border-destructive" : ""} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} className={errors.city ? "border-destructive" : ""} />
                        {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Relationship to the loved one *</Label>
                      <Select value={formData.relationship} onValueChange={(value) => setFormData((p) => ({ ...p, relationship: value }))}>
                        <SelectTrigger className={errors.relationship ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Parent",
                            "Spouse or partner",
                            "Adult child",
                            "Sibling",
                            "Grandparent",
                            "Friend or chosen family",
                            "Professional referral / advocate",
                            "Other",
                          ].map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.relationship && <p className="text-sm text-destructive">{errors.relationship}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label>Which best fits you right now? *</Label>
                      <RadioGroup
                        value={formData.attendanceStatus}
                        onValueChange={(value: "referred-seat" | "need-seat" | "need-scholarship") => setFormData((p) => ({ ...p, attendanceStatus: value }))}
                        className="space-y-3"
                      >
                        {[
                          { value: "referred-seat", label: "I was referred and want a program seat" },
                          { value: "need-seat", label: "I am unattached and want to book a seat" },
                          { value: "need-scholarship", label: "I am unattached and need financial hardship or scholarship review" },
                        ].map((option) => (
                          <div key={option.value} className="flex items-start gap-3 rounded-lg border p-4">
                            <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                            <Label htmlFor={option.value} className="cursor-pointer font-normal leading-relaxed">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referredBy">Who referred you? *</Label>
                      <Input id="referredBy" value={formData.referredBy} onChange={(e) => setFormData((p) => ({ ...p, referredBy: e.target.value }))} placeholder="Provider, therapist, friend, family member, or self-directed" className={errors.referredBy ? "border-destructive" : ""} />
                      {errors.referredBy && <p className="text-sm text-destructive">{errors.referredBy}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reasonForComing">Brief assessment, why are you coming now? *</Label>
                      <Textarea id="reasonForComing" rows={6} value={formData.reasonForComing} onChange={(e) => setFormData((p) => ({ ...p, reasonForComing: e.target.value }))} placeholder="What is happening in the family, what has changed recently, and what help are you hoping for?" className={errors.reasonForComing ? "border-destructive" : ""} />
                      {errors.reasonForComing && <p className="text-sm text-destructive">{errors.reasonForComing}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="householdSummary">Anything else we should know?</Label>
                      <Textarea id="householdSummary" rows={4} value={formData.householdSummary} onChange={(e) => setFormData((p) => ({ ...p, householdSummary: e.target.value }))} placeholder="Optional: safety concerns, treatment history, or family alignment issues" />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending intake...
                        </>
                      ) : (
                        "Submit intake"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>{nextStep.title}</CardTitle>
                  <CardDescription>{nextStep.copy}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={nextStep.ctaHref}>
                    <Button className="w-full gap-2">
                      {nextStep.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/monday-zoom-registration">
                    <Button variant="outline" className="w-full gap-2">
                      <Calendar className="h-4 w-4" />
                      Free Monday Zoom support
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branching logic in plain English</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Referred families:</strong> intake first, then seat confirmation and follow-up.</p>
                  <p><strong className="text-foreground">Unattached families ready to join:</strong> intake first, then book a seat / consultation path.</p>
                  <p><strong className="text-foreground">Unattached families needing help with cost:</strong> intake first, then hardship or scholarship review path.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need immediate support?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="tel:5412415668" className="flex items-center gap-3 text-primary hover:underline">
                    <Phone className="h-4 w-4" />
                    (541) 241-5668
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Families who cannot wait can still use the Monday Zoom or call directly while this program intake is being reviewed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
