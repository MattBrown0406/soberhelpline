import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Clock, Loader2, Mail, ShieldCheck, Trash2 } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const CONFIRM_WORD = "DELETE";

type Problem = "protected" | "paypal_failed" | "app_failed" | "error";

/**
 * Deletes the signed-in person's account here and in the Sober Helpline app.
 * The work is done by the delete-account function; this only collects a
 * deliberate confirmation and reports what happened.
 */
function DeleteAccountNow() {
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [typed, setTyped] = useState("");
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setEmail(data.session?.user?.email ?? null);
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const deleteEverywhere = async () => {
    if (typed.trim() !== CONFIRM_WORD || working) return;
    setWorking(true);
    setProblem(null);
    try {
      const { data, error } = await supabase.functions.invoke("delete-account", { body: { confirm: CONFIRM_WORD } });
      let result = data as { ok?: boolean; code?: string } | null;
      if (error && !result) {
        try {
          result = await (error as { context?: Response }).context?.json();
        } catch {
          result = null;
        }
      }
      if (result?.ok) {
        // The account no longer exists; clear what this browser remembers of it.
        await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
        setDone(true);
        return;
      }
      const code = result?.code;
      setProblem(code === "protected" || code === "paypal_failed" || code === "app_failed" ? code : "error");
    } catch {
      setProblem("error");
    } finally {
      setWorking(false);
    }
  };

  if (done) {
    return (
      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Your account has been deleted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Your soberhelpline.com account is gone, and so is your Sober Helpline app account if you had one under the
            same email address. Any membership billed through PayPal has been cancelled.
          </p>
          <p>
            If you subscribed inside the app, that subscription is billed by Apple and only you can cancel it. Open
            your Apple ID subscriptions on your iPhone or iPad and cancel it there.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!checked) return null;

  if (!email) {
    return (
      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trash2 className="h-5 w-5 text-primary" />
            Delete your account now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Log in and you can delete your account from this page. One deletion removes your soberhelpline.com account
            and your Sober Helpline app account together.
          </p>
          <Button asChild size="lg">
            <Link to="/auth?redirect=/delete-account">Log in to delete my account</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trash2 className="h-5 w-5 text-destructive" />
          Delete your account now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        <p>
          You are signed in as <strong className="break-all text-foreground">{email}</strong>. Deleting cannot be undone.
        </p>
        <ul className="space-y-2">
          {[
            "Your soberhelpline.com account, profile, workbook entries and saved tools are deleted.",
            "Your Sober Helpline app account under this email address is deleted too.",
            "A membership billed through PayPal is cancelled, so you are not charged again.",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
          <li className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            A subscription you bought inside the app is billed by Apple. We cannot cancel it for you: cancel it in
            your Apple ID subscriptions.
          </li>
        </ul>

        <div className="space-y-2">
          <Label htmlFor="delete-confirm" className="text-foreground">
            Type {CONFIRM_WORD} to confirm
          </Label>
          <Input
            id="delete-confirm"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="max-w-xs"
          />
        </div>

        {problem && (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {problem === "protected" && (
              <>
                This account has staff or provider access, so it cannot be deleted from this page. Write to{" "}
                <a className="font-semibold underline" href="mailto:matt@soberhelpline.com?subject=Account%20Deletion%20Request">matt@soberhelpline.com</a>{" "}
                and we will take care of it.
              </>
            )}
            {problem === "paypal_failed" &&
              "PayPal would not confirm that your membership was cancelled, so nothing was deleted. Please try again in a few minutes."}
            {problem === "app_failed" &&
              "Your membership was cancelled, but we could not reach the app to finish, so your account is still here. Please try again in a few minutes."}
            {problem === "error" && "Something went wrong and your account was not deleted. Please try again in a few minutes."}
          </p>
        )}

        <Button
          type="button"
          variant="destructive"
          size="lg"
          className="gap-2"
          onClick={deleteEverywhere}
          disabled={working || typed.trim() !== CONFIRM_WORD}
        >
          {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {working ? "Deleting..." : "Delete my account everywhere"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DeleteAccount() {
  return (
    <>
      <SEOHead
        title="Delete Your Sober Helpline Account | Sober Helpline"
        description="Delete your Sober Helpline account on the website and in the app, and learn what may be retained for legal or security purposes."
        speakableSelectors={["h1", ".deletion-summary", "h2"]}
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Sober Helpline website and app</p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Delete your account and data
              </h1>
              <p className="deletion-summary mx-auto max-w-3xl text-lg text-muted-foreground">
                This page is the public account-deletion resource for Sober Helpline. You can delete your account here, inside the app, or by email. Deleting it in one place deletes it in both the website and the app.
              </p>
            </div>
          </div>
        </section>

        <main className="container py-10 md:py-14">
          <div className="mx-auto max-w-4xl space-y-6">
            <DeleteAccountNow />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trash2 className="h-5 w-5 text-primary" />
                  Or delete your account in the app
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Open the Sober Helpline app and sign in.</li>
                  <li>Open <strong>Settings</strong>.</li>
                  <li>Scroll to <strong>Delete account</strong>.</li>
                  <li>Read the warning and confirm deletion.</li>
                </ol>
                <p>Deletion begins immediately after the app confirms the request. You will be signed out and the account cannot be restored. Your soberhelpline.com account under the same email address is deleted at the same time.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-5 w-5 text-primary" />
                  Or ask us to do it
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Email us from the address connected to your Sober Helpline account. Use the subject line <strong>Account Deletion Request</strong>. We may ask you to verify account ownership before processing the request.</p>
                <Button asChild size="lg" className="gap-2">
                  <a href="mailto:matt@soberhelpline.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20Sober%20Helpline%20account%20and%20associated%20personal%20data.%20The%20email%20address%20on%20my%20account%20is%3A%20">
                    <Mail className="h-4 w-4" />
                    Initiate deletion request
                  </a>
                </Button>
                <p className="text-sm">If the email button does not open, write to <a className="font-semibold text-primary underline" href="mailto:matt@soberhelpline.com">matt@soberhelpline.com</a>.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-5 w-5 text-primary" />
                  One deletion covers the website and the app
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Your website account and your app account are matched by email address. Deleting your account on
                  this page, or in the app, deletes both.
                </p>
                <p>
                  A website membership billed through PayPal is cancelled as part of the deletion. If PayPal cannot
                  confirm the cancellation, nothing is deleted and you are asked to try again, so you are never left
                  with a deleted account that is still being charged.
                </p>
                <p>
                  If you used a different email address in the app than on the website, delete each one separately,
                  or tell us both addresses by email.
                </p>
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
                <p>When your account is deleted, Sober Helpline deletes or de-identifies account-linked data that is not required to be retained, including:</p>
                <ul className="space-y-2">
                  {[
                    "Your website and app login and account profile",
                    "Website workbook entries, saved tools, learning path and member email preferences",
                    "Saved app plans, check-ins, notes, and family-support records stored in your account",
                    "App support threads, community content, and uploaded attachments associated with your account, subject to safety and legal exceptions",
                    "Push-notification tokens and app preferences associated with your account",
                    "Sober Helpline subscription-entitlement mirror records associated with your account",
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
                <p>Account deletion and app-store billing are separate. Cancel an active subscription in your Apple App Store subscription settings to prevent future renewal. Deleting your Sober Helpline account does not issue an automatic refund.</p>
                <p>Sober Helpline is not an emergency service. If someone is in immediate danger, call 911. For mental-health crisis support in the United States, call or text 988.</p>
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
