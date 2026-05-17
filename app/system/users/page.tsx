'use client';

import { useState } from 'react';
import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UsersManagementEnhanced } from '@/components/system/UsersManagementEnhanced';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddUser = () => {
    setShowAddForm(!showAddForm);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    console.log('[v0] Edit user:', user.id);
    alert(`Edit user: ${user.firstName} ${user.lastName}`);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('[v0] Delete user:', userId);
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    alert('User deleted successfully');
  };

  return (
    <SystemLayout currentPage="users">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
            <p className="text-gray-600 mt-2">Manage system users and roles</p>
          </div>
          <Button onClick={handleAddUser} className="gap-2">
            {showAddForm ? 'Cancel' : '+ Add User'}
          </Button>
        </div>

        {showAddForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-900">User form component will be added here. Users can be created with name, email, phone, national ID, role, and status.</p>
            </div>
          </div>
        )}

        <UsersManagementEnhanced
          users={users}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </SystemLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <UsersPage />
    </ProtectedRoute>
  );
}
