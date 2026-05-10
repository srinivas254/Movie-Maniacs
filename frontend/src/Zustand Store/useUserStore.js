import { create } from "zustand";

const useUserStore = create((set) => ({
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

window.useUserStore = useUserStore;

export default useUserStore;
