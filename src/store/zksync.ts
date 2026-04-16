import { create } from "zustand";
import type { NodeNetworkStates } from "@/types/node";
import type { ZkSyncRollupNode, ZkSyncRollupOverview, ZkSyncRollupUserInputs } from "@/types/zksync";

type ZksyncInfo = {
  name?: string;
  chainId?: string;
  environment?: "production" | "sandbox";
  agentId?: string;
  analyticsId?: string;
  status?: NodeNetworkStates;
  createdAt?: Date | string;
  ownedBy?: string;
  infraProvisionedAt?: Date | string;
  blockchainProvisionedAt?: Date | string;
  serviceId?: number;
  serviceName?: string;
  userInputs?: ZkSyncRollupUserInputs;
  nodes?: ZkSyncRollupNode[];
  overview?: ZkSyncRollupOverview;
};

type State = {
  zksyncInfo: { data?: ZksyncInfo; isLoading: boolean };
};

type Actions = {
  setZksyncInfo: (isLoading: boolean, data?: ZksyncInfo) => void;
  reset: () => void;
};

const initialState: State = {
  zksyncInfo: { data: undefined, isLoading: false },
};

const useZksyncStore = create<State & Actions>((set) => ({
  ...initialState,
  setZksyncInfo: (isLoading: boolean, data?: ZksyncInfo) => {
    set({ zksyncInfo: { data, isLoading } });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useZksyncStore };
