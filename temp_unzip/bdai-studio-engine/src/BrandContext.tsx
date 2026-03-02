// ============================================
// BDai.studio — Brand Context Provider
// Makes brand config + language available to all components
// ============================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { BrandConfig } from './types';
import { loadBrandConfig, applyBrandTheme } from './brandConfig';

interface BrandContextValue {
  config: BrandConfig | null;
  language: 'bn' | 'en';
  toggleLanguage: () => void;
  isLoading: boolean;
  error: string | null;
}

const BrandContext = createContext<BrandContextValue>({
  config: null,
  language: 'bn',
  toggleLanguage: () => {},
  isLoading: true,
  error: null,
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BrandConfig | null>(null);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrandConfig()
      .then((cfg) => {
        setConfig(cfg);
        setLanguage(cfg.language || 'bn');
        applyBrandTheme(cfg);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Brand config load failed:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  return (
    <BrandContext.Provider value={{ config, language, toggleLanguage, isLoading, error }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within BrandProvider');
  return context;
}
