import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeDollarSign, CalendarCheck, Crown, Handshake, HelpCircle, MousePointerClick, RefreshCw, Target, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { revenueLadder } from "@/data/revenueLadder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TimeRange = "7d" | "30d" | "90d" | "all";

interface ZoomRegistrationRow {
  id: string;
  created_at: string;
  lead_score?: number | null;
  lead_tier?: string | null;
  revenue_path?: string | null;
  nme_attributed?: boolean | null;
  request_follow_up?: boolean | null;
  next_revenue_action?: string | null;
}

interface ConsultationBookingRow {
  id: string;
  created_at: string;
  amount_paid: number | null;
  status: string | null;
}

interface AbandonedBookingRow {
  id: string;
  created_at: string;
  plan_type: string | null;
  completed: boolean | null;
}

interface ConversionEventRow {
  id: string;
  created_at: string;
  event_name: string;
  utm_source: string | null;
  page_path: string | null;
  source: string | null;
  label: string | null;
  target_href: string | null;
  metadata: Record<string, unknown> | null;
}

interface QueryResult<T> {
  data: T[] | null;
  error: { message?: string } | null;
}

interface UntypedQuery<T> {
  select(columns: string): UntypedQuery<T>;
  gte(column: string, value: string): UntypedQuery<T>;
  order(column: string, options: { ascending: boolean }): UntypedQuery<T>;
  limit(count: number): Promise<QueryResult<T>>;
}

interface UntypedSupabase {
  from<T>(table: string): UntypedQuery<T>;
}

const rangeLabels: Record<TimeRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  all: "All time",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const formatPercent = (value: number, total: number) =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : "0%";

const tierLabel: Record<string, string> = {
  intervention_priority: "Intervention priority",
  coaching_likely: "Coaching likely",
  support_nurture: "Support nurture",
};

const metadataText = (metadata: Record<string, unknown> | null, key: string) => {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
};

const answerLabel = (slug: string) => slug.split("-").join(" ");

