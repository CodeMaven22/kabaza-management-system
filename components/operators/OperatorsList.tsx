'use client';

import { Operator } from '@/lib/types';
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
import Link from 'next/link';

interface OperatorsListProps {
  operators: Operator[];
  onViewDetails?: (operatorId: string) => void;
}

export function OperatorsList({ operators, onViewDetails }: OperatorsListProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Registered Operators</CardTitle>
        <CardDescription>Total operators: {operators.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Bikes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No operators registered yet
                  </TableCell>
                </TableRow>
              ) : (
                operators.map((operator) => (
                  <TableRow key={operator.id}>
                    <TableCell className="font-medium">
                      {operator.firstName} {operator.lastName}
                    </TableCell>
                    <TableCell>{operator.email}</TableCell>
                    <TableCell>{operator.phoneNumber}</TableCell>
                    <TableCell>{operator.idNumber}</TableCell>
                    <TableCell>{operator.city}</TableCell>
                    <TableCell>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {operator.totalBikes}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(operator.status)}>
                        {operator.status.charAt(0).toUpperCase() + operator.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/operators/${operator.id}`}>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </Link>
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
