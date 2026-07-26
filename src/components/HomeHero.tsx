import { ArrowRight, CalendarDays, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.png";
import SoberHelplineAppStoreBadge from "@/components/SoberHelplineAppStoreBadge";
import { trackConversionEvent } from "@/lib/conversionTracking";
import "./HomeHero.css";

const supportRoutes = [
  {
    eyebrow: "START FREE",
    title: "Family Squares",
    description: "A live room for families every Monday at 7 PM Pacific.",
    cta: "Join Monday support",
    to: "/family-squares",
    icon: CalendarDays,
    event: "monday_zoom_click",
  },
  {
    eyebrow: "NEED ANSWERS NOW",
    title: "Private guidance",
    description: "One-on-one help when waiting until Monday is not realistic.",
    cta: "Book a private session",
    to: "/family-consultation",
    icon: MessageCircle,
    event: "coaching_click",
  },
  {
    eyebrow: "RISK IS RISING",
    title: "Intervention readiness",
    description: "Know when the situation needs a coordinated professional response.",
    cta: "Check intervention fit",
    to: "/intervention-help",
    icon: ShieldCheck,
    event: "intervention_readiness_click",
  },
] as const;

const HomeHero = () => {
  return (
    <section className="shl-hero" aria-labelledby="shl-hero-title">
      <div className="shl-stars" aria-hidden="true" />
      <div className="shl-horizon-glow" aria-hidden="true" />

      <div className="shl-inner">
        <div className="shl-main">
          <div className="shl-copy">
            <div className="shl-eyebrow">
              <img src={logo} alt="" aria-hidden="true" />
              <span>When addiction clouds the way forward</span>
            </div>

            <h1 id="shl-hero-title">
              Find your guiding light
              <span>through the storm of addiction.</span>
            </h1>

            <p className="shl-lead hero-description">
              When addiction leaves your family feeling lost, Sober Helpline helps you see what comes next—free live support, private guidance when it cannot wait, and a clear path forward when risk is rising.
            </p>

            <div className="shl-actions">
              <Link
                to="/family-squares"
                className="shl-button shl-button-primary"
                onClick={() => trackConversionEvent("monday_zoom_click", { source: "homepage_lighthouse_hero_primary" })}
              >
                <CalendarDays aria-hidden="true" />
                Join free Monday support
              </Link>
              <a
                href="tel:4582988008"
                className="shl-button shl-button-secondary"
                onClick={() => trackConversionEvent("phone_click", { source: "homepage_lighthouse_hero" })}
              >
                <Phone aria-hidden="true" />
                Call (458) 298-8008
              </a>
            </div>

            <div className="shl-trust-line">
              <span><i aria-hidden="true" /> No shame</span>
              <span><i aria-hidden="true" /> No referral pressure</span>
              <span><i aria-hidden="true" /> Family-first support</span>
            </div>
          </div>

          <div className="shl-scene" aria-label="An animated lighthouse casting a rotating beam across the water">
            <div className="shl-moon" aria-hidden="true" />
            <div className="shl-beam shl-beam-left" aria-hidden="true" />
            <div className="shl-beam shl-beam-right" aria-hidden="true" />
            <div className="shl-beacon-haze" aria-hidden="true" />

            <div className="shl-lighthouse" aria-hidden="true">
              <div className="shl-roof"><span /></div>
              <div className="shl-lantern-room">
                <span className="shl-lamp-core" />
                <span className="shl-lamp-flare" />
              </div>
              <div className="shl-railing" />
              <div className="shl-tower">
                <span className="shl-window shl-window-one" />
                <span className="shl-window shl-window-two" />
                <span className="shl-door" />
              </div>
            </div>

            <div className="shl-cliffs" aria-hidden="true">
              <span /><span /><span /><span />
            </div>

            <div className="shl-water" aria-hidden="true">
              <span className="shl-wave shl-wave-one" />
              <span className="shl-wave shl-wave-two" />
              <span className="shl-wave shl-wave-three" />
              <span className="shl-reflection" />
            </div>

            <div className="shl-live-card">
              <span className="shl-live-dot" aria-hidden="true" />
              <span>
                <small>YOUR FIRST SAFE HARBOR</small>
                <strong>Free Family Squares</strong>
                <em>Monday · 7 PM Pacific</em>
              </span>
            </div>

            <div className="shl-app-card">
              <div>
                <small>TAKE SUPPORT WITH YOU</small>
                <strong>The Sober Helpline app</strong>
              </div>
              <SoberHelplineAppStoreBadge height={34} source="homepage_lighthouse_hero_app" />
            </div>
          </div>
        </div>

        <div className="shl-routes" aria-label="Choose a support path">
          <div className="shl-routes-heading">
            <span>Choose your starting point</span>
            <small>Each path begins with the same promise: honest help without pressure.</small>
          </div>
          <div className="shl-route-grid">
            {supportRoutes.map((route) => (
              <Link
                key={route.title}
                to={route.to}
                className="shl-route"
                onClick={() => trackConversionEvent(route.event, { source: "homepage_lighthouse_route", label: route.title })}
              >
                <span className="shl-route-icon"><route.icon aria-hidden="true" /></span>
                <span className="shl-route-copy">
                  <small>{route.eyebrow}</small>
                  <strong>{route.title}</strong>
                  <em>{route.description}</em>
                </span>
                <span className="shl-route-arrow" aria-label={route.cta}><ArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
