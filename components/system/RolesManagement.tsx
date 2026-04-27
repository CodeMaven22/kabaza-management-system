'use client';

import { useState } from 'react';
import { Role } from '@/lib/types';
import { mockRoles, mockUsers } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Eye, Trash2, Shield } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  'view_all',
  'create',
  'edit',
  'delete',
  'manage_users',
  'manage_roles',
  'manage_payments',
  'manage_fines',
  'view_own',
  'view_reports',
];

export function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
  });

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description || selectedPermissions.length === 0) {
      alert('Please fill in all fields and select at least one permission');
      return;
    }

    const role: Role = {
      id: `ROLE${String(roles.length + 1).padStart(3, '0')}`,
      name: newRole.name,
      description: newRole.description,
      permissions: selectedPermissions,
    };

    setRoles([role, ...roles]);
    setNewRole({ name: '', description: '' });
    setSelectedPermissions([]);
    setShowForm(false);
    alert('Role created successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter((r) => r.id !== id));
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const getUserCountForRole = (roleId: string) => {
    return mockUsers.filter((u) => u.roleId === roleId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Roles Management</h2>
          <p className="text-gray-600">Create and manage system roles with permissions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={18} />
          Create Role
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Roles</p>
              <p className="text-3xl font-bold">{roles.length}</p>
            </div>
            <Shield className="text-purple-600" size={40} />
          </div>
        </CardContent>
      </Card>

      {/* Create Role Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Role</CardTitle>
            <CardDescription>Add a new system role with permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name *</Label>
                <Input
                  id="roleName"
                  placeholder="e.g., Supervisor"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this role..."
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Permissions *</Label>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <label key={permission} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{permission.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateRole} variant="default">
                Create Role
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
          placeholder="Search by role name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Role Details Modal */}
      {selectedRole && (
        <Card className="border-2 border-purple-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={24} className="text-purple-600" />
                  {selectedRole.name}
                </CardTitle>
                <CardDescription>Role Details</CardDescription>
              </div>
              <Button
                onClick={() => setSelectedRole(null)}
                variant="ghost"
                className="text-gray-500"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-semibold">{selectedRole.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Users with this role</p>
              <p className="font-semibold">{getUserCountForRole(selectedRole.id)} users</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {selectedRole.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                  >
                    {permission.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roles List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Roles ({filteredRoles.length})</h3>
        <div className="grid gap-4">
          {filteredRoles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No roles found</p>
              </CardContent>
            </Card>
          ) : (
            filteredRoles.map((role) => {
              const userCount = getUserCountForRole(role.id);
              return (
                <Card key={role.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Shield size={20} className="text-purple-600" />
                          <p className="font-semibold">{role.name}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <span
                              key={permission}
                              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                            >
                              {permission.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {userCount} user{userCount !== 1 ? 's' : ''} assigned to this role
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedRole(role)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye size={16} />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDelete(role.id)}
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          disabled={userCount > 0}
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
