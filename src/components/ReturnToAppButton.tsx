import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOBER_HELPLINE_APP_STORE_URL } from "@/components/AppStoreBadge";
import { appLinksSupported } from "@/lib/webSession";
import { cn } from "@/lib/utils";

// Back to the Sober Helpline app, with the app's own link scheme. Not the
// https://soberhelpline.com/app/... universal links: iOS keeps a tap from a
// soberhelpline.com page to another soberhelpline.com address in Safari.
//
// - App 4.0 (3)+ (this tab saw app_links=1): a deep link to the matching screen.
// - Older builds (4.0 (2) shows "Unmatched Route" for sober-helpline://app/...):
//   plain sober-helpline://, which just opens the app.
// A custom-scheme link does nothing without the app, so callers only show this
// to visitors who came from the app.
const APP_DEEP_LINKS = {
  coachingBooked: "sober-helpline://app/coaching/booked",
  planReview: "sober-helpline://app/plan-review",
} as const;
const APP_OPEN_LINK = "sober-helpline://";

interface ReturnToAppButtonProps {
  /** The app screen to return to (used only when the app understands deep links). */
  destination: keyof typeof APP_DEEP_LINKS;
  className?: string;
}

/** "Return to the Sober Helpline app" — only for visitors who came here from the app. */
export default function ReturnToAppButton({ destination, className }: ReturnToAppButtonProps) {
  const deepLinks = appLinksSupported();
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <Button asChild size="lg" className="w-full gap-2 bg-logo-blue text-white hover:bg-logo-blue/90 sm:w-auto">
        <a href={deepLinks ? APP_DEEP_LINKS[destination] : APP_OPEN_LINK}>
          <Smartphone className="h-5 w-5" aria-hidden="true" />
          {deepLinks ? "Return to the Sober Helpline app" : "Open the Sober Helpline app"}
        </a>
      </Button>
      <p className="text-xs text-muted-foreground">
        App didn't open?{" "}
        <a
          href={SOBER_HELPLINE_APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-logo-blue underline-offset-2 hover:underline"
        >
          Open the App Store
        </a>
      </p>
    </div>
  );
}
