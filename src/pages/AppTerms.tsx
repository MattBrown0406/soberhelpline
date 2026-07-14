import { AlertTriangle, CreditCard, FileText, ShieldCheck, UserRound } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppTerms() {
  return (
    <>
      <SEOHead
        title="SoberHelpline App Terms of Use | Sober Helpline"
        description="Terms governing use of the SoberHelpline mobile app, subscriptions, family-support tools, accounts, acceptable use, and safety limitations."
        speakableSelectors={["h1", ".terms-summary", "h2"]}
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-4xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">SoberHelpline mobile app</p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">Terms of Use</h1>
              <p className="terms-summary max-w-3xl text-lg text-muted-foreground">
                These Terms govern your use of the SoberHelpline mobile app, accounts, subscriptions, educational tools, family-support features, and related services.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">Effective date: July 14, 2026</p>
            </div>
          </div>
        </section>

        <main className="container py-10 md:py-14">
          <div className="mx-auto max-w-5xl space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-2xl"><FileText className="h-5 w-5 text-primary" />Agreement and eligibility</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>By creating an account, accepting these Terms, purchasing a subscription, or using the app, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the app.</p>
                <p>SoberHelpline is intended for adults. You must provide accurate account information and protect your sign-in credentials. You are responsible for activity under your account.</p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader><CardTitle className="flex items-center gap-2 text-2xl"><AlertTriangle className="h-5 w-5 text-amber-600" />Not emergency, medical, or professional treatment</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>SoberHelpline provides family education, organizational tools, peer-support pathways, and access to separately described professional services. It is not an emergency service, detox facility, medical provider, psychiatric provider, legal service, or substitute for licensed diagnosis or treatment.</p>
                <p>If someone is in immediate danger, call 911. For mental-health crisis support in the United States, call or text 988. For poison or overdose concerns, contact emergency services or Poison Control as appropriate.</p>
                <p>App guidance is general and cannot account for every family, medical, legal, safety, or treatment circumstance. You remain responsible for decisions and for obtaining qualified professional help.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-2xl"><CreditCard className="h-5 w-5 text-primary" />Subscriptions, billing, and professional services</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Digital subscriptions purchased in the app are processed by the Apple App Store or Google Play. Prices, billing period, trial terms, renewal terms, and available cancellation options are shown by the applicable store before purchase.</p>
                <p>Subscriptions automatically renew unless cancelled through the applicable app-store account settings before renewal. Deleting the app or your SoberHelpline account does not automatically cancel an app-store subscription. Refund requests are governed by the applicable store's policies.</p>
                <p>Subscriptions provide only the features and access pathways displayed for the selected plan. Intervention services, treatment placement, one-time coaching, plan review, or other separately priced professional services are not included unless the app or a written agreement expressly says otherwise.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-2xl"><UserRound className="h-5 w-5 text-primary" />Acceptable use and user content</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You may not use SoberHelpline to threaten, harass, impersonate, exploit, defraud, distribute illegal material, interfere with the service, bypass access controls, or violate another person's privacy or rights.</p>
                <p>You retain responsibility for information, messages, notes, images, and other content you choose to submit. Do not upload content you lack authority to share. You grant SoberHelpline the limited rights necessary to host, process, secure, and display that content to provide the service.</p>
                <p>Community and support features may be moderated. We may remove content or restrict access when reasonably necessary for safety, privacy, legal compliance, or enforcement of these Terms.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-2xl"><ShieldCheck className="h-5 w-5 text-primary" />Privacy, availability, and account termination</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Our <a className="font-semibold text-primary underline" href="https://soberhelpline.com/privacy">Privacy Policy</a> explains how information is collected, used, shared, retained, and deleted. Account-deletion instructions are available at <a className="font-semibold text-primary underline" href="https://soberhelpline.com/delete-account">soberhelpline.com/delete-account</a>.</p>
                <p>We work to keep the app available and secure, but do not guarantee uninterrupted or error-free operation. Features may change as the app, legal requirements, safety practices, and app-store rules evolve.</p>
                <p>We may suspend or terminate access for material violations, unlawful activity, threats to users or systems, fraud, or nonpayment. Sections that logically survive termination—including payment obligations, disclaimers, limitations, and dispute provisions—remain effective.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Disclaimers and limitation of liability</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>To the maximum extent permitted by law, the app and its content are provided “as is” and “as available.” SoberHelpline disclaims implied warranties that cannot legally be required.</p>
                <p>To the maximum extent permitted by law, SoberHelpline is not liable for indirect, incidental, special, consequential, or punitive damages arising from app use, inability to use the app, reliance on educational content, third-party services, or user content. Nothing in these Terms excludes liability that cannot legally be excluded.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Changes and contact</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We may update these Terms. Material changes will be posted with a revised effective date and, when appropriate, communicated in the app. Continued use after the effective date means you accept the updated Terms.</p>
                <p>Questions: <a className="font-semibold text-primary underline" href="mailto:support@soberhelpline.com">support@soberhelpline.com</a> or 458-298-8008.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
