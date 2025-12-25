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
import { BookOpen, Eye, Users } from "lucide-react";

interface GuideAnalytics {
  guide_path: string;
  guide_name: string;
  total_views: number;
  unique_sessions: number;
  unique_users: number;
  month: string;
}

export const GuideAnalytics = () => {
  const [analytics, setAnalytics] = useState<GuideAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_guide_analytics');

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error("Error fetching guide analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  // Aggregate totals across all months
  const aggregatedByGuide = analytics.reduce((acc, item) => {
    const existing = acc.find(a => a.guide_path === item.guide_path);
    if (existing) {
      existing.total_views += item.total_views;
      existing.unique_sessions += item.unique_sessions;
      existing.unique_users += item.unique_users;
    } else {
      acc.push({
        guide_path: item.guide_path,
        guide_name: item.guide_name,
        total_views: item.total_views,
        unique_sessions: item.unique_sessions,
        unique_users: item.unique_users,
      });
    }
    return acc;
  }, [] as { guide_path: string; guide_name: string; total_views: number; unique_sessions: number; unique_users: number }[]);

  // Sort by total views descending
  aggregatedByGuide.sort((a, b) => b.total_views - a.total_views);

  // Calculate totals
  const totalViews = aggregatedByGuide.reduce((sum, item) => sum + item.total_views, 0);
  const totalSessions = aggregatedByGuide.reduce((sum, item) => sum + item.unique_sessions, 0);
  const totalUsers = aggregatedByGuide.reduce((sum, item) => sum + item.unique_users, 0);

  // Top 10 for chart
  const chartData = aggregatedByGuide.slice(0, 10).map(item => ({
    name: item.guide_name.length > 25 ? item.guide_name.substring(0, 25) + '...' : item.guide_name,
    views: item.total_views,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
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
            <CardTitle>Top 10 Most Viewed Guides</CardTitle>
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
          <CardTitle>All Guide Analytics</CardTitle>
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
              No guide analytics data yet. Views will appear here as users access the guides.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
