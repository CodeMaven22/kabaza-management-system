'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Bike, Users, CreditCard, Home, LogOut, Settings, Receipt, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const router = useRouter();

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: Home,
      id: 'dashboard',
    },
    {
      label: 'Bike Registration',
      href: '/bikes',
      icon: Bike,
      id: 'bikes',
    },
    {
      label: 'Bike Owners',
      href: '/owners',
      icon: Users,
      id: 'owners',
    },
    {
      label: 'Operators',
      href: '/operators',
      icon: Users,
      id: 'operators',
    },
    {
      label: 'Payments',
      href: '/payments',
      icon: CreditCard,
      id: 'payments',
    },
    {
      label: 'Receipts',
      href: '/receipts',
      icon: Receipt,
      id: 'receipts',
    },
    {
      label: 'Fines',
      href: '/fines',
      icon: AlertTriangle,
      id: 'fines',
    },
    {
      label: 'Users & Roles',
      href: '/users',
      icon: Settings,
      id: 'users',
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          'bg-gray-900 text-white transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Kabaza</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-400">© 2024 Kabaza System</p>
            {user && <p className="text-xs text-gray-500 mt-2">Logged as: {user.username}</p>}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Kabaza Registration System</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
