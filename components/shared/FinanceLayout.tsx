'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, CreditCard, AlertTriangle, BarChart3, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useModule } from '@/lib/moduleContext';
import { ModuleSelector } from '../ModuleSelector';
import { cn } from '@/lib/utils';

interface FinanceLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export function FinanceLayout({ children, currentPage = '' }: FinanceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const router = useRouter();
  const { activeModule, setActiveModule } = useModule();

  useEffect(() => {
    if (activeModule !== 'finance') {
      setActiveModule('finance');
    }
  }, [activeModule, setActiveModule]);

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/finance',
      icon: Home,
      id: 'dashboard',
    },
    {
      label: 'Subscriptions',
      href: '/finance/subscriptions',
      icon: CreditCard,
      id: 'subscriptions',
    },
    {
      label: 'Payments',
      href: '/finance/payments',
      icon: CreditCard,
      id: 'payments',
    },
    {
      label: 'Fines',
      href: '/finance/fines',
      icon: AlertTriangle,
      id: 'fines',
    },
    {
      label: 'Analytics',
      href: '/finance/analytics',
      icon: BarChart3,
      id: 'analytics',
    },
    {
      label: 'Reports',
      href: '/finance/reports',
      icon: FileText,
      id: 'reports',
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-gray-900 text-white transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Header with Module Selector */}
        <div className="p-4 border-b border-gray-700">
          {sidebarOpen ? (
            <div className="space-y-3">
              <h1 className="text-xl font-bold">Kabaza System</h1>
              <ModuleSelector />
            </div>
          ) : (
            <div className="flex justify-center">
              <CreditCard className="text-green-400" size={28} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                )}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">© 2024 Kabaza</p>
            {user && <p className="text-xs text-gray-500 mt-2">{user.username}</p>}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Finance Domain</h2>
          <div className="w-10"></div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
