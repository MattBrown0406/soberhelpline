import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Check, CheckCircle2, Info, Loader2, Lock, Mail, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { formatPhoneNumber } from "@/lib/formatPhone";

// One page for a visitor with no account: their details, the plan, and
// PayPal's payment box (PayPal account, or a debit or credit card typed into
// PayPal's own fields). The account is created when they press a payment
// button; they confirm their email after paying. Server side:
// supabase/functions/membership-quick-start.

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phoneNumber: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or fewer")
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers and underscores only"),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});
type FormValues = z.infer<typeof schema>;

type Plan = "trial" | "annual";
type Done = { kind: "paid" | "bypass" | "already_started"; email: string; plan: Plan };

// Display only: the server (paypal-subscriptions) decides what is charged.
const MONTHLY_PRICE = "$9.99";
const ANNUAL_PRICE = "$100";
const ANNUAL_SAVINGS = "$19.88";

const OLD_SIGNUP_HREF = "/auth?redirect=/family-membership&mode=signup";
const LOGIN_HREF = "/auth?redirect=/family-membership";

// A second PayPal SDK configuration (the coaching checkout loads one for
// one-time payments) cannot share window.paypal, so this one gets its own name.
const PAYPAL_NAMESPACE = "paypal_membership";
// PayPal Credit and Pay Later are left out so the choice stays simple: a PayPal
// account, or a debit or credit card.
const sdkSrc = (clientId: string) =>
  `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription&components=buttons&disable-funding=credit,paylater`;

