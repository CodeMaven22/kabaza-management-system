'use client';

import { useState } from 'react';
import { User, UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Edit, Trash2, Plus } from 'lucide-react';

interface UsersManagementEnhancedProps {
  users: User[];
  onAddUser?: () => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}

const roleLabels: Record<UserRole, string> = {
  ICT_OFFICER: 'ICT Officer',
  REVENUE_COLLECTOR: 'Revenue Collector',
  REVENUE_OFFICER: 'Revenue Officer',
  REGISTRATION_OFFICER: 'Registration Officer',
  FINANCE_OFFICER: 'Finance Officer',
  ACCOUNTS_ASSISTANT: 'Accounts Assistant',
  DIRECTOR_OF_ADMINISTRATION: 'Director of Administration',
  CHIEF_EXECUTIVE: 'Chief Executive',
  TRAFFIC_OFFICER: 'Traffic Officer',
};

export function UsersManagementEnhanced({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: UsersManagementEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'inactive' | 'suspended' | 'deactivated'>('active');

  const filteredUsers = users.filter((user) => {
    const matchesTab = user.status === activeTab;
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'deactivated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      CHIEF_EXECUTIVE: 'bg-purple-100 text-purple-800',
      DIRECTOR_OF_ADMINISTRATION: 'bg-blue-100 text-blue-800',
      FINANCE_OFFICER: 'bg-green-100 text-green-800',
      REVENUE_OFFICER: 'bg-orange-100 text-orange-800',
      REGISTRATION_OFFICER: 'bg-cyan-100 text-cyan-800',
      REVENUE_COLLECTOR: 'bg-indigo-100 text-indigo-800',
      ICT_OFFICER: 'bg-pink-100 text-pink-800',
      ACCOUNTS_ASSISTANT: 'bg-amber-100 text-amber-800',
      TRAFFIC_OFFICER: 'bg-red-100 text-red-800',
    };
    return colors[role];
  };

  const tabCounts = {
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    deactivated: users.filter((u) => u.status === 'deactivated').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <Button onClick={onAddUser} className="gap-2">
          <Plus size={18} />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, phone, username, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['active', 'inactive', 'suspended', 'deactivated'] as const).map((status) => {
          const statusLabels = {
            active: 'Active',
            inactive: 'Inactive',
            suspended: 'Suspended',
            deactivated: 'Deactivated',
          };

          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === status
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {statusLabels[status]} ({tabCounts[status]})
            </button>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Total users in {activeTab} status: {filteredUsers.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>National ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No users found in {activeTab} status
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell className="text-sm text-gray-600">{user.nationalId}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{roleLabels[user.role]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditUser?.(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteUser?.(user.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
