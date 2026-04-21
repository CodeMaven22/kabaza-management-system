'use client';

import { Owner, Bike } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bike as BikeIcon, Calendar, MapPin, Phone, Mail, FileText } from 'lucide-react';

interface OwnerProfileProps {
  owner: Owner;
  bikes?: Bike[];
}

export function OwnerProfile({ owner, bikes = [] }: OwnerProfileProps) {
  return (
    <div className="space-y-6">
      {/* Owner Information */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {owner.firstName} {owner.lastName}
              </CardTitle>
              <CardDescription className="mt-2">Owner Profile</CardDescription>
            </div>
            <Badge variant={owner.status === 'active' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
              {owner.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center gap-2 mt-1 text-gray-900">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {owner.email}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <div className="flex items-center gap-2 mt-1 text-gray-900">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {owner.phoneNumber}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">ID Number</label>
                <div className="flex items-center gap-2 mt-1 text-gray-900">
                  <FileText className="h-4 w-4 text-gray-500" />
                  {owner.idNumber}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <div className="flex items-center gap-2 mt-1 text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {owner.city}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="mt-1 text-gray-900">{owner.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Registration Date</label>
                <div className="flex items-center gap-2 mt-1 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {owner.registrationDate}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bikes Associated with Owner */}
      {bikes && bikes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BikeIcon className="h-5 w-5" />
              Bikes Owned
            </CardTitle>
            <CardDescription>{bikes.length} bike(s) registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bikes.map((bike) => (
                <div key={bike.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{bike.registrationNumber}</p>
                      <p className="text-sm text-gray-600">
                        {bike.make} {bike.model} - {bike.color}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Registered: {bike.registrationDate}
                      </p>
                    </div>
                    <Badge variant={bike.status === 'active' ? 'default' : 'secondary'}>
                      {bike.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!bikes || bikes.length === 0) && (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <BikeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No bikes registered for this owner yet.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
