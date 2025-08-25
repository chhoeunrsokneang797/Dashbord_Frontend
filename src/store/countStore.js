import { create } from "zustand";
import React from "react";
export const countStore = create((set) => ({
  count: 0, // state
  category: [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
  ],
  loading: false,
  indcrese: () => set((state) => ({ count: state.count + 1 })),
  descrese: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0, category: [] }),
  update: (value) => set({ count: value }),
}));
