import { create } from 'zustand';
// Not persisted on purpose: persistence only after cookie consent.
export const useStore = create((set) => ({
  lang: 'en', theme: 'light',
  setTheme: (theme) => set({ theme }),
  cycleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : s.theme === 'dark' ? 'rose' : 'light' })),
}));
