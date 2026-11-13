import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Phone, Check, Loader2, Tag, CheckCircle2, Heart, UserCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

import { usePayPalSubscription } from "@/hooks/usePayPalSubscription";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SEOHead from "@/components/SEOHead";
import MembershipSalesPage from "@/components/MembershipSalesPage";
import MembershipOneStepCheckout from "@/components/MembershipOneStepCheckout";
import { formatPhoneNumber } from "@/lib/formatPhone";
import { arrivedFromApp } from "@/lib/webSession";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";

const referralSources = [
  "The free Monday meeting (Family Squares)",
  "Google or another search",
  "The Sober Helpline app",
  "Facebook",
  "TikTok",
  "A treatment program or professional",
  "InterventionOnCall.com",
  "Word of Mouth",
  "Other",
];

const membershipFormSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Valid email is required").max(255),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  // Optional: it is only used to learn which paths bring families here.
  referralSource: z.string().max(100).optional(),
});

type MembershipFormValues = z.infer<typeof membershipFormSchema>;

const membershipPlans = {
  trial: {
    id: 'family-membership-trial',
    name: 'Free Trial',
    price: '0',
    period: '/7 days',
    billingCycle: 'trial' as const,
  },
  monthly: {
    id: 'family-membership-monthly',
    name: 'Family Support Membership',
    price: '9.99',
    period: '/month',
    billingCycle: 'monthly' as const,
  },
  annual: {
    id: 'family-membership-annual',
    name: 'Family Support Membership',
    price: '100.00',
    period: '/year',
    billingCycle: 'annual' as const,
  },
};

const membershipFeatures = {
  trial: [
    'Full family education library',
    'Private family forum access',
    'Recorded sessions and guided tools',
    '$25 member discount on private coaching',
    'Essential features in the Sober Helpline app',
    'No charge for the first 7 days',
  ],
  paid: [
    'Full family education library: 60+ guides, tools and meditations',
    'Private family forum access',
    'Recorded sessions and guided tools',
    '$25 member discount on private coaching',
    'Essential features in the Sober Helpline app',
    'Cancel anytime',
  ]
};

// Display only: the server (paypal-subscriptions) decides the price that is charged.
// Work in cents so the savings math is exact: 12 x $9.99 = $119.88; annual $100 saves $19.88.
const MONTHLY_PRICE_CENTS = 999;
const ANNUAL_PRICE_CENTS = 10000;
const MONTHLY_ANNUAL_COST = (MONTHLY_PRICE_CENTS * 12) / 100; // $119.88
const ANNUAL_SAVINGS = (MONTHLY_PRICE_CENTS * 12 - ANNUAL_PRICE_CENTS) / 100; // $19.88

export default function FamilyMembership() {
  // Opened from the Sober Helpline app: no website membership sales (App Store
  // guideline 3.1.1) — membership comes with the app plan.
  const [fromApp] = useState(arrivedFromApp);
  return fromApp ? <MembershipInTheApp /> : <FamilyMembershipCheckout />;
}

