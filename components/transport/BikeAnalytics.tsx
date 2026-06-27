'use client';

import { Bike } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike as BikeIcon, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface BikeAnalyticsProps {
  bikes: Bike[];
}

export function BikeAnalytics({ bikes }: BikeAnalyticsProps) {
  const totalBikes = bikes.length;
  const activeBikes = bikes.filter((b) => b.status === 'active').length;
  const inactiveBikes = bikes.filter((b) => b.status === 'inactive').length;
  const motorbikeCount = bikes.filter((b) => b.bikeType === 'motorbike').length;
  const bicycleCount = bikes.filter((b) => b.bikeType === 'bicycle').length;
  const suspendedBikes = bikes.filter((b) => b.status === 'suspended').length;

  const stats = [
    {
      title: 'Total Registered Bikes',
      value: totalBikes,
      icon: BikeIcon,
      color: 'bg-blue-100 text-blue-600',
      description: 'All registered bikes',
    },
    {
      title: 'Active Bikes',
      value: activeBikes,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      description: 'Bikes in active status',
    },
    {
      title: 'Motorbikes',
      value: motorbikeCount,
      icon: Zap,
      color: 'bg-orange-100 text-orange-600',
      description: 'Registered motorbikes',
    },
    {
      title: 'Bicycles',
      value: bicycleCount,
      icon: BikeIcon,
      color: 'bg-purple-100 text-purple-600',
      description: 'Registered bicycles',
    },
    {
      title: 'Inactive Bikes',
      value: inactiveBikes,
      icon: AlertCircle,
      color: 'bg-gray-100 text-gray-600',
      description: 'Inactive registrations',
    },
    {
      title: 'Suspended Bikes',
      value: suspendedBikes,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
      description: 'Suspended bikes',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Bike Registration Status Breakdown</CardTitle>
          <CardDescription>Distribution of bikes by registration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { status: 'Active', count: activeBikes, percentage: totalBikes > 0 ? ((activeBikes / totalBikes) * 100).toFixed(1) : 0 },
              { status: 'Inactive', count: inactiveBikes, percentage: totalBikes > 0 ? ((inactiveBikes / totalBikes) * 100).toFixed(1) : 0 },
              { status: 'Suspended', count: suspendedBikes, percentage: totalBikes > 0 ? ((suspendedBikes / totalBikes) * 100).toFixed(1) : 0 },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.status}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === 'Active'
                          ? 'bg-green-600'
                          : item.status === 'Suspended'
                            ? 'bg-red-600'
                            : 'bg-gray-400'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold">{item.count}</p>
                  <p className="text-xs text-gray-600">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
