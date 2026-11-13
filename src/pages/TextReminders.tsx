import { Link } from "react-router-dom";
import { BellOff, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import { TextReminderOptInForm, TextReminderOptOutForm, useTextRemindersAvailable } from "@/components/TextReminderForms";

/** Turn text reminders for the Monday meeting on or off, any time. */
const TextReminders = () => {
  const available = useTextRemindersAvailable();

  return (
    <>
      <SEOHead
        title="Text Reminders for The Family Squares | Sober Helpline"
        description="Get a text message about an hour before The Family Squares, the free Monday family support meeting, or stop the texts."
      />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground">Text reminders</h1>
        <p className="mt-3 text-muted-foreground">
          One text about an hour before The Family Squares, the free family support meeting every Monday at 7:00 PM
          Pacific. You can turn it on or off here any time.
        </p>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <Smartphone className="h-5 w-5 shrink-0 text-logo-blue" aria-hidden="true" />
              Turn text reminders on
            </p>
            {available ? (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the email address you registered for the meeting with, or your member email. Not registered yet?{" "}
                  <Link to="/family-squares" className="underline">Register for the free meeting</Link> first.
                </p>
                <TextReminderOptInForm source="text_reminders_page" />
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Text reminders are not available right now. You will still get the reminder email an hour before each
                meeting you are registered for.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <BellOff className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              Turn text reminders off
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the number, or simply reply STOP to any text from us.
            </p>
            <TextReminderOptOutForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-sm text-muted-foreground">
          Message and data rates may apply. See our <Link to="/sms-terms" className="underline">SMS terms</Link> and{" "}
          <Link to="/privacy" className="underline">privacy policy</Link>.
        </p>
      </div>
    </>
  );
};

export default TextReminders;
