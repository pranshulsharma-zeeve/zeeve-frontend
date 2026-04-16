import { create } from "zustand";
import { NodeNetworkStates } from "@/types/node";

type NodeInfo = {
  name: string;
  status: NodeNetworkStates;
};

type State = {
  nodeInfo: { data?: NodeInfo; isLoading: boolean };
};

type Actions = {
  setNodeInfo: (isLoading: boolean, data?: NodeInfo) => void;
  resetNodeInfo: () => void;
};

const initialState: State = {
  nodeInfo: { data: undefined, isLoading: false },
};

const useNodeStore = create<State & Actions>((set) => ({
  ...initialState,
  setNodeInfo: (isLoading: boolean, data?: NodeInfo) => {
    set({ nodeInfo: { data, isLoading } });
  },
  resetNodeInfo: () => {
    set(initialState);
  },
}));

export { useNodeStore };
