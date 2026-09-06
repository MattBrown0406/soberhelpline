import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, Check, FolderOpen, Mail, Network, Search, Smartphone, TrendingUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const features = [
  { icon: CalendarCheck, title: "Know what needs attention", description: "Start with Today: overdue actions, scheduled calls, consultations, and partners due for a check-in." },
  { icon: Search, title: "Find a placement that fits", description: "Compare programs by level of care, location, insurance, budget, and therapeutic needs. Client fit comes first." },
  { icon: FolderOpen, title: "Keep each case together", description: "Bring family contacts, notes, documents, payments, and the case timeline into one place." },
  { icon: Network, title: "Stay connected to your network", description: "Keep program details close, log relationship activity, and set a cadence for staying in touch." },
  { icon: ArrowRight, title: "Follow every referral", description: "Track inbound and outbound introductions, prepare placement packets, and record what happens next." },
  { icon: TrendingUp, title: "See your practice clearly", description: "The Pro business dashboard brings together your case pipeline, lead sources, collected revenue, and referral outcomes." },
];

const previews = [
  { image: "placement", title: "Start with the right fit", caption: "Save client criteria and compare eligible programs." },
  { image: "cases", title: "One family. One place.", caption: "Keep case details organized from the first call." },
  { image: "business", title: "See the bigger picture", caption: "Review pipeline and revenue with the Pro dashboard." },
];

export default function ReferralFit() {
  return (
    <>
      <SEOHead
        title="ReferralFit | Referral & Case Management"
        description="Organize referrals, family cases, placement matches, and follow-ups with ReferralFit. Professional tools for intervention and treatment coordination."
        canonicalPath="/referralfit"
      />
      <div className="bg-[#F6F4EE] text-[#16352E]">
        <section className="overflow-hidden bg-[#16352E] text-white">
          <div className="container mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <img src="/referralfit/icon.png" alt="" width={56} height={56} className="rounded-2xl" />
                <span className="text-2xl font-bold tracking-tight">ReferralFit</span>
              </div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D7AD58]">For the professionals helping families move forward</p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Keep every next step in view.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#DCEAE0]">Referrals, family cases, and follow-ups belong together. ReferralFit helps intervention professionals and care coordinators stay organized from the first call to the next placement.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="h-auto min-h-11 whitespace-normal bg-[#DCEAE0] py-3 text-[#16352E] hover:bg-white">
                  <a href="mailto:support@soberhelpline.com?subject=ReferralFit%20Information"><Mail className="mr-2 h-4 w-4" aria-hidden="true" />Contact us about ReferralFit</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link to="/referralfit-support">App support<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </Button>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm text-[#DCEAE0]"><Smartphone className="h-4 w-4" aria-hidden="true" />Designed for iPhone and iPad</p>
            </div>
            <figure className="mx-auto w-full max-w-[300px] md:max-w-[330px]">
              <img src="/referralfit/today.webp" alt="ReferralFit Today screen with an overdue admissions call and scheduled family follow-ups" width={828} height={1792} fetchPriority="high" className="w-full rounded-[2rem] border border-white/20 shadow-2xl" />
              <figcaption className="mt-4 text-center text-xs text-[#DCEAE0]">App preview with fictional sample data.</figcaption>
            </figure>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-6 py-14 md:py-20" aria-labelledby="referralfit-features">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#1F5A49]">A clearer working day</p>
            <h2 id="referralfit-features" className="text-3xl font-bold tracking-tight md:text-4xl">Less searching. More follow-through.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-[#DDE4DF] bg-white p-7">
                <div className="mb-5 inline-flex rounded-xl bg-[#EDF4EF] p-3"><Icon className="h-6 w-6 text-[#1F5A49]" aria-hidden="true" /></div>
                <h3 className="mb-3 text-xl font-semibold">{title}</h3>
                <p className="leading-relaxed text-[#38564F]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#DDE4DF] bg-white" aria-labelledby="referralfit-preview">
          <div className="container mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 id="referralfit-preview" className="text-3xl font-bold tracking-tight md:text-4xl">A closer look at ReferralFit</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#38564F]">Explore the tools behind a more organized practice. Screens show fictional sample data; features and access depend on your workspace plan.</p>
            <div className="mt-10 grid gap-10 sm:grid-cols-3">
              {previews.map(({ image, title, caption }) => (
                <figure key={image} className="mx-auto w-full max-w-[310px]">
                  <a href={`/referralfit/${image}.webp`} aria-label={`View larger screenshot: ${title}`} className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F5A49]">
                    <img src={`/referralfit/${image}.webp`} alt={`ReferralFit app preview: ${title}`} width={828} height={1792} loading="lazy" className="w-full rounded-2xl shadow-lg" />
                  </a>
                  <figcaption className="mt-5"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#38564F]">{caption}</p></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 md:py-20" aria-labelledby="referralfit-fit">
          <div>
            <h2 id="referralfit-fit" className="text-3xl font-bold tracking-tight">Client fit comes first.</h2>
            <p className="mt-5 leading-relaxed text-[#38564F]">ReferralFit ranks placement options using the needs you select. Relationship history is a tie-breaker only when fit is equal. Verify program availability, benefits, and clinical suitability with the provider before making a placement.</p>
          </div>
          <div className="rounded-2xl bg-[#DCEAE0] p-7">
            <h3 className="text-xl font-semibold">Built around your practice</h3>
            <ul className="mt-5 space-y-4">
              {["Reusable, de-identified placement profiles", "A shared workspace for your practice", "Next steps linked to the cases they belong to"].map((text) => <li key={text} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /><span>{text}</span></li>)}
            </ul>
            <p className="mt-6 text-sm text-[#38564F]">Team invitations and full business analytics require Pro. Directory and benchmark access depend on your workspace plan.</p>
          </div>
        </section>

        <section className="bg-[#16352E] px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Have a question about ReferralFit?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#DCEAE0]">Ask about the app or get help with your account, workspace, and day-to-day tools.</p>
          <Link to="/referralfit-support" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#DCEAE0] px-6 py-3 font-semibold text-[#16352E] hover:bg-white">Visit ReferralFit support<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </section>
      </div>
    </>
  );
}
