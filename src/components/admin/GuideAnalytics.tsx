import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Eye, Users, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GuideView {
  id: string;
  guide_path: string;
  guide_name: string;
  viewed_at: string;
  session_id: string | null;
  user_id: string | null;
}

interface AggregatedGuide {
  guide_path: string;
  guide_name: string;
  total_views: number;
  unique_sessions: number;
  unique_users: number;
}

export const GuideAnalytics = () => {
  const [views, setViews] = useState<GuideView[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    fetchViews();
  }, []);

  const fetchViews = async () => {
    try {
      const { data, error } = await supabase
        .from("guide_views")
        .select("*")
        .order("viewed_at", { ascending: false });

      if (error) throw error;
      setViews(data || []);
    } catch (error) {
      console.error("Error fetching guide views:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredViews = () => {
    const now = new Date();
    let cutoffDate: Date;

    switch (timePeriod) {
      case "week":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    return views.filter(v => new Date(v.viewed_at) >= cutoffDate);
  };

  const aggregateByGuide = (filteredViews: GuideView[]): AggregatedGuide[] => {
    const aggregated: Record<string, AggregatedGuide> = {};

    filteredViews.forEach(view => {
      if (!aggregated[view.guide_path]) {
        aggregated[view.guide_path] = {
          guide_path: view.guide_path,
          guide_name: view.guide_name,
          total_views: 0,
          unique_sessions: 0,
          unique_users: 0,
        };
      }
      aggregated[view.guide_path].total_views++;
    });

    // Calculate unique sessions and users
    Object.keys(aggregated).forEach(path => {
      const guideViews = filteredViews.filter(v => v.guide_path === path);
      const sessions = new Set(guideViews.map(v => v.session_id).filter(Boolean));
      const users = new Set(guideViews.map(v => v.user_id).filter(Boolean));
      aggregated[path].unique_sessions = sessions.size;
      aggregated[path].unique_users = users.size;
    });

    return Object.values(aggregated).sort((a, b) => b.total_views - a.total_views);
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const filteredViews = getFilteredViews();
  const aggregatedByGuide = aggregateByGuide(filteredViews);

  const totalViews = aggregatedByGuide.reduce((sum, item) => sum + item.total_views, 0);
  const totalSessions = aggregatedByGuide.reduce((sum, item) => sum + item.unique_sessions, 0);
  const totalUsers = aggregatedByGuide.reduce((sum, item) => sum + item.unique_users, 0);

  const chartData = aggregatedByGuide.slice(0, 10).map(item => ({
    name: item.guide_name.length > 25 ? item.guide_name.substring(0, 25) + '...' : item.guide_name,
    views: item.total_views,
  }));

  const periodLabel = timePeriod === "week" ? "Past 7 Days" : timePeriod === "month" ? "Past 30 Days" : "Past Year";

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Time Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as "week" | "month" | "year")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views ({periodLabel})</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Guides Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Most Viewed Guides ({periodLabel})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Guide Analytics ({periodLabel})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guide Name</TableHead>
                  <TableHead className="text-right">Total Views</TableHead>
                  <TableHead className="text-right">Unique Sessions</TableHead>
                  <TableHead className="text-right">Unique Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aggregatedByGuide.map((item) => (
                  <TableRow key={item.guide_path}>
                    <TableCell className="font-medium">{item.guide_name}</TableCell>
                    <TableCell className="text-right">{item.total_views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.unique_sessions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.unique_users.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {aggregatedByGuide.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No guide views recorded for this time period.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
