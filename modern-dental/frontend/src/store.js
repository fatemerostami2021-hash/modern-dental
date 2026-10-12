import { create } from 'zustand';
// Not persisted on purpose: persistence only after cookie consent (planned M6).
export const useStore = create((set) => ({
  lang: 'fa', theme: 'light',
  setLang: (lang) => set({ lang }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}));
