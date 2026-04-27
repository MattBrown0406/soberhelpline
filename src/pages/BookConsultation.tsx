import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle, Phone, Monitor, Globe, Crown, Users } from "lucide-react";
import logo from "@/assets/logo.png";

import SEOHead from "@/components/SEOHead";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
];

interface ProviderDateOverride {
  id: string;
  override_date: string;
  is_available: boolean;
  start_time: string | null;
  end_time: string | null;
  timezone: string | null;
}

const getTimezoneLabel = (tz: string) => TIMEZONE_OPTIONS.find((t) => t.value === tz)?.label || tz;

const convertTime = (timeStr: string, dateStr: string, fromTz: string, toTz: string): { time: string; dayOffset: number } => {
  const [h, m] = timeStr.split(":").map(Number);
  const getOffset = (tz: string, date: Date) => {
    const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const local = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return (local.getTime() - utc.getTime()) / 60000;
  };
  const sourceDateStr = `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  const refDate = new Date(sourceDateStr);
  const fromOffset = getOffset(fromTz, refDate);
  const toOffset = getOffset(toTz, refDate);
  const diffMinutes = toOffset - fromOffset;
  let totalMinutes = h * 60 + m + diffMinutes;
  let dayOffset = 0;
  while (totalMinutes < 0) { totalMinutes += 1440; dayOffset--; }
  while (totalMinutes >= 1440) { totalMinutes -= 1440; dayOffset++; }
  const newH = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const newM = String(totalMinutes % 60).padStart(2, "0");
  return { time: `${newH}:${newM}`, dayOffset };
};

const formatTime12h = (time24: string) => {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

const formatDateInTimezone = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value || "0000";
  const month = parts.find((part) => part.type === "month")?.value || "01";
  const day = parts.find((part) => part.type === "day")?.value || "01";

  return `${year}-${month}-${day}`;
};

const addDaysToDateStr = (dateStr: string, days: number) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
};

const getDayOfWeekFromDateStr = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
};

const rangesOverlap = (startA: number, endA: number, startB: number, endB: number) => startA < endB && endA > startB;

const SESSION_REASONS = [
  "Emergency Game Plan",
  "Family Intervention Coaching",
  "Finding a Treatment Program",
  "Following Aftercare Plans",
  "Boundaries and Enabling",
  "Family Communication Strategies",
  "Relapse Response Planning",
  "Understanding Addiction & Mental Health",
  "Supporting a Loved One in Recovery",
  "Other",
];

const intakeSections = [
  {
    title: "Contact Information",
    fields: [
      { id: "client_email", label: "Email Address", type: "email", required: true },
      { id: "client_name", label: "Your Full Name", type: "text", required: true },
      { id: "client_phone", label: "Phone Number", type: "tel", required: false },
      { id: "session_reason", label: "Primary Reason for This Session", type: "select", required: true, options: SESSION_REASONS, singleSessionOnly: true },
      { id: "relationship", label: "Your Relationship to the Individual", type: "select", required: true, options: ["Parent", "Spouse/Partner", "Adult Child", "Sibling", "Close Friend", "Employer", "Other"] },
    ],
  },
  {
    title: "About the Individual",
    fields: [
      { id: "individual_age", label: "Approximate Age of Individual", type: "select", required: true, options: ["Under 18", "18-25", "26-35", "36-45", "46-55", "56-65", "Over 65"] },
      { id: "primary_substance", label: "Primary Substance(s) of Concern", type: "text", required: true, placeholder: "e.g., Alcohol, Opioids, Methamphetamine" },
      { id: "duration_of_use", label: "How Long Has Substance Use Been a Concern?", type: "select", required: true, options: ["Less than 6 months", "6-12 months", "1-2 years", "3-5 years", "5-10 years", "Over 10 years"] },
      { id: "previous_treatment", label: "Has the Individual Been in Treatment Before?", type: "select", required: true, options: ["No", "Yes - once", "Yes - multiple times", "Unsure"] },
    ],
  },
  {
    title: "Current Situation",
    fields: [
      { id: "urgency", label: "How Urgent Is Your Situation?", type: "select", required: true, options: ["I need guidance but it's not urgent", "The situation is escalating", "This is a crisis - I need help now"] },
      { id: "family_dynamic", label: "Briefly Describe Your Family Dynamic", type: "textarea", required: true, placeholder: "What is the current household situation? How are family members affected?" },
      { id: "goals", label: "What Do You Hope to Gain From This Consultation?", type: "textarea", required: true, placeholder: "What questions do you have? What outcomes are you looking for?" },
    ],
  },
];

const BookConsultation = () => {
  const { isMember: isMemberViaAuth } = useMembershipStatus();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0); // 0=providers, 1=select slot(s), 2-4=intake, 5=confirm
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [dateOverrides, setDateOverrides] = useState<ProviderDateOverride[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [stabilizationSlots, setStabilizationSlots] = useState<Array<{ date: string; slot: any }>>([]);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [clientTimezone, setClientTimezone] = useState(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return TIMEZONE_OPTIONS.some((t) => t.value === tz) ? tz : "America/Los_Angeles";
    } catch { return "America/Los_Angeles"; }
  });

  // Membership detection state
  const [isMemberViaEmail, setIsMemberViaEmail] = useState(false);
  const [memberCheckDone, setMemberCheckDone] = useState(false);
  const [memberCheckLoading, setMemberCheckLoading] = useState(false);

  // Combined membership status
  const isMember = isMemberViaAuth || isMemberViaEmail;

  // Abandoned booking tracking — capture email and progress so we can follow up
  const [abandonedBookingId, setAbandonedBookingId] = useState<string | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const planType = urlParams.get("plan");
  const isReadinessIntensive = planType === "family-readiness-intensive";
  const isStabilization = planType === "stabilization";
  const isParallelRecovery = planType === "parallel-recovery";
  const isMultiSession = isStabilization || isParallelRecovery;
  const requiredSlots = isParallelRecovery ? 12 : isStabilization ? 4 : 1;

  const totalSteps = 6;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  // Handle PayPal return - capture payment after redirect back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paypalToken = params.get("token");
    const paypalOrderId = params.get("paypal_order_id") || paypalToken;
    if (paypalOrderId && !paymentProcessing) {
      capturePayment(paypalOrderId);
    }
  }, []);

  const capturePayment = async (orderId: string) => {
    setPaymentProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("consultation-payment", {
        body: { action: "capture-order", orderId },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.paymentCaptured) {
          toast({
            title: "Payment Received",
            description: data.error,
          });
        } else {
          throw new Error(data.error);
        }
      } else {
        toast({
          title: "Booking Confirmed!",
          description: "Payment received and your session is booked. Check your email for the Zoom link.",
        });
      }

      // Mark abandoned booking as completed (so we don't follow up)
      if (abandonedBookingId) {
        await supabase
          .from("abandoned_bookings")
          .update({ completed: true })
          .eq("id", abandonedBookingId);
      } else if (intakeData.client_email) {
        // No id (e.g. payment captured after redirect on fresh page load) — mark by email
        await supabase
          .from("abandoned_bookings")
          .update({ completed: true })
          .eq("client_email", intakeData.client_email.toLowerCase())
          .eq("completed", false);
      }

      // Clean up URL and navigate to onboarding
      const storedPlan = localStorage.getItem("consultation_plan_type") || "single";
      localStorage.removeItem("consultation_plan_type");
      navigate(`/coaching-onboarding?plan=${storedPlan}`, { replace: true });
    } catch (err) {
      console.error("Payment capture error:", err);
      toast({
        title: "Payment Error",
        description: "There was an issue processing your payment. Please contact us at matt@soberhelpline.com",
        variant: "destructive",
      });
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
      setPaymentProcessing(false);
    }
  };

  useEffect(() => {
    loadInit();
  }, []);

  const loadInit = async () => {
    // Check if user is logged in (optional, not required)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      // Pre-fill email from profile if available
      const { data: profile } = await supabase
        .from("profile_private")
        .select("email, phone_number")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile) {
        setIntakeData((prev) => ({
          ...prev,
          client_email: profile.email || "",
          client_phone: profile.phone_number || "",
        }));
      }
      // Pre-fill name from profiles
      const { data: pubProfile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle();
      if (pubProfile) {
        setIntakeData((prev) => ({
          ...prev,
          client_name: `${pubProfile.first_name} ${pubProfile.last_name}`.trim(),
        }));
      }
    }
    loadProviders();
  };

  const loadProviders = async () => {
    const { data } = await supabase
      .from("consultation_providers")
      .select("*")
      .eq("status", "active");

    const sortedProviders = [...(data || [])].sort((a, b) => {
      if (a.full_name === "Matt Brown") return -1;
      if (b.full_name === "Matt Brown") return 1;
      if (a.full_name === "Katie Barr") return -1;
      if (b.full_name === "Katie Barr") return 1;
      return a.full_name.localeCompare(b.full_name);
    });

    setProviders(sortedProviders);
    setLoading(false);
  };

  // Email-based membership check (debounced)
  const checkMembershipByEmail = useCallback(async (email: string) => {
    if (!email || !email.includes("@")) {
      setIsMemberViaEmail(false);
      setMemberCheckDone(false);
      return;
    }
    setMemberCheckLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-membership-email", {
        body: { email: email.trim() },
      });
      if (!error && data) {
        setIsMemberViaEmail(data.isMember === true);
      } else {
        setIsMemberViaEmail(false);
      }
    } catch {
      setIsMemberViaEmail(false);
    } finally {
      setMemberCheckDone(true);
      setMemberCheckLoading(false);
    }
  }, []);

  // Debounce email check
  useEffect(() => {
    const email = intakeData.client_email;
    if (!email || !email.includes("@")) {
      setMemberCheckDone(false);
      setIsMemberViaEmail(false);
      return;
    }
    const timer = setTimeout(() => checkMembershipByEmail(email), 600);
    return () => clearTimeout(timer);
  }, [intakeData.client_email, checkMembershipByEmail]);

  // Capture/update abandoned booking record (debounced) — for follow-up emails
  useEffect(() => {
    const email = intakeData.client_email?.trim();
    if (!email || !email.includes("@") || email.length < 5) return;

    const timer = setTimeout(async () => {
      const payload = {
        client_email: email.toLowerCase(),
        client_name: intakeData.client_name || null,
        client_phone: intakeData.client_phone || null,
        plan_type: planType || "single",
        provider_id: selectedProvider?.id || null,
        provider_name: selectedProvider?.full_name || null,
        selected_date: selectedDate || null,
        selected_time: selectedSlot?.start_time || null,
        last_step: step,
        user_id: user?.id || null,
      };

      try {
        if (abandonedBookingId) {
          await supabase
            .from("abandoned_bookings")
            .update(payload)
            .eq("id", abandonedBookingId);
        } else {
          const { data } = await supabase
            .from("abandoned_bookings")
            .insert(payload)
            .select("id")
            .single();
          if (data?.id) setAbandonedBookingId(data.id);
        }
      } catch (e) {
        // Silent — never block the booking flow
        console.warn("Abandoned booking tracking failed:", e);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    intakeData.client_email,
    intakeData.client_name,
    intakeData.client_phone,
    planType,
    selectedProvider?.id,
    selectedDate,
    selectedSlot?.start_time,
    step,
    abandonedBookingId,
    user?.id,
  ]);

  const selectProvider = async (provider: any) => {
    const providerTz = provider.timezone || "America/Los_Angeles";
    const providerTodayStr = formatDateInTimezone(new Date(), providerTz);
    const windowEnd = addDaysToDateStr(providerTodayStr, isParallelRecovery ? 90 : 30);

    setSelectedProvider(provider);
    trackConversionEvent("booking_provider_selected", {
      source: "book_consultation",
      planType,
      providerName: provider.full_name,
    });
    const [availRes, bookingsRes, overridesRes] = await Promise.all([
      supabase
        .from("provider_availability")
        .select("*")
        .eq("provider_id", provider.id)
        .eq("is_active", true)
        .order("day_of_week")
        .order("start_time"),
      supabase.rpc("get_booking_slots"),
      supabase
        .from("provider_date_overrides")
        .select("id, override_date, is_available, start_time, end_time, timezone")
        .eq("provider_id", provider.id)
        .gte("override_date", providerTodayStr)
        .lte("override_date", windowEnd)
        .order("override_date")
        .order("start_time"),
    ]);

    setAvailability(availRes.data || []);
    setBookedSlots(bookingsRes.data || []);
    setDateOverrides((overridesRes.data || []) as ProviderDateOverride[]);
    setSelectedDate("");
    setSelectedSlot(null);
    setStep(1);
  };

  const handleIntakeChange = (fieldId: string, value: string) => {
    setIntakeData({ ...intakeData, [fieldId]: value });
  };

  const validateSection = (sectionIndex: number) => {
    const section = intakeSections[sectionIndex];
    const visibleFields = section.fields.filter((f) => !((f as any).singleSessionOnly && isMultiSession));
    for (const field of visibleFields) {
      if (field.required && !intakeData[field.id]?.trim()) {
        toast({ title: "Required field", description: `Please fill in "${field.label}"`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (step >= 2 && step <= 4) {
      if (!validateSection(step - 2)) return;
    }
    trackConversionEvent("booking_step_continue", {
      source: "book_consultation",
      planType,
      value: step + 1,
    });
    setStep(step + 1);
  };

  const getSlotsForDate = (dateStr: string) => {
    const providerTz = selectedProvider?.timezone || "America/Los_Angeles";
    const dayOfWeek = getDayOfWeekFromDateStr(dateStr);
    const dayAvailability = availability.filter((a) => a.day_of_week === dayOfWeek);
    const duration = selectedProvider?.session_duration_minutes || 60;
    const providerTodayStr = formatDateInTimezone(new Date(), providerTz);
    const providerNow = new Date(new Date().toLocaleString("en-US", { timeZone: providerTz }));
    const providerNowMinutes = providerNow.getHours() * 60 + providerNow.getMinutes();
    const overridesForDate = dateOverrides.filter((override) => override.override_date === dateStr);
    const isDayBlocked = overridesForDate.some((override) => !override.is_available && !override.start_time && !override.end_time);
    const removedOverrides = overridesForDate.filter((override) => !override.is_available && override.start_time && override.end_time);
    const addedOverrides = overridesForDate.filter((override) => override.is_available && override.start_time && override.end_time);
    const slots: { id: string; start_time: string; end_time: string; provider_start_time: string; provider_end_time: string; display_start: string; display_end: string; timezone: string }[] = [];

    if (isDayBlocked) return [];

    const pushSlotsFromRange = (rangeId: string, startTime: string, endTime: string, timezone?: string | null) => {
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);

      for (let minutes = startMinutes; minutes + duration <= endMinutes; minutes += duration) {
        const slotStartH = String(Math.floor(minutes / 60)).padStart(2, "0");
        const slotStartM = String(minutes % 60).padStart(2, "0");
        const slotEndTotal = minutes + duration;
        const slotEndH = String(Math.floor(slotEndTotal / 60)).padStart(2, "0");
        const slotEndM = String(slotEndTotal % 60).padStart(2, "0");
        const providerStartTime = `${slotStartH}:${slotStartM}:00`;
        const providerEndTime = `${slotEndH}:${slotEndM}:00`;
        const slotStartMin = minutes;
        const slotEndMin = minutes + duration;

        const isRemoved = removedOverrides.some((override) => {
          const removedStart = timeToMinutes(override.start_time || "00:00");
          const removedEnd = timeToMinutes(override.end_time || "00:00");
          return rangesOverlap(slotStartMin, slotEndMin, removedStart, removedEnd);
        });

        if (isRemoved) continue;

        const isBooked = bookedSlots.some((booking) => {
          if (booking.booking_date !== dateStr) return false;
          const bookedTz = (booking as any).timezone || providerTz;
          let bookedStartStr = booking.start_time?.slice(0, 5) || "00:00";
          let bookedEndStr = booking.end_time?.slice(0, 5) || "01:00";

          if (bookedTz !== providerTz) {
            bookedStartStr = convertTime(bookedStartStr, dateStr, bookedTz, providerTz).time;
            bookedEndStr = convertTime(bookedEndStr, dateStr, bookedTz, providerTz).time;
          }

          const bookedStartMin = timeToMinutes(bookedStartStr);
          const bookedEndMin = timeToMinutes(bookedEndStr);
          return rangesOverlap(slotStartMin, slotEndMin, bookedStartMin, bookedEndMin);
        });

        if (isBooked) continue;
        if (dateStr === providerTodayStr && slotStartMin <= providerNowMinutes) continue;

        const convertedStart = convertTime(`${slotStartH}:${slotStartM}`, dateStr, providerTz, clientTimezone);
        const convertedEnd = convertTime(`${slotEndH}:${slotEndM}`, dateStr, providerTz, clientTimezone);
        const slotId = `${dateStr}-${providerStartTime}-${providerEndTime}`;

        if (slots.some((slot) => slot.id === slotId)) continue;

        slots.push({
          id: slotId,
          start_time: providerStartTime,
          end_time: providerEndTime,
          provider_start_time: providerStartTime,
          provider_end_time: providerEndTime,
          display_start: formatTime12h(convertedStart.time),
          display_end: formatTime12h(convertedEnd.time),
          timezone: timezone || providerTz,
        });
      }
    };

    dayAvailability.forEach((range) => {
      pushSlotsFromRange(range.id, range.start_time, range.end_time, range.timezone);
    });

    addedOverrides.forEach((override) => {
      pushSlotsFromRange(`override-${override.id}`, override.start_time || "00:00", override.end_time || "00:00", override.timezone || providerTz);
    });

    return slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const getAvailableDates = () => {
    if (!selectedProvider) return [];

    const providerTz = selectedProvider.timezone || "America/Los_Angeles";
    const providerTodayStr = formatDateInTimezone(new Date(), providerTz);
    const daysAhead = isParallelRecovery ? 90 : 30;
    const dates: string[] = [];

    for (let i = 0; i <= daysAhead; i++) {
      const dateStr = addDaysToDateStr(providerTodayStr, i);
      if (getSlotsForDate(dateStr).length > 0) {
        dates.push(dateStr);
      }
    }

    return dates;
  };

  const addStabilizationSlot = () => {
    if (!selectedDate || !selectedSlot) return;
    const isDuplicate = stabilizationSlots.some(
      (s) => s.date === selectedDate && s.slot.id === selectedSlot.id
    );
    if (isDuplicate) {
      toast({ title: "Duplicate slot", description: "You've already selected this time slot.", variant: "destructive" });
      return;
    }
    setStabilizationSlots([...stabilizationSlots, { date: selectedDate, slot: selectedSlot }]);
    setSelectedDate("");
    setSelectedSlot(null);
  };

  const removeStabilizationSlot = (index: number) => {
    setStabilizationSlots(stabilizationSlots.filter((_, i) => i !== index));
  };

  const handleBooking = async () => {
    if (!selectedProvider) return;

    const slotsToBook = isMultiSession
      ? stabilizationSlots.map((s) => ({ date: s.date, slot: s.slot }))
      : selectedSlot ? [{ date: selectedDate, slot: selectedSlot }] : [];

    if (slotsToBook.length === 0) return;
    setIsSubmitting(true);

    try {
      // Build intake responses object with readable labels
      const intakeResponses: Record<string, string> = {};
      intakeSections.forEach((section) => {
        section.fields.forEach((field) => {
          if (intakeData[field.id]) {
            intakeResponses[field.label] = intakeData[field.id];
          }
        });
      });

      const bookings = slotsToBook.map((s) => ({
        booking_date: s.date,
        start_time: s.slot.start_time,
        end_time: s.slot.end_time,
        timezone: s.slot.timezone || "America/Los_Angeles",
      }));

      // Store plan type for after PayPal redirect
      localStorage.setItem("consultation_plan_type", planType || "single");
      trackConversionEvent("booking_payment_start", {
        source: "book_consultation",
        planType,
        providerName: selectedProvider.full_name,
        value: displayRate,
      });

      const returnUrl = `${window.location.origin}/book-consultation?paypal_success=true`;
      const cancelUrl = `${window.location.origin}/book-consultation${planType ? `?plan=${planType}` : ""}`;

      // Create PayPal order
      const { data, error } = await supabase.functions.invoke("consultation-payment", {
        body: {
          action: "create-order",
          provider_id: selectedProvider.id,
          bookings,
          intake_responses: intakeResponses,
          client_name: intakeData.client_name,
          client_email: intakeData.client_email,
          client_phone: intakeData.client_phone || null,
          plan_type: planType || "single",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.approvalUrl) {
        // Redirect to PayPal for payment
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({ title: "Booking failed", description: "Please try again.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  // Price display helpers
  const displayRate = isReadinessIntensive ? (isMember ? 2250 : 2500) : isMember && !isMultiSession ? 125 : selectedProvider?.session_rate || 150;

  if (loading || paymentProcessing) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {paymentProcessing ? (
        <>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-lg font-medium">Processing your payment...</p>
          <p className="text-sm text-muted-foreground">Please don't close this page.</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Book a Consultation | Sober Helpline"
        description="Book a one-on-one video consultation with an addiction and family recovery specialist."
        personJsonLd={mattBrownPersonSchema}
      />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
          </Link>
          <img src={logo} alt="Sober Helpline" className="w-24 md:w-32 h-auto" />
        </div>

        {step > 0 && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Step {step} of {totalSteps - 1}</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Member Badge - persistent across steps */}
        {memberCheckDone && !isMultiSession && (
          <div className="max-w-2xl mx-auto mb-4">
            {isMember ? (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg px-4 py-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  ✅ Member discount applied — {isReadinessIntensive ? "$2,250 for the intensive" : "$125/session"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-4 py-2.5">
                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Members save $25 per session —{" "}
                  <Link to="/family-membership" className="text-primary hover:underline font-medium">
                    Join for $14.99/mo
                  </Link>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* Step 0: Browse Providers */}
          {step === 0 && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-center">
                {isReadinessIntensive ? "Book the Family Readiness Intensive" : isMultiSession ? (isParallelRecovery ? "Book Parallel Recovery Program™" : "Book Family Stabilization Plan") : "Book a Consultation"}
              </h1>
              <p className="text-muted-foreground text-center mb-3">
                {isReadinessIntensive
                  ? `Choose a provider for your 90-minute Family Readiness Intensive${isMember ? " ($2,250 member rate)" : " ($2,500, or $2,250 for members)"}`
                  : isParallelRecovery
                  ? `Choose the provider who feels like the best fit for your 12-session program ($1,500)`
                  : isStabilization
                  ? "Choose a provider for your 4-session stabilization plan ($500)"
                  : `Choose a provider for a 60-minute video consultation${isMember ? " ($125 member rate)" : " ($150, or $125 for members)"}`}
              </p>
              {!isMultiSession && !isMember && !isReadinessIntensive && (
                <div className="flex justify-center mb-6">
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link to="/family-membership">
                      <Crown className="w-4 h-4" />
                      Join membership to save $25 per session
                    </Link>
                  </Button>
                </div>
              )}
              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardContent className="p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">You are not booking into a sales funnel.</p>
                  <p className="mt-1">
                    This is a private family strategy session with an addiction professional. The goal is a clear next step, whether that means coaching, Monday support, treatment planning, or intervention readiness.
                  </p>
                </CardContent>
              </Card>
              {providers.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No providers are currently available. Please check back soon.</CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {providers.map((p) => (
                    <Card key={p.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => selectProvider(p)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img src={p.photo_url || "/placeholder.svg"} alt={p.full_name} className="w-16 h-16 rounded-full object-cover object-top flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{p.full_name}</h3>
                            {p.title && <p className="text-sm text-muted-foreground">{p.title}</p>}
                            <p className="text-sm mt-2 line-clamp-2">{p.bio}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(p.specialties || []).map((s: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                            <p className="text-sm font-medium mt-2 text-primary">
                              {isReadinessIntensive ? (
                                <span>
                                  ${isMember ? "2,250" : "2,500"} / 90 min
                                  {isMember && (
                                    <>
                                      <span className="line-through text-muted-foreground ml-2">$2,500</span>
                                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">Member</span>
                                    </>
                                  )}
                                </span>
                              ) : isMember && !isMultiSession ? (
                                <span className="flex items-center gap-1.5">
                                  <Crown className="w-3.5 h-3.5" />
                                  <span className="line-through text-muted-foreground">${p.session_rate}</span>{" "}
                                  $125 / {p.session_duration_minutes} min
                                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">Member</span>
                                </span>
                              ) : (
                                <span>
                                  ${p.session_rate} / {p.session_duration_minutes} min
                                  {!isMultiSession && (
                                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                                      (or $125 for members)
                                    </span>
                                  )}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Step 1: Select Date & Time */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>{isMultiSession ? `Select ${requiredSlots} Session Times` : "Choose a Date and Time"}</CardTitle>
                <CardDescription>
                  {isMultiSession
                    ? `Choose dates and times for all ${requiredSlots} sessions with ${selectedProvider?.full_name}. ${stabilizationSlots.length} of ${requiredSlots} selected.`
                    : isReadinessIntensive
                    ? `Pick an available 90-minute time with ${selectedProvider?.full_name} for the Family Readiness Intensive.`
                    : `Pick an available time with ${selectedProvider?.full_name}. We'll keep it simple.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isMultiSession && stabilizationSlots.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Sessions</Label>
                    {stabilizationSlots.map((s, i) => {
                      const dateObj = new Date(s.date + "T00:00:00");
                      return (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Session {i + 1}</Badge>
                            <span className="text-sm font-medium">
                              {DAYS[dateObj.getDay()]}, {dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {s.slot.display_start} - {s.slot.display_end}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeStabilizationSlot(i)} className="text-destructive hover:text-destructive">
                            ✕
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(!isMultiSession || stabilizationSlots.length < requiredSlots) && (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Globe className="h-4 w-4" />Your Timezone</Label>
                      <Select value={clientTimezone} onValueChange={(v) => { setClientTimezone(v); setSelectedSlot(null); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TIMEZONE_OPTIONS.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{isMultiSession ? `Select Date for Session ${stabilizationSlots.length + 1}` : "Available Dates"}</Label>
                      <Select value={selectedDate} onValueChange={(v) => { setSelectedDate(v); setSelectedSlot(null); }}>
                        <SelectTrigger><SelectValue placeholder="Select a date..." /></SelectTrigger>
                        <SelectContent>
                          {getAvailableDates().map((d) => {
                            const date = new Date(d + "T00:00:00");
                            return <SelectItem key={d} value={d}>{DAYS[date.getDay()]}, {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedDate && (
                      <div className="space-y-2">
                        <Label>Available Times <span className="text-muted-foreground font-normal">({getTimezoneLabel(clientTimezone)})</span></Label>
                        <RadioGroup value={selectedSlot?.id || ""} onValueChange={(v) => setSelectedSlot(getSlotsForDate(selectedDate).find((s) => s.id === v))}>
                          {getSlotsForDate(selectedDate).filter((slot) => {
                            if (!isMultiSession) return true;
                            return !stabilizationSlots.some((s) => s.date === selectedDate && s.slot.id === slot.id);
                          }).map((slot) => (
                            <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={slot.id} id={slot.id} />
                              <Label htmlFor={slot.id} className="flex items-center gap-2 cursor-pointer">
                                <Clock className="h-4 w-4" />
                                {slot.display_start} - {slot.display_end}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {isMultiSession && selectedSlot && (
                      <Button onClick={addStabilizationSlot} className="w-full">
                        Add Session {stabilizationSlots.length + 1} of {requiredSlots}
                      </Button>
                    )}
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => { setStep(0); setStabilizationSlots([]); }}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button
                    onClick={goNext}
                    disabled={isMultiSession ? stabilizationSlots.length < requiredSlots : !selectedSlot}
                  >
                    Next<ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Steps 2-4: Intake Questionnaire */}
          {step >= 2 && step <= 4 && (
            <Card>
              <CardHeader>
                <CardTitle>{intakeSections[step - 2].title}</CardTitle>
                <CardDescription>Section {step - 1} of 3</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {intakeSections[step - 2].fields.filter((f: any) => !(f.singleSessionOnly && isMultiSession)).map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label} {field.required && "*"}</Label>
                    {field.type === "select" ? (
                      <Select value={intakeData[field.id] || ""} onValueChange={(v) => handleIntakeChange(field.id, v)}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt: string) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        value={intakeData[field.id] || ""}
                        onChange={(e) => handleIntakeChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        value={intakeData[field.id] || ""}
                        onChange={(e) => handleIntakeChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                    {/* Show membership badge right after email field */}
                    {field.id === "client_email" && memberCheckDone && !isMultiSession && (
                      <div className="mt-1">
                        {isMember ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <Crown className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">✅ Member discount applied — {isReadinessIntensive ? "$2,250 for the intensive" : "$125/session"}</span>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Members save $25/session —{" "}
                            <Link to="/family-membership" className="text-primary hover:underline">Join for $14.99/mo</Link>
                          </p>
                        )}
                      </div>
                    )}
                    {field.id === "client_email" && memberCheckLoading && (
                      <p className="text-xs text-muted-foreground">Checking membership...</p>
                    )}
                  </div>
                ))}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Previous
                  </Button>
                  <Button onClick={goNext}>
                    Next<ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {isReadinessIntensive ? "Confirm Your Family Readiness Intensive" : isMultiSession ? `Confirm Your ${isParallelRecovery ? "Parallel Recovery Program" : "Stabilization Plan"}` : "Confirm Your Consultation"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="font-medium">{selectedProvider?.full_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span className="font-medium">{intakeData.client_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{intakeData.client_email}</span></div>
                  {isMultiSession ? (
                    <>
                      <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium">{isParallelRecovery ? "Parallel Recovery Program™ (12 sessions)" : "Family Stabilization Plan (4 sessions)"}</span></div>
                      <div className="border-t pt-2 mt-2 space-y-2">
                        {stabilizationSlots.map((s, i) => {
                          const dateObj = new Date(s.date + "T00:00:00");
                          return (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Session {i + 1}</span>
                              <span className="font-medium">
                                {DAYS[dateObj.getDay()]}, {dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {s.slot.display_start} - {s.slot.display_end}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Total</span><span className="font-bold text-primary">${isParallelRecovery ? "1,500" : "500"}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedSlot?.display_start} - {selectedSlot?.display_end} ({getTimezoneLabel(clientTimezone)})</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{isReadinessIntensive ? "90" : selectedProvider?.session_duration_minutes} minutes</span></div>
                      {isReadinessIntensive && (
                        <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">Family Readiness Intensive</span></div>
                      )}
                      {isReadinessIntensive ? (
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-semibold flex items-center gap-1.5">{isMember ? <><Crown className="w-4 h-4 text-primary" />Member Rate</> : "Total"}</span>
                          <span className="font-bold text-primary">
                            {isMember && <span className="line-through text-muted-foreground text-sm mr-1">$2500</span>}
                            ${isMember ? "2250" : "2500"}
                          </span>
                        </div>
                      ) : isMember ? (
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-semibold flex items-center gap-1.5"><Crown className="w-4 h-4 text-primary" />Member Rate</span>
                          <span className="font-bold text-primary">
                            <span className="line-through text-muted-foreground text-sm mr-1">${selectedProvider?.session_rate}</span>
                            $125
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Total</span><span className="font-bold text-primary">${selectedProvider?.session_rate}</span></div>
                      )}
                    </>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {isMultiSession
                    ? `Zoom meetings will be created for each session. You'll receive confirmation emails with join links for all ${requiredSlots} sessions.`
                    : "Your video session will be created automatically, and you'll get the Zoom link and details by email right away."}
                </p>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(4)}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button onClick={handleBooking} disabled={isSubmitting} size="lg">
                    {isSubmitting ? "Booking..." : isReadinessIntensive ? `Book & Pay $${isMember ? "2,250" : "2,500"}` : isMultiSession ? `Book & Pay $${isParallelRecovery ? "1,500" : "500"}` : `Book & Pay $${isMember ? "125" : selectedProvider?.session_rate}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
