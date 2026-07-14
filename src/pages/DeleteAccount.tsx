import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Clock, Mail, ShieldCheck, Trash2 } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeleteAccount() {
  return (
    <>
      <SEOHead
        title="Delete Your SoberHelpline Account | Sober Helpline"
        description="Request deletion of your SoberHelpline mobile app account and associated personal data, and learn what may be retained for legal or security purposes."
        speakableSelectors={["h1", ".deletion-summary", "h2"]}
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">SoberHelpline app</p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Delete your account and app data
              </h1>
              <p className="deletion-summary mx-auto max-w-3xl text-lg text-muted-foreground">
                This page is the public account-deletion resource for the SoberHelpline mobile app. You may delete your account inside the app or initiate a deletion request by email.
              </p>
            </div>
          </div>
        </section>

        <main className="container py-10 md:py-14">
          <div className="mx-auto max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trash2 className="h-5 w-5 text-primary" />
                  Option 1: Delete your account in the app
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Open the SoberHelpline app and sign in.</li>
                  <li>Open <strong>Settings</strong>.</li>
                  <li>Scroll to <strong>Delete account</strong>.</li>
                  <li>Read the warning and confirm deletion.</li>
                </ol>
                <p>Deletion begins immediately after the app confirms the request. You will be signed out and the account cannot be restored.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-5 w-5 text-primary" />
                  Option 2: Request deletion without the app
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Email us from the address connected to your SoberHelpline account. Use the subject line <strong>Account Deletion Request</strong>. We may ask you to verify account ownership before processing the request.</p>
                <Button asChild size="lg" className="gap-2">
                  <a href="mailto:support@soberhelpline.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20SoberHelpline%20app%20account%20and%20associated%20personal%20data.%20The%20email%20address%20on%20my%20account%20is%3A%20">
                    <Mail className="h-4 w-4" />
                    Initiate deletion request
                  </a>
                </Button>
                <p className="text-sm">If the email button does not open, write to <a className="font-semibold text-primary underline" href="mailto:support@soberhelpline.com">support@soberhelpline.com</a>.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  What is deleted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>When your account is deleted, SoberHelpline deletes or de-identifies account-linked app data that is not required to be retained, including:</p>
                <ul className="space-y-2">
                  {[
                    "Your app login and account profile",
                    "Saved app plans, check-ins, notes, and family-support records stored in your account",
                    "App support threads, community content, and uploaded attachments associated with your account, subject to safety and legal exceptions",
                    "Push-notification tokens and app preferences associated with your account",
                    "SoberHelpline subscription-entitlement mirror records associated with your account",
                  ].map((item) => (
                    <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Clock className="h-5 w-5 text-primary" />
                  Data that may be retained
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>Limited records may be retained when reasonably necessary for fraud prevention, security, dispute resolution, tax or accounting requirements, transaction records, legal obligations, or enforcing our agreements. Backups and security logs may persist for a limited period before routine deletion or de-identification.</p>
                <p>Email requests are generally completed within 30 days after account ownership is verified. We will explain if law requires a longer period or prevents deletion of a specific record.</p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Deletion does not cancel an app-store subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Account deletion and app-store billing are separate. Cancel an active subscription in Apple App Store or Google Play settings to prevent future renewal. Deleting your SoberHelpline account does not issue an automatic refund.</p>
                <p>SoberHelpline is not an emergency service. If someone is in immediate danger, call 911. For mental-health crisis support in the United States, call or text 988.</p>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground">
              Review the <Link className="font-semibold text-primary underline" to="/privacy">Privacy Policy</Link> or visit <Link className="font-semibold text-primary underline" to="/support">App Support</Link> for other account questions.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
