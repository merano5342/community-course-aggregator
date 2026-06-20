import { create } from 'zustand';

const MAX = 3;

interface CompareStore {
  ids: string[];
  add: (id: string) => boolean; // returns false if full
  remove: (id: string) => void;
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  clear: () => void;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareStore>()((set, get) => ({
  ids: [],
  add: (id) => {
    const s = get();
    if (s.ids.includes(id)) return true;
    if (s.ids.length >= MAX) return false;
    set((prev) => ({ ids: [...prev.ids, id] }));
    return true;
  },
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
  toggle: (id) => {
    if (get().ids.includes(id)) { get().remove(id); return true; }
    return get().add(id);
  },
  has: (id) => get().ids.includes(id),
  clear: () => set({ ids: [] }),
  isFull: () => get().ids.length >= MAX,
}));
