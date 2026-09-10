import kioskLogo from "@/assets/sober-helpline-kiosk-logo.jpg";
import "./FamilySquaresKioskAttract.css";

interface FamilySquaresKioskAttractProps {
  onDismiss: () => void;
}

export default function FamilySquaresKioskAttract({ onDismiss }: FamilySquaresKioskAttractProps) {
  return (
    <button
      type="button"
      className="kiosk-attract"
      onClick={onDismiss}
      aria-label="Tap anywhere to open Family Squares registration"
    >
      <span className="kiosk-attract__scene" aria-hidden="true">
        <span className="kiosk-attract__beam kiosk-attract__beam--one" />
        <span className="kiosk-attract__beam kiosk-attract__beam--two" />
        <span className="kiosk-attract__wave kiosk-attract__wave--one" />
        <span className="kiosk-attract__wave kiosk-attract__wave--two" />
      </span>

      <span className="kiosk-attract__content">
        <img
          className="kiosk-attract__brand"
          src={kioskLogo}
          alt="Sober Helpline — Family Addiction Support and Education"
        />
        <span className="kiosk-attract__title">You care deeply.<br />You don’t have to figure this out alone.</span>
        <span className="kiosk-attract__subtitle">Get education and support for the difficult decisions that come with loving someone affected by addiction.</span>
        <span className="kiosk-attract__details">Family Squares · Mondays at 7:00 PM Pacific · Open to everyone</span>
        <span className="kiosk-attract__tap">Tap to take the next step.</span>
      </span>
    </button>
  );
}
