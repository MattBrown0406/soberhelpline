import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, NotebookPen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { describeSavedKey, savedTools } from "@/data/savedTools";
import { EARLIER_WORKSHEETS_PATH, retiredWorksheets } from "@/data/memberLibrary";

// My Workbook, second half: the fillable plans, check-ins and checklists (each
// saves automatically on its own page) and the notes she has written on guides.

interface SavedRow {
  worksheet_key: string;
  updated_at: string;
}

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
      const { data } = await supabase
        .from("worksheet_responses")
        .select("worksheet_key, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (cancelled) return;
      const saved = (data ?? []) as SavedRow[];
      setRows(saved);
      const retiredKeys = new Set(retiredWorksheets.map((w) => w.worksheetKey).filter(Boolean));
      if (saved.some((r) => retiredKeys.has(r.worksheet_key))) {
        setHasEarlier(true);
        return;
      }
      // Three of the long worksheets saved to their own tables.
      const counts = await Promise.all(
        (["family_assessments", "family_control_worksheets", "family_boundary_worksheets"] as const).map((table) =>
          supabase.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId),
        ),
      );
      if (!cancelled && counts.some((c) => !c.error && (c.count ?? 0) > 0)) setHasEarlier(true);
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
      <section aria-labelledby="wb-plans" className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="wb-plans" className="text-xl font-semibold text-foreground">
            Plans, check-ins and checklists
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          These save automatically as you fill them in. Come back and update them any time, and print them when you
          need a copy.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {savedTools.map((tool) => {
            const at = savedAt.get(tool.key);
            return (
              <li key={tool.key}>
                <Link
                  to={tool.path}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">{tool.kind}</span>
                  <span className="font-semibold leading-snug text-foreground group-hover:text-primary">{tool.title}</span>
                  <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{tool.summary}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {at ? `Saved ${savedOn(at)} · Open` : "Start"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {hasEarlier && (
        <p className="mb-12 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          Looking for the longer worksheets you filled in before? They have been replaced by the short exercises above,
          but what you wrote is still here:{" "}
          <Link to={EARLIER_WORKSHEETS_PATH} className="font-medium text-primary underline-offset-2 hover:underline">
            your earlier worksheets
          </Link>
          .
        </p>
      )}

      {notes.length > 0 && (
        <section aria-labelledby="wb-notes" className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 id="wb-notes" className="text-xl font-semibold text-foreground">
              Your notes on guides
            </h2>
          </div>
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {notes.map(({ row, info }) => (
              <li key={row.worksheet_key}>
                <Link
                  to={info!.path}
                  className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="font-medium text-foreground">{info!.title.replace(/^Your notes: /, "")}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">Saved {savedOn(row.updated_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
