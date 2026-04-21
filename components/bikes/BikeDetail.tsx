'use client';

import { Bike, Operator } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeViewer } from '@/components/QRCodeGenerator';

interface BikeDetailProps {
  bike: Bike;
  operator: Operator | undefined;
}

export function BikeDetail({ bike, operator }: BikeDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
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
              <CardTitle>{bike.make} {bike.model}</CardTitle>
              <CardDescription>{bike.registrationNumber}</CardDescription>
            </div>
            <Badge className={getStatusColor(bike.status)}>
              {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Make</p>
                <p className="text-lg font-semibold">{bike.make}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="text-lg font-semibold">{bike.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="text-lg font-semibold">{bike.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="text-lg font-semibold">{bike.registrationDate}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Engine Number</p>
                <p className="text-lg font-semibold">{bike.engineNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chassis Number</p>
                <p className="text-lg font-semibold">{bike.chassisNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="text-lg font-semibold">{bike.expiryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Operator</p>
                <p className="text-lg font-semibold">
                  {operator ? `${operator.firstName} ${operator.lastName}` : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <QRCodeViewer registrationNumber={bike.registrationNumber} />
    </div>
  );
}
