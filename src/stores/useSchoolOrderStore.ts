import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SCHOOL_INFO } from '@/lib/courseUtils';

const DEFAULT_ORDER = Object.keys(SCHOOL_INFO);

interface SchoolOrderStore {
  schoolOrder: string[];
  setOrder: (order: string[]) => void;
  reset: () => void;
}

export const useSchoolOrderStore = create<SchoolOrderStore>()(
  persist(
    (set) => ({
      schoolOrder: DEFAULT_ORDER,
      setOrder: (order) => set({ schoolOrder: order }),
      reset: () => set({ schoolOrder: DEFAULT_ORDER }),
    }),
    { name: 'cca_school_order' }
  )
);
