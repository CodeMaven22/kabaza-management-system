'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModuleType = 'transport' | 'finance' | 'system';

interface ModuleContextType {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleType>('transport');

  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule must be used within ModuleProvider');
  }
  return context;
}
