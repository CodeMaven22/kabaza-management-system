'use client';

import { Operator, Bike } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OperatorProfileProps {
  operator: Operator;
  bikes: Bike[];
}

export function OperatorProfile({ operator, bikes }: OperatorProfileProps) {
  const operatorBikes = bikes.filter((bike) => bike.operatorId === operator.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {operator.firstName} {operator.lastName}
              </CardTitle>
              <CardDescription>{operator.id}</CardDescription>
            </div>
            <Badge className={getStatusColor(operator.status)}>
              {operator.status.charAt(0).toUpperCase() + operator.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold">{operator.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-lg font-semibold">{operator.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Number</p>
                <p className="text-lg font-semibold">{operator.idNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="text-lg font-semibold">{operator.registrationDate}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-lg font-semibold">{operator.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="text-lg font-semibold">{operator.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bikes</p>
                <p className="text-lg font-semibold">{operator.totalBikes}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Associated Bikes</CardTitle>
          <CardDescription>{operatorBikes.length} bikes registered</CardDescription>
        </CardHeader>
        <CardContent>
          {operatorBikes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No bikes registered yet</p>
          ) : (
            <div className="space-y-2">
              {operatorBikes.map((bike) => (
                <div
                  key={bike.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold">{bike.registrationNumber}</p>
                    <p className="text-sm text-gray-600">
                      {bike.make} {bike.model}
                    </p>
                  </div>
                  <Badge
                    className={
                      bike.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
