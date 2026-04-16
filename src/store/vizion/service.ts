import { create } from "zustand";
import { ServiceStatusResponse } from "@/services/vision/polygon/main-page/services";

// types
type State = {
  service: ServiceStatusResponse | null;
};

type Actions = {
  setService: (service: ServiceStatusResponse) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  service: null,
};

// config store
const useServiceStore = create<State & Actions>((set) => ({
  ...initialState,
  setService: (service: ServiceStatusResponse) => {
    set({ service });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useServiceStore };
