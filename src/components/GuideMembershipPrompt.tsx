import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackConversionEvent } from "@/lib/conversionTracking";

// The same wording every other page uses for the size of the library.
const librarySize = "60+";

/**
 * Shown to visitors who are not members at the end of a library guide that is
 * open to everyone. The guide stays free to read; this says where it comes
 * from and what membership adds.
 */
const GuideMembershipPrompt = ({ path }: { path: string }) => (
  <aside
    className="container mx-auto max-w-4xl px-4 pb-12 print:hidden"
    aria-label="About the family membership"
  >
    <div className="rounded-2xl border border-logo-blue/25 bg-logo-blue/5 p-6 sm:p-8">
      <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-logo-blue">
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        From the member library
      </p>
      <h2 className="text-lg font-bold text-foreground sm:text-xl">
        This guide is one of {librarySize} in the family membership
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        You can read this one free. Members get the whole library laid out as a path with their place saved,
        a private family forum, and recordings of past Monday meetings. The first seven days are free, then
        it is $9.99 a month.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/family-membership"
          onClick={() => trackConversionEvent("membership_click", { source: "library_guide_end", guide: path })}
        >
          <Button className="w-full gap-2 bg-logo-blue text-white hover:bg-logo-blue/90 sm:w-auto">
            See what membership includes
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
        <Link
          to="/family-squares"
          onClick={() => trackConversionEvent("monday_zoom_click", { source: "library_guide_end" })}
        >
          <Button variant="outline" className="w-full sm:w-auto">
            Or come to the free Monday meeting
          </Button>
        </Link>
      </div>
    </div>
  </aside>
);

export default GuideMembershipPrompt;
