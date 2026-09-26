import { createContext, useContext, useMemo, useState, PropsWithChildren } from 'react';
import { DEFAULT_API_URL } from '@/lib/config';

interface SettingsValue {
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_URL);
  const value = useMemo(() => ({ apiBaseUrl, setApiBaseUrl }), [apiBaseUrl]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
