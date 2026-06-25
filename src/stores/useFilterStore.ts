import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_FILTERS, type FilterState } from '@/components/courses/filterState';

interface FilterStore {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: DEFAULT_FILTERS,
      setFilters: (filters) => set({ filters }),
      reset: () => set({ filters: DEFAULT_FILTERS }),
    }),
    { name: 'cca_filters' }
  )
);
