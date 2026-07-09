import { Link } from "react-router-dom";
import { MessageSquare, ShieldCheck, Ban, HelpCircle } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const smsFaqs = [
  {
    question: "How do I opt in to SMS messages from Sober Helpline?",
    answer:
      "You opt in by providing your mobile number through a Sober Helpline form (such as Monday Family Squares Zoom registration, coaching booking, or account signup) and checking the box agreeing to receive SMS messages. Message frequency varies based on the reason you provided your number.",
  },
  {
    question: "How do I stop receiving SMS messages?",
    answer:
      "Reply STOP to any SMS message from Sober Helpline at any time. You will receive a final confirmation that you have been unsubscribed and no further messages will be sent. Reply HELP for support or email support@soberhelpline.com.",
  },
  {
    question: "How much do SMS messages cost?",
    answer:
      "Sober Helpline does not charge for SMS messages. However, message and data rates from your mobile carrier may apply. Contact your carrier for details about your plan.",
  },
  {
    question: "What kinds of messages will I receive?",
    answer:
      "Messages may include Monday Family Squares Zoom reminders and links, coaching appointment confirmations and reminders, replies from Matt Brown or the support team about your inquiry, and account or membership notifications. We do not send marketing messages to numbers that only opted in for service reminders.",
  },
];

export default function SmsTerms() {
  return (
    <>
      <SEOHead
        title="SMS Terms & Conditions | Sober Helpline"
        description="Terms and conditions for SMS text messages from Sober Helpline, including opt-in, opt-out (STOP), HELP, message frequency, carrier charges, and privacy."
        faqItems={smsFaqs}
        speakableSelectors={["h1", ".sms-summary", "h2"]}
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-4xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                SMS Terms &amp; Conditions
              </p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Sober Helpline SMS Terms &amp; Conditions
              </h1>
              <p className="sms-summary max-w-3xl text-lg text-muted-foreground">
                These terms govern text messages sent by Sober Helpline to mobile numbers that have opted in.
                By providing your mobile number and checking the SMS consent box on a Sober Helpline form, you
                agree to these terms.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Last updated: July 9, 2026
              </p>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto grid max-w-4xl gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>Program description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  Sober Helpline uses SMS to support families affected by addiction. After you opt in,
                  you may receive:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Monday Family Squares Zoom meeting reminders and join links</li>
                  <li>Coaching appointment confirmations, reminders, and rescheduling notices</li>
                  <li>Direct replies from Matt Brown or the Sober Helpline support team</li>
                  <li>Account, membership, and billing notifications</li>
                </ul>
                <p>
                  Message frequency varies based on the reason you provided your number and your
                  activity with Sober Helpline.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Opt-in consent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  You opt in to SMS by entering your mobile number into a Sober Helpline form and
                  affirmatively checking the box agreeing to receive text messages. Consent to receive
                  SMS is not a condition of purchasing any product or service.
                </p>
                <p>
                  Your mobile number and consent are stored securely. Sober Helpline does not share,
                  sell, rent, or lease mobile numbers or SMS opt-in data with third parties for their
                  marketing purposes. Numbers are shared only with the messaging service provider
                  (Twilio) strictly to deliver messages you requested.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Ban className="h-5 w-5 text-primary" />
                <CardTitle>Opt-out (STOP)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  You can cancel SMS messages at any time by replying <strong>STOP</strong> to any
                  message. After you reply STOP, you will receive one final confirmation message and
                  no further texts will be sent.
                </p>
                <p>
                  To resume messages, reply <strong>START</strong> or opt in again through a Sober
                  Helpline form.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle>Help &amp; support (HELP)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  Reply <strong>HELP</strong> to any SMS message for assistance. You can also contact
                  support directly:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Email: <a className="text-primary underline" href="mailto:support@soberhelpline.com">support@soberhelpline.com</a></li>
                  <li>Phone: <a className="text-primary underline" href="tel:4582027900">(458) 202-7900</a></li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carrier charges &amp; supported carriers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  Message and data rates may apply. Sober Helpline does not charge for text messages,
                  but your mobile carrier may charge for messages sent or received according to your
                  plan. Contact your carrier for pricing details.
                </p>
                <p>
                  Supported carriers include AT&amp;T, Verizon Wireless, T-Mobile, Sprint, U.S.
                  Cellular, Boost Mobile, MetroPCS, Cricket, Virgin Mobile, and most other U.S.
                  carriers. Carriers are not liable for delayed or undelivered messages.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  Information collected through the SMS program is handled in accordance with the{" "}
                  <Link to="/privacy" className="text-primary underline">Sober Helpline Privacy Policy</Link>.
                  Mobile opt-in data and consent is never shared with third parties for marketing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to these terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  Sober Helpline may update these SMS Terms &amp; Conditions from time to time. The
                  updated version will be posted on this page with a new "Last updated" date. Continued
                  participation in the SMS program after changes constitutes acceptance of the updated
                  terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Sober Helpline</p>
                <p>Email: <a className="text-primary underline" href="mailto:support@soberhelpline.com">support@soberhelpline.com</a></p>
                <p>Phone: <a className="text-primary underline" href="tel:4582027900">(458) 202-7900</a></p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
