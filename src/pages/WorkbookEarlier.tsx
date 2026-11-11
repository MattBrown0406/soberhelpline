import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import ControlWorksheet from "@/components/ControlWorksheet";
import BoundaryWorksheet from "@/components/BoundaryWorksheet";
import ScenarioWorksheet from "@/components/ScenarioWorksheet";
import GuiltResponsibilityWorksheet from "@/components/GuiltResponsibilityWorksheet";
import SelfCareWorksheet from "@/components/SelfCareWorksheet";
import TraumaHypervigilanceAssessment from "@/components/TraumaHypervigilanceAssessment";
import { retiredWorksheets } from "@/data/memberLibrary";

// The long worksheets that used to sit on the Education Center. They were
// replaced by the short guided exercises, but nothing a member wrote in them
// is thrown away: they stay here, exactly as they were, for as long as she
// wants them. Each one loads its own saved answers.

const title = (id: string) => retiredWorksheets.find((w) => w.id === id)?.title ?? id;

export default function WorkbookEarlier() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sheets: { id: string; render: (u: User) => JSX.Element }[] = [
    { id: "trauma-assessment", render: (u) => <TraumaHypervigilanceAssessment user={u} /> },
    { id: "worksheet-family-self-assessment", render: (u) => <FamilySelfAssessment user={u} /> },
    { id: "worksheet-control", render: (u) => <ControlWorksheet user={u} /> },
    { id: "worksheet-boundary", render: (u) => <BoundaryWorksheet user={u} /> },
    { id: "worksheet-scenario", render: (u) => <ScenarioWorksheet user={u} /> },
    { id: "worksheet-guilt-responsibility", render: (u) => <GuiltResponsibilityWorksheet user={u} /> },
    { id: "worksheet-self-care", render: (u) => <SelfCareWorksheet user={u} /> },
  ];

  return (
    <>
      <SEOHead title="Your Earlier Worksheets | Sober Helpline Members" description="The longer worksheets you filled in before, kept as you left them." noIndex />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-10">
          <Link
            to="/workbook"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            My Workbook
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Your earlier worksheets</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            These longer worksheets have been replaced by the short guided exercises in My Workbook. Anything you wrote
            in them is still here. Some open with your answers in place. Three of them (Family Self-Assessment, Control
            Worksheet and Boundary Worksheet) open on a fresh form: look for “View past” inside to see what you saved
            before.
          </p>

          {user && (
            <Accordion type="multiple" className="mt-6 space-y-3">
              {sheets.map((sheet) => (
                <AccordionItem key={sheet.id} value={sheet.id} className="rounded-xl border border-border bg-card px-4">
                  <AccordionTrigger className="min-h-12 text-left text-base font-semibold">{title(sheet.id)}</AccordionTrigger>
                  {/* Rendered only when opened, so each worksheet loads its answers on demand. */}
                  <AccordionContent className="pt-2">{sheet.render(user)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </main>
      </div>
    </>
  );
}
