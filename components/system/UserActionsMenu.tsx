'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/api/authService';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

interface UserActionsMenuProps {
  user: UserProfile;
  onViewDetails?: (user: UserProfile) => void;
  onEdit?: (user: UserProfile) => void;
  onDelete?: (userId: number) => void;
  onChangeStatus?: (userId: number, status: string) => void;
}

export function UserActionsMenu({
  user,
  onViewDetails,
  onEdit,
  onDelete,
  onChangeStatus,
}: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statuses = ['active', 'inactive', 'suspended', 'deactivated'];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            {/* View Details */}
            <button
              onClick={() => {
                onViewDetails?.(user);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <Eye size={16} />
              View Details
            </button>

            {/* Edit */}
            <button
              onClick={() => {
                onEdit?.(user);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <Edit size={16} />
              Edit
            </button>

            {/* Change Status */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <CheckCircle size={16} />
                Change Status
              </button>

              {showStatusMenu && (
                <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded shadow-lg">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onChangeStatus?.(user.id, status);
                        setShowStatusMenu(false);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 ${
                        user.status === status ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delete */}
            <button
              onClick={() => {
                onDelete?.(user.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
