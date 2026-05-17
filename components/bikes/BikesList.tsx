'use client';

import { Bike, Owner, Operator } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BikeActions } from './BikeActions';
import Link from 'next/link';

interface BikesListProps {
  bikes: Bike[];
  operators: Operator[];
  owners?: Owner[];
  onViewDetails?: (bike: Bike) => void;
  onEdit?: (bike: Bike) => void;
}

export function BikesList({ bikes, operators, onViewDetails }: BikesListProps) {
  const getOperatorName = (operatorId: string) => {
    const operator = operators.find((op) => op.id === operatorId);
    return operator ? `${operator.firstName} ${operator.lastName}` : 'Unknown';
  };

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
    <Card>
      <CardHeader>
        <CardTitle>Registered Bikes</CardTitle>
        <CardDescription>Total bikes: {bikes.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration #</TableHead>
                <TableHead>Make/Model</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bikes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No bikes registered yet
                  </TableCell>
                </TableRow>
              ) : (
                bikes.map((bike) => (
                  <TableRow key={bike.id}>
                    <TableCell className="font-medium">{bike.registrationNumber}</TableCell>
                    <TableCell>
                      {bike.make} {bike.model}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{
                            backgroundColor: bike.color.toLowerCase().includes('red')
                              ? '#ef4444'
                              : bike.color.toLowerCase().includes('blue')
                                ? '#3b82f6'
                                : bike.color.toLowerCase().includes('yellow')
                                  ? '#eab308'
                                  : bike.color.toLowerCase().includes('black')
                                    ? '#1f2937'
                                    : '#9ca3af',
                          }}
                        />
                        {bike.color}
                      </div>
                    </TableCell>
                    <TableCell>{getOperatorName(bike.operatorId)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bike.status)}>
                        {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{bike.expiryDate}</TableCell>
                    <TableCell className="text-right">
                      <BikeActions bike={bike} onViewDetails={onViewDetails} onEdit={onEdit} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
