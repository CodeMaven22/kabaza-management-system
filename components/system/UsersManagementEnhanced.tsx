'use client';

import { useState, useEffect } from 'react';
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
import { Search, Plus, X, AlertCircle, Loader } from 'lucide-react';
import { UserActionsMenu } from './UserActionsMenu';
import { usersService, type CreateUserRequest } from '@/lib/api/usersService';
import { UserProfile, UserRole, UserStatus } from '@/lib/api/authService';

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

const statusColors: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-yellow-100 text-yellow-800',
  deactivated: 'bg-red-100 text-red-800',
};

export function UsersManagementEnhanced() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<UserStatus>('active');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateUserRequest>>({});

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await usersService.getAllUsers({ status: activeTab });
        setUsers(response.results || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch users';
        setError(message);
        console.error('[v0] Fetch users error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus size={18} />
          Add User
        </Button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="border rounded px-3 py-2" />
              <input type="text" placeholder="Last Name" className="border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="email" placeholder="Email" className="border rounded px-3 py-2" />
              <input type="tel" placeholder="Phone Number" className="border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="National ID" className="border rounded px-3 py-2" />
              <select className="border rounded px-3 py-2">
                <option>Select Role</option>
                <option>ICT OFFICER</option>
                <option>REVENUE COLLECTOR</option>
                <option>REVENUE OFFICER</option>
                <option>REGISTRATION OFFICER</option>
                <option>FINANCE OFFICER</option>
                <option>ACCOUNTS ASSISTANT</option>
                <option>DIRECTOR OF ADMINISTRATION</option>
                <option>CHIEF EXECUTIVE</option>
                <option>TRAFFIC OFFICER</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Username" className="border rounded px-3 py-2" />
              <input type="password" placeholder="Password" className="border rounded px-3 py-2" />
            </div>
            <select className="border rounded px-3 py-2 w-full">
              <option>Select Status</option>
              <option>active</option>
              <option>inactive</option>
              <option>suspended</option>
              <option>deactivated</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">Create User</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error loading users</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="flex-1"
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
          <CardDescription>
            {isLoading ? 'Loading users...' : `Total users in ${activeTab} status: ${filteredUsers.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
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
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{roleLabels[user.role]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[user.status]}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActionsMenu
                          user={user}
                          onViewDetails={(u) => console.log('View:', u.id)}
                          onEdit={(u) => console.log('Edit:', u.id)}
                          onDelete={async (id) => {
                            try {
                              await usersService.deleteUser(id);
                              setUsers(users.filter((u) => u.id !== id));
                            } catch (err) {
                              console.error('[v0] Delete error:', err);
                            }
                          }}
                          onChangeStatus={async (id, status) => {
                            try {
                              const updated = await usersService.changeUserStatus(id, status);
                              setUsers(
                                users.map((u) =>
                                  u.id === id ? updated : u
                                )
                              );
                            } catch (err) {
                              console.error('[v0] Status change error:', err);
                            }
                          }}
                        />
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
