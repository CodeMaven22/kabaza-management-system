'use client';

import Link from 'next/link';
import { Owner } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Phone, Mail } from 'lucide-react';

interface OwnersListProps {
  owners: Owner[];
}

export function OwnersList({ owners }: OwnersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Owners</CardTitle>
        <CardDescription>List of all bike owners in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">City</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bikes</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {owner.firstName} {owner.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{owner.idNumber}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="h-4 w-4 text-gray-500" />
                        {owner.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {owner.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{owner.city}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {owner.totalBikes}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={owner.status === 'active' ? 'default' : 'secondary'}>
                      {owner.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/owners/${owner.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {owners.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No owners registered yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
