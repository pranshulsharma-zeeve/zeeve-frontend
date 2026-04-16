import { create } from "zustand";
import { BannerKey } from "./banners";

type State = {
  key: BannerKey | null;
};

const initialState: State = {
  key: null,
};

type Actions = {
  setBanner: (key: BannerKey) => void;
  reset: () => void;
};

const useBannerStore = create<State & Actions>((set) => ({
  ...initialState,
  setBanner: (key) => {
    set({ key });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useBannerStore };
