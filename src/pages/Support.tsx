import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Clock, Mail, Phone, Shield, Smartphone } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const supportFaqs = [
  {
    question: "How do I get help with the SoberHelpline app?",
    answer: "Email support@soberhelpline.com or call 458-202-7900 with your device type, the email on your account, and a short description of what is not working.",
  },
  {
    question: "Is SoberHelpline emergency or medical care?",
    answer: "No. SoberHelpline provides education and family support. If someone may be in immediate danger, call 911 or use 988 for mental health crisis support in the United States.",
  },
  {
    question: "How do I manage an Apple App Store subscription?",
    answer: "Open iPhone Settings, tap your name, tap Subscriptions, choose SoberHelpline, then update or cancel the subscription there.",
  },
];

export default function Support() {
  return (
    <>
      <SEOHead
        title="SoberHelpline App Support | Sober Helpline"
        description="Support for the SoberHelpline mobile app, account access, subscriptions, billing questions, technical issues, and family support resources."
        faqItems={supportFaqs}
        speakableSelectors={["h1", ".support-summary", "h2"]}
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">SoberHelpline app support</p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Help with your SoberHelpline app account
              </h1>
              <p className="support-summary mx-auto max-w-2xl text-lg text-muted-foreground">
                Use this page for App Store support, account access, subscriptions, billing questions, technical problems,
                and help finding the right family support resource.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <a href="mailto:support@soberhelpline.com?subject=SoberHelpline%20App%20Support">
                    <Mail className="h-4 w-4" />
                    Email support
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <a href="tel:4582027900">
                    <Phone className="h-4 w-4" />
                    Call 458-202-7900
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <main className="container py-10 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Smartphone className="h-5 w-5 text-primary" />
                  What we can help with
                </CardTitle>
                <CardDescription>
                  Include the email address on your account and what device you are using so we can troubleshoot faster.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Trouble signing in or accessing your account",
                    "App crashes, blank screens, or loading problems",
                    "Family membership or subscription questions",
                    "Apple App Store billing and cancellation guidance",
                    "Questions about Family Squares, coaching, or app resources",
                    "Problems with notifications, audio, video, or forms",
                  ].map((item) => (
                    <div key={item} className="flex gap-2 rounded-lg border bg-card p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Response time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Email is the cleanest support path. We aim to respond within 1 business day when possible.
                </p>
                <p>
                  If your issue is urgent and related to a family addiction crisis, call instead of waiting on email.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription and billing help</CardTitle>
                <CardDescription>For purchases made through Apple, Apple controls billing and cancellation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Open the <strong>Settings</strong> app on your iPhone.</li>
                  <li>Tap your name at the top.</li>
                  <li>Tap <strong>Subscriptions</strong>.</li>
                  <li>Select <strong>SoberHelpline</strong>.</li>
                  <li>Choose the change or cancellation option shown by Apple.</li>
                </ol>
                <p>
                  If you do not see the subscription there, email us and include the Apple ID email you used for purchase if you are comfortable sharing it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send this with your support request</CardTitle>
                <CardDescription>These details prevent back-and-forth.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />Your name and account email</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />iPhone or Android device model</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />What screen or feature has the problem</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />A screenshot if it helps explain the issue</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mx-auto mt-8 max-w-5xl">
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Safety and crisis limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  SoberHelpline is not emergency medical care, psychiatric care, detox, legal advice, or a crisis response service.
                  If someone is in immediate danger, call <a className="font-semibold text-primary underline" href="tel:911">911</a>.
                  For mental health crisis support in the United States, call or text <a className="font-semibold text-primary underline" href="tel:988">988</a>.
                </p>
                <p>
                  For substance use treatment referrals, SAMHSA is available at <a className="font-semibold text-primary underline" href="tel:18006624357">1-800-662-4357</a>.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mx-auto mt-8 max-w-5xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy and account requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  For account access, data, or privacy-related requests, email <a className="font-semibold text-primary underline" href="mailto:support@soberhelpline.com">support@soberhelpline.com</a> from the email connected to your account.
                </p>
                <p>
                  If you are looking for family addiction resources rather than app support, start with the <Link className="font-semibold text-primary underline" to="/start-here">Start Here</Link> page or the free <Link className="font-semibold text-primary underline" to="/family-squares">Family Squares</Link> meeting.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
