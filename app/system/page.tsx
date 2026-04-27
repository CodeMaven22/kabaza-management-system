'use client';

import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUsers, mockRoles } from '@/lib/mockData';
import { Users, Shield, UserCheck } from 'lucide-react';

function SystemDashboard() {
  const activeUsers = mockUsers.filter((u) => u.status === 'active');

  const stats = [
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      description: `${activeUsers.length} active`,
    },
    {
      title: 'Total Roles',
      value: mockRoles.length,
      icon: Shield,
      color: 'bg-purple-100 text-purple-600',
      description: 'Role configurations',
    },
    {
      title: 'Active Admins',
      value: mockUsers.filter((u) => u.status === 'active' && u.roleId === 'ROLE001').length,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
      description: 'Administrator accounts',
    },
  ];

  return (
    <SystemLayout currentPage="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Control Dashboard</h1>
          <p className="text-gray-600 mt-2">User management, roles, and system settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Users and Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>Active system users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => {
                  const role = mockRoles.find((r) => r.id === user.roleId);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user.username}</p>
                        <p className="text-xs text-gray-500">{role?.name}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Roles List */}
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>Available roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold">{role.name}</p>
                      <p className="text-sm text-gray-600">{role.description}</p>
                      <p className="text-xs text-gray-500">{role.permissions.length} permissions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SystemLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SystemDashboard />
    </ProtectedRoute>
  );
}
