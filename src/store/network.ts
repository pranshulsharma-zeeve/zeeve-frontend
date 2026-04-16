import { create } from "zustand";
import { NetworkDetailResponse } from "@/services/platform/network/detail";

type NetworkInfo = {
  data?: NetworkDetailResponse;
  isLoading: boolean;
};

// types
type State = {
  networkInfo: NetworkInfo;
};

type Actions = {
  setNetworkInfo: (networkInfo: NetworkInfo) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  networkInfo: { data: undefined, isLoading: false },
};

// network store
const useNetworkStore = create<State & Actions>((set) => ({
  ...initialState,
  setNetworkInfo: (networkInfo: NetworkInfo) => {
    set({ networkInfo });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useNetworkStore };
export type { NetworkInfo };
