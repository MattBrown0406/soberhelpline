import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowRight, ClipboardList, Flag, Gauge, HeartHandshake, History, Home, Megaphone, NotebookPen, PenLine, Search, Wind,
  type LucideIcon,
} from "lucide-react";
import { IconTile, KindPill, SectionHeading, TONE, toneForKind } from "@/components/member/MemberUI";
import { supabase } from "@/integrations/supabase/client";
import { describeSavedKey, savedTools } from "@/data/savedTools";
import { EARLIER_WORKSHEETS_PATH, retiredWorksheets } from "@/data/memberLibrary";

// My Workbook, second half: the fillable plans, check-ins and checklists (each
// saves automatically on its own page) and the notes she has written on guides.

interface SavedRow {
  worksheet_key: string;
  updated_at: string;
}

// A picture for each tool, so she can find the one she wants at a glance.
const TOOL_ICONS: Record<string, LucideIcon> = {
  "tool:family-action-plan": HeartHandshake,
  "tool:readiness-checklist": Gauge,
  "tool:relapse-warning-signs": Activity,
  "tool:aftercare-checklist": Home,
  "tool:treatment-red-flags": Flag,
  "tool:family-advocacy-toolkit": Megaphone,
  "tool:fear-inventory": Search,
  "tool:emotional-regulation": Wind,
};

const savedOn = (iso: string) =>
  new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

export default function SavedToolsList() {
  const [rows, setRows] = useState<SavedRow[] | null>(null);
  // Whether she wrote anything in the long worksheets that were retired.
  const [hasEarlier, setHasEarlier] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        if (!cancelled) setRows([]);
        return;
      }
      const { data, error: rowsError } = await supabase
        .from("worksheet_responses")
        .select("worksheet_key, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (cancelled) return;
      const saved = (data ?? []) as SavedRow[];
      setRows(saved);
      const retiredKeys = new Set(retiredWorksheets.map((w) => w.worksheetKey).filter(Boolean));
      // If we couldn't check, show the link: hiding the only way to her
      // earlier writing because of a blip would be worse than an empty page.
      if (rowsError || saved.some((r) => retiredKeys.has(r.worksheet_key))) {
        setHasEarlier(true);
        return;
      }
      // Three of the long worksheets saved to their own tables.
      const counts = await Promise.all(
        (["family_assessments", "family_control_worksheets", "family_boundary_worksheets"] as const).map((table) =>
          supabase.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId),
        ),
      );
      if (!cancelled && counts.some((c) => !!c.error || (c.count ?? 0) > 0)) setHasEarlier(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const savedAt = new Map((rows ?? []).map((r) => [r.worksheet_key, r.updated_at]));
  const notes = (rows ?? [])
    .map((r) => ({ row: r, info: describeSavedKey(r.worksheet_key) }))
    .filter((x) => x.info && (x.info.kind === "Notes" || x.row.worksheet_key.startsWith("guide:")));

  return (
    <>
      <section aria-labelledby="wb-plans" className="space-y-4">
        <SectionHeading
          id="wb-plans"
          icon={ClipboardList}
          tone="navy"
          title="Plans, check-ins and checklists"
          description="These save automatically as you fill them in. Come back and update them any time, and print them when you need a copy."
        />
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {savedTools.map((tool) => {
            const at = savedAt.get(tool.key);
            const tone = toneForKind(tool.kind);
            return (
              <li key={tool.key}>
                <Link
                  to={tool.path}
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-slate-900/[0.04] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none sm:p-5"
                >
                  <span className="flex items-start justify-between gap-3">
                    <IconTile icon={TOOL_ICONS[tool.key] ?? ClipboardList} tone={tone} />
                    <KindPill tone={tone}>{tool.kind}</KindPill>
                  </span>
                  <span className="mt-3 block font-semibold leading-snug text-foreground">{tool.title}</span>
                  <span className="mt-1 block flex-1 text-sm leading-relaxed text-muted-foreground">{tool.summary}</span>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${TONE[tone].text}`}>
                    {at ? `Saved ${savedOn(at)} · Open` : "Start"}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {hasEarlier && (
        <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-slate-900/[0.04]">
          <IconTile icon={History} tone="navy" size="sm" />
          <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
            Looking for the longer worksheets you filled in before? They have been replaced by the short exercises above,
            but what you wrote is still here:{" "}
            <Link
              to={EARLIER_WORKSHEETS_PATH}
              className="rounded font-semibold text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              your earlier worksheets
            </Link>
            .
          </p>
        </div>
      )}

      {notes.length > 0 && (
        <section aria-labelledby="wb-notes" className="space-y-4">
          <SectionHeading id="wb-notes" icon={NotebookPen} tone="rose" title="Your notes on guides" />
          <ul className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm shadow-slate-900/[0.04]">
            {notes.map(({ row, info }) => (
              <li key={row.worksheet_key}>
                <Link
                  to={info!.path}
                  className="flex min-h-14 items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <IconTile icon={PenLine} tone="rose" size="sm" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="font-medium leading-snug text-foreground">{info!.title.replace(/^Your notes: /, "")}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">Saved {savedOn(row.updated_at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
