import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import exerciseData from "../../../supabase/functions/_shared/memberExercises.json";

interface WeekRow {
  week_start: string;
  members_visited: number;
  active_members: number;
  new_members: number;
  guides_started: number;
  guides_completed: number;
  exercises_started: number;
  exercises_completed: number;
  worksheets_edited: number;
  forum_threads: number;
  forum_replies: number;
  paths_chosen: number;
}

interface BreakdownRow {
  section: "snapshot" | "exercise" | "library";
  label: string | null;
  started: number | null;
  completed: number | null;
}

const exerciseTitles: Record<string, string> = Object.fromEntries(
  (exerciseData.exercises as Array<{ id: string; title: string }>).map((e) => [e.id, e.title]),
);

const n = (value: number | null | undefined) => Number(value ?? 0);

const weekLabel = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "–");

/**
 * Members-only usage, computed in the database (no 1,000-row cap). Weeks are
 * Monday–Sunday, Pacific time. Public guide traffic is in Guide Analytics.
 */
export function MemberEngagement() {
  const [weeks, setWeeks] = useState("12");
  const [days, setDays] = useState("30");
  const [series, setSeries] = useState<WeekRow[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [seriesRes, breakdownRes] = await Promise.all([
      untypedSupabase.rpc("get_member_engagement", { p_weeks: Number(weeks) }),
      untypedSupabase.rpc("get_member_engagement_breakdown", { p_days: Number(days) }),
    ]);
    const failure = seriesRes.error ?? breakdownRes.error;
    if (failure) {
      const missing = failure.code === "PGRST202" || failure.code === "42883" || failure.code === "42P01";
      setError(
        missing
          ? "This report needs the 2026-11-10 member-area database update. Run that Lovable prompt, then reload."
          : `Couldn't load the report: ${failure.message}`,
      );
      setSeries([]);
      setBreakdown([]);
    } else {
      setSeries(((seriesRes.data as unknown) as WeekRow[]) ?? []);
      setBreakdown(((breakdownRes.data as unknown) as BreakdownRow[]) ?? []);
    }
    setLoading(false);
  }, [weeks, days]);

  useEffect(() => {
    load();
  }, [load]);

  const snapshot = breakdown.filter((r) => r.section === "snapshot");
  const activeNow = n(snapshot.find((r) => r.label === "Active members")?.started);
  const exercises = breakdown.filter((r) => r.section === "exercise");
  const library = breakdown.filter((r) => r.section === "library");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground flex-1 min-w-[240px]">
          Members only, counted in the database. Weeks run Monday–Sunday, Pacific time. Visits are counted once per
          member per day when they open any member page.
        </p>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-[150px]" aria-label="Breakdown period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
        <Select value={weeks} onValueChange={setWeeks}>
          <SelectTrigger className="w-[150px]" aria-label="Weeks shown">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">8 weeks</SelectItem>
            <SelectItem value="12">12 weeks</SelectItem>
            <SelectItem value="26">26 weeks</SelectItem>
            <SelectItem value="52">52 weeks</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading member engagement…
        </div>
      ) : error ? (
        <p className="text-sm text-destructive py-4">{error}</p>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Members right now, and what they did in the period</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measure</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead className="text-right">Share of active members</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.map((row) => (
                    <TableRow key={row.label ?? ""}>
                      <TableCell>{row.label}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(row.started)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {row.label === "Active members" ? "" : pct(n(row.started), activeNow)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-2">
                "Have chosen a path" is current, not limited to the period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Week by week</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week of</TableHead>
                    <TableHead className="text-right">Visited</TableHead>
                    <TableHead className="text-right">Did anything</TableHead>
                    <TableHead className="text-right">New members</TableHead>
                    <TableHead className="text-right">Guides started / done</TableHead>
                    <TableHead className="text-right">Exercises started / done</TableHead>
                    <TableHead className="text-right">Long worksheets edited</TableHead>
                    <TableHead className="text-right">Forum threads / replies</TableHead>
                    <TableHead className="text-right">Paths chosen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {series.map((w) => (
                    <TableRow key={w.week_start}>
                      <TableCell className="whitespace-nowrap">{weekLabel(w.week_start)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.members_visited)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.active_members)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.new_members)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.guides_started)} / {n(w.guides_completed)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.exercises_started)} / {n(w.exercises_completed)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.worksheets_edited)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.forum_threads)} / {n(w.forum_replies)}</TableCell>
                      <TableCell className="text-right tabular-nums">{n(w.paths_chosen)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-2">
                The current week is partial. "Did anything" = visited, read, did an exercise or worksheet, or posted.
                Long worksheets only record their latest save, so earlier weeks undercount them.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Guided exercises</CardTitle>
              </CardHeader>
              <CardContent>
                {exercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No guided exercises started yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exercise</TableHead>
                        <TableHead className="text-right">Started</TableHead>
                        <TableHead className="text-right">Finished</TableHead>
                        <TableHead className="text-right">Finish rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exercises
                        .slice()
                        .sort((a, b) => n(b.started) - n(a.started))
                        .map((row) => (
                          <TableRow key={row.label ?? ""}>
                            <TableCell>{exerciseTitles[row.label ?? ""] ?? row.label}</TableCell>
                            <TableCell className="text-right tabular-nums">{n(row.started)}</TableCell>
                            <TableCell className="text-right tabular-nums">{n(row.completed)}</TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {pct(n(row.completed), n(row.started))}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  "Finished" counts every completion, including retakes, so it can exceed "Started".
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Most-used library pages</CardTitle>
              </CardHeader>
              <CardContent>
                {library.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No library activity in this period.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead className="text-right">Started</TableHead>
                        <TableHead className="text-right">Marked done</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {library.map((row, i) => (
                        <TableRow key={`${row.label}-${i}`}>
                          <TableCell>{row.label}</TableCell>
                          <TableCell className="text-right tabular-nums">{n(row.started)}</TableCell>
                          <TableCell className="text-right tabular-nums">{n(row.completed)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default MemberEngagement;
