import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Moon, PhoneCall, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppLink from "@/components/WhatsAppLink";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";

interface FreeFamilyNextStepsProps {
  source: string;
  showPaidSecondary?: boolean;
}

export default function FreeFamilyNextSteps({ source, showPaidSecondary = true }: FreeFamilyNextStepsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Button asChild className="h-auto justify-start whitespace-normal py-3">
          <Link to="/what-to-do-tonight">
            <Moon className="h-4 w-4 shrink-0" />
            What to do tonight
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start whitespace-normal py-3" onClick={() => trackConversionEvent("monday_zoom_click", { source })}>
          <Link to="/family-squares">
            <Calendar className="h-4 w-4 shrink-0" />
            Family Squares · Monday 7 PM PT
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start whitespace-normal py-3" onClick={() => trackPhoneClick(source)}>
          <a href="tel:+14582988008">
            <PhoneCall className="h-4 w-4 shrink-0" />
            Call (458) 298-8008
          </a>
        </Button>
      </div>
      <WhatsAppLink source={source} variant="button" label="WhatsApp +1 503-836-2136" />
      {showPaidSecondary && (
        <p className="text-sm text-muted-foreground">
          If the situation is higher-risk and you need a private plan,{" "}
          <Link
            to="/family-consultation"
            onClick={() => trackConversionEvent("coaching_click", { source })}
            className="font-semibold text-logo-blue hover:underline"
          >
            book a private consult
          </Link>
          {" "}or{" "}
          <Link
            to="/intervention-help"
            onClick={() => trackConversionEvent("intervention_readiness_click", { source })}
            className="inline-flex items-center gap-1 font-semibold text-logo-blue hover:underline"
          >
            review intervention help
            <Shield className="h-3.5 w-3.5" />
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          . No treatment-center placements are sold here.
        </p>
      )}
    </div>
  );
}
