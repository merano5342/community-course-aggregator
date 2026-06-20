import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnnouncementFilterStore {
  selectedSchools: string[];  // empty = show all schools (including 'all')
  toggle: (school: string) => void;
  clear: () => void;
}

export const useAnnouncementFilterStore = create<AnnouncementFilterStore>()(
  persist(
    (set, get) => ({
      selectedSchools: [],
      toggle: (school) => {
        const current = get().selectedSchools;
        const has = current.includes(school);
        set({ selectedSchools: has ? current.filter((s) => s !== school) : [...current, school] });
      },
      clear: () => set({ selectedSchools: [] }),
    }),
    { name: 'cca_announcement_filter' },
  ),
);
