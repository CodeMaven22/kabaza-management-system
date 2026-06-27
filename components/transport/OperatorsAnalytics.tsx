'use client';

import { Operator, Bike } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface OperatorsAnalyticsProps {
  operators: Operator[];
  bikes: Bike[];
}

export function OperatorsAnalytics({ operators, bikes }: OperatorsAnalyticsProps) {
  const totalOperators = operators.length;
  const activeOperators = operators.filter((o) => o.status === 'active').length;
  const inactiveOperators = operators.filter((o) => o.status === 'inactive').length;
  const totalBikesOperated = bikes.length;
  const avgBikesPerOperator = totalOperators > 0 ? (totalBikesOperated / totalOperators).toFixed(1) : 0;

  const stats = [
    {
      title: 'Total Operators',
      value: totalOperators,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      description: 'Registered bike operators',
    },
    {
      title: 'Active Operators',
      value: activeOperators,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      description: 'Operators with active status',
    },
    {
      title: 'Inactive Operators',
      value: inactiveOperators,
      icon: AlertCircle,
      color: 'bg-gray-100 text-gray-600',
      description: 'Inactive registrations',
    },
    {
      title: 'Avg Bikes/Operator',
      value: avgBikesPerOperator,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
      description: 'Average bikes per operator',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
}
