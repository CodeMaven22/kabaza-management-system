'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { mockUsers, mockRoles } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Eye, Edit2, Trash2, Users } from 'lucide-react';

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    roleId: 'ROLE003',
  });

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.username) {
      alert('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      username: newUser.username,
      roleId: newUser.roleId,
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
    };

    setUsers([user, ...users]);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      username: '',
      roleId: 'ROLE003',
    });
    setShowForm(false);
    alert('User created successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  const activeUsers = users.filter((u) => u.status === 'active');
  const inactiveUsers = users.filter((u) => u.status === 'inactive');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600">Manage system users and their access levels</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={18} />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers.length}</p>
              </div>
              <Users className="text-green-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers.length}</p>
              </div>
              <Users className="text-red-600" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create User Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Add a new system user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="john_doe"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+265888123456"
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={newUser.roleId} onValueChange={(value) => setNewUser({ ...newUser, roleId: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateUser} variant="default">
                Create User
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <Input
          placeholder="Search by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedUser.firstName} {selectedUser.lastName}
                </CardTitle>
                <CardDescription>User Details</CardDescription>
              </div>
              <Button
                onClick={() => setSelectedUser(null)}
                variant="ghost"
                className="text-gray-500"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-semibold">{selectedUser.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedUser.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold">
                  {mockRoles.find((r) => r.id === selectedUser.roleId)?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{selectedUser.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="font-semibold">{selectedUser.registrationDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Users ({filteredUsers.length})</h3>
        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => {
              const role = mockRoles.find((r) => r.id === user.roleId);
              return (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-xs text-gray-500">
                          {user.email} | {role?.name} | {user.registrationDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                        <Button
                          onClick={() => setSelectedUser(user)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          onClick={() => handleToggleStatus(user.id)}
                          variant="outline"
                          size="sm"
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
