import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FreeConsultationCTAProps {
  compact?: boolean;
}

export default function FreeConsultationCTA({ compact = false }: FreeConsultationCTAProps) {
  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-sky-600 p-4 md:p-6 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-base md:text-lg font-bold">Unsure where to start?</h3>
              <p className="text-xs md:text-sm text-white/80 mt-0.5">Take a quick family assessment to find the right next step.</p>
            </div>
          </div>
          <Link to="/family-situation-assessment" className="flex-shrink-0">
            <Button variant="secondary" size="sm" className="font-semibold whitespace-nowrap">
              Take the Assessment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 via-teal-50 to-sky-50 dark:from-sky-950/40 dark:via-teal-950/30 dark:to-sky-950/40 border border-sky-200 dark:border-sky-800/50 p-6 md:p-8 shadow-sm">
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-700/50 mb-4">
          <ClipboardCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-sky-800 dark:text-sky-300 mb-2">
          Not Sure Where to Start?
        </h2>
        <p className="text-sm md:text-base font-medium text-sky-700 dark:text-sky-400 mb-3">
          Take a quick family assessment — no account needed.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Answer a few simple questions about your situation and we'll point you to the resources, tools, and next steps that fit your family best. No sign-up required.
        </p>
        <Link to="/family-situation-assessment">
          <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Take the Family Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
}
