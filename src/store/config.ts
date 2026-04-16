import { create } from "zustand";
import { Config } from "@/config";

// types
type State = {
  config: Config | null;
};

type Actions = {
  setConfig: (config: Config) => void;
};

// initial state
const initialState: State = {
  config: null,
};

// config store
const useConfigStore = create<State & Actions>((set) => ({
  ...initialState,
  setConfig: (config: Config) => {
    set({ config });
  },
}));

export { useConfigStore };
