import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CreditCard, Mail, ShieldCheck } from "lucide-react";

export default function CancelMembership() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  const goToBilling = () => {
    if (signedIn) navigate("/member-billing");
    else navigate("/auth?redirect=/member-billing");
  };

  return (
    <>
      <SEOHead
        title="Cancel Your Family Membership | Sober Helpline"
        description="Cancel your Sober Helpline family membership in a few clicks. Cancelling also stops your recurring PayPal billing immediately."
        speakableSelectors={["h1", ".cancel-summary", "h2"]}
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Cancel your family membership
              </h1>
              <p className="cancel-summary mx-auto max-w-2xl text-lg text-muted-foreground">
                No phone calls, no retention hoops. Cancelling here also cancels your recurring
                PayPal subscription so you are never billed again.
              </p>
            </div>
          </div>
        </section>

        <main className="container py-10 md:py-14">
          <div className="mx-auto max-w-3xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Cancel online in three steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-muted-foreground">
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Sign in with the email on your membership.</li>
                  <li>Open <strong>Membership &amp; Billing</strong>.</li>
                  <li>Choose <strong>Cancel membership</strong> and confirm.</li>
                </ol>
                <Button size="lg" onClick={goToBilling} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  {signedIn ? "Go to Membership & Billing" : "Sign in to cancel"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  What happens when you cancel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <ul className="space-y-2">
                  {[
                    "Your recurring PayPal subscription is cancelled right away — no further charges.",
                    "You keep access to member resources through the end of the period you already paid for.",
                    "You will receive a cancellation confirmation email.",
                    "You can rejoin at any time; your forum posts and saved worksheets stay with your account.",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-5 w-5 text-primary" />
                  Need help, or subscribed in the app?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  If your membership came from a complimentary code, or you cannot sign in, email{" "}
                  <a className="font-semibold text-primary underline" href="mailto:matt@soberhelpline.com?subject=Membership%20Cancellation%20Request">
                    matt@soberhelpline.com
                  </a>{" "}
                  and we will cancel it for you.
                </p>
                <p>
                  Subscriptions purchased inside the SoberHelpline mobile app are billed by Apple or
                  Google and must be cancelled in your App Store or Google Play subscription settings.
                </p>
                <p className="text-sm">
                  Want to remove your account entirely? See{" "}
                  <Link className="font-semibold text-primary underline" to="/delete-account">
                    Delete your account
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
