import { create } from "zustand";
import { OVERVIEW_INFO } from "@orbit/types/overview";

// types
type State = {
  networkInfo: { data?: OVERVIEW_INFO; isLoading: boolean };
};

type Actions = {
  setNetworkInfo: (isLoading: boolean, data?: OVERVIEW_INFO) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  networkInfo: { data: undefined, isLoading: false },
};

// config store
const useNetworkStore = create<State & Actions>((set) => ({
  ...initialState,
  setNetworkInfo: (isLoading: boolean, data?: OVERVIEW_INFO) => {
    set({ networkInfo: { data, isLoading } });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useNetworkStore };
