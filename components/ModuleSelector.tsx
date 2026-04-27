'use client';

import { useModule, ModuleType } from '@/lib/moduleContext';
import { useRouter } from 'next/navigation';
import { ChevronDown, Truck, DollarSign, Settings } from 'lucide-react';
import { useState } from 'react';

export function ModuleSelector() {
  const { activeModule, setActiveModule } = useModule();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const modules: { id: ModuleType; label: string; description: string; icon: any }[] = [
    {
      id: 'transport',
      label: 'Transport Domain',
      description: 'Bike registration, owners & operators',
      icon: Truck,
    },
    {
      id: 'finance',
      label: 'Finance Domain',
      description: 'Payments, fines & analytics',
      icon: DollarSign,
    },
    {
      id: 'system',
      label: 'System Control',
      description: 'Users, roles & settings',
      icon: Settings,
    },
  ];

  const currentModule = modules.find((m) => m.id === activeModule);
  const CurrentIcon = currentModule?.icon || Truck;

  const handleModuleChange = (moduleId: ModuleType) => {
    setActiveModule(moduleId);
    setDropdownOpen(false);
    
    const routes: Record<ModuleType, string> = {
      transport: '/transport',
      finance: '/finance',
      system: '/system',
    };
    
    router.push(routes[moduleId]);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
      >
        <CurrentIcon size={18} />
        <span className="font-semibold">{currentModule?.label}</span>
        <ChevronDown size={18} className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {modules.map((module) => {
            const ModuleIcon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => handleModuleChange(module.id)}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  activeModule === module.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-b border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${activeModule === module.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    <ModuleIcon size={20} />
                  </div>
                  <div>
                    <p className={`font-semibold ${activeModule === module.id ? 'text-blue-600' : 'text-gray-900'}`}>
                      {module.label}
                    </p>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
