import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { trackConversionEvent } from "@/lib/conversionTracking";
import "./HolidayCoachingBanner.css";

// Seasonal homepage placement: remove in January 2027 (no scheduled backend job).
const HolidayCoachingBanner = () => (
  <section className="holiday-coaching" aria-labelledby="holiday-coaching-title">
    <div className="holiday-coaching__inner">
      <div className="holiday-coaching__copy">
        <p className="holiday-coaching__eyebrow"><CalendarDays aria-hidden="true" /> Holiday family planning</p>
        <h2 id="holiday-coaching-title">Make a plan before the holiday gathering.</h2>
        <p className="holiday-coaching__description">Use a focused private coaching session to talk through invitations, boundaries, money, and communication—and work toward a shared family plan.</p>
      </div>
      <div className="holiday-coaching__action">
        <Link
          to="/book-consultation?plan=single"
          className="holiday-coaching__link"
          onClick={() => trackConversionEvent("coaching_click", { source: "homepage_holiday_coaching" })}
        >
          <span>Plan your holiday coaching session</span><ArrowRight aria-hidden="true" />
        </Link>
        <p>Existing paid coaching · Choose your provider and review session details at booking.</p>
      </div>
    </div>
  </section>
);

export default HolidayCoachingBanner;
