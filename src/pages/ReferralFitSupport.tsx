import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, Phone, ShieldCheck } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { question: "I cannot sign in. What should I do?", answer: "Check that you are using the email and password for your ReferralFit account. If you still cannot sign in, email support with your account email and the error message. Never send your password or a verification code." },
  { question: "My cases or partners are missing. What should I check?", answer: "Confirm that you are signed in to the correct account and practice workspace, and check your internet connection. Tell support which screen is affected and whether you recently changed workspaces. Avoid deleting or reinstalling the app while you may have unsynced changes." },
  { question: "How do I get help with an invitation or workspace?", answer: "Ask your practice administrator to confirm the invitation is for the intended workspace. Invite codes are single-use, and creating invitations requires Pro. Before changing workspaces, review the app's explanation of what happens to your practice data." },
  { question: "Why are there no eligible placement matches?", answer: "Review your selected level of care, state, insurance network, budget, and therapeutic needs. A combination of filters may exclude all programs in your network. Check partner details and adjust the criteria where appropriate. Always confirm benefits, availability, and suitability directly with the provider." },
  { question: "How do I get help with my plan or billing?", answer: "Email support with your account email, workspace name, and the feature or charge you are asking about. If your subscription was purchased through Apple, you can manage it in your device's Settings under your name, then Subscriptions. Do not include full payment-card details." },
  { question: "Can I use ReferralFit on Apple Watch?", answer: "ReferralFit is designed for iPhone and iPad. There is no Apple Watch companion app at this time." },
];

export default function ReferralFitSupport() {
  return (
    <>
      <SEOHead title="ReferralFit Support | Sober Helpline" description="Get help with ReferralFit sign-in, workspaces, referrals, case files, billing, and technical issues. Contact support by email or phone." canonicalPath="/referralfit-support" faqItems={faqs} />
      <div className="bg-[#F6F4EE] text-[#16352E]">
        <section className="border-b border-[#DDE4DF] bg-[#EDF4EF]">
          <div className="container mx-auto max-w-5xl px-6 py-12 md:py-16">
            <Link to="/referralfit" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1F5A49] hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />About ReferralFit</Link>
            <div className="mb-6 flex items-center gap-3"><img src="/referralfit/icon.png" alt="" width={48} height={48} className="rounded-xl" /><span className="text-lg font-semibold">ReferralFit support</span></div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Help with your app, account, and workspace.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#38564F]">Contact us for help with ReferralFit sign-in, case files, placement matching, referrals, and technical issues.</p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="h-auto min-h-11 whitespace-normal bg-[#1F5A49] py-3 text-white hover:bg-[#16352E]">
                <a href="mailto:support@soberhelpline.com?subject=ReferralFit%20Support"><Mail className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" /><span className="break-all">support@soberhelpline.com</span></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[#9EB7A2] bg-white text-[#16352E] hover:bg-[#DCEAE0]">
                <a href="tel:+14582988008"><Phone className="mr-2 h-4 w-4" aria-hidden="true" />Call (458) 298-8008</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-[#38564F]">Mention ReferralFit so we can direct your request to the right app.</p>
          </div>
        </section>

        <section className="container mx-auto grid max-w-5xl gap-6 px-6 py-12 md:grid-cols-[1.2fr_0.8fr]" aria-labelledby="support-details">
          <div className="rounded-2xl border border-[#DDE4DF] bg-white p-6 md:p-8">
            <h2 id="support-details" className="text-2xl font-bold">Send these details with your request</h2>
            <ul className="mt-6 space-y-4 text-[#38564F]">
              {["The email address on your ReferralFit account and your workspace name", "Your iPhone or iPad model, operating system, and app version", "The screen or feature involved and what you expected to happen", "The error message and the steps that led to it", "A redacted screenshot, if it helps explain the issue"].map((text) => <li key={text} className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1F5A49]" aria-hidden="true" /><span>{text}</span></li>)}
            </ul>
          </div>
          <aside className="rounded-2xl bg-[#DCEAE0] p-6 md:p-8">
            <ShieldCheck className="mb-4 h-7 w-7 text-[#1F5A49]" aria-hidden="true" />
            <h2 className="text-2xl font-bold">Keep client details private</h2>
            <p className="mt-4 leading-relaxed text-[#38564F]">Remove client names, health details, documents, and other sensitive information from screenshots. Use initials or a sample case label when describing an issue.</p>
            <p className="mt-4 leading-relaxed text-[#38564F]">Do not email passwords, verification codes, payment-card numbers, or private client records.</p>
          </aside>
        </section>

        <section className="container mx-auto max-w-5xl px-6 pb-12" aria-labelledby="support-faq">
          <h2 id="support-faq" className="mb-6 text-3xl font-bold">Common questions</h2>
          <Accordion type="single" collapsible className="rounded-2xl border border-[#DDE4DF] bg-white px-6 md:px-8">
            {faqs.map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`question-${index}`} className="border-[#DDE4DF] last:border-b-0">
                <AccordionTrigger className="text-left text-base font-semibold">{question}</AccordionTrigger>
                <AccordionContent className="leading-relaxed text-[#38564F]">{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="container mx-auto max-w-5xl px-6 pb-16" aria-labelledby="support-privacy">
          <div className="rounded-2xl border border-[#DDE4DF] bg-white p-6 md:p-8">
            <h2 id="support-privacy" className="text-2xl font-bold">Account deletion and privacy requests</h2>
            <p className="mt-4 leading-relaxed text-[#38564F]">For account deletion, data access, corrections, or privacy questions, email from the address associated with your ReferralFit account. Include your workspace name and describe your request without attaching client records.</p>
            <a href="mailto:support@soberhelpline.com?subject=ReferralFit%20Account%20or%20Privacy%20Request" className="mt-5 inline-flex font-semibold text-[#1F5A49] underline underline-offset-4">Email an account or privacy request</a>
            <p className="mt-5 text-sm leading-relaxed text-[#38564F]">Looking for support for the separate SoberHelpline family app? Visit <Link to="/support" className="font-semibold underline underline-offset-4">SoberHelpline app support</Link>.</p>
          </div>
        </section>
      </div>
    </>
  );
}