function FamilyMembershipCheckout() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [freeListingActivated, setFreeListingActivated] = useState(false);
  const [freeAccessEndsAt, setFreeAccessEndsAt] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [webinarRemindersOptIn, setWebinarRemindersOptIn] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'trial' | 'monthly' | 'annual'>('trial');
  
  const selectedPlan = membershipPlans[billingCycle];
  
  const { createSubscription, isLoading: paypalLoading, paypalUrl, clearPaypalUrl } = usePayPalSubscription();
  const { isMember, loading: membershipLoading } = useMembershipStatus();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-redirect to PayPal when approval URL is received
  useEffect(() => {
    if (paypalUrl) {
      toast({
        title: 'Redirecting to PayPal',
        description: 'Please complete your payment on PayPal.',
      });
      const timer = setTimeout(() => {
        window.location.href = paypalUrl;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [paypalUrl, toast]);
  
  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phoneNumber: "",
      referralSource: "",
    },
  });

  // Fill in what the person already told us when they made their account, so
  // nobody types their name, email and phone twice. Only empty fields are filled.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fillEmpty = (field: "firstName" | "lastName" | "phoneNumber" | "username" | "email", value?: string | null) => {
      const text = (value ?? "").trim();
      if (text && !form.getValues(field)) form.setValue(field, field === "phoneNumber" ? formatPhoneNumber(text) : text);
    };
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const metaText = (key: string) => (typeof meta[key] === "string" ? (meta[key] as string) : "");
    fillEmpty("email", user.email);
    fillEmpty("firstName", metaText("first_name"));
    fillEmpty("lastName", metaText("last_name"));
    fillEmpty("phoneNumber", metaText("phone_number"));
    void (async () => {
      try {
        const [{ data: profile }, { data: contact }] = await Promise.all([
          supabase.from("profiles").select("first_name, last_name, username").eq("id", user.id).maybeSingle(),
          supabase.from("profile_private").select("phone_number").eq("user_id", user.id).maybeSingle(),
        ]);
        if (cancelled) return;
        fillEmpty("firstName", profile?.first_name);
        fillEmpty("lastName", profile?.last_name);
        fillEmpty("username", profile?.username);
        fillEmpty("phoneNumber", contact?.phone_number);
      } catch {
        // The form still works when this lookup fails; the fields just start empty.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, form]);

  const handleSubscribe = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(true);
    clearPaypalUrl();
    
    try {
      const formData = form.getValues();
      trackConversionEvent("membership_checkout_start", {
        source: "family_membership_checkout",
        plan: billingCycle,
        heard_from: formData.referralSource || "not given",
      });
      // /subscription/cancel is shared with provider listings; this tells it
      // where "try again" should lead.
      try {
        sessionStorage.setItem("checkoutKind", "family");
      } catch {
        // Not essential.
      }
      
      // Update the user's profile with the form data (non-sensitive fields)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user!.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          webinar_reminders_opted_in: webinarRemindersOptIn,
        });

      // Store contact data separately
      const { error: privateError } = await supabase
        .from('profile_private')
        .upsert({
          user_id: user!.id,
          email: formData.email,
          phone_number: formData.phoneNumber,
        });

      if (profileError || privateError) {
        if (profileError?.code === '23505') {
          toast({
            title: "Username taken",
            description: "This username is already in use. Please choose another.",
            variant: "destructive",
          });
          setProcessingPayment(false);
          return;
        }
        console.error('Profile update error:', profileError || privateError);
      }

      // Add to Mailchimp if opted in for webinar reminders
      if (webinarRemindersOptIn) {
        try {
          const { error: mailchimpError } = await supabase.functions.invoke('add-to-mailchimp', {
            body: {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
            },
          });
          
          if (mailchimpError) {
            console.error('Mailchimp error:', mailchimpError);
            // Don't block subscription on Mailchimp failure
          } else {
            console.log('Successfully added to Mailchimp');
          }
        } catch (mailchimpErr) {
          console.error('Mailchimp integration error:', mailchimpErr);
        }
      }

      // The trial is a real PayPal subscription: $0 for seven days, then $9.99/month.
      // The amount sent here is ignored by the server, which sets the price itself.
      const isTrial = billingCycle === 'trial';
      const result = await createSubscription({
        planType: isTrial ? 'monthly' : billingCycle,
        amount: isTrial ? membershipPlans.monthly.price : selectedPlan.price,
        discountCode: isTrial ? 'HELPLINE' : discountCode.trim() || undefined,
      });
      
      // A promo code (FAMILY6) activated a free membership without PayPal.
      if (result?.bypassed) {
        const endsAt = (result as { accessEndsAt?: string | null }).accessEndsAt ?? null;
        setFreeAccessEndsAt(endsAt);
        setFreeListingActivated(true);
        toast({
          title: 'Membership Activated!',
          description: 'Your family membership is now active.',
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // No account yet: the sales page, then one page that takes their details
    // and payment together (?start=1). People who already have an account log
    // in and use the checkout below.
    return searchParams.get("start") ? <MembershipOneStepCheckout /> : <MembershipSalesPage />;
  }

  // Someone who is already a member should not be asked to pay again. A new
  // member also lands here from the confirmation link in their email.
  if (!membershipLoading && isMember && !freeListingActivated && !processingPayment) {
    const confirmedAt = user.email_confirmed_at ? new Date(user.email_confirmed_at).getTime() : 0;
    const justConfirmed = confirmedAt > 0 && Date.now() - confirmedAt < 15 * 60 * 1000;
    return (
      <>
        <SEOHead
          title="You Are Already a Member | Sober Helpline"
          description="Your Sober Helpline family membership is active."
          noIndex={true}
        />
        <div className="min-h-[70vh] bg-background">
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CheckCircle2 className="h-14 w-14 text-logo-green mx-auto mb-3" />
                <CardTitle>{justConfirmed ? "Your email is confirmed. Welcome!" : "You are already a member"}</CardTitle>
                <CardDescription>
                  {justConfirmed
                    ? "Your family membership is active and everything is open to you."
                    : "Your family membership is active, so there is nothing to sign up for here."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/member-home')} className="w-full">
                  Go to My Family Hub
                </Button>
                <Button variant="outline" onClick={() => navigate('/member-billing')} className="w-full">
                  Membership and billing
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  // Show success state for free membership
  if (freeListingActivated) {
    return (
      <>
        <SEOHead
          title="Membership Activated | Sober Helpline"
          description="Your Sober Helpline family membership is active and ready to use."
          noIndex={true}
        />
        <div className="min-h-screen bg-background">
          <main className="container py-12">
            <Card className="max-w-md mx-auto border-green-500">
              <CardHeader className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-600">Membership Activated!</CardTitle>
                <CardDescription>
                  Your family support membership is now active.
                  {freeAccessEndsAt && (
                    <> Your free access runs until {new Date(freeAccessEndsAt).toLocaleDateString()}.</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-medium mb-1">What's next?</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Open the family education library</li>
                    <li>Introduce yourself in the private family forum</li>
                    <li>Watch recordings of past Monday meetings</li>
                  </ul>
                </div>
                <Button onClick={() => navigate('/family-support')} className="w-full">
                  Go to Family Support
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Family Support Membership | Sober Helpline"
        description="Join Sober Helpline membership for family education, practical tools, community support, and steadier support when addiction has your family stretched thin."
      />

      <div className="min-h-screen bg-background">

        <main className="container py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            <Link
              to="/family-support"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Support
            </Link>

            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-4">
                Family Support Membership
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Membership gives your family a steadier place to learn, ask better questions, and make calmer decisions when things feel heavy.
              </p>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">
                If you want the simplest first step, start with the free Family Squares meeting. Membership is the next layer of support. Private coaching is there later when you want one-on-one help.
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Member Information</CardTitle>
                    <CardDescription>A few details to set up your account and help protect your privacy in the forum.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Username Field */}
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <UserCircle className="h-4 w-4" />
                              Choose a Username *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="anonymous_helper" {...field} />
                            </FormControl>
                            <div className="flex items-start gap-2 mt-2">
                              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground">
                                Your username appears in the forum instead of your real name, so you can take part without putting your personal information on display.
                              </p>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
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
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Webinar Reminders Opt-in */}
                    <div className="flex items-start space-x-3 pl-1">
                      <Checkbox
                        id="webinar-reminders"
                        checked={webinarRemindersOptIn}
                        onCheckedChange={(checked) => setWebinarRemindersOptIn(checked === true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor="webinar-reminders" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Send me reminders about upcoming webinars and special education sessions
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          You can unsubscribe at any time from your account settings.
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(555) 123-4567" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* How did you hear about us */}
                    <FormField
                      control={form.control}
                      name="referralSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you hear about us? (optional)</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <option value="">Select an option</option>
                              {referralSources.map((source) => (
                                <option key={source} value={source}>
                                  {source}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Subscription Card */}
                <Card className="border-primary">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Choose Your Membership</CardTitle>
                    </div>
                    
                    {/* Billing Cycle Toggle */}
                    <div className="space-y-3 mt-3">
                      {/* Free Trial - Most Prominent */}
                      <Button
                        type="button"
                        variant={billingCycle === 'trial' ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => setBillingCycle('trial')}
                        className="w-full bg-gradient-to-r from-logo-blue to-blue-700 hover:from-logo-blue/90 hover:to-blue-800 text-white border-0"
                      >
                        🎉 Start Free for 7 Days
                        <Badge variant="secondary" className="ml-2 bg-white/20 text-white text-xs border-0">
                          Most Popular
                        </Badge>
                      </Button>
                      
                      {/* Paid Options */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setBillingCycle('monthly')}
                          className="flex-1"
                        >
                          Monthly
                        </Button>
                        <Button
                          type="button"
                          variant={billingCycle === 'annual' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setBillingCycle('annual')}
                          className="flex-1"
                        >
                          Annual
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 text-xs">
                            Save ${ANNUAL_SAVINGS.toFixed(2)}
                          </Badge>
                        </Button>
                      </div>
                    </div>

                    <CardDescription className="pt-4">
                      {billingCycle === 'trial' ? (
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
                          <div className="text-lg text-muted-foreground">7-Day Trial</div>
                          <div className="mt-2 p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-700 font-medium block">
                              No charge today. PayPal bills $9.99/month after the seven-day trial unless you cancel first.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-foreground">${selectedPlan.price}</span>
                          <span className="text-muted-foreground">{selectedPlan.period}</span>
                          {billingCycle === 'annual' && (
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Save ${ANNUAL_SAVINGS.toFixed(2)} vs monthly (${MONTHLY_ANNUAL_COST.toFixed(2)}/year)
                              </Badge>
                            </div>
                          )}
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {(billingCycle === 'trial' ? membershipFeatures.trial : membershipFeatures.paid).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {billingCycle !== 'trial' && (
                      <div className="space-y-2">
                        <Label htmlFor="discountCode" className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Discount Code (optional)
                        </Label>
                        <Input
                          id="discountCode"
                          placeholder="Enter discount code"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          maxLength={50}
                        />
                      </div>
                    )}

                    {paypalUrl ? (
                      <div className="w-full p-4 bg-muted rounded-lg text-center space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-sm font-medium text-foreground">
                          Taking you to PayPal...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          If you're not redirected automatically, <a href={paypalUrl} className="underline text-primary">click here</a>.
                        </p>
                      </div>
                    ) : (
                      <Button 
                        type="button"
                        size="lg" 
                        onClick={handleSubscribe}
                        disabled={paypalLoading || processingPayment || isSubmitting}
                        className="w-full"
                      >
                        {paypalLoading || processingPayment || isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Setting things up...
                          </>
                        ) : (
                          <>{billingCycle === 'trial' ? 'Start Trial with PayPal' : 'Continue to PayPal'}</>
                        )}
                      </Button>
                    )}
                    <p className="text-sm text-muted-foreground text-center">
                      Secure checkout through PayPal. The seven-day trial has no charge; recurring billing starts afterward unless you cancel.
                    </p>
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

/** For visitors who came from the Sober Helpline app: plain text, no checkout. */
function MembershipInTheApp() {
  return (
    <div className="min-h-[60vh] bg-background flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Membership is available in the Sober Helpline app</CardTitle>
          <CardDescription className="text-base">
            Essential and Premier plans in the app include the family education library, the private family
            forum, past Family Squares recordings and member Q&amp;A on this website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
          <p>
            Already have a plan? Go back to the app and open a member page from there. You'll be signed in here
            automatically.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Go to the home page</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
