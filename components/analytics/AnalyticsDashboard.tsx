'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyticsService, type AnalyticsDashboard as AnalyticsDashboardType } from '@/lib/api/analyticsService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
}

function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await analyticsService.getDashboard();
        setData(response);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load analytics';
        setError(message);
        console.error('[v0] Analytics error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
        <span className="text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
        <div>
          <p className="font-medium text-red-900">Error loading analytics</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, revenue_trend, vehicle_stats, fine_stats } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of all business metrics</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${(stats.total_revenue / 1000).toFixed(1)}K`}
          subtitle="This period"
        />
        <StatCard
          title="Total Vehicles"
          value={stats.total_vehicles}
          subtitle={`${stats.total_vehicles} registered`}
        />
        <StatCard
          title="Active Operators"
          value={stats.active_operators}
          subtitle="Verified operators"
        />
        <StatCard
          title="Pending Registrations"
          value={stats.pending_registrations}
          subtitle="Awaiting approval"
        />
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue collection</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
              <Line type="monotone" dataKey="collections" stroke="#10b981" name="Collections" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vehicle & Fine Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
            <CardDescription>{vehicle_stats.total} total vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: vehicle_stats.active },
                    { name: 'Inactive', value: vehicle_stats.inactive },
                    { name: 'Suspended', value: vehicle_stats.suspended },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fine Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Fine Collection</CardTitle>
            <CardDescription>Issued vs Collected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Issued</span>
                <span className="text-lg font-bold text-gray-900">{fine_stats.total_issued}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-lg font-bold text-blue-600">
                  ${(fine_stats.total_amount / 1000).toFixed(1)}K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Collected</span>
                <Badge className="bg-green-100 text-green-800">
                  {fine_stats.collected} ({((fine_stats.collected / fine_stats.total_issued) * 100).toFixed(0)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Outstanding</span>
                <Badge className="bg-red-100 text-red-800">
                  ${(fine_stats.outstanding / 1000).toFixed(1)}K
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Type Distribution */}
      {Object.keys(vehicle_stats.by_type).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicles by Type</CardTitle>
            <CardDescription>Distribution of registered vehicle types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={Object.entries(vehicle_stats.by_type).map(([type, count]) => ({
                  type,
                  count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
