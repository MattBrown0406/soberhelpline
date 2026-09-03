import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Calendar, CircleHelp, Clock, Eraser, Loader2, Mail, MessageSquare, RefreshCw, ShieldCheck, Smartphone, Users, Video, WifiOff } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FamilySquaresKioskAttract from "@/components/FamilySquaresKioskAttract";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import kioskLogo from "@/assets/sober-helpline-kiosk-logo.jpg";
import appStoreQrCode from "@/assets/sober-helpline-app-store-qr.png";
import mobileRegistrationQrCode from "@/assets/family-squares-mobile-registration-qr.png";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { z } from "zod";

const RESET_SECONDS = 20;
const ATTRACT_IDLE_MS = 60 * 1000;
const IDLE_REFRESH_MS = 15 * 60 * 1000;
const SLOW_SUBMISSION_MS = 5 * 1000;
const KIOSK_HELP_PHONE = "(458) 298-8008";

const COMMON_EMAIL_DOMAIN_TYPOS: Record<string, string> = {
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmail.con": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yahoo.con": "yahoo.com",
  "icloud.con": "icloud.com",
};

const suggestEmailCorrection = (email: string) => {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex <= 0) return null;
  const localPart = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1).toLowerCase();
  const correctedDomain = COMMON_EMAIL_DOMAIN_TYPOS[domain];
  return correctedDomain ? `${localPart}@${correctedDomain}` : null;
};

const formatPhoneInput = (value: string) => {
  const limited = value.slice(0, 20);
  if (limited.includes("+") || /[A-Za-z]/.test(limited)) return limited;
  const digits = limited.replace(/\D/g, "");
  if (digits.length > 10) return limited;
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  phone: z.string().trim().max(20, "Please keep your phone number under 20 characters.").optional().default(""),
  question: z.string().trim().max(1000, "Please keep your question under 1,000 characters.").optional().default(""),
  requestFollowUp: z.boolean().default(false),
});

