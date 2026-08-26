import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Calendar, CheckCircle2, Clock, Loader2, Mail, MessageSquare, RotateCcw, ShieldCheck, Users, Video } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { z } from "zod";

const RESET_SECONDS = 8;
const IDLE_CLEAR_MS = 2 * 60 * 1000;

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  question: z.string().trim().max(1000, "Please keep your question under 1,000 characters.").optional().default(""),
});

type FormData = z.infer<typeof registrationSchema>;

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  question: "",
};

const getNextMeetingDate = () => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(values.weekday);
  const pacificHour = Number(values.hour);
  const daysUntilMonday = weekdayIndex === 1 && pacificHour < 19 ? 0 : (8 - weekdayIndex) % 7 || 7;
  const pacificDate = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
  pacificDate.setUTCDate(pacificDate.getUTCDate() + daysUntilMonday);
  return pacificDate.toISOString().slice(0, 10);
};

const formatMeetingDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

export default function FamilySquaresKiosk() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(RESET_SECONDS);
  const [cancellationReason, setCancellationReason] = useState<string | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const meetingDate = getNextMeetingDate();

  useEffect(() => {
    const robotsTags = Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta[name="robots"]'));
    const originalValues = robotsTags.map((tag) => tag.content);
    robotsTags.forEach((tag) => tag.setAttribute("content", "noindex, nofollow"));
    return () => robotsTags.forEach((tag, index) => tag.setAttribute("content", originalValues[index]));
  }, []);

  const resetForNextPerson = useCallback(() => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    setResetCountdown(RESET_SECONDS);
    setIsSubmitting(false);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const restartIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!submitted && Object.values(formData).some((value) => value.trim())) {
      idleTimer.current = setTimeout(resetForNextPerson, IDLE_CLEAR_MS);
    }
  }, [formData, resetForNextPerson, submitted]);

  useEffect(() => {
    restartIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [restartIdleTimer]);

  useEffect(() => {
    const checkCancellation = async () => {
      const { data } = await supabase
        .from("cancelled_meeting_dates")
        .select("reason")
        .eq("meeting_date", meetingDate)
        .maybeSingle();
      setCancellationReason(data?.reason ?? null);
    };
    void checkCancellation();
  }, [meetingDate]);

  useEffect(() => {
    if (!submitted) return;
    if (resetCountdown <= 0) {
      resetForNextPerson();
      return;
    }
    const timer = window.setTimeout(() => setResetCountdown((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resetCountdown, resetForNextPerson, submitted]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    if (cancellationReason) {
      toast({ title: "This week's meeting is cancelled", description: cancellationReason, variant: "destructive" });
      return;
    }

    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof FormData | undefined;
        if (field) fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("public-register-monday-zoom", {
        body: {
          user_id: null,
          name: result.data.name,
          email: result.data.email,
          phone: "",
          question: result.data.question,
          request_follow_up: false,
          consent_email_list: false,
          meeting_date: meetingDate,
          auto_register: false,
          preferred_contact_date: null,
          preferred_contact_time: null,
          preferred_timezone: null,
          language: "en",
          attribution: {
            pagePath: "/family-squares-kiosk",
            utmSource: "raspberry_pi_kiosk",
            utmCampaign: "family_squares_remote_registration",
            utmContent: "touchscreen",
          },
        },
      });
      if (error) throw error;

      // Remove personal information before showing the shared-screen confirmation.
      setFormData(EMPTY_FORM);
      setSubmitted(true);
      setResetCountdown(RESET_SECONDS);
    } catch (error: unknown) {
      console.error("Kiosk registration failed:", error);
      toast({
        title: "Registration could not be completed",
        description: "Please check the internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-logo-blue to-emerald-950 px-5 py-8 text-white">
        <SEOHead
          title="Family Squares Registration Kiosk | Sober Helpline"
          description="Shared-device registration for the Sober Helpline Family Squares meeting."
          noIndex
          canonicalPath="/family-squares"
        />
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <Card className="w-full border-white/20 bg-white text-center shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-600" aria-hidden="true" />
              <h1 className="mt-6 text-3xl font-extrabold text-slate-900 sm:text-5xl">You're registered.</h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Check your email for the Family Squares Zoom link. You may also submit your question in advance from this screen.
              </p>
              <div className="mx-auto mt-7 max-w-lg rounded-2xl bg-emerald-50 p-5 text-emerald-900">
                <Mail className="mx-auto mb-2 h-7 w-7" aria-hidden="true" />
                <p className="font-semibold">Your personal information has been cleared from this shared screen.</p>
              </div>
              <p className="mt-7 text-base text-slate-500">Ready for the next person in {resetCountdown} seconds.</p>
              <Button type="button" size="lg" className="mt-5 min-h-14 w-full text-lg" onClick={resetForNextPerson}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Register Another Person Now
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-logo-blue to-emerald-950 px-4 py-5 sm:px-6 sm:py-8">
      <SEOHead
        title="Family Squares Registration Kiosk | Sober Helpline"
        description="Shared-device registration for the Sober Helpline Family Squares meeting."
        noIndex
        canonicalPath="/family-squares"
      />
      <main className="mx-auto max-w-6xl">
        <header className="mb-5 flex items-center justify-center sm:mb-7">
          <img src={logo} alt="Sober Helpline" className="h-20 w-auto rounded-xl bg-white px-3 shadow-lg sm:h-24" />
        </header>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-bold text-emerald-100">
              <Video className="h-5 w-5" />
              Free weekly family support
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">Join the Family Squares Zoom Meeting</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-100 sm:text-xl">
              A compassionate Monday-night meeting for parents, spouses, siblings, adult children, and anyone affected by a loved one's addiction.
            </p>

            <div className="mt-7 grid gap-3">
              {[
                { icon: Calendar, text: "Every Monday" },
                { icon: Clock, text: "7:00 PM Pacific" },
                { icon: Users, text: "Open to families everywhere" },
                { icon: MessageSquare, text: "Submit a question if you choose" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex min-h-14 items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 text-lg font-semibold">
                  <Icon className="h-6 w-6 shrink-0 text-emerald-300" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-7 flex gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-950/30 p-4 text-emerald-50">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" aria-hidden="true" />
              <p className="leading-relaxed">Registration is private. Your name and email are cleared from this shared screen after submission.</p>
            </div>
          </section>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-logo-blue">Upcoming meeting</p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{formatMeetingDate(meetingDate)}</h2>
                <p className="mt-2 text-base text-slate-600">Register below. Your Zoom link will be emailed to you.</p>
              </div>

              {cancellationReason ? (
                <div className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-red-900">
                  <p className="font-bold">This week's meeting is cancelled.</p>
                  <p className="mt-1">{cancellationReason}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5" aria-label="Family Squares registration">
                <div className="space-y-2">
                  <Label htmlFor="kiosk-name" className="text-base font-bold">Full Name *</Label>
                  <Input
                    id="kiosk-name"
                    name="family-squares-kiosk-name"
                    autoComplete="off"
                    data-lpignore="true"
                    required
                    value={formData.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Your full name"
                    className="h-14 text-lg"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? <p className="font-medium text-destructive">{errors.name}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kiosk-email" className="text-base font-bold">Email Address *</Label>
                  <Input
                    id="kiosk-email"
                    name="family-squares-kiosk-email"
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    data-lpignore="true"
                    required
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    className="h-14 text-lg"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? <p className="font-medium text-destructive">{errors.email}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kiosk-question" className="text-base font-bold">
                    Question for Monday <span className="font-normal text-slate-500">(Optional)</span>
                  </Label>
                  <Textarea
                    id="kiosk-question"
                    name="family-squares-kiosk-question"
                    autoComplete="off"
                    data-lpignore="true"
                    value={formData.question}
                    onChange={(event) => updateField("question", event.target.value)}
                    placeholder="What would make this meeting useful for you?"
                    rows={4}
                    className="min-h-28 text-lg"
                    aria-invalid={Boolean(errors.question)}
                  />
                  {errors.question ? <p className="font-medium text-destructive">{errors.question}</p> : null}
                </div>

                <Button type="submit" size="lg" className="min-h-16 w-full text-xl font-bold" disabled={isSubmitting || Boolean(cancellationReason)}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Registering…</>
                  ) : (
                    <><Mail className="mr-2 h-6 w-6" />Register & Email My Zoom Link</>
                  )}
                </Button>

                <p className="text-center text-sm leading-relaxed text-slate-500">
                  This meeting is recorded and archived for Sober Helpline members. This is support and education, not emergency or medical care.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
