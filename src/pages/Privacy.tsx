import { Link } from "react-router-dom";
import { Database, Lock, Mail, ShieldCheck, Trash2, Users } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const privacyFaqs = [
  {
    question: "What information does SoberHelpline collect?",
    answer: "SoberHelpline may collect account information, app usage information, support requests, subscription status, and information you choose to enter into app features or forms.",
  },
  {
    question: "How do I request account deletion or data access?",
    answer: "Email support@soberhelpline.com from the email address connected to your account and ask for account deletion, data access, or correction.",
  },
  {
    question: "Does SoberHelpline sell personal information?",
    answer: "No. SoberHelpline does not sell personal information.",
  },
];

export default function Privacy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Sober Helpline"
        description="Privacy policy for Sober Helpline and the SoberHelpline mobile app, including data collection, use, sharing, retention, account deletion, and contact information."
        faqItems={privacyFaqs}
        speakableSelectors={["h1", ".privacy-summary", "h2"]}
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-4xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Privacy Policy</p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Sober Helpline Privacy Policy
              </h1>
              <p className="privacy-summary max-w-3xl text-lg text-muted-foreground">
                This policy explains how Sober Helpline and the SoberHelpline mobile app collect, use, share,
                protect, retain, and delete information. It is written for families using Sober Helpline resources,
                app features, support, subscriptions, forms, coaching, and educational tools.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">Effective date: June 14, 2026</p>
            </div>
          </div>
        </section>

        <main className="container py-10 md:py-14">
          <div className="mx-auto max-w-5xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Who this policy covers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  “Sober Helpline,” “SoberHelpline,” “we,” “us,” and “our” refer to Sober Helpline services,
                  websites, and mobile app experiences operated for addiction family education and support.
                </p>
                <p>
                  This policy applies to the SoberHelpline mobile app, soberhelpline.com, support requests,
                  forms, account features, membership features, educational tools, and related communications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Database className="h-5 w-5 text-primary" />
                  Information we may collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We may collect the following categories of information, depending on how you use the app or website:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Account information:</strong> name, email address, login identifiers, and authentication information.</li>
                  <li><strong>Contact information:</strong> phone number, email address, and details you provide when requesting support or coaching.</li>
                  <li><strong>Payment and subscription information:</strong> subscription status, plan type, purchase history, and billing-related identifiers. App Store purchases are processed by Apple, not directly by Sober Helpline.</li>
                  <li><strong>App usage information:</strong> pages viewed, features used, device type, browser/app version, crash data, diagnostics, and approximate technical logs.</li>
                  <li><strong>User-provided content:</strong> form responses, assessment answers, notes, forum/community posts, support messages, coaching intake information, and other information you choose to enter.</li>
                  <li><strong>Communications:</strong> emails, support messages, call notes, and other communications with us.</li>
                </ul>
                <p>
                  Please do not enter information about another person unless you have a legitimate reason to do so and understand that you are choosing to share that information with Sober Helpline.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-5 w-5 text-primary" />
                  How we use information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use information to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Provide app features, family education, resources, account access, and support.</li>
                  <li>Respond to support requests, coaching inquiries, account questions, and technical issues.</li>
                  <li>Process or verify subscription access and membership status.</li>
                  <li>Improve app reliability, diagnose crashes, fix bugs, and understand feature usage.</li>
                  <li>Send transactional messages, reminders, updates, support replies, and service-related communications.</li>
                  <li>Maintain safety, prevent abuse, enforce community standards, and protect the integrity of the service.</li>
                  <li>Comply with legal obligations and resolve disputes.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Lock className="h-5 w-5 text-primary" />
                  Sharing and disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We do not sell personal information. We may share limited information with service providers only as needed to operate Sober Helpline.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Technology providers:</strong> hosting, database, analytics, authentication, error logging, email delivery, and customer support tools.</li>
                  <li><strong>Payment platforms:</strong> Apple and other payment processors handle billing and subscription transactions according to their own policies.</li>
                  <li><strong>Professional or legal needs:</strong> advisors, compliance support, or legal authorities when required by law or necessary to protect rights and safety.</li>
                  <li><strong>With your direction:</strong> if you ask us to connect you with a resource, provider, support option, or consultation path.</li>
                </ul>
                <p>
                  Sober Helpline is not a medical provider, emergency service, detox facility, hospital, or crisis response service. Do not use the app as a substitute for medical, psychiatric, legal, or emergency care.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health, addiction, and sensitive information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Some information you choose to provide may relate to addiction, mental health, family crisis, treatment, recovery, or other sensitive topics.
                  We treat that information carefully and use it only to provide and improve the support, education, and services you request.
                </p>
                <p>
                  Do not use Sober Helpline for emergencies. If someone is in immediate danger, call <a className="font-semibold text-primary underline" href="tel:911">911</a>.
                  For mental health crisis support in the United States, call or text <a className="font-semibold text-primary underline" href="tel:988">988</a>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We keep information for as long as needed to provide the service, maintain accounts, respond to support requests,
                  meet legal or accounting obligations, resolve disputes, maintain safety, and improve reliability.
                </p>
                <p>
                  Some records may be retained in backups, logs, transaction records, or legal/accounting records for a limited period after account deletion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trash2 className="h-5 w-5 text-primary" />
                  Your choices, access, correction, and deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You may request access, correction, deletion, or account closure by contacting us.</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Email <a className="font-semibold text-primary underline" href="mailto:support@soberhelpline.com">support@soberhelpline.com</a> from the email address connected to your account.</li>
                  <li>Use the subject line: <strong>Privacy Request</strong> or <strong>Account Deletion Request</strong>.</li>
                  <li>Tell us what you want deleted, corrected, or accessed.</li>
                </ul>
                <p>
                  We may need to verify your identity before fulfilling a request. Some deletion requests may be limited by legal, safety, billing, fraud-prevention, or operational obligations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Children</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Sober Helpline is intended for adults and is not directed to children under 13. If you believe a child has provided personal information,
                  contact us so we can review and delete it where appropriate.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We use reasonable administrative, technical, and organizational safeguards designed to protect information.
                  No internet or mobile app system is perfectly secure, so we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to this policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may update this Privacy Policy as the app and services evolve. The effective date at the top of this page shows when it was last updated.
                  Continued use of the app or website after changes means the updated policy applies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  For privacy, account, or app support questions, contact:
                </p>
                <p>
                  <strong>Sober Helpline</strong><br />
                  Email: <a className="font-semibold text-primary underline" href="mailto:support@soberhelpline.com">support@soberhelpline.com</a><br />
                  Phone: <a className="font-semibold text-primary underline" href="tel:4582027900">458-202-7900</a>
                </p>
                <p>
                  For app support rather than privacy questions, use the <Link className="font-semibold text-primary underline" to="/support">SoberHelpline App Support</Link> page.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
