import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, Globe, Phone, Mail, Users, MousePointer } from "lucide-react";

interface ClickAnalytics {
  provider_id: string;
  provider_name: string;
  category: string;
  city: string | null;
  state: string | null;
  total_clicks: number;
  unique_visitors: number;
  card_views: number;
  website_clicks: number;
  phone_clicks: number;
  email_clicks: number;
  clicks_last_7_days: number;
  clicks_last_30_days: number;
  first_click: string | null;
  last_click: string | null;
}

interface GeographicData {
  country: string;
  region: string;
  city: string;
  click_count: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function ProviderAnalytics() {
  const [analytics, setAnalytics] = useState<ClickAnalytics[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | 'all'>('30days');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchAnalytics();
    fetchGeographicData();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc("get_provider_click_analytics_admin");

      if (error) throw error;
      setAnalytics((data as ClickAnalytics[]) || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeographicData = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_clicks')
        .select('country, region, city')
        .not('country', 'is', null);

      if (error) throw error;

      // Aggregate by location
      const locationCounts: Record<string, GeographicData> = {};
      (data || []).forEach((click: any) => {
        const key = `${click.country}-${click.region}-${click.city}`;
        if (!locationCounts[key]) {
          locationCounts[key] = {
            country: click.country || 'Unknown',
            region: click.region || 'Unknown',
            city: click.city || 'Unknown',
            click_count: 0
          };
        }
        locationCounts[key].click_count++;
      });

      const sortedLocations = Object.values(locationCounts)
        .sort((a, b) => b.click_count - a.click_count)
        .slice(0, 10);

      setGeographicData(sortedLocations);
    } catch (error) {
      console.error('Error fetching geographic data:', error);
    }
  };

  const getFilteredData = () => {
    let filtered = analytics;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  // Calculate totals
  const totals = filteredData.reduce((acc, item) => ({
    total_clicks: acc.total_clicks + (item.total_clicks || 0),
    unique_visitors: acc.unique_visitors + (item.unique_visitors || 0),
    website_clicks: acc.website_clicks + (item.website_clicks || 0),
    phone_clicks: acc.phone_clicks + (item.phone_clicks || 0),
    email_clicks: acc.email_clicks + (item.email_clicks || 0),
    clicks_last_7_days: acc.clicks_last_7_days + (item.clicks_last_7_days || 0),
    clicks_last_30_days: acc.clicks_last_30_days + (item.clicks_last_30_days || 0),
  }), {
    total_clicks: 0,
    unique_visitors: 0,
    website_clicks: 0,
    phone_clicks: 0,
    email_clicks: 0,
    clicks_last_7_days: 0,
    clicks_last_30_days: 0,
  });

  // Get unique categories
  const categories = Array.from(new Set(analytics.map(item => item.category))).sort();

  // Prepare chart data
  const topProviders = filteredData.slice(0, 10).map(item => ({
    name: item.provider_name.length > 20 ? item.provider_name.substring(0, 20) + '...' : item.provider_name,
    clicks: item.total_clicks || 0,
    unique: item.unique_visitors || 0
  }));

  const clickTypeData = [
    { name: 'Card Views', value: totals.total_clicks - totals.website_clicks - totals.phone_clicks - totals.email_clicks },
    { name: 'Website Clicks', value: totals.website_clicks },
    { name: 'Phone Clicks', value: totals.phone_clicks },
    { name: 'Email Clicks', value: totals.email_clicks },
  ].filter(item => item.value > 0);

  if (loading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Clicks</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totals.total_clicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Unique Visitors</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totals.unique_visitors.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Website Clicks</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totals.website_clicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Phone Clicks</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totals.phone_clicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email Clicks</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totals.email_clicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last 30 Days</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totals.clicks_last_30_days.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Providers Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Providers by Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            {topProviders.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProviders} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#10b981" name="Total Clicks" />
                  <Bar dataKey="unique" fill="#3b82f6" name="Unique Visitors" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No click data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Click Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Click Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {clickTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clickTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {clickTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No click data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provider Click Details</CardTitle>
          <CardDescription>Detailed breakdown of clicks per provider</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Unique</TableHead>
                  <TableHead className="text-right">Website</TableHead>
                  <TableHead className="text-right">Phone</TableHead>
                  <TableHead className="text-right">Email</TableHead>
                  <TableHead className="text-right">Last 7d</TableHead>
                  <TableHead className="text-right">Last 30d</TableHead>
                  <TableHead>Last Click</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.provider_id}>
                    <TableCell className="font-medium">{item.provider_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.city && item.state ? `${item.city}, ${item.state}` : item.state || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{item.total_clicks || 0}</TableCell>
                    <TableCell className="text-right">{item.unique_visitors || 0}</TableCell>
                    <TableCell className="text-right">{item.website_clicks || 0}</TableCell>
                    <TableCell className="text-right">{item.phone_clicks || 0}</TableCell>
                    <TableCell className="text-right">{item.email_clicks || 0}</TableCell>
                    <TableCell className="text-right">{item.clicks_last_7_days || 0}</TableCell>
                    <TableCell className="text-right">{item.clicks_last_30_days || 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.last_click ? new Date(item.last_click).toLocaleDateString() : 'Never'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredData.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No analytics data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