type FormData = z.infer<typeof registrationSchema>;

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  question: "",
  requestFollowUp: false,
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
  // Family Squares is scheduled for 60 minutes. Keep the current meeting
  // available through 8 PM Pacific, then roll forward to next Monday.
  const daysUntilMonday = weekdayIndex === 1 && pacificHour < 20 ? 0 : (8 - weekdayIndex) % 7 || 7;
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
  const [isAttractMode, setIsAttractMode] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(RESET_SECONDS);
  const [cancellationReason, setCancellationReason] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [emailSuggestionDismissedFor, setEmailSuggestionDismissedFor] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSlowSubmission, setShowSlowSubmission] = useState(false);
  const [offlineRetryStatus, setOfflineRetryStatus] = useState<"idle" | "checking" | "failed">("idle");
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slowSubmissionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submissionAttempt = useRef(0);
  const submissionInFlight = useRef(false);
  const confirmationButtonRef = useRef<HTMLButtonElement>(null);
  const formStartedTracked = useRef(false);
  const attractViewTracked = useRef(false);
  const offlineViewTracked = useRef(false);
  const { toast } = useToast();
  const [meetingDate, setMeetingDate] = useState(getNextMeetingDate);

  useEffect(() => {
    try {
      window.localStorage.removeItem("soberhelpline_inbound_source");
      window.localStorage.removeItem("soberhelpline_conversion_events");
    } catch {
      // Shared-device privacy cleanup must never interrupt registration.
    }
  }, []);

  useEffect(() => {
    const robotsTags = Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta[name="robots"]'));
    const originalValues = robotsTags.map((tag) => tag.content);
    robotsTags.forEach((tag) => tag.setAttribute("content", "noindex, nofollow"));
    return () => robotsTags.forEach((tag, index) => tag.setAttribute("content", originalValues[index]));
  }, []);

  useEffect(() => {
    const refreshMeetingDate = () => setMeetingDate(getNextMeetingDate());
    const timer = window.setInterval(refreshMeetingDate, 30_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshMeetingDate();
    };

    window.addEventListener("focus", refreshMeetingDate);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshMeetingDate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let healthOffline = !navigator.onLine;
    let healthCheckInFlight = false;
    const clearForOffline = () => {
      healthOffline = true;
      submissionAttempt.current += 1;
      if (slowSubmissionTimer.current) clearTimeout(slowSubmissionTimer.current);
      slowSubmissionTimer.current = null;
      setFormData(EMPTY_FORM);
      setErrors({});
      setEmailSuggestion(null);
      setEmailSuggestionDismissedFor(null);
      setShowHelp(false);
      setShowSlowSubmission(false);
      setIsSubmitting(false);
      setIsOnline(false);
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    };
    const recoverOnline = () => {
      if (healthOffline) {
        window.location.reload();
        return;
      }
      setIsOnline(true);
    };
    const checkConnection = async () => {
      if (submissionInFlight.current || healthCheckInFlight) return;
      if (!navigator.onLine) {
        clearForOffline();
        return;
      }
      healthCheckInFlight = true;
      try {
        const response = await fetch(`/robots.txt?kiosk-health=${Date.now()}`, {
          method: "HEAD",
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`Health check returned ${response.status}`);
        recoverOnline();
      } catch {
        clearForOffline();
      } finally {
        healthCheckInFlight = false;
      }
    };

    window.addEventListener("offline", clearForOffline);
    window.addEventListener("online", recoverOnline);
    void checkConnection();
    const healthTimer = window.setInterval(checkConnection, 30_000);
    return () => {
      window.clearInterval(healthTimer);
      window.removeEventListener("offline", clearForOffline);
      window.removeEventListener("online", recoverOnline);
    };
  }, []);

  useEffect(() => {
    if (isAttractMode && !attractViewTracked.current) {
      attractViewTracked.current = true;
      trackConversionEvent("kiosk_attract_view", { source: "family_squares_kiosk", privacySafe: true });
    }
    if (!isAttractMode) attractViewTracked.current = false;
  }, [isAttractMode]);

  useEffect(() => {
    if (!isOnline && !offlineViewTracked.current) {
      offlineViewTracked.current = true;
      trackConversionEvent("kiosk_offline_view", { source: "family_squares_kiosk", privacySafe: true });
    }
    if (isOnline) offlineViewTracked.current = false;
  }, [isOnline]);

  useEffect(() => {
    if (!submitted) return;
    trackConversionEvent("kiosk_app_qr_view", { source: "family_squares_kiosk", privacySafe: true });
  }, [submitted]);

  useEffect(() => {
    if (!isAttractMode || !isOnline) return;
    const refreshTimer = window.setTimeout(() => window.location.reload(), IDLE_REFRESH_MS);
    return () => window.clearTimeout(refreshTimer);
  }, [isAttractMode, isOnline]);

  const keepFocusedFieldVisible = useCallback(() => {
    if (focusScrollTimer.current) clearTimeout(focusScrollTimer.current);
    focusScrollTimer.current = setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
    }, 300);
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    viewport.addEventListener("resize", keepFocusedFieldVisible);
    return () => {
      viewport.removeEventListener("resize", keepFocusedFieldVisible);
      if (focusScrollTimer.current) clearTimeout(focusScrollTimer.current);
    };
  }, [keepFocusedFieldVisible]);

  const resetForNextPerson = useCallback(() => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    setResetCountdown(RESET_SECONDS);
    setIsSubmitting(false);
    setIsAttractMode(false);
    setEmailSuggestion(null);
    setEmailSuggestionDismissedFor(null);
    setShowHelp(false);
    setShowSlowSubmission(false);
    formStartedTracked.current = false;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const enterAttractMode = useCallback(() => {
    // Clear abandoned entries before covering the form on this shared screen.
    submissionAttempt.current += 1;
    submissionInFlight.current = false;
    if (slowSubmissionTimer.current) clearTimeout(slowSubmissionTimer.current);
    slowSubmissionTimer.current = null;
    setFormData(EMPTY_FORM);
    setErrors({});
    setIsSubmitting(false);
    setEmailSuggestion(null);
    setEmailSuggestionDismissedFor(null);
    setShowHelp(false);
    setShowSlowSubmission(false);
    formStartedTracked.current = false;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, behavior: "auto" });
    setIsAttractMode(true);
  }, []);

  useEffect(() => {
    if (submitted || isAttractMode) return;

    const restartAttractTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(enterAttractMode, ATTRACT_IDLE_MS);
    };

    restartAttractTimer();
    window.addEventListener("pointerdown", restartAttractTimer, true);
    window.addEventListener("keydown", restartAttractTimer, true);
    window.addEventListener("input", restartAttractTimer, true);
    window.addEventListener("change", restartAttractTimer, true);
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener("pointerdown", restartAttractTimer, true);
      window.removeEventListener("keydown", restartAttractTimer, true);
      window.removeEventListener("input", restartAttractTimer, true);
      window.removeEventListener("change", restartAttractTimer, true);
    };
  }, [enterAttractMode, isAttractMode, submitted]);

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

  useEffect(() => {
    if (!submitted) return;
    const animationFrame = window.requestAnimationFrame(() => confirmationButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(animationFrame);
  }, [submitted]);

  useEffect(() => () => {
    if (slowSubmissionTimer.current) window.clearTimeout(slowSubmissionTimer.current);
  }, []);

  const trackFormStarted = () => {
    if (formStartedTracked.current) return;
    formStartedTracked.current = true;
    trackConversionEvent("kiosk_form_started", { source: "family_squares_kiosk", privacySafe: true });
  };

  const updateField = (field: keyof FormData, value: string) => {
    trackFormStarted();
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === "email") {
      setEmailSuggestion(null);
      setEmailSuggestionDismissedFor(null);
    }
  };

  const clearForm = () => {
    const interruptedSubmission = submissionInFlight.current;
    submissionAttempt.current += 1;
    submissionInFlight.current = false;
    if (slowSubmissionTimer.current) clearTimeout(slowSubmissionTimer.current);
    slowSubmissionTimer.current = null;
    setIsSubmitting(false);
    setShowSlowSubmission(false);
    setFormData(EMPTY_FORM);
    setErrors({});
    setEmailSuggestion(null);
    setEmailSuggestionDismissedFor(null);
    formStartedTracked.current = false;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    trackConversionEvent("kiosk_form_cleared", { source: "family_squares_kiosk", privacySafe: true });
    if (interruptedSubmission) {
      toast({
        title: "The form was cleared",
        description: "If you already tapped Register, check your email before submitting again.",
      });
    }
  };

  const retryConnection = async () => {
    setOfflineRetryStatus("checking");
    try {
      const response = await fetch(`/robots.txt?kiosk-retry=${Date.now()}`, { method: "HEAD", cache: "no-store" });
      if (!response.ok) throw new Error(`Retry returned ${response.status}`);
      window.location.reload();
    } catch {
      setOfflineRetryStatus("failed");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    if (!isOnline) return;

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

    const suggestedEmail = suggestEmailCorrection(result.data.email);
    if (suggestedEmail && emailSuggestionDismissedFor !== result.data.email) {
      setEmailSuggestion(suggestedEmail);
      return;
    }

    setIsSubmitting(true);
    submissionInFlight.current = true;
    setShowSlowSubmission(false);
    trackConversionEvent("kiosk_registration_submit", { source: "family_squares_kiosk", privacySafe: true });
    const currentAttempt = ++submissionAttempt.current;
    slowSubmissionTimer.current = setTimeout(() => setShowSlowSubmission(true), SLOW_SUBMISSION_MS);
    try {
      const { error } = await supabase.functions.invoke("public-register-monday-zoom", {
        body: {
          user_id: null,
          name: result.data.name,
          email: result.data.email,
          // A phone number is retained only with the visitor's affirmative
          // intervention-contact request. Email remains the Zoom delivery path.
          phone: result.data.requestFollowUp ? result.data.phone : "",
          question: result.data.question,
          request_follow_up: result.data.requestFollowUp,
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
      if (currentAttempt !== submissionAttempt.current) return;

      // Remove personal information before showing the shared-screen confirmation.
      setFormData(EMPTY_FORM);
      setSubmitted(true);
      setResetCountdown(RESET_SECONDS);
      trackConversionEvent("kiosk_registration_success", { source: "family_squares_kiosk", privacySafe: true });
    } catch (error: unknown) {
      if (currentAttempt !== submissionAttempt.current) return;
      console.error("Kiosk registration failed:", error);
      trackConversionEvent("kiosk_registration_failure", { source: "family_squares_kiosk", privacySafe: true, reason: navigator.onLine ? "request_failed" : "offline" });
      if (!navigator.onLine) {
        setFormData(EMPTY_FORM);
        setErrors({});
        setEmailSuggestion(null);
        setEmailSuggestionDismissedFor(null);
        setIsOnline(false);
      }
      toast({
        title: "Registration could not be completed",
        description: "Please check the internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      if (currentAttempt === submissionAttempt.current) {
        if (slowSubmissionTimer.current) window.clearTimeout(slowSubmissionTimer.current);
        slowSubmissionTimer.current = null;
        submissionInFlight.current = false;
        setShowSlowSubmission(false);
        setIsSubmitting(false);
      }
    }
  };

  if (!isOnline) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-logo-blue to-emerald-950 p-5 text-slate-900">
        <SEOHead
          title="Family Squares Registration Kiosk | Sober Helpline"
          description="Shared-device registration for the Sober Helpline Family Squares meeting."
          noIndex
          canonicalPath="/family-squares"
        />
        <main className="grid w-full max-w-4xl items-center gap-6 rounded-3xl bg-white p-7 text-center shadow-2xl md:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col items-center" role="alert" aria-live="assertive">
            <WifiOff className="h-16 w-16 text-amber-600" aria-hidden="true" />
            <h1 className="mt-3 text-4xl font-extrabold text-slate-950">This kiosk is temporarily offline</h1>
            <p className="mt-4 max-w-xl text-xl leading-relaxed text-slate-600">
              Your information has been cleared. If you already tapped Register, check your email before submitting again. Otherwise, scan the QR code and continue on your phone.
            </p>
            <Button type="button" size="lg" className="mt-6 min-h-14 px-8 text-lg" onClick={() => void retryConnection()} disabled={offlineRetryStatus === "checking"}>
              <RefreshCw className={`mr-2 h-5 w-5 ${offlineRetryStatus === "checking" ? "animate-spin" : ""}`} aria-hidden="true" />
              {offlineRetryStatus === "checking" ? "Checking Connection…" : "Retry Connection"}
            </Button>
            {offlineRetryStatus === "failed" ? <p role="status" className="mt-3 font-bold text-amber-700">Still offline. Please scan the QR code or try again shortly.</p> : null}
            <p className="mt-5 text-base font-semibold text-slate-600">Need help? Call {KIOSK_HELP_PHONE} from your phone.</p>
          </section>
          <section className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-5">
            <p className="mb-3 text-xl font-extrabold text-emerald-950">Register on your phone</p>
            <img
              src={mobileRegistrationQrCode}
              alt="QR code linking to online Family Squares registration"
              className="mx-auto h-[280px] w-[280px] rounded-2xl border-8 border-white bg-white shadow-xl"
            />
            <p className="mt-3 whitespace-nowrap text-sm font-bold tracking-tight text-emerald-900">SoberHelpline.com/family-squares</p>
          </section>
        </main>
      </div>
    );
  }

  if (isAttractMode) {
    return <FamilySquaresKioskAttract onDismiss={() => setIsAttractMode(false)} />;
  }

  if (submitted) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-logo-blue to-emerald-950 text-white">
        <SEOHead
          title="Family Squares Registration Kiosk | Sober Helpline"
          description="Shared-device registration for the Sober Helpline Family Squares meeting."
          noIndex
          canonicalPath="/family-squares"
        />
        <main className="h-screen">
          <button
            ref={confirmationButtonRef}
            type="button"
            onClick={resetForNextPerson}
            className="flex h-screen w-full items-center justify-center p-4 text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-inset focus-visible:outline-emerald-300"
            aria-label="Registration complete. Scan the QR code to download the Sober Helpline app. Tap anywhere to return to registration now."
          >
            <span className="grid h-full max-h-[568px] w-full max-w-5xl grid-cols-1 items-center gap-5 rounded-3xl border border-white/25 bg-white p-5 text-slate-900 shadow-2xl md:grid-cols-[1.1fr_0.9fr] lg:gap-7 lg:p-7">
              <span className="flex min-w-0 flex-col items-center text-center">
                <img
                  src={kioskLogo}
                  alt="Sober Helpline — Family Addiction Support & Education"
                  className="w-full max-w-[250px] rounded-2xl shadow-lg"
                />
                <span role="status" aria-live="polite" className="mt-4 text-4xl font-extrabold leading-tight text-slate-950 lg:text-[42px]">You're registered!</span>
                <span className="mt-3 max-w-xl text-lg leading-snug text-slate-600">
                  Check your email for your Family Squares Zoom information.
                </span>
                <span className="mt-4 flex items-center gap-2 text-xl font-bold text-logo-blue">
                  <Smartphone className="h-6 w-6 shrink-0" aria-hidden="true" />
                  Take Sober Helpline with you
                </span>
                <span className="mt-2 max-w-lg text-base leading-snug text-slate-600">
                  Scan the code to download the Sober Helpline app for iPhone and iPad.
                </span>
                <span className="mt-5 text-sm font-bold text-slate-700">
                  Resetting in {resetCountdown} seconds
                </span>
                <span className="mt-2 h-2 w-full max-w-sm overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                  <span
                    className="block h-full rounded-full bg-emerald-500 transition-[width] duration-1000 ease-linear"
                    style={{ width: `${(resetCountdown / RESET_SECONDS) * 100}%` }}
                  />
                </span>
                <span className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-logo-blue px-6 text-base font-extrabold text-white shadow-md">
                  Register Another Person Now
                </span>
                <span className="mt-2 text-sm font-semibold text-slate-600">Your personal information has been cleared.</span>
              </span>

              <span className="flex flex-col items-center justify-center rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-4 shadow-inner">
                <span className="mb-2 flex items-center gap-2 text-lg font-extrabold text-emerald-950">
                  <Smartphone className="h-6 w-6" aria-hidden="true" />
                  Scan with your iPhone or iPad camera
                </span>
                <img
                  src={appStoreQrCode}
                  alt="QR code linking to the Sober Helpline app in the Apple App Store"
                  className="h-[290px] w-[290px] rounded-2xl border-8 border-white bg-white shadow-xl"
                />
                <span className="mt-3 text-base font-bold text-emerald-900">Available for iPhone and iPad</span>
              </span>
            </span>
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-logo-blue to-emerald-950 px-4 py-5 sm:px-6 sm:py-8 md:py-3 lg:px-4 lg:py-1">
      <SEOHead
        title="Family Squares Registration Kiosk | Sober Helpline"
        description="Shared-device registration for the Sober Helpline Family Squares meeting."
        noIndex
        canonicalPath="/family-squares"
      />
      <main className="mx-auto max-w-6xl">
        <header className="mb-5 flex items-center justify-center sm:mb-7 md:mb-3 lg:mb-2">
          <img
            src={kioskLogo}
            alt="Sober Helpline — Family Addiction Support & Education"
            className="w-full max-w-md rounded-2xl shadow-2xl md:max-w-[190px] md:rounded-xl lg:max-w-[112px] lg:rounded-lg"
          />
        </header>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-3">
          <section className="order-2 min-w-0 select-none rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur sm:p-8 lg:order-none lg:rounded-2xl lg:p-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-bold text-emerald-100 lg:px-3 lg:py-1.5 lg:text-xs">
              <Video className="h-5 w-5" />
              Free weekly family support
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:mt-2 lg:text-3xl">Join the Family Squares Zoom Meeting</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-100 sm:text-xl lg:mt-2 lg:text-sm lg:leading-snug">
              Compassionate support for anyone affected by a loved one's addiction.
            </p>

            <div className="mt-7 grid gap-3 lg:mt-3 lg:grid-cols-2 lg:gap-2">
              {[
                { icon: Calendar, text: "Every Monday" },
                { icon: Clock, text: "7:00 PM Pacific" },
                { icon: Users, text: "Open to families everywhere" },
                { icon: MessageSquare, text: "Submit a question if you choose" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex min-h-14 items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 text-lg font-semibold lg:min-h-11 lg:gap-2 lg:rounded-xl lg:px-3 lg:py-1.5 lg:text-sm">
                  <Icon className="h-6 w-6 shrink-0 text-emerald-300 lg:h-5 lg:w-5" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-950/30 p-4 text-emerald-50 lg:mt-3 lg:rounded-xl lg:p-2.5 lg:text-sm">
              <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-300 lg:h-5 lg:w-5" aria-hidden="true" />
              <p className="min-w-0 flex-1 leading-snug">Private. Personal information is cleared after submission.</p>
              <button
                type="button"
                onClick={() => {
                  setShowHelp(true);
                  trackConversionEvent("kiosk_help_view", { source: "family_squares_kiosk", privacySafe: true });
                }}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 font-bold hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <CircleHelp className="h-5 w-5" aria-hidden="true" />
                Need help?
              </button>
            </div>
          </section>

          <Card className="order-1 min-w-0 border-0 shadow-2xl lg:order-none">
            <CardContent className="p-6 sm:p-8 md:p-5 lg:p-4">
              <div className="mb-6 text-center md:mb-3 lg:mb-2">
                <p className="text-sm font-bold uppercase tracking-wider text-logo-blue lg:text-xs">Upcoming meeting</p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-xl">{formatMeetingDate(meetingDate)}</h2>
                <p className="mt-2 text-base text-slate-600 lg:mt-1 lg:text-sm">Register below. Your Zoom link will be emailed to you.</p>
              </div>

              {cancellationReason ? (
                <div className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-red-900">
                  <p className="font-bold">This week's meeting is cancelled.</p>
                  <p className="mt-1">{cancellationReason}</p>
                </div>
              ) : null}

              <form
                onSubmit={handleSubmit}
                onFocusCapture={keepFocusedFieldVisible}
                autoComplete="off"
                className="space-y-5 md:space-y-3 lg:space-y-2"
                aria-label="Family Squares registration"
              >
                <div className="grid gap-5 md:grid-cols-2 md:gap-3">
                  <div className="space-y-2 lg:space-y-1">
                    <Label htmlFor="kiosk-name" className="text-base font-bold lg:text-sm">Full Name *</Label>
                    <Input
                      id="kiosk-name"
                      name="family-squares-kiosk-name"
                      autoComplete="off"
                      data-lpignore="true"
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Your full name"
                      className="h-14 text-lg md:h-12 lg:text-base"
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name ? <p className="font-medium text-destructive lg:text-xs lg:leading-tight">{errors.name}</p> : null}
                  </div>

                  <div className="space-y-2 lg:space-y-1">
                    <Label htmlFor="kiosk-email" className="text-base font-bold lg:text-sm">Email Address *</Label>
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
                      maxLength={255}
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@example.com"
                      className="h-14 text-lg md:h-12 lg:text-base"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email ? <p className="font-medium text-destructive lg:text-xs lg:leading-tight">{errors.email}</p> : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr] md:items-stretch">
                  <div className="space-y-2 lg:space-y-1">
                    <Label htmlFor="kiosk-phone" className="text-base font-bold lg:text-sm">
                      Phone Number <span className="font-normal text-slate-500">(Optional)</span>
                    </Label>
                    <Input
                      id="kiosk-phone"
                      name="family-squares-kiosk-phone"
                      type="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      autoComplete="off"
                      data-lpignore="true"
                      maxLength={20}
                      value={formData.phone}
                      onChange={(event) => updateField("phone", formatPhoneInput(event.target.value))}
                      placeholder="(555) 123-4567"
                      className="h-14 text-lg md:h-12 lg:text-base"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "kiosk-phone-error" : undefined}
                    />
                    {errors.phone ? <p id="kiosk-phone-error" className="font-medium text-destructive lg:text-xs lg:leading-tight">{errors.phone}</p> : null}
                  </div>

                  <div className="flex min-h-16 items-center rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 md:p-3 lg:min-h-0 lg:rounded-xl lg:p-2">
                    <div className="flex items-start gap-4 lg:items-center lg:gap-3">
                      <Checkbox
                        id="kiosk-intervention-contact"
                        checked={formData.requestFollowUp}
                        onCheckedChange={(checked) => {
                          trackFormStarted();
                          setFormData((current) => ({ ...current, requestFollowUp: checked === true }));
                          setErrors((current) => ({ ...current, requestFollowUp: undefined }));
                        }}
                        className="mt-0.5 h-7 w-7 rounded-md border-2"
                      />
                      <Label htmlFor="kiosk-intervention-contact" className="cursor-pointer text-base font-semibold leading-relaxed text-slate-800 md:text-sm lg:leading-snug">
                        Contact me about intervention services. <span className="font-normal text-slate-500">(Optional)</span>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 lg:space-y-1">
                  <Label htmlFor="kiosk-question" className="text-base font-bold lg:text-sm">
                    Question for Monday <span className="font-normal text-slate-500">(Optional)</span>
                  </Label>
                  <Textarea
                    id="kiosk-question"
                    name="family-squares-kiosk-question"
                    autoComplete="off"
                    data-lpignore="true"
                    maxLength={1000}
                    value={formData.question}
                    onChange={(event) => updateField("question", event.target.value)}
                    placeholder="What would make this meeting useful for you?"
                    rows={2}
                    className="min-h-28 resize-none text-lg md:min-h-20 lg:min-h-14 lg:text-base"
                    aria-invalid={Boolean(errors.question)}
                  />
                  {errors.question ? <p className="font-medium text-destructive lg:text-xs lg:leading-tight">{errors.question}</p> : null}
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Button type="submit" size="lg" className="min-h-16 whitespace-normal px-4 text-lg font-bold leading-tight sm:text-xl md:min-h-14 lg:min-h-12 lg:text-base" disabled={isSubmitting || Boolean(cancellationReason) || !isOnline}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center" role="status" aria-live="polite">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" aria-hidden="true" />
                        {showSlowSubmission ? "Still working—please keep this screen open…" : "Registering—please wait…"}
                      </span>
                    ) : (
                      <><Mail className="mr-2 h-6 w-6" />Register & Email My Zoom Link</>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="min-h-16 px-4 font-bold md:min-h-14 lg:min-h-12"
                    onClick={clearForm}
                  >
                    <Eraser className="mr-2 h-5 w-5" aria-hidden="true" />
                    {isSubmitting ? "Cancel & Clear" : "Clear"}
                  </Button>
                </div>

                <p className="text-center text-sm leading-relaxed text-slate-500 lg:text-xs lg:leading-snug">
                  This meeting is recorded and archived for Sober Helpline members. This is support and education, not emergency or medical care.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {emailSuggestion ? (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-slate-950/80 p-5" role="dialog" aria-modal="true" aria-labelledby="email-suggestion-title">
          <div className="w-full max-w-xl rounded-3xl bg-white p-7 text-center shadow-2xl">
            <AlertTriangle className="mx-auto h-14 w-14 text-amber-500" aria-hidden="true" />
            <h2 id="email-suggestion-title" className="mt-3 text-3xl font-extrabold text-slate-950">Check your email address</h2>
            <p className="mt-3 text-lg text-slate-600">Did you mean:</p>
            <p className="mt-2 break-all text-2xl font-bold text-logo-blue">{emailSuggestion}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                size="lg"
                autoFocus
                className="min-h-16 text-lg font-bold"
                onClick={() => {
                  setFormData((current) => ({ ...current, email: emailSuggestion }));
                  setEmailSuggestionDismissedFor(emailSuggestion);
                  setEmailSuggestion(null);
                }}
              >
                Use This Address
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="min-h-16 text-lg font-bold"
                onClick={() => {
                  setEmailSuggestionDismissedFor(formData.email.trim());
                  setEmailSuggestion(null);
                }}
              >
                Keep What I Typed
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {showHelp ? (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-slate-950/80 p-5" role="dialog" aria-modal="true" aria-labelledby="kiosk-help-title">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-2xl">
            <CircleHelp className="mx-auto h-16 w-16 text-logo-blue" aria-hidden="true" />
            <h2 id="kiosk-help-title" className="mt-3 text-3xl font-extrabold text-slate-950">Need help registering?</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">Use your phone to call Sober Helpline:</p>
            <p className="mt-2 text-4xl font-extrabold tracking-wide text-logo-blue">{KIOSK_HELP_PHONE}</p>
            <p className="mt-4 text-base text-slate-500">Your information remains private on this screen.</p>
            <Button type="button" size="lg" autoFocus className="mt-6 min-h-16 w-full text-lg font-bold" onClick={() => setShowHelp(false)}>
              Back to Registration
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
