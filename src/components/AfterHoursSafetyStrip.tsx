import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/conversionTracking";

interface AfterHoursSafetyStripProps {
  source: string;
  showTonightLink?: boolean;
}

export default function AfterHoursSafetyStrip({ source, showTonightLink = false }: AfterHoursSafetyStripProps) {
  return (
    <section className="border-y border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/20" aria-label="Family support and emergency routing">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="mx-auto flex max-w-5xl gap-3 md:gap-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
          <div className="min-w-0 text-sm leading-relaxed text-amber-950 dark:text-amber-100/90">
            <p>
              Sober Helpline is family support, not emergency medical care. If someone is in immediate danger, call{" "}
              <a href="tel:911" className="font-semibold underline underline-offset-2">911</a>. If you are in a mental-health crisis, call or text{" "}
              <a href="tel:988" className="font-semibold underline underline-offset-2">988</a>. For family guidance, call{" "}
              <a
                href="tel:+14582988008"
                onClick={() => trackPhoneClick(source)}
                className="font-semibold underline underline-offset-2"
              >
                (458) 298-8008
              </a>{" "}
              or WhatsApp{" "}
              <a
                href="https://wa.me/5038362136"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(source)}
                className="font-semibold underline underline-offset-2"
              >
                +1 503-836-2136
              </a>{" "}
              (including from outside the US). If it can wait, join{" "}
              <Link to="/family-squares" className="font-semibold underline underline-offset-2">
                Family Squares Monday at 7 PM Pacific
              </Link>
              .
            </p>
            {showTonightLink && (
              <p className="mt-2">
                <Link to="/what-to-do-tonight" className="inline-flex items-center gap-1 font-semibold text-logo-blue hover:underline">
                  Need a plan for tonight?
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
