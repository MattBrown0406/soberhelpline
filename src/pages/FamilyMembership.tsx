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
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Check, Loader2, Tag, CheckCircle2, Heart, UserCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";
import { usePayPalSubscription } from "@/hooks/usePayPalSubscription";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Helmet } from "react-helmet-async";

const referralSources = [
  "Facebook",
  "TikTok", 
  "InterventionOnCall.com",
  "Word of Mouth",
];

// Format phone number as user types: (000) 000-0000
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Check if it might be an international number (starts with + or has more than 10 digits)
  if (value.startsWith('+') || digits.length > 10) {
    return value; // Don't format international numbers
  }
  
  // Format as US phone number
  if (digits.length <= 3) {
    return digits.length > 0 ? `(${digits}` : '';
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

const membershipFormSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Valid email is required").max(255),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  city: z.string().min(2, "City is required").max(100),
  country: z.enum(["US", "CA"], { required_error: "Please select a country" }),
  state: z.string().min(2, "State/Province is required").max(50),
  referralSource: z.string().min(1, "Please let us know how you heard about us"),
});

type MembershipFormValues = z.infer<typeof membershipFormSchema>;

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

const canadianProvinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec",
  "Saskatchewan", "Yukon"
];

const membershipPlans = {
  monthly: {
    id: 'family-membership-monthly',
    name: 'Family Support Membership',
    price: '14.99',
    period: '/month',
    billingCycle: 'monthly' as const,
  },
  annual: {
    id: 'family-membership-annual',
    name: 'Family Support Membership',
    price: '149',
    period: '/year',
    billingCycle: 'annual' as const,
  },
};

const membershipFeatures = [
  'Access to premium family resources',
  'Exclusive support group access',
  'Educational webinars & content',
  'Direct support from our team',
  'Cancel anytime',
];

const MONTHLY_ANNUAL_COST = 14.99 * 12; // $179.88
const ANNUAL_SAVINGS = MONTHLY_ANNUAL_COST - 149; // $30.88

export default function FamilyMembership() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [freeListingActivated, setFreeListingActivated] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [webinarRemindersOptIn, setWebinarRemindersOptIn] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const selectedPlan = membershipPlans[billingCycle];
  
  const { createSubscription, isLoading: paypalLoading, paypalUrl, clearPaypalUrl } = usePayPalSubscription();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in or create an account to join.",
        variant: "destructive",
      });
      navigate("/auth?redirect=/family-membership");
    }
  }, [user, isLoading, navigate, toast]);

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
      city: "",
      country: "US",
      state: "",
      referralSource: "",
    },
  });

  const selectedCountry = form.watch("country");

  // Update email when user is loaded
  useEffect(() => {
    if (user?.email) {
      form.setValue('email', user.email);
    }
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

      // Create the subscription
      const result = await createSubscription({
        planType: billingCycle,
        amount: selectedPlan.price,
        discountCode: discountCode.trim() || undefined,
      });
      
      // Check if FREELIST code was used
      if (result?.bypassed) {
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

  // Show success state for free membership
  if (freeListingActivated) {
    return (
      <>
        <Helmet>
          <title>Membership Activated | Sober Helpline</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <header className="border-b border-border/40 bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
              </Link>
              <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
                <Phone className="h-4 w-4" />
                (541) 241-5886
              </a>
            </div>
          </header>
          <main className="container py-12">
            <Card className="max-w-md mx-auto border-green-500">
              <CardHeader className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-600">Membership Activated!</CardTitle>
                <CardDescription>
                  Your family support membership is now active.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-medium mb-1">What's next?</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Access premium family resources</li>
                    <li>Join exclusive support groups</li>
                    <li>Watch educational webinars</li>
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
      <Helmet>
        <title>Family Support Membership | Sober Helpline</title>
        <meta name="description" content="Join our family support membership program for access to premium resources, support groups, and expert guidance." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

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
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Family Support Membership
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Get access to premium resources, support groups, and expert guidance to help your family through this journey.
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Member Information</CardTitle>
                    <CardDescription>Please provide your contact details</CardDescription>
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
                                Your username will be displayed in the forum instead of your real name to protect your privacy.
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
                          Send me reminders for upcoming webinars and special education sessions
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

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                form.setValue("state", ""); // Reset state when country changes
                              }}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{selectedCountry === "CA" ? "Province/Territory" : "State"} *</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select {selectedCountry === "CA" ? "a province" : "a state"}</option>
                                {(selectedCountry === "CA" ? canadianProvinces : usStates).map((region) => (
                                  <option key={region} value={region}>
                                    {region}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* How did you hear about us */}
                    <FormField
                      control={form.control}
                      name="referralSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you hear about us? *</FormLabel>
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
                      <CardTitle className="text-lg">Complete Your Membership</CardTitle>
                    </div>
                    
                    {/* Billing Cycle Toggle */}
                    <div className="flex gap-2 mt-3">
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
                          Save ${ANNUAL_SAVINGS.toFixed(0)}
                        </Badge>
                      </Button>
                    </div>

                    <CardDescription className="pt-4">
                      <span className="text-3xl font-bold text-foreground">${selectedPlan.price}</span>
                      <span className="text-muted-foreground">{selectedPlan.period}</span>
                      {billingCycle === 'annual' && (
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Save ${ANNUAL_SAVINGS.toFixed(2)} vs monthly (${MONTHLY_ANNUAL_COST.toFixed(2)}/year)
                          </Badge>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {membershipFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

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

                    {paypalUrl ? (
                      <div className="w-full p-4 bg-muted rounded-lg text-center space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-sm font-medium text-foreground">
                          Redirecting you to PayPal...
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
                            Processing...
                          </>
                        ) : (
                          <>Subscribe with PayPal</>
                        )}
                      </Button>
                    )}
                    <p className="text-sm text-muted-foreground text-center">
                      Secure payment powered by PayPal. Cancel anytime.
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
