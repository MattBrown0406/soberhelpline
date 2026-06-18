import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Video, MessageCircle, Users, Calendar, ArrowRight,
  CheckCircle, Clock, FileText, TrendingUp, Heart, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { supabase } from "@/integrations/supabase/client";

interface WorksheetEntry {
  worksheet_key: string;
  updated_at: string;
}

const WORKSHEET_LABELS: Record<string, string> = {
  scenario_worksheet: "Scenario Practice",
  guilt_responsibility_worksheet: "Guilt vs. Responsibility",
  self_care_worksheet: "Self-Care Worksheet",
  trauma_hypervigilance_assessment: "Trauma & Hypervigilance",
};

function getNextMonday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon…
  const daysUntilMonday = day === 1 ? (now.getHours() < 19 ? 0 : 7) : (8 - day) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  next.setHours(19, 0, 0, 0); // 7 PM
  return next;
}

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MemberHome() {
  const { getStats, loading: progressLoading } = useEducationProgress();
  const [worksheets, setWorksheets] = useState<WorksheetEntry[]>([]);
  const [wsLoading, setWsLoading] = useState(true);
  const nextMonday = getNextMonday();
  const countdown = useCountdown(nextMonday);
  const stats = getStats();

  useEffect(() => {
    supabase
      .from("worksheet_responses")
      .select("worksheet_key, updated_at")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setWorksheets((data ?? []) as WorksheetEntry[]);
        setWsLoading(false);
      });
  }, []);

  const memberLinks = [
    { to: "/family-education",       icon: BookOpen,       label: "Education Center",  desc: "60+ guides & tools" },
    { to: "/member-learning-paths",  icon: TrendingUp,     label: "Learning Paths",    desc: "Curated sequences" },
    { to: "/zoom-recordings",        icon: Video,          label: "Recordings",        desc: "Past Monday meetings" },
    { to: "/member-qa",              icon: MessageCircle,  label: "Q&A Archive",       desc: "Meeting Q&As" },
    { to: "/family-forum",           icon: Users,          label: "Forum",             desc: "Connect with families" },
    { to: "/family-webinars",        icon: Calendar,       label: "Webinars",          desc: "Live sessions" },
  ];

  return (
    <>
      <SEOHead
        title="Member Home | Sober Helpline"
        description="Your member dashboard — progress, saved worksheets, and quick access to all resources."
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Here's where you left off</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Progress card */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Education Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progressLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-3xl font-bold text-foreground">{stats.completionPercentage}%</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.totalCompleted} of {stats.totalResources} resources
                      </span>
                    </div>
                    <Progress value={stats.completionPercentage} className="h-2.5 mb-4" />
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(stats.byType).slice(0, 3).map(([type, data]) => (
                        <div key={type} className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-semibold text-foreground">{data.completed}</p>
                          <p className="text-xs text-muted-foreground capitalize">{type}s</p>
                        </div>
                      ))}
                    </div>
                    <Link to="/family-education" className="mt-4 flex items-center gap-1 text-sm text-primary hover:underline">
                      Continue learning <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Monday meeting countdown */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Next Monday Meeting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-1 text-center mb-4">
                  {[
                    { value: countdown.days,    label: "d" },
                    { value: countdown.hours,   label: "h" },
                    { value: countdown.minutes, label: "m" },
                    { value: countdown.seconds, label: "s" },
                  ].map(({ value, label }) => (
                    <div key={label} className="bg-background rounded-lg py-2">
                      <p className="text-xl font-bold text-foreground tabular-nums">
                        {String(value).padStart(2, "0")}
                      </p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mb-3">Mondays at 7 PM PT</p>
                <Link to="/monday-zoom-registration">
                  <Button size="sm" className="w-full gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Get the link
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Saved worksheets */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Worksheets in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : worksheets.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">No worksheets started yet.</p>
                    <Link to="/family-education">
                      <Button variant="outline" size="sm">Go to Education Center</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {worksheets.map((ws) => (
                      <Link
                        key={ws.worksheet_key}
                        to="/family-education"
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {WORKSHEET_LABELS[ws.worksheet_key] ?? ws.worksheet_key}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">In progress</Badge>
                          <span className="text-xs text-muted-foreground">{relativeDate(ws.updated_at)}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {memberLinks.map(({ to, icon: Icon, label, desc }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </>
  );
}