function loadPayPalSdk(clientId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const ready = () => (window as any)[PAYPAL_NAMESPACE];
    if (ready()) return resolve(ready());
    const existing = document.querySelector<HTMLScriptElement>("script[data-membership-paypal-sdk]");
    const finish = () => (ready() ? resolve(ready()) : reject(new Error("paypal_sdk_missing")));
    if (existing) {
      existing.addEventListener("load", finish);
      existing.addEventListener("error", () => reject(new Error("paypal_sdk_load_failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = sdkSrc(clientId);
    script.async = true;
    script.dataset.membershipPaypalSdk = "1";
    script.dataset.namespace = PAYPAL_NAMESPACE;
    script.onload = finish;
    script.onerror = () => reject(new Error("paypal_sdk_load_failed"));
    document.head.appendChild(script);
  });
}

const firstChargeDate = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function MembershipOneStepCheckout() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", phoneNumber: "", username: "", password: "" },
  });

  const [plan, setPlan] = useState<Plan>("trial");
  const [showCode, setShowCode] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [sdkState, setSdkState] = useState<"loading" | "ready" | "unavailable">("loading");
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<{ code: string; message?: string } | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  // PayPal's buttons are created once; they read the latest values from here.
  const latest = useRef({ plan, discountCode, honeypot });
  latest.current = { plan, discountCode, honeypot };
  const handled = useRef(false);
  const buttonsHost = useRef<HTMLDivElement | null>(null);
  const buttonsMounted = useRef(false);

  // Reached from a button further down the sales page (same path, new query),
  // so the page does not scroll up on its own. Also when the last screen shows.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [done]);

  useEffect(() => {
    let cancelled = false;

    // The payment box sits below the form, so bring the field that needs
    // attention back into view.
    const showField = (name?: string) => {
      if (!name) return;
      document.querySelector(`input[name="${name}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    };

    const showProblem = (code: string, message?: string, field?: string) => {
      handled.current = true;
      if (code === "username_taken") {
        form.setError("username", { message: "That username is taken. Please choose another." });
        showField("username");
      } else if (code === "weak_password") {
        form.setError("password", { message: "Please choose a stronger password." });
        showField("password");
      } else if (code === "invalid" && field) {
        // The server names the field it could not use.
        const name = (field === "phone" ? "phoneNumber" : field) as keyof FormValues;
        if (name in form.getValues()) {
          form.setError(name, { message: "Please check this." });
          showField(name);
        }
      } else if (code === "promo_unknown") {
        setShowCode(true);
        setCodeError("That code was not recognised. Correct it or clear it to continue.");
      } else if (code === "promo_problem") {
        setShowCode(true);
        setCodeError(message || "That code could not be used.");
      }
      setProblem({ code, message });
    };

    const startSignup = async (): Promise<string> => {
      const values = form.getValues();
      const { plan: chosenPlan, discountCode: code, honeypot: trap } = latest.current;
      setWorking(true);
      setProblem(null);
      setCodeError(null);
      handled.current = false;
      trackConversionEvent("membership_checkout_start", { source: "membership_one_step", plan: chosenPlan });
      try {
        const { data, error } = await supabase.functions.invoke("membership-quick-start", {
          body: {
            action: "start",
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phoneNumber,
            username: values.username,
            password: values.password,
            plan: chosenPlan,
            discountCode: code.trim() || undefined,
            website: trap,
          },
        });
        // A refusal arrives as a non-2xx response; read its reason when there is one.
        let result = data as Record<string, any> | null;
        if (error && !result) {
          try {
            result = await (error as any).context?.json?.();
          } catch {
            result = null;
          }
        }
        if (result?.ok && result.bypass) {
          handled.current = true;
          setDone({ kind: "bypass", email: values.email.trim(), plan: chosenPlan });
          throw new Error("no_payment_needed");
        }
        if (result?.ok && typeof result.subscriptionId === "string") return result.subscriptionId;
        if (result?.code === "confirm_pending") {
          handled.current = true;
          setDone({ kind: "already_started", email: values.email.trim(), plan: chosenPlan });
          throw new Error("confirm_pending");
        }
        showProblem(typeof result?.code === "string" ? result.code : "error", result?.message, result?.field);
        throw new Error(result?.code || "start_failed");
      } finally {
        setWorking(false);
      }
    };

    const confirmApproved = async (subscriptionId: string) => {
      const values = form.getValues();
      const chosenPlan = latest.current.plan;
      setWorking(true);
      // PayPal can take a few seconds to report the subscription as active. Its
      // own notice to the site activates the membership either way, so a slow
      // answer here never blocks the member.
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data } = await supabase.functions.invoke("membership-quick-start", {
            body: { action: "activate", subscriptionId },
          });
          if ((data as any)?.ok) break;
        } catch {
          // Try again below.
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      setWorking(false);
      try {
        const key = `membershipSuccessTracked:${subscriptionId}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          trackConversionEvent("membership_signup_success", { source: "membership_one_step", plan: chosenPlan });
        }
      } catch {
        trackConversionEvent("membership_signup_success", { source: "membership_one_step", plan: chosenPlan });
      }
      setDone({ kind: "paid", email: values.email.trim(), plan: chosenPlan });
    };

    void (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("membership-quick-start", { body: { action: "config" } });
        const clientId = (data as any)?.paypalClientId;
        if (error || !clientId) throw new Error("no_paypal_config");
        const paypal = await loadPayPalSdk(clientId);
        if (cancelled || !buttonsHost.current || buttonsMounted.current) return;
        const buttons = paypal.Buttons({
          style: { layout: "vertical", shape: "rect", label: "subscribe" },
          onClick: async (_data: unknown, actions: any) => {
            const valid = await form.trigger(undefined, { shouldFocus: true });
            if (!valid) {
              showField(Object.keys(form.formState.errors)[0]);
              setProblem({ code: "form" });
              return actions.reject();
            }
            return actions.resolve();
          },
          createSubscription: () => startSignup(),
          onApprove: (data: any) => confirmApproved(data.subscriptionID),
          onCancel: () => {
            trackConversionEvent("membership_checkout_abandoned", { source: "membership_one_step" });
          },
          onError: () => {
            // Problems this page already explained (taken username, promo code,
            // "no payment needed") are not PayPal errors.
            if (!handled.current) setProblem({ code: "paypal" });
          },
        });
        if (!buttons.isEligible()) throw new Error("paypal_not_eligible");
        buttonsMounted.current = true;
        await buttons.render(buttonsHost.current);
        if (!cancelled) setSdkState("ready");
      } catch (e) {
        console.error("Membership payment box failed to load:", e);
        if (!cancelled) setSdkState("unavailable");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [form]);

  const resendConfirmation = async () => {
    if (!done) return;
    setResendState("sending");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: done.email,
        options: { emailRedirectTo: `${window.location.origin}/family-membership` },
      });
      setResendState(error ? "failed" : "sent");
    } catch {
      setResendState("failed");
    }
  };

  if (done) {
    const heading =
      done.kind === "bypass"
        ? "Your free membership is active"
        : done.kind === "already_started"
          ? "You have already started your membership"
          : done.plan === "trial"
            ? "Your 7-day free trial has started"
            : "Your membership has started";
    return (
      <>
        <SEOHead title="Confirm Your Email | Sober Helpline" description="One last step to open your membership." noIndex={true} />
        <div className="min-h-[70vh] bg-background">
          <main className="container py-12">
            <Card className="mx-auto max-w-lg">
              <CardHeader className="text-center">
                <CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-logo-green" aria-hidden="true" />
                <CardTitle className="text-2xl">{heading}</CardTitle>
                <CardDescription className="text-base">One last step: confirm your email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border border-logo-blue/25 bg-logo-blue/5 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-logo-blue" aria-hidden="true" />
                    <div className="text-sm leading-relaxed">
                      <p className="font-medium text-foreground">
                        We sent a link to <span className="break-all">{done.email}</span>
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Open that email and select the link. It signs you in and opens your membership. If you do not
                        see it within a few minutes, check your spam or junk folder.
                      </p>
                    </div>
                  </div>
                </div>

                {done.kind === "paid" && done.plan === "trial" && (
                  <p className="text-sm text-muted-foreground">
                    Nothing is charged today. Your first payment of {MONTHLY_PRICE} is on {firstChargeDate()} unless
                    you cancel before then. You can cancel online from Membership and Billing.
                  </p>
                )}

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={resendConfirmation}
                    disabled={resendState === "sending" || resendState === "sent"}
                  >
                    {resendState === "sending" ? "Sending..." : resendState === "sent" ? "Sent. Check your inbox." : "Send the link again"}
                  </Button>
                  {resendState === "failed" && (
                    <p className="text-center text-sm text-muted-foreground">
                      We could not send it just now. Please wait a minute and try again.
                    </p>
                  )}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Wrong email address, or no link after a few tries? Write to{" "}
                  <a href="mailto:matt@soberhelpline.com" className="font-medium text-logo-blue hover:underline">
                    matt@soberhelpline.com
                  </a>{" "}
                  and we will fix it.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  const problemText = (() => {
    if (!problem) return null;
    switch (problem.code) {
      case "form":
        return "Please fill in the highlighted fields above, then choose how to pay.";
      case "username_taken":
        return "That username is taken. Choose another above, then choose how to pay.";
      case "weak_password":
        return "Please choose a stronger password above, then choose how to pay.";
      case "promo_unknown":
      case "promo_problem":
        return "There is a problem with the promo code. See the note under the code.";
      case "invalid":
        return "Some details above could not be used. Please check them and try again.";
      case "rate_limited":
        return "Too many tries from this connection. Please wait a few minutes and try again.";
      case "signup_failed":
        return "We could not create your account just now. Please wait a minute and try again.";
      case "paypal":
        return "PayPal could not finish. Nothing was charged. Please try again.";
      case "account_exists":
        return null; // Shown with a log-in link below.
      default:
        return "Something went wrong setting this up. Nothing was charged. Please try again.";
    }
  })();

  return (
    <>
      <SEOHead
        title="Start Your 7-Day Free Trial | Sober Helpline Family Membership"
        description="Start a Sober Helpline family membership: seven days free, then $9.99 a month. One short form, secure payment through PayPal."
        noIndex={true}
      />
      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="mx-auto max-w-2xl">
            <Link to="/family-membership" className="mb-6 inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="mr-1 h-4 w-4" />
              What membership includes
            </Link>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-logo-blue md:text-4xl">Start your 7-day free trial</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                One short form. No charge today. Cancel online any time.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to={LOGIN_HREF} className="font-medium text-logo-blue hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()} autoComplete="on" noValidate>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">1. Your details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input autoComplete="given-name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input autoComplete="family-name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" autoComplete="email" inputMode="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                autoComplete="tel"
                                inputMode="tel"
                                placeholder="(555) 123-4567"
                                {...field}
                                onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forum username</FormLabel>
                            <FormControl>
                              <Input autoComplete="off" autoCapitalize="none" spellCheck={false} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Choose a password</FormLabel>
                            <FormControl>
                              <Input type="password" autoComplete="new-password" placeholder="At least 8 characters" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      Other members see your username in the family forum, never your real name, email or phone.
                    </p>

                    {/* Not for people: left empty by real visitors. */}
                    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="membership-website">Website</label>
                      <input
                        id="membership-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">2. Your plan and payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Membership plan">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={plan === "trial"}
                        onClick={() => setPlan("trial")}
                        className={`rounded-lg border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          plan === "trial" ? "border-logo-blue bg-logo-blue/5" : "border-border hover:border-logo-blue/40"
                        }`}
                      >
                        <span className="block font-semibold text-foreground">7 days free, then monthly</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          $0 today, then {MONTHLY_PRICE} a month
                        </span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={plan === "annual"}
                        onClick={() => setPlan("annual")}
                        className={`rounded-lg border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          plan === "annual" ? "border-logo-blue bg-logo-blue/5" : "border-border hover:border-logo-blue/40"
                        }`}
                      >
                        <span className="block font-semibold text-foreground">Annual</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {ANNUAL_PRICE} today for a full year (saves {ANNUAL_SAVINGS})
                        </span>
                      </button>
                    </div>

                    <div className="rounded-lg bg-muted/60 p-4 text-sm">
                      {discountCode.trim() ? (
                        <p className="text-foreground">
                          Your promo code is applied when you choose how to pay. PayPal shows the exact amount and dates
                          before you approve anything.
                        </p>
                      ) : plan === "trial" ? (
                        <dl className="space-y-1.5">
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Due today</dt>
                            <dd className="font-semibold text-foreground">$0.00</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">First payment on {firstChargeDate()}</dt>
                            <dd className="font-semibold text-foreground">{MONTHLY_PRICE}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">After that</dt>
                            <dd className="font-semibold text-foreground">{MONTHLY_PRICE} a month</dd>
                          </div>
                        </dl>
                      ) : (
                        <dl className="space-y-1.5">
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Due today</dt>
                            <dd className="font-semibold text-foreground">{ANNUAL_PRICE}.00</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">After that</dt>
                            <dd className="font-semibold text-foreground">{ANNUAL_PRICE} a year</dd>
                          </div>
                        </dl>
                      )}
                      <ul className="mt-3 space-y-1 border-t border-border pt-3 text-muted-foreground">
                        {plan === "trial" && !discountCode.trim() && (
                          <li className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-logo-green" aria-hidden="true" />
                            Cancel in the first seven days and you pay nothing.
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-logo-green" aria-hidden="true" />
                          Cancel online any time from Membership and Billing.
                        </li>
                      </ul>
                    </div>

                    {showCode ? (
                      <div className="space-y-2">
                        <Label htmlFor="membership-promo" className="flex items-center gap-2">
                          <Tag className="h-4 w-4" aria-hidden="true" />
                          Promo code
                        </Label>
                        <Input
                          id="membership-promo"
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value);
                            setCodeError(null);
                          }}
                          maxLength={50}
                          autoComplete="off"
                          autoCapitalize="characters"
                          aria-invalid={codeError ? true : undefined}
                        />
                        {codeError && <p className="text-sm font-medium text-destructive">{codeError}</p>}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCode(true)}
                        className="text-sm font-medium text-logo-blue underline-offset-4 hover:underline"
                      >
                        Have a promo code?
                      </button>
                    )}

                    <div>
                      <p className="mb-3 font-medium text-foreground">Choose how to pay</p>

                      {problemText && (
                        <p role="alert" className="mb-3 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                          {problemText}
                        </p>
                      )}
                      {problem?.code === "account_exists" && (
                        <p role="alert" className="mb-3 rounded-md border border-logo-blue/30 bg-logo-blue/5 p-3 text-sm text-foreground">
                          This email address already has a Sober Helpline account.{" "}
                          <Link to={LOGIN_HREF} className="font-semibold text-logo-blue hover:underline">
                            Log in to start your membership
                          </Link>
                          . If you do not remember a password, use “Forgot password?” on that page.
                        </p>
                      )}

                      {sdkState === "loading" && (
                        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Loading secure payment...
                        </div>
                      )}
                      {working && (
                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Setting things up...
                        </div>
                      )}

                      <div ref={buttonsHost} className={sdkState === "unavailable" ? "hidden" : "min-h-[48px]"} />

                      {sdkState === "unavailable" && (
                        <div className="rounded-lg border p-4 text-sm">
                          <p className="text-foreground">
                            The payment box could not load on this device. You can still join in two steps.
                          </p>
                          <Button asChild className="mt-3 w-full">
                            <Link to={OLD_SIGNUP_HREF}>Create my account, then pay</Link>
                          </Button>
                        </div>
                      )}

                      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>
                          Pay with a PayPal account or a debit or credit card. Card details are entered in PayPal's
                          secure form and are never seen or stored by Sober Helpline. After paying, we email you a link
                          to confirm your address and open your membership. See our{" "}
                          <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
                            privacy policy
                          </Link>
                          .
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </>
  );
}
