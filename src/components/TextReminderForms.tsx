import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { trackConversionEvent } from "@/lib/conversionTracking";

// Must match SMS_CONSENT_TEXT in supabase/functions/_shared/twilioSms.ts: the
// server stores the wording the person agreed to.
const SMS_CONSENT_TEXT =
  "I agree to receive text message reminders from Sober Helpline about Family Squares at this number. " +
  "About one message per meeting. Message and data rates may apply. Reply STOP to cancel, HELP for help.";

/** The reason a refused request gives, whether it came back as data or as an error. */
async function refusalReason(data: { error?: string } | null, invokeError: unknown): Promise<string | undefined> {
  if (data?.error) return data.error;
  try {
    return (await (invokeError as { context?: Response } | null)?.context?.json())?.error;
  } catch {
    return undefined;
  }
}

/**
 * Whether the owner has text reminders switched on
 * (site_settings family_squares_sms_enabled = "true"). False until known.
 */
export function useTextRemindersAvailable(): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "family_squares_sms_enabled")
          .maybeSingle();
        if (!cancelled) setAvailable(String(data?.value ?? "").trim() === "true");
      } catch {
        // Stays unavailable if the setting cannot be read.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return available;
}

interface OptInProps {
  /** Known from the registration form; left out, the form asks for it. */
  email?: string;
  phone?: string;
  /** Where the form is shown, for tracking. */
  source: string;
}

/** Sign up for a text an hour before each meeting. The consent box starts unticked. */
export const TextReminderOptInForm = ({ email, phone, source }: OptInProps) => {
  const askEmail = !email;
  const [address, setAddress] = useState(email ?? "");
  const [number, setNumber] = useState(phone ?? "");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const id = `text-reminder-${source}`;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "working") return;
    if (!consent) {
      setError("Please tick the box to agree to text reminders.");
      return;
    }
    setError(null);
    setState("working");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("family-squares-sms-optin", {
        body: { phone: number, email: address.trim(), consent: true },
      });
      if (invokeError || data?.ok !== true) {
        throw new Error((await refusalReason(data, invokeError)) || "Something went wrong. Please try again.");
      }
      trackConversionEvent("monday_zoom_text_reminder_optin", { source });
      setState("done");
    } catch (submitError) {
      setState("idle");
      const message = submitError instanceof Error ? submitError.message : "";
      setError(message && message !== "not_available" ? message : "Text reminders are not available right now.");
    }
  };

  if (state === "done") {
    return (
      <p className="mt-2 text-sm text-muted-foreground" role="status">
        Done. We just sent a text to confirm. You will get one reminder about an hour before each meeting. To stop,
        reply STOP to any of our texts or use the{" "}
        <Link to="/text-reminders" className="underline">text reminders page</Link>.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3" noValidate>
      {askEmail && (
        <div className="space-y-2">
          <Label htmlFor={`${id}-email`}>Email you registered with</Label>
          <Input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength={254}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor={`${id}-phone`}>Mobile number</Label>
        <Input
          id={`${id}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(555) 123-4567"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          maxLength={20}
        />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id={`${id}-consent`}
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          className="mt-1"
        />
        <Label htmlFor={`${id}-consent`} className="text-xs font-normal leading-relaxed text-muted-foreground">
          {SMS_CONSENT_TEXT} See our{" "}
          <Link to="/sms-terms" className="underline">SMS terms</Link> and{" "}
          <Link to="/privacy" className="underline">privacy policy</Link>. Agreeing is not required to attend.
        </Label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" variant="outline" disabled={state === "working"} className="w-full sm:w-auto">
        {state === "working" ? "Sending..." : "Text me reminders"}
      </Button>
    </form>
  );
};

/** Stop text reminders for a number. Works whether or not texting is switched on. */
export const TextReminderOptOutForm = () => {
  const [number, setNumber] = useState("");
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "working") return;
    setError(null);
    setState("working");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("family-squares-sms-optin", {
        body: { action: "opt_out", phone: number },
      });
      if (invokeError || data?.ok !== true) {
        throw new Error((await refusalReason(data, invokeError)) || "Something went wrong. Please try again.");
      }
      setState("done");
    } catch (submitError) {
      setState("idle");
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    }
  };

  if (state === "done") {
    return (
      <p className="mt-2 text-sm text-muted-foreground" role="status">
        Done. If that number was signed up, it will not get any more reminder texts from us.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3" noValidate>
      <div className="space-y-2">
        <Label htmlFor="text-reminder-stop-phone">Mobile number</Label>
        <Input
          id="text-reminder-stop-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(555) 123-4567"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          maxLength={20}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" variant="outline" disabled={state === "working"} className="w-full sm:w-auto">
        {state === "working" ? "Stopping..." : "Stop text reminders"}
      </Button>
    </form>
  );
};
