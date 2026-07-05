'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Truck, DollarSign, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Welcome, {user?.first_name || 'User'}
              </h1>
              <p className="text-slate-600 mt-2">
                Kabaza Management System - {user?.role?.replace(/_/g, ' ') || 'User'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Transport Module */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Transport
                </CardTitle>
                <CardDescription>Vehicle Management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Active Vehicles</p>
                    <p className="text-3xl font-bold text-slate-900">-</p>
                    <p className="text-xs text-slate-500 mt-1">Loading...</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/transport/bikes')}
                    className="w-full"
                  >
                    Manage Vehicles
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Finance Module */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Finance
                </CardTitle>
                <CardDescription>Revenue Management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Today's Revenue</p>
                    <p className="text-3xl font-bold text-slate-900">-</p>
                    <p className="text-xs text-slate-500 mt-1">Loading...</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/finance/payments')}
                    className="w-full"
                  >
                    View Payments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Module */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  System
                </CardTitle>
                <CardDescription>User Management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Active Users</p>
                    <p className="text-3xl font-bold text-slate-900">-</p>
                    <p className="text-xs text-slate-500 mt-1">Loading...</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/system/users')}
                    className="w-full"
                  >
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  Analytics
                </CardTitle>
                <CardDescription>System Insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Performance</p>
                    <p className="text-3xl font-bold text-slate-900">-</p>
                    <p className="text-xs text-slate-500 mt-1">Loading...</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/finance/analytics')}
                    className="w-full"
                  >
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Navigate to frequently used sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/transport/bikes')}
                  className="h-20 flex-col"
                >
                  <Truck className="h-5 w-5 mb-1" />
                  <span className="text-xs">Vehicles</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/transport/owners')}
                  className="h-20 flex-col"
                >
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Owners</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/finance/payments')}
                  className="h-20 flex-col"
                >
                  <DollarSign className="h-5 w-5 mb-1" />
                  <span className="text-xs">Payments</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/finance/fines')}
                  className="h-20 flex-col"
                >
                  <AlertCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">Fines</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/transport/verification')}
                  className="h-20 flex-col"
                >
                  <TrendingUp className="h-5 w-5 mb-1" />
                  <span className="text-xs">Verify</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/finance/analytics')}
                  className="h-20 flex-col"
                >
                  <BarChart3 className="h-5 w-5 mb-1" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Your Account</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Name:</dt>
                      <dd className="font-medium text-slate-900">
                        {user?.first_name} {user?.last_name}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Email:</dt>
                      <dd className="font-medium text-slate-900">{user?.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Role:</dt>
                      <dd className="font-medium text-slate-900">
                        {user?.role?.replace(/_/g, ' ') || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Status:</dt>
                      <dd className="font-medium">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {user?.status || 'N/A'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">System Status</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Backend:</dt>
                      <dd className="font-medium text-green-600">Connected</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Version:</dt>
                      <dd className="font-medium text-slate-900">1.0.0</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Environment:</dt>
                      <dd className="font-medium text-slate-900">Development</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Last Sync:</dt>
                      <dd className="font-medium text-slate-900">Just now</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
