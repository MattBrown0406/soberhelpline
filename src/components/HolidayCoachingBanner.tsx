import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { trackConversionEvent } from "@/lib/conversionTracking";
import "./HolidayCoachingBanner.css";

// Seasonal homepage placement: remove in January 2027 (no scheduled backend job).
const HolidayCoachingBanner = () => (
  <section className="holiday-coaching" aria-labelledby="holiday-coaching-title">
    <svg className="holiday-coaching__seasonal" viewBox="0 0 280 100" fill="none" aria-hidden="true" focusable="false">
      <path d="M8 5C75 65 184 65 272 8" stroke="currentColor" strokeWidth="1" />
      <g className="holiday-coaching__pine" strokeWidth="1.5" strokeLinecap="round">
        <path d="M192 4l76 65M205 16l-2 21m2-21 24-1m-13 12-2 23m2-23 26-1m-14 12-1 22m1-22 25 1m-14 10 1 21m-1-21 23 2" />
        <path d="M245 3l-54 64M233 17l-20-3m20 3 3 20m-15-6-20-1m20 1 3 21m-15-7-19 1m19-1 1 19" />
      </g>
      <g className="holiday-coaching__lights">
        <circle cx="42" cy="29" r="2.5" /><circle cx="86" cy="45" r="2.5" />
        <circle cx="134" cy="49" r="2.5" /><circle cx="180" cy="43" r="2.5" />
        <circle cx="225" cy="29" r="2.5" />
      </g>
    </svg>
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
