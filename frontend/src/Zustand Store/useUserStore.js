import { create } from "zustand";

export const useUserStore = create((set) => ({
  profile: null,

  setProfile: (profile) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...profile,
      },
    })),

  clearProfile: () => set({ profile: null }),
}));
