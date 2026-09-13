import AfterHoursSafetyStrip from "@/components/AfterHoursSafetyStrip";
import { Link } from "react-router-dom";

export default function RegionalFamilySupportOptions({ state }: { state: string }) {
  const linkClass = "font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return (
    <>
    <AfterHoursSafetyStrip source={`regional_${state.toLowerCase()}`} />
    <section aria-label={`Remote support options for ${state} families`} className="py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-logo-blue">Choose the support that fits your family</h2>
        <p className="mt-4 text-muted-foreground">
          You can use Sober Helpline from {state} by phone or online. This is remote family education and coaching, not a local Sober Helpline office or a treatment facility.
        </p>
        <ul className="mt-6 space-y-5 text-muted-foreground">
          <li><Link to="/monday-zoom-registration" className={linkClass}>Free Monday Family Squares</Link>: a weekly online family-support meeting at 7 PM Pacific. Registration is free; check the registration page for the next meeting.</li>
          <li><Link to="/family-membership" className={linkClass}>Family education membership</Link>: paid access to member resources. Review the current price, trial terms, and included resources before joining.</li>
          <li><Link to="/family-coaching" className={linkClass}>Private family coaching</Link>: one-on-one conversations about your family situation. Standard sessions are $150, or $125 for members; confirm the provider, rate, and availability on the <Link to="/book-consultation" className={linkClass}>booking page</Link>. Coaching is booked separately from membership.</li>
          <li><Link to="/family-support" className={linkClass}>Family support hub</Link>: compare resources if you are not ready to choose a paid option.</li>
        </ul>
        <p className="mt-6 text-muted-foreground">
          Looking specifically for an in-person intervention rather than ongoing family support? <a href="https://freedominterventions.com/interventionist" className={linkClass}>Learn about intervention services at Freedom Interventions</a> and discuss availability directly. This page does not promise local staffing or an intervention outcome.
        </p>
      </div>
    </section>
    </>
  );
}
