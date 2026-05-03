import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, CalendarCheck, MousePointerClick, RefreshCw, Route, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TimeRange = "7d" | "30d" | "90d" | "all";

interface ConversionEventRow {
  id: string;
  event_name: string;
  page_path: string | null;
  source: string | null;
  label: string | null;
  target_href: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  referrer: string | null;
  first_landing_path: string | null;
  created_at: string;
}

interface QueryResult {
  data: ConversionEventRow[] | null;
  error: { message?: string } | null;
}

interface UntypedQuery {
  select(columns: string): UntypedQuery;
  gte(column: string, value: string): UntypedQuery;
  order(column: string, options: { ascending: boolean }): UntypedQuery;
  limit(count: number): Promise<QueryResult>;
}

interface UntypedSupabase {
  from(table: string): UntypedQuery;
}

const rangeLabels: Record<TimeRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  all: "All time",
};

const formatPercent = (numerator: number, denominator: number) =>
  denominator > 0 ? `${((numerator / denominator) * 100).toFixed(1)}%` : "0.0%";

const isNmeEvent = (event: ConversionEventRow) =>
  event.utm_source === "nomoreenabling" ||
  event.first_landing_path === "/from-no-more-enabling" ||
  event.page_path === "/from-no-more-enabling" ||
  event.source?.includes("nme") ||
  event.source?.includes("no_more_enabling") ||
  event.referrer?.includes("nomoreenabling.com");

const eventCount = (events: ConversionEventRow[], names: string[]) =>
  events.filter((event) => names.includes(event.event_name)).length;

export function NmeFunnelReport() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [events, setEvents] = useState<ConversionEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    let query = (supabase as unknown as UntypedSupabase)
      .from("conversion_events")
      .select("id, event_name, page_path, source, label, target_href, utm_source, utm_medium, utm_campaign, utm_content, referrer, first_landing_path, created_at");

    if (timeRange !== "all") {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - days);
      query = query.gte("created_at", since.toISOString());
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(1000);

    if (error) {
      setErrorMessage(error.message || "Could not load conversion events.");
      setEvents([]);
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  }, [timeRange]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const report = useMemo(() => {
    const nmeEvents = events.filter(isNmeEvent);
    const bridgeArrivals = eventCount(nmeEvents, ["nme_bridge_arrival"]);
    const bridgeLaneClicks = eventCount(nmeEvents, ["nme_bridge_lane_click"]);
    const familySquaresClicks = eventCount(nmeEvents, ["nme_bridge_family_squares_click"]);
    const registrationViews = eventCount(nmeEvents, ["monday_zoom_registration_view"]);
    const registrations = eventCount(nmeEvents, ["monday_zoom_registration_success", "monday_zoom_registration_submit"]);
    const coachingClicks = eventCount(nmeEvents, ["nme_bridge_coaching_click", "coaching_click"]);
    const interventionClicks = eventCount(nmeEvents, ["nme_bridge_intervention_click", "intervention_readiness_click"]);
    const leadMagnetSignups = eventCount(nmeEvents, ["lead_magnet_signup"]);

    const sourceRows = Object.entries(
      nmeEvents.reduce<Record<string, { arrivals: number; clicks: number; registrations: number }>>((acc, event) => {
        const key = event.utm_content || event.source || event.page_path || "unknown";
        if (!acc[key]) acc[key] = { arrivals: 0, clicks: 0, registrations: 0 };
        if (event.event_name === "nme_bridge_arrival") acc[key].arrivals += 1;
        if (["nme_bridge_lane_click", "nme_bridge_family_squares_click", "nme_bridge_coaching_click", "nme_bridge_intervention_click"].includes(event.event_name)) {
          acc[key].clicks += 1;
        }
        if (["monday_zoom_registration_success", "monday_zoom_registration_submit"].includes(event.event_name)) {
          acc[key].registrations += 1;
        }
        return acc;
      }, {}),
    )
      .map(([source, counts]) => ({ source, ...counts }))
      .sort((a, b) => b.clicks + b.registrations - (a.clicks + a.registrations))
      .slice(0, 8);

    return {
      nmeEvents,
      bridgeArrivals,
      bridgeLaneClicks,
      familySquaresClicks,
      registrationViews,
      registrations,
      coachingClicks,
      interventionClicks,
      leadMagnetSignups,
      sourceRows,
    };
  }, [events]);

  const cards = [
    {
      label: "Bridge Arrivals",
      value: report.bridgeArrivals,
      note: "Visits to /from-no-more-enabling",
      icon: Route,
    },
    {
      label: "Bridge Clicks",
      value: report.bridgeLaneClicks,
      note: `${formatPercent(report.bridgeLaneClicks, report.bridgeArrivals)} of bridge arrivals`,
      icon: MousePointerClick,
    },
    {
      label: "Family Squares Clicks",
      value: report.familySquaresClicks,
      note: `${formatPercent(report.familySquaresClicks, report.bridgeArrivals)} of bridge arrivals`,
      icon: Users,
    },
    {
      label: "Registration Views",
      value: report.registrationViews,
      note: "NME-attributed registration page views",
      icon: BarChart3,
    },
    {
      label: "Registrations",
      value: report.registrations,
      note: `${formatPercent(report.registrations, report.registrationViews)} of registration views`,
      icon: CalendarCheck,
    },
  ];

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading NME funnel report...</p>;
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">NME funnel report is waiting on the backend table/function.</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">No More Enabling Funnel Report</h2>
          <p className="text-sm text-muted-foreground">
            Tracks the handoff from NME readers into Sober Helpline, Family Squares, private coaching, and intervention readiness.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(rangeLabels) as TimeRange[]).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
            >
              {rangeLabels[range]}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => void fetchEvents()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{card.value.toLocaleString()}</p>
                <p className="mt-2 text-xs text-muted-foreground">{card.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Decision Lanes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 text-sm">
              <span>Private coaching clicks</span>
              <strong>{report.coachingClicks.toLocaleString()}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 text-sm">
              <span>Intervention readiness clicks</span>
              <strong>{report.interventionClicks.toLocaleString()}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 text-sm">
              <span>Bridge lead magnet signups</span>
              <strong>{report.leadMagnetSignups.toLocaleString()}</strong>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best NME Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {report.sourceRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No No More Enabling-attributed events yet.</p>
            ) : (
              <div className="space-y-3">
                {report.sourceRows.map((row) => (
                  <div key={row.source} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{row.source}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{row.arrivals} arrivals</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{row.clicks} clicks</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{row.registrations} registrations</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