export function RevenueCommandCenter() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [registrations, setRegistrations] = useState<ZoomRegistrationRow[]>([]);
  const [bookings, setBookings] = useState<ConsultationBookingRow[]>([]);
  const [abandonedBookings, setAbandonedBookings] = useState<AbandonedBookingRow[]>([]);
  const [events, setEvents] = useState<ConversionEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const db = supabase as unknown as UntypedSupabase;
    const since = new Date();
    if (timeRange !== "all") {
      since.setDate(since.getDate() - (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90));
    }

    const applyRange = <T,>(query: UntypedQuery<T>) =>
      timeRange === "all" ? query : query.gte("created_at", since.toISOString());

    const [registrationRes, bookingRes, abandonedRes, eventRes] = await Promise.all([
      applyRange(
        db
          .from<ZoomRegistrationRow>("zoom_meeting_registrations")
          .select("id, created_at, lead_score, lead_tier, revenue_path, nme_attributed, request_follow_up, next_revenue_action"),
      )
        .order("created_at", { ascending: false })
        .limit(1000),
      applyRange(
        db
          .from<ConsultationBookingRow>("consultation_bookings")
          .select("id, created_at, amount_paid, status"),
      )
        .order("created_at", { ascending: false })
        .limit(1000),
      applyRange(
        db
          .from<AbandonedBookingRow>("abandoned_bookings")
          .select("id, created_at, plan_type, completed"),
      )
        .order("created_at", { ascending: false })
        .limit(1000),
      applyRange(
        db
          .from<ConversionEventRow>("conversion_events")
          .select("id, created_at, event_name, utm_source, page_path, source, label, target_href, metadata"),
      )
        .order("created_at", { ascending: false })
        .limit(1000),
    ]);

    const firstError = registrationRes.error || bookingRes.error || abandonedRes.error || eventRes.error;
    if (firstError) {
      setErrorMessage(firstError.message || "Revenue report is waiting on one of the backend tables.");
      setRegistrations([]);
      setBookings([]);
      setAbandonedBookings([]);
      setEvents([]);
      setLoading(false);
      return;
    }

    setRegistrations(registrationRes.data || []);
    setBookings(bookingRes.data || []);
    setAbandonedBookings(abandonedRes.data || []);
    setEvents(eventRes.data || []);
    setLoading(false);
  }, [timeRange]);

  useEffect(() => {
    void load();
  }, [load]);

  const report = useMemo(() => {
    const actualRevenue = bookings.reduce((sum, booking) => sum + Number(booking.amount_paid || 0), 0);
    const supportNurture = registrations.filter((lead) => (lead.lead_tier || "support_nurture") === "support_nurture").length;
    const coachingLikely = registrations.filter((lead) => lead.lead_tier === "coaching_likely").length;
    const interventionPriority = registrations.filter((lead) => lead.lead_tier === "intervention_priority").length;
    const nmeAttributed = registrations.filter((lead) => lead.nme_attributed).length;
    const requestedFollowup = registrations.filter((lead) => lead.request_follow_up).length;
    const sponsorSignals = events.filter((event) => event.event_name === "partner_page_click").length;
    const abandonedOpen = abandonedBookings.filter((booking) => !booking.completed).length;
    const answerEvents = events.filter((event) => event.event_name.startsWith("family_answer_"));
    const answerViews = events.filter((event) => event.event_name === "family_answer_view").length;
    const answerCtaClicks = events.filter((event) => event.event_name === "family_answer_click").length;
    const answerHubClicks = events.filter((event) => event.event_name === "family_answer_hub_click").length;
    const answerFamilySquaresClicks = events.filter((event) =>
      event.event_name === "family_answer_click" &&
      ((event.target_href || "").includes("family-squares") || metadataText(event.metadata, "targetHref")?.includes("family-squares")),
    ).length;
    const answerCoachingClicks = events.filter((event) =>
      event.event_name === "family_answer_click" &&
      ((event.target_href || "").includes("book-consultation") || metadataText(event.metadata, "targetHref")?.includes("book-consultation")),
    ).length;
    const answerInterventionClicks = events.filter((event) =>
      event.event_name === "family_answer_click" &&
      ((event.target_href || "").includes("intervention-help") || metadataText(event.metadata, "targetHref")?.includes("intervention-help")),
    ).length;
    const topAnswerPages = Object.entries(
      answerEvents.reduce<Record<string, { views: number; clicks: number }>>((acc, event) => {
        const slug = metadataText(event.metadata, "answer_slug") || event.page_path?.split("/").filter(Boolean).pop() || "unknown";
        if (!acc[slug]) acc[slug] = { views: 0, clicks: 0 };
        if (event.event_name === "family_answer_view") acc[slug].views += 1;
        if (event.event_name === "family_answer_click" || event.event_name === "family_answer_hub_click") acc[slug].clicks += 1;
        return acc;
      }, {}),
    )
      .map(([slug, counts]) => ({ slug, ...counts }))
      .sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
      .slice(0, 6);
    const topPaths = Object.entries(
      registrations.reduce<Record<string, number>>((acc, lead) => {
        const key = lead.revenue_path || "family_squares";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    )
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const offerValuePipeline =
      supportNurture * 14.99 +
      coachingLikely * 150 +
      interventionPriority * 2500 +
      abandonedBookings.filter((booking) => !booking.completed && booking.plan_type === "family-readiness-intensive").length * 2500;

    return {
      actualRevenue,
      supportNurture,
      coachingLikely,
      interventionPriority,
      nmeAttributed,
      requestedFollowup,
      sponsorSignals,
      abandonedOpen,
      answerViews,
      answerCtaClicks,
      answerHubClicks,
      answerFamilySquaresClicks,
      answerCoachingClicks,
      answerInterventionClicks,
      topAnswerPages,
      topPaths,
      offerValuePipeline,
      registrations: registrations.length,
      bookings: bookings.length,
    };
  }, [abandonedBookings, bookings, events, registrations]);

  const cards = [
    {
      label: "Booked revenue",
      value: formatCurrency(report.actualRevenue),
      note: `${report.bookings} consultation bookings`,
      icon: BadgeDollarSign,
    },
    {
      label: "Family Squares leads",
      value: report.registrations.toString(),
      note: `${report.requestedFollowup} requested follow-up`,
      icon: Users,
    },
    {
      label: "Coaching likely",
      value: report.coachingLikely.toString(),
      note: `${formatPercent(report.coachingLikely, report.registrations)} of scored leads`,
      icon: CalendarCheck,
    },
    {
      label: "Intervention priority",
      value: report.interventionPriority.toString(),
      note: `${formatPercent(report.interventionPriority, report.registrations)} of scored leads`,
      icon: Target,
    },
    {
      label: "Offer-value pipeline",
      value: formatCurrency(report.offerValuePipeline),
      note: "Potential if routed into best-fit offers",
      icon: TrendingUp,
    },
    {
      label: "Advertiser signals",
      value: report.sponsorSignals.toString(),
      note: "Partner page clicks",
      icon: Handshake,
    },
    {
      label: "Answer views",
      value: report.answerViews.toString(),
      note: `${report.answerHubClicks} hub/internal answer clicks`,
      icon: HelpCircle,
    },
    {
      label: "Answer CTA clicks",
      value: report.answerCtaClicks.toString(),
      note: "Clicks from answers into money paths",
      icon: MousePointerClick,
    },
  ];

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading revenue command center...</p>;
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">Revenue reporting is waiting on the latest backend publish.</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Revenue Command Center</h2>
          <p className="text-sm text-muted-foreground">
            A practical view of the doubling plan: traffic, scored leads, paid bookings, abandoned revenue, and advertiser proof.
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
          <Button size="sm" variant="ghost" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">Family Squares lead mix</h3>
                <p className="text-sm text-muted-foreground">Where free meeting traffic should route next.</p>
              </div>
              <Badge variant="outline">{report.nmeAttributed} NME-attributed</Badge>
            </div>
            <div className="space-y-4">
              {[
                { label: "Support nurture", count: report.supportNurture, color: "bg-muted-foreground" },
                { label: "Coaching likely", count: report.coachingLikely, color: "bg-primary" },
                { label: "Intervention priority", count: report.interventionPriority, color: "bg-destructive" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{row.label}</span>
                    <span className="text-muted-foreground">{row.count} · {formatPercent(row.count, report.registrations)}</span>
                  </div>
                  <Progress value={report.registrations > 0 ? (row.count / report.registrations) * 100 : 0} className={row.color} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Top revenue paths</h3>
            </div>
            <div className="space-y-3">
              {report.topPaths.length === 0 && <p className="text-sm text-muted-foreground">No scored paths yet.</p>}
              {report.topPaths.map((path) => (
                <div key={path.path} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium text-foreground">{tierLabel[path.path] || path.path.split("_").join(" ")}</span>
                  <Badge>{path.count}</Badge>
                </div>
              ))}
              <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100">
                {report.abandonedOpen} open abandoned booking records should be treated as direct revenue recovery opportunities.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground">Family answer performance</h3>
              <p className="text-sm text-muted-foreground">
                Shows whether AEO traffic is moving into Family Squares, private coaching, or intervention readiness.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{report.answerFamilySquaresClicks} Family Squares</Badge>
              <Badge variant="outline">{report.answerCoachingClicks} Coaching</Badge>
              <Badge variant="outline">{report.answerInterventionClicks} Intervention</Badge>
            </div>
          </div>
          {report.topAnswerPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No answer-page activity yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {report.topAnswerPages.map((answer) => (
                <div key={answer.slug} className="rounded-lg border p-3">
                  <p className="text-sm font-medium capitalize text-foreground">{answerLabel(answer.slug)}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {answer.views} views · {answer.clicks} clicks
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Offer ladder scoreboard</h3>
            <p className="text-sm text-muted-foreground">The offers that make the Sober Helpline funnel capable of meaningful revenue growth.</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead>Offer</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Business role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueLadder.map((step) => (
                  <TableRow key={step.key}>
                    <TableCell><Badge variant="outline">{step.stage}</Badge></TableCell>
                    <TableCell className="font-medium">{step.offer}</TableCell>
                    <TableCell>{step.price}</TableCell>
                    <TableCell className="max-w-xl text-sm text-muted-foreground">{step.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
