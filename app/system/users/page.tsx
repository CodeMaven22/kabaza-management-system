'use client';

import { useState } from 'react';
import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UsersManagementEnhanced } from '@/components/system/UsersManagementEnhanced';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/lib/types';

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600 mt-2">Manage system users and roles</p>
        </div>

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
