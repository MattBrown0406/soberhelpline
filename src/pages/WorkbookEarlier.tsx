import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, FileText, Info } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { IconTile, MemberHero, MemberPage } from "@/components/member/MemberUI";
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
      <MemberPage>
        <main className="container mx-auto max-w-3xl px-4 py-4 sm:py-8">
          <Link
            to="/workbook"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            My Workbook
          </Link>
          <MemberHero
            className="mt-2 py-6 sm:py-7"
            eyebrow="My Workbook"
            title="Your earlier worksheets"
            subtitle="These longer worksheets have been replaced by the short guided exercises in My Workbook. Anything you wrote in them is still here."
          />
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-slate-900/[0.04]">
            <IconTile icon={Info} tone="navy" size="sm" />
            <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
              Some open with your answers in place. Three of them (Family Self-Assessment, Control Worksheet and Boundary
              Worksheet) open on a fresh form: look for “View past” inside to see what you saved before.
            </p>
          </div>

          {user && (
            <Accordion type="multiple" className="mt-6 space-y-3">
              {sheets.map((sheet) => (
                <AccordionItem
                  key={sheet.id}
                  value={sheet.id}
                  className="rounded-2xl border border-border/70 bg-card px-4 shadow-sm shadow-slate-900/[0.04] sm:px-5"
                >
                  <AccordionTrigger className="min-h-14 gap-3 rounded-lg py-3 text-left text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card">
                    <span className="flex min-w-0 items-center gap-3">
                      <IconTile icon={FileText} tone="navy" size="sm" />
                      <span className="min-w-0 leading-snug">{title(sheet.id)}</span>
                    </span>
                  </AccordionTrigger>
                  {/* Rendered only when opened, so each worksheet loads its answers on demand. */}
                  <AccordionContent className="pt-2">{sheet.render(user)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </main>
      </MemberPage>
    </>
  );
}
