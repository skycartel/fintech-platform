import { createContext, useContext, useCallback, useState, ReactNode } from 'react';

interface UIState {
  phoneOpen: boolean;
  openPhone: () => void;
  closePhone: () => void;
}

const UICtx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const openPhone = useCallback(() => setPhoneOpen(true), []);
  const closePhone = useCallback(() => setPhoneOpen(false), []);
  return (
    <UICtx.Provider value={{ phoneOpen, openPhone, closePhone }}>
      {children}
    </UICtx.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
