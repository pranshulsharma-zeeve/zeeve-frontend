import { create } from "zustand";
import { NodeNetworkStates } from "@orbit/types/node";

// types
type State = {
  nodeInfo: {
    data?: { name: string; status: NodeNetworkStates };
    isLoading: boolean;
  };
};

type Actions = {
  setNodeInfo: (isLoading: boolean, data?: { name: string; status: NodeNetworkStates }) => void;
  resetNodeInfo: () => void;
};

// initial state
const initialState: State = {
  nodeInfo: { data: undefined, isLoading: false },
};

// node store
const useNodeStore = create<State & Actions>((set) => ({
  ...initialState,
  setNodeInfo: (isLoading: boolean, data?: { name: string; status: NodeNetworkStates }) => {
    set({ nodeInfo: { data, isLoading } });
  },
  resetNodeInfo: () => {
    set(initialState);
  },
}));

export { useNodeStore };
