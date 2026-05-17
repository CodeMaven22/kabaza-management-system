'use client';

import { useState } from 'react';
import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UsersManagementEnhanced } from '@/components/system/UsersManagementEnhanced';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage system users and roles</p>
          </div>
          <Button onClick={handleAddUser} className="gap-2">
            <Plus size={18} />
            Add User
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
              <p className="text-sm text-blue-900">
                <strong>User Registration Form</strong> - Fill in the details below to create a new system user.
              </p>
              <div className="mt-4 space-y-4">
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
                <div>
                  <select className="border rounded px-3 py-2 w-full">
                    <option>Select Status</option>
                    <option>active</option>
                    <option>inactive</option>
                    <option>suspended</option>
                    <option>deactivated</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">Create User</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
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
